#!/usr/bin/env python3
"""
Simple test for bcrypt password hashing
"""

import sys
sys.path.insert(0, '/Users/zhengningdai/workspace/skyold/agentq/backend')

from repositories.user_repo import _hash_password

print("=" * 60)
print("Testing Bcrypt Password Hashing")
print("=" * 60)

# Test password
password = "testpass123"

print(f"\nOriginal password: {password}")

# Hash the password
hashed = _hash_password(password)
print(f"Hashed password: {hashed}")
print(f"Hash length: {len(hashed)}")

# Verify it's bcrypt (starts with $2b$ or $2a$)
if hashed.startswith('$2'):
    print("✓ Using bcrypt format")
else:
    print("✗ Not using bcrypt format")

print("\n" + "=" * 60)
print("Bcrypt test completed!")
print("=" * 60)
