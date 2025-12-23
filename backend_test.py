#!/usr/bin/env python3
"""
EMD Hunter Backend API Testing Suite
Tests all authentication, keyword research, SERP analysis, and opportunities endpoints
"""

import requests
import sys
import json
from datetime import datetime

class EMDHunterAPITester:
    def __init__(self, base_url="https://emdradar.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log(self, message, test_name=None):
        """Log test results"""
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {message}")
        if test_name and "❌" in message:
            self.failed_tests.append(f"{test_name}: {message}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        self.log(f"🔍 Testing {name}...", name)
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.log(f"✅ {name} - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                self.log(f"❌ {name} - Expected {expected_status}, got {response.status_code}", name)
                try:
                    error_detail = response.json()
                    self.log(f"   Error: {error_detail}", name)
                except:
                    self.log(f"   Response: {response.text[:200]}", name)
                return False, {}

        except Exception as e:
            self.log(f"❌ {name} - Exception: {str(e)}", name)
            return False, {}

    def test_health_check(self):
        """Test basic health endpoints"""
        self.log("\n=== HEALTH CHECK TESTS ===")
        self.run_test("API Root", "GET", "", 200)
        self.run_test("Health Check", "GET", "health", 200)

    def test_user_registration(self):
        """Test user registration"""
        self.log("\n=== USER REGISTRATION TEST ===")
        test_user = {
            "email": "hunter@test.com",
            "password": "hunter123",
            "name": "Test Hunter"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            self.log(f"✅ Registration successful, token obtained")
            return True
        else:
            self.log("❌ Registration failed - no token received")
            return False

    def test_user_login(self):
        """Test user login with existing credentials"""
        self.log("\n=== USER LOGIN TEST ===")
        login_data = {
            "email": "hunter@test.com",
            "password": "hunter123"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            self.log(f"✅ Login successful, token updated")
            return True
        else:
            self.log("❌ Login failed - no token received")
            return False

    def test_protected_route(self):
        """Test protected /auth/me endpoint"""
        self.log("\n=== PROTECTED ROUTE TEST ===")
        if not self.token:
            self.log("❌ No token available for protected route test")
            return False
            
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        
        if success and 'email' in response:
            self.log(f"✅ Protected route working, user: {response.get('name')}")
            return True
        return False

    def test_keyword_search(self):
        """Test keyword search endpoint"""
        self.log("\n=== KEYWORD SEARCH TEST ===")
        if not self.token:
            self.log("❌ No token available for keyword search")
            return False
            
        search_data = {
            "seed_keyword": "plumber phoenix",
            "location_name": "United States",
            "min_volume": 200,
            "max_volume": 1200,
            "min_cpc": 10.0,
            "limit": 10
        }
        
        success, response = self.run_test(
            "Keyword Search",
            "POST",
            "keywords/search",
            200,
            data=search_data
        )
        
        if success and 'keywords' in response:
            keywords = response['keywords']
            self.log(f"✅ Keyword search returned {len(keywords)} keywords")
            if response.get('source') == 'mock':
                self.log("ℹ️  Using mock data (DataForSEO not configured)")
            return True, keywords
        return False, []

    def test_serp_analysis(self):
        """Test SERP analysis endpoint"""
        self.log("\n=== SERP ANALYSIS TEST ===")
        if not self.token:
            self.log("❌ No token available for SERP analysis")
            return False
            
        serp_data = {
            "keyword": "plumber phoenix",
            "location_name": "United States"
        }
        
        success, response = self.run_test(
            "SERP Analysis",
            "POST",
            "serp/analyze",
            200,
            data=serp_data
        )
        
        if success and 'results' in response and 'kill_score' in response:
            results = response['results']
            kill_score = response['kill_score']
            self.log(f"✅ SERP analysis returned {len(results)} results, Kill Score: {kill_score}")
            if response.get('source') == 'mock':
                self.log("ℹ️  Using mock data (DataForSEO not configured)")
            return True, response
        return False, {}

    def test_ai_analysis(self):
        """Test AI analysis endpoint"""
        self.log("\n=== AI ANALYSIS TEST ===")
        if not self.token:
            self.log("❌ No token available for AI analysis")
            return False
            
        # Test with request body (the endpoint expects function parameters)
        ai_data = {
            "keyword": "plumber phoenix",
            "serp_data": [{"domain": "test.com", "rank": 1, "title": "Test Title"}],
            "keyword_data": {"keyword": "plumber phoenix", "search_volume": 500, "cpc": 25}
        }
        
        success, response = self.run_test(
            "AI Analysis",
            "POST",
            "ai/analyze",
            200,
            data=ai_data
        )
        
        if success and 'analysis' in response:
            analysis = response['analysis'][:100] + "..." if len(response['analysis']) > 100 else response['analysis']
            self.log(f"✅ AI analysis returned: {analysis}")
            if response.get('source') == 'error':
                self.log("⚠️  AI analysis returned error (EMERGENT_LLM_KEY issue)")
            return True
        return False

    def test_opportunities_crud(self):
        """Test opportunities CRUD operations"""
        self.log("\n=== OPPORTUNITIES CRUD TESTS ===")
        if not self.token:
            self.log("❌ No token available for opportunities tests")
            return False
            
        # Create opportunity
        opportunity_data = {
            "keyword": "test plumber phoenix",
            "location": "United States",
            "search_volume": 500,
            "cpc": 25.50,
            "competition": 0.6,
            "kill_score": 75,
            "serp_results": [
                {"rank": 1, "domain": "test.com", "title": "Test Result"}
            ],
            "ai_analysis": "Test analysis"
        }
        
        success, response = self.run_test(
            "Create Opportunity",
            "POST",
            "opportunities",
            200,
            data=opportunity_data
        )
        
        opportunity_id = None
        if success and 'id' in response:
            opportunity_id = response['id']
            self.log(f"✅ Opportunity created with ID: {opportunity_id}")
        else:
            self.log("❌ Failed to create opportunity")
            return False
            
        # Get all opportunities
        success, response = self.run_test(
            "Get All Opportunities",
            "GET",
            "opportunities",
            200
        )
        
        if success and isinstance(response, list):
            self.log(f"✅ Retrieved {len(response)} opportunities")
        else:
            self.log("❌ Failed to get opportunities list")
            
        # Get specific opportunity
        if opportunity_id:
            success, response = self.run_test(
                "Get Specific Opportunity",
                "GET",
                f"opportunities/{opportunity_id}",
                200
            )
            
            if success and response.get('id') == opportunity_id:
                self.log(f"✅ Retrieved specific opportunity")
            else:
                self.log("❌ Failed to get specific opportunity")
                
            # Delete opportunity
            success, response = self.run_test(
                "Delete Opportunity",
                "DELETE",
                f"opportunities/{opportunity_id}",
                200
            )
            
            if success:
                self.log(f"✅ Opportunity deleted successfully")
                return True
            else:
                self.log("❌ Failed to delete opportunity")
                
        return False

    def run_all_tests(self):
        """Run complete test suite"""
        self.log("🚀 Starting EMD Hunter API Test Suite")
        self.log(f"🎯 Testing against: {self.base_url}")
        
        # Health checks
        self.test_health_check()
        
        # Authentication flow
        auth_success = self.test_user_registration()
        if not auth_success:
            # Try login if registration fails (user might already exist)
            auth_success = self.test_user_login()
            
        if auth_success:
            self.test_protected_route()
            
            # Core functionality tests
            self.test_keyword_search()
            self.test_serp_analysis()
            self.test_ai_analysis()
            self.test_opportunities_crud()
        else:
            self.log("❌ Authentication failed - skipping protected endpoint tests")
        
        # Print summary
        self.print_summary()
        
        return self.tests_passed == self.tests_run

    def print_summary(self):
        """Print test results summary"""
        self.log(f"\n{'='*50}")
        self.log(f"📊 TEST SUMMARY")
        self.log(f"{'='*50}")
        self.log(f"✅ Tests Passed: {self.tests_passed}")
        self.log(f"❌ Tests Failed: {self.tests_run - self.tests_passed}")
        self.log(f"📈 Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            self.log(f"\n❌ FAILED TESTS:")
            for failure in self.failed_tests:
                self.log(f"   • {failure}")
        
        self.log(f"{'='*50}")

def main():
    """Main test execution"""
    tester = EMDHunterAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())