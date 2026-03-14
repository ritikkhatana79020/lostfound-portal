#!/bin/bash

# Lost & Found Portal - Project Setup Verification Script
# This script verifies that all components are properly configured

echo "=================================="
echo "Lost & Found Portal Setup Checker"
echo "=================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Function to check if command exists
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 is not installed"
        ((FAILED++))
        return 1
    fi
}

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 missing"
        ((FAILED++))
        return 1
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 directory exists"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 directory missing"
        ((FAILED++))
        return 1
    fi
}

# Function to check service running
check_service() {
    if pgrep -f "$1" > /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is running"
        ((PASSED++))
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $1 is not running (this is OK if you haven't started it yet)"
        return 1
    fi
}

echo "Checking Prerequisites..."
echo "========================="
echo ""

# Check Java
java -version &> /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Java is installed"
    java -version 2>&1 | grep version
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Java is not installed"
    ((FAILED++))
fi
echo ""

# Check Maven
check_command "mvn"
echo ""

# Check PostgreSQL
check_command "psql"
echo ""

# Check Git
check_command "git"
echo ""

echo "Checking Project Structure..."
echo "============================="
echo ""

# Backend structure
check_dir "src/main/java"
check_dir "src/main/resources"
check_dir "src/main/resources/templates"
check_dir "src/main/resources/static"
check_dir "src/main/resources/static/css"
check_dir "src/main/resources/static/js"
check_dir "src/test/java"
echo ""

echo "Checking Backend Files..."
echo "========================"
echo ""

check_file "pom.xml"
check_file "src/main/resources/application.properties"
check_file "src/main/java/com/shweta/lostfound_portal/LostfoundPortalApplication.java"
check_file "src/main/java/com/shweta/lostfound_portal/model/Item.java"
check_file "src/main/java/com/shweta/lostfound_portal/repository/ItemRepository.java"
check_file "src/main/java/com/shweta/lostfound_portal/service/ItemService.java"
check_file "src/main/java/com/shweta/lostfound_portal/controller/ItemController.java"
echo ""

echo "Checking Frontend Files..."
echo "=========================="
echo ""

check_file "src/main/resources/templates/home.html"
check_file "src/main/resources/templates/lost.html"
check_file "src/main/resources/templates/found.html"
check_file "src/main/resources/templates/admin.html"
check_file "src/main/resources/static/css/style.css"
check_file "src/main/resources/static/js/app.js"
echo ""

echo "Checking Documentation..."
echo "========================="
echo ""

check_file "README.md"
check_file "QUICKSTART.md"
check_file "BACKEND_README.md"
check_file "FRONTEND_README.md"
check_file "API_TESTING_GUIDE.md"
check_file "DEPLOYMENT_GUIDE.md"
check_file "Postman_Collection.json"
echo ""

echo "Checking Database Connection..."
echo "==============================="
echo ""

# Try to connect to PostgreSQL
psql -U postgres -d lostfound -c "SELECT 1" &> /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} PostgreSQL database connection successful"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} PostgreSQL database connection failed"
    echo "  Make sure PostgreSQL is running and database 'lostfound' exists"
fi
echo ""

echo "Checking Services..."
echo "===================="
echo ""

# Check if backend is running
curl -s http://localhost:8080/health > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Backend API is running on port 8080"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Backend API is not running"
    echo "  Start it with: ./mvnw spring-boot:run"
fi
echo ""

# Display Summary
echo "=================================="
echo "Setup Verification Summary"
echo "=================================="
echo -e "${GREEN}✓ Passed: $PASSED${NC}"
echo -e "${RED}✗ Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All checks passed! You're ready to go.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start PostgreSQL: brew services start postgresql"
    echo "2. Run backend: ./mvnw spring-boot:run"
    echo "3. Open browser: http://localhost:8080"
    echo ""
else
    echo -e "${YELLOW}Some checks failed or warnings detected.${NC}"
    echo "Please resolve the issues above before running the application."
    echo ""
fi

# Return exit code based on critical failures
if [ $FAILED -gt 0 ]; then
    exit 1
else
    exit 0
fi

