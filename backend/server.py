from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import httpx
import base64
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'emd-hunter-secret-key-2025')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# DataForSEO Config
DATAFORSEO_LOGIN = os.environ.get('DATAFORSEO_LOGIN', '')
DATAFORSEO_PASSWORD = os.environ.get('DATAFORSEO_PASSWORD', '')

# Emergent LLM Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

# Create the main app
app = FastAPI(title="EMD Hunter API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ============== MODELS ==============

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class KeywordSearchRequest(BaseModel):
    seed_keyword: str
    location_name: str = "United States"
    language_name: str = "English"
    min_volume: int = 200
    max_volume: int = 1200
    min_cpc: float = 10.0
    max_cpc: Optional[float] = None
    limit: int = 50

class SERPAnalysisRequest(BaseModel):
    keyword: str
    location_name: str = "United States"
    language_name: str = "English"

class KeywordData(BaseModel):
    keyword: str
    search_volume: int
    cpc: float
    competition: float
    advertiser_competition: Optional[float] = None

class SERPResult(BaseModel):
    rank: int
    domain: str
    url: str
    title: str
    description: Optional[str] = None
    domain_rank: Optional[int] = None
    backlinks: Optional[int] = None
    is_directory: bool = False
    is_replaceable: bool = False

class OpportunityCreate(BaseModel):
    keyword: str
    location: str
    search_volume: int
    cpc: float
    competition: float
    kill_score: int
    serp_results: List[dict]
    ai_analysis: Optional[str] = None

class OpportunityResponse(BaseModel):
    id: str
    keyword: str
    location: str
    search_volume: int
    cpc: float
    competition: float
    kill_score: int
    serp_results: List[dict]
    ai_analysis: Optional[str] = None
    created_at: str
    user_id: str

# ============== HELPER FUNCTIONS ==============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def calculate_kill_score(serp_results: List[dict], keyword_data: dict) -> int:
    """Calculate Kill Score (0-100) based on SERP weakness indicators."""
    score = 0
    
    # Directory sites (Yelp, BBB, Angi, etc.) - easy to replace
    directory_domains = ['yelp.com', 'bbb.org', 'angieslist.com', 'angi.com', 'yellowpages.com', 
                         'thumbtack.com', 'homeadvisor.com', 'houzz.com', 'manta.com']
    
    replaceable_count = 0
    weak_competitors = 0
    
    for result in serp_results[:10]:
        domain = result.get('domain', '').lower()
        
        # Check for directory sites
        if any(dir_domain in domain for dir_domain in directory_domains):
            replaceable_count += 1
            continue
        
        # Check domain authority (if available)
        domain_rank = result.get('domain_rank', 0)
        if domain_rank and domain_rank < 40:
            weak_competitors += 1
        
        # Check backlinks
        backlinks = result.get('backlinks', 0)
        if backlinks and backlinks < 50:
            weak_competitors += 1
        
        # Check if title contains exact keyword
        title = result.get('title', '').lower()
        keyword = keyword_data.get('keyword', '').lower()
        if keyword and keyword not in title:
            replaceable_count += 1
    
    # Calculate score components
    # Replaceable results (max 40 points)
    score += min(replaceable_count * 8, 40)
    
    # Weak competitors (max 30 points)
    score += min(weak_competitors * 6, 30)
    
    # CPC indicator (max 15 points) - higher CPC = more valuable
    cpc = keyword_data.get('cpc', 0)
    if cpc >= 50:
        score += 15
    elif cpc >= 30:
        score += 12
    elif cpc >= 10:
        score += 8
    
    # Volume sweetspot (max 15 points) - 200-1200 is ideal
    volume = keyword_data.get('search_volume', 0)
    if 200 <= volume <= 1200:
        score += 15
    elif 100 <= volume <= 2000:
        score += 10
    elif volume > 0:
        score += 5
    
    return min(score, 100)

# ============== AUTH ENDPOINTS ==============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "name": user_data.name,
        "password": hash_password(user_data.password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    token = create_token(user_id, user_data.email)
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user_id,
            email=user_data.email,
            name=user_data.name,
            created_at=user_doc["created_at"]
        )
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"], user["email"])
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            created_at=user["created_at"]
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)

# ============== DATAFORSEO ENDPOINTS ==============

@api_router.post("/keywords/search")
async def search_keywords(request: KeywordSearchRequest, current_user: dict = Depends(get_current_user)):
    """Search for keywords using DataForSEO API."""
    if not DATAFORSEO_LOGIN or not DATAFORSEO_PASSWORD:
        # Return mock data if no API credentials
        mock_data = generate_mock_keywords(request.seed_keyword, request.min_volume, request.max_volume, request.min_cpc, request.limit)
        return {"keywords": mock_data, "source": "mock"}
    
    try:
        auth_string = base64.b64encode(f"{DATAFORSEO_LOGIN}:{DATAFORSEO_PASSWORD}".encode()).decode()
        
        async with httpx.AsyncClient() as client_http:
            # Use Keywords For Site endpoint for related keywords
            response = await client_http.post(
                "https://api.dataforseo.com/v3/keywords_data/google_ads/keywords_for_site/live",
                headers={
                    "Authorization": f"Basic {auth_string}",
                    "Content-Type": "application/json"
                },
                json=[{
                    "target": request.seed_keyword,
                    "location_name": request.location_name,
                    "language_name": request.language_name,
                    "search_partners": False,
                    "sort_by": "search_volume"
                }],
                timeout=60.0
            )
            
            data = response.json()
            
            if data.get("status_code") != 20000:
                # Fallback to mock data
                mock_data = generate_mock_keywords(request.seed_keyword, request.min_volume, request.max_volume, request.min_cpc, request.limit)
                return {"keywords": mock_data, "source": "mock"}
            
            keywords = []
            tasks = data.get("tasks", [])
            for task in tasks:
                result = task.get("result", [])
                for item in result:
                    sv = item.get("search_volume", 0) or 0
                    cpc_val = item.get("cpc", 0) or 0
                    comp = item.get("competition", 0) or 0
                    
                    # Apply filters
                    if sv < request.min_volume or sv > request.max_volume:
                        continue
                    if cpc_val < request.min_cpc:
                        continue
                    if request.max_cpc and cpc_val > request.max_cpc:
                        continue
                    
                    keywords.append({
                        "keyword": item.get("keyword", ""),
                        "search_volume": sv,
                        "cpc": cpc_val,
                        "competition": comp,
                        "advertiser_competition": item.get("competition_index", 0)
                    })
            
            keywords = keywords[:request.limit]
            return {"keywords": keywords, "source": "dataforseo"}
            
    except Exception as e:
        logger.error(f"DataForSEO error: {str(e)}")
        mock_data = generate_mock_keywords(request.seed_keyword, request.min_volume, request.max_volume, request.min_cpc, request.limit)
        return {"keywords": mock_data, "source": "mock"}

def generate_mock_keywords(seed: str, min_vol: int, max_vol: int, min_cpc: float, limit: int) -> List[dict]:
    """Generate mock keyword data for demo purposes."""
    import random
    
    cities = ["phoenix", "new york", "los angeles", "chicago", "houston", "miami", "seattle", "denver", "atlanta", "dallas"]
    services = ["plumber", "roofing", "hvac", "electrician", "lawyer", "dentist", "contractor", "landscaping", "pool service", "tree service"]
    
    keywords = []
    for _ in range(limit):
        city = random.choice(cities)
        service = random.choice(services)
        
        keyword = f"{service} {city}" if random.random() > 0.5 else f"{city} {service}"
        if seed.lower() not in keyword.lower():
            keyword = f"{seed} {city}"
        
        volume = random.randint(min_vol, max_vol)
        cpc = round(random.uniform(min_cpc, min_cpc * 5), 2)
        competition = round(random.uniform(0.2, 0.9), 2)
        
        keywords.append({
            "keyword": keyword,
            "search_volume": volume,
            "cpc": cpc,
            "competition": competition,
            "advertiser_competition": round(random.uniform(0.3, 0.95), 2)
        })
    
    return keywords

@api_router.post("/serp/analyze")
async def analyze_serp(request: SERPAnalysisRequest, current_user: dict = Depends(get_current_user)):
    """Analyze SERP results for a keyword using DataForSEO."""
    if not DATAFORSEO_LOGIN or not DATAFORSEO_PASSWORD:
        # Return mock data if no API credentials
        mock_results = generate_mock_serp(request.keyword)
        kill_score = calculate_kill_score(mock_results, {"keyword": request.keyword, "search_volume": 500, "cpc": 25})
        return {"results": mock_results, "kill_score": kill_score, "source": "mock"}
    
    try:
        auth_string = base64.b64encode(f"{DATAFORSEO_LOGIN}:{DATAFORSEO_PASSWORD}".encode()).decode()
        
        async with httpx.AsyncClient() as client_http:
            response = await client_http.post(
                "https://api.dataforseo.com/v3/serp/google/organic/live/advanced",
                headers={
                    "Authorization": f"Basic {auth_string}",
                    "Content-Type": "application/json"
                },
                json=[{
                    "keyword": request.keyword,
                    "location_name": request.location_name,
                    "language_name": request.language_name,
                    "device": "desktop",
                    "os": "windows"
                }],
                timeout=60.0
            )
            
            data = response.json()
            
            if data.get("status_code") != 20000:
                mock_results = generate_mock_serp(request.keyword)
                kill_score = calculate_kill_score(mock_results, {"keyword": request.keyword, "search_volume": 500, "cpc": 25})
                return {"results": mock_results, "kill_score": kill_score, "source": "mock"}
            
            results = []
            directory_domains = ['yelp.com', 'bbb.org', 'angieslist.com', 'angi.com', 'yellowpages.com']
            
            tasks = data.get("tasks", [])
            for task in tasks:
                task_result = task.get("result", [])
                for result_item in task_result:
                    items = result_item.get("items", [])
                    for item in items:
                        if item.get("type") != "organic":
                            continue
                        
                        domain = extract_domain(item.get("url", ""))
                        is_directory = any(d in domain.lower() for d in directory_domains)
                        
                        results.append({
                            "rank": item.get("rank_absolute", 0),
                            "domain": domain,
                            "url": item.get("url", ""),
                            "title": item.get("title", ""),
                            "description": item.get("description", ""),
                            "domain_rank": item.get("rank_info", {}).get("main_domain_rank", 0) if item.get("rank_info") else 0,
                            "backlinks": item.get("backlinks_info", {}).get("backlinks", 0) if item.get("backlinks_info") else 0,
                            "is_directory": is_directory,
                            "is_replaceable": is_directory or (item.get("rank_info", {}).get("main_domain_rank", 100) or 100) < 40
                        })
            
            results = results[:10]
            kill_score = calculate_kill_score(results, {"keyword": request.keyword, "search_volume": 500, "cpc": 25})
            return {"results": results, "kill_score": kill_score, "source": "dataforseo"}
            
    except Exception as e:
        logger.error(f"SERP analysis error: {str(e)}")
        mock_results = generate_mock_serp(request.keyword)
        kill_score = calculate_kill_score(mock_results, {"keyword": request.keyword, "search_volume": 500, "cpc": 25})
        return {"results": mock_results, "kill_score": kill_score, "source": "mock"}

def extract_domain(url: str) -> str:
    from urllib.parse import urlparse
    try:
        parsed = urlparse(url)
        return parsed.netloc.replace("www.", "")
    except:
        return url

def generate_mock_serp(keyword: str) -> List[dict]:
    """Generate mock SERP data for demo purposes."""
    import random
    
    directory_sites = [
        {"domain": "yelp.com", "name": "Yelp"},
        {"domain": "bbb.org", "name": "BBB"},
        {"domain": "angieslist.com", "name": "Angie's List"},
        {"domain": "yellowpages.com", "name": "Yellow Pages"},
        {"domain": "thumbtack.com", "name": "Thumbtack"},
    ]
    
    local_businesses = [
        "localplumbingpros.com", "cityroofingexperts.com", "bestcontractors.net",
        "affordablehvac.com", "qualityserviceco.com", "premiumlawyers.com"
    ]
    
    results = []
    
    for i in range(10):
        if random.random() < 0.4:
            # Directory site
            site = random.choice(directory_sites)
            results.append({
                "rank": i + 1,
                "domain": site["domain"],
                "url": f"https://www.{site['domain']}/search?q={keyword.replace(' ', '+')}",
                "title": f"{site['name']} - Find {keyword.title()} Near You",
                "description": f"Find the best {keyword} services. Read reviews, compare prices, and get quotes.",
                "domain_rank": random.randint(70, 95),
                "backlinks": random.randint(10000, 500000),
                "is_directory": True,
                "is_replaceable": True
            })
        else:
            # Local business
            domain = random.choice(local_businesses)
            results.append({
                "rank": i + 1,
                "domain": domain,
                "url": f"https://www.{domain}/",
                "title": f"Best {keyword.title()} Services | {domain.split('.')[0].title()}",
                "description": f"Professional {keyword} services. Licensed and insured. Call for free quote.",
                "domain_rank": random.randint(10, 45),
                "backlinks": random.randint(5, 200),
                "is_directory": False,
                "is_replaceable": random.random() < 0.6
            })
    
    return results

# ============== AI ANALYSIS ENDPOINT ==============

class AIAnalysisRequest(BaseModel):
    keyword: str
    serp_data: List[dict]
    keyword_data: dict

@api_router.post("/ai/analyze")
async def ai_analyze_opportunity(
    request: AIAnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    """Use Claude AI to analyze EMD opportunity."""
    keyword = request.keyword
    serp_data = request.serp_data
    keyword_data = request.keyword_data
    
    if not EMERGENT_LLM_KEY:
        return {"analysis": "AI analysis not available. Please configure EMERGENT_LLM_KEY.", "source": "mock"}
    
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"emd-analysis-{uuid.uuid4()}",
            system_message="""You are an expert SEO analyst specializing in EMD (Exact Match Domain) opportunities. 
            Analyze the provided SERP data and keyword metrics to identify if this is a viable EMD opportunity.
            Focus on:
            1. Weakness of current rankings (directory sites, low DA competitors)
            2. Commercial intent (CPC, advertiser competition)
            3. Market opportunity (search volume vs competition)
            4. Recommended approach if this is a good opportunity
            Be concise but thorough. Format your response in clear sections."""
        ).with_model("anthropic", "claude-4-sonnet-20250514")
        
        prompt = f"""Analyze this EMD opportunity:

Keyword: {keyword}
Search Volume: {keyword_data.get('search_volume', 'N/A')}
CPC: ${keyword_data.get('cpc', 'N/A')}
Competition: {keyword_data.get('competition', 'N/A')}

Top 10 SERP Results:
"""
        for i, result in enumerate(serp_data[:10], 1):
            prompt += f"""
{i}. {result.get('domain', 'Unknown')}
   - Title: {result.get('title', 'N/A')}
   - Domain Rank: {result.get('domain_rank', 'N/A')}
   - Backlinks: {result.get('backlinks', 'N/A')}
   - Directory Site: {'Yes' if result.get('is_directory') else 'No'}
"""
        
        prompt += "\nProvide your analysis of this EMD opportunity."
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        return {"analysis": response, "source": "claude"}
        
    except Exception as e:
        logger.error(f"AI analysis error: {str(e)}")
        return {"analysis": f"AI analysis error: {str(e)}", "source": "error"}

# ============== OPPORTUNITIES ENDPOINTS ==============

@api_router.post("/opportunities", response_model=OpportunityResponse)
async def save_opportunity(opportunity: OpportunityCreate, current_user: dict = Depends(get_current_user)):
    """Save an EMD opportunity."""
    opp_id = str(uuid.uuid4())
    opp_doc = {
        "id": opp_id,
        "user_id": current_user["id"],
        **opportunity.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.opportunities.insert_one(opp_doc)
    
    return OpportunityResponse(**opp_doc)

@api_router.get("/opportunities", response_model=List[OpportunityResponse])
async def get_opportunities(current_user: dict = Depends(get_current_user)):
    """Get all saved opportunities for the current user."""
    opportunities = await db.opportunities.find(
        {"user_id": current_user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return [OpportunityResponse(**opp) for opp in opportunities]

@api_router.get("/opportunities/{opportunity_id}", response_model=OpportunityResponse)
async def get_opportunity(opportunity_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific opportunity."""
    opportunity = await db.opportunities.find_one(
        {"id": opportunity_id, "user_id": current_user["id"]},
        {"_id": 0}
    )
    
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    return OpportunityResponse(**opportunity)

@api_router.delete("/opportunities/{opportunity_id}")
async def delete_opportunity(opportunity_id: str, current_user: dict = Depends(get_current_user)):
    """Delete an opportunity."""
    result = await db.opportunities.delete_one(
        {"id": opportunity_id, "user_id": current_user["id"]}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    return {"message": "Opportunity deleted"}

# ============== HEALTH CHECK ==============

@api_router.get("/")
async def root():
    return {"message": "EMD Hunter API", "status": "running"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
