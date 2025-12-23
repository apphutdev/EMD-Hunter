# EMD Hunter - Requirements & Architecture

## Original Problem Statement
Build an EMD (Exact Match Domain) Opportunity Finder tool that helps SEO professionals find killer domain opportunities in "big city/niche" markets.

## User Choices
- DataForSEO API integration for keyword data and SERP analysis
- SERP API integration for analyzing page one results
- User authentication with login/signup
- AI features using Claude (via Emergent LLM Key)
- Dark theme with neon colors and trendy animations

## Architecture

### Backend (FastAPI + MongoDB)
- **Auth**: JWT-based authentication with bcrypt password hashing
- **Keyword Research**: DataForSEO integration with mock data fallback
- **SERP Analysis**: Page one analysis with competitor metrics
- **Kill Score**: Proprietary scoring algorithm (0-100)
- **AI Analysis**: Claude AI integration for opportunity insights
- **Opportunities**: CRUD operations for saved opportunities

### Frontend (React + Tailwind + shadcn)
- **Theme**: Cyberpunk dark theme with neon green (#00FF94) accents
- **Typography**: Unbounded (headings), Manrope (body), JetBrains Mono (data)
- **Animations**: Framer Motion for entrance animations
- **Components**: Custom Kill Score gauge, data tables, filter panels

### Database Collections
- `users`: User accounts with hashed passwords
- `opportunities`: Saved EMD opportunities with SERP data

## Key Features Implemented

### Phase 1: Keyword Collection
- Seed keyword search with DataForSEO API
- Location-first keyword expansion
- Mock data fallback for demo purposes

### Phase 2: Filter for Money
- Volume filter: 200-1200 searches/month
- CPC filter: $10-$50+ indicators
- Competition filter with visual indicators
- Advertiser competition tracking

### Phase 3: SERP Analysis
- Page one result analysis
- Directory site detection (Yelp, BBB, Angi, etc.)
- Weak competitor identification
- Domain authority and backlink metrics

### Kill Score Algorithm (0-100)
- Directory sites: +8 points each (max 40)
- Weak competitors: +6 points each (max 30)
- CPC indicator: up to +15 points
- Volume sweetspot: up to +15 points

### AI Analysis (Claude)
- Opportunity assessment
- Weakness identification
- Recommended approach
- Commercial intent analysis

## API Endpoints
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- GET /api/auth/me - Get current user
- POST /api/keywords/search - Keyword research
- POST /api/serp/analyze - SERP analysis
- POST /api/ai/analyze - Claude AI analysis
- GET/POST/DELETE /api/opportunities - CRUD operations

## Next Action Items
1. Add DataForSEO API credentials for real data
2. Implement keyword history tracking
3. Add domain availability checker
4. Export opportunities to CSV/PDF
5. Add team collaboration features
6. Implement email notifications for score changes
