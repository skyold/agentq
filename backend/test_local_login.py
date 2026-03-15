#!/usr/bin/env python3
"""
Test script for local login functionality
Tests user registration and login
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_register():
    """Test user registration"""
    print("\n=== Testing User Registration ===")
    
    # Test data
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/register", json=user_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✓ Registration successful!")
            return response.json()
        else:
            print(f"✗ Registration failed: {response.json()}")
            return None
    except Exception as e:
        print(f"✗ Error: {e}")
        return None

def test_login(username, password):
    """Test user login"""
    print("\n=== Testing User Login ===")
    
    login_data = {
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/login", json=login_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✓ Login successful!")
            return response.json()
        else:
            print(f"✗ Login failed: {response.json()}")
            return None
    except Exception as e:
        print(f"✗ Error: {e}")
        return None

def test_profile(session_token):
    """Test getting user profile"""
    print("\n=== Testing User Profile ===")
    
    try:
        response = requests.get(f"{BASE_URL}/users/profile?session_token={session_token}")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✓ Profile retrieved successfully!")
            return response.json()
        else:
            print(f"✗ Profile retrieval failed: {response.json()}")
            return None
    except Exception as e:
        print(f"✗ Error: {e}")
        return None

def test_logout(session_token):
    """Test user logout"""
    print("\n=== Testing User Logout ===")
    
    try:
        response = requests.post(f"{BASE_URL}/users/logout", json={"session_token": session_token})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✓ Logout successful!")
            return True
        else:
            print(f"✗ Logout failed: {response.json()}")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def main():
    print("=" * 60)
    print("Local Login Functionality Test")
    print("=" * 60)
    
    # Test 1: Registration
    reg_result = test_register()
    
    if reg_result:
        # Test 2: Login with registered user
        login_result = test_login("testuser", "testpass123")
        
        if login_result:
            session_token = login_result["session_token"]
            
            # Test 3: Get user profile
            profile_result = test_profile(session_token)
            
            # Test 4: Logout
            logout_result = test_logout(session_token)
            
            # Test 5: Try to use invalidated session
            print("\n=== Testing Invalidated Session ===")
            test_profile(session_token)
        else:
            print("\n✗ Login test failed, skipping remaining tests")
    else:
        # Try login if user already exists
        print("\nUser may already exist, trying login...")
        login_result = test_login("testuser", "testpass123")
        
        if login_result:
            session_token = login_result["session_token"]
            profile_result = test_profile(session_token)
            logout_result = test_logout(session_token)
        else:
            print("\n✗ All tests failed")

if __name__ == "__main__":
    main()
