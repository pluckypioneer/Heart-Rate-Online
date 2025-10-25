#!/usr/bin/env python3
"""
Simple script to test syntax of processors.py
"""

try:
    import lib.processors
    print("✓ Import successful!")
    
    # Test class instantiation
    processor = lib.processors.findFaceGetPulse()
    print("✓ Class instantiation successful!")
    
    print("All syntax checks passed!")
    
except SyntaxError as e:
    print(f"✗ Syntax error: {e}")
    print(f"Line {e.lineno}: {e.text}")
    
except Exception as e:
    print(f"✗ Other error: {e}")
    import traceback
    traceback.print_exc()