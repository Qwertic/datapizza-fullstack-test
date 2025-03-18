#!/usr/bin/env python
"""
Script to run tests for DataPizza backend API.
"""
import pytest
import sys
import os

if __name__ == "__main__":
    # Add the parent directory to the path so imports work correctly
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
    
    # Run pytest with verbose output, capture output, and show locals on failure
    sys.exit(pytest.main(["-v", "-s", "--showlocals", "tests"])) 