#!/bin/bash
# LearnSocial - Automated Installation Script (Bash)
# This script installs all dependencies for backend and mobile

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  LearnSocial - Installation Script${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Check if Node.js is installed
echo -e "${YELLOW}Checking prerequisites...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js is not installed!${NC}"
    echo -e "${RED}  Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm installed: v$NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm is not installed!${NC}"
    exit 1
fi

echo ""

# Install root dependencies
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}Installing root dependencies...${NC}"
echo -e "${CYAN}========================================${NC}"
if npm install; then
    echo -e "${GREEN}✓ Root dependencies installed successfully!${NC}"
else
    echo -e "${RED}✗ Failed to install root dependencies${NC}"
    exit 1
fi

echo ""

# Install backend dependencies
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}Installing backend dependencies...${NC}"
echo -e "${CYAN}========================================${NC}"
cd backend || exit 1
if npm install; then
    echo -e "${GREEN}✓ Backend dependencies installed successfully!${NC}"
else
    echo -e "${RED}✗ Failed to install backend dependencies${NC}"
    cd ..
    exit 1
fi
cd ..

echo ""

# Install mobile dependencies
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}Installing mobile dependencies...${NC}"
echo -e "${CYAN}========================================${NC}"
cd mobile || exit 1
if npm install; then
    echo -e "${GREEN}✓ Mobile dependencies installed successfully!${NC}"
else
    echo -e "${RED}✗ Failed to install mobile dependencies${NC}"
    cd ..
    exit 1
fi
cd ..

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ Installation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo -e "${WHITE}1. Set up PostgreSQL database${NC}"
echo -e "${WHITE}2. Configure environment files:${NC}"
echo -e "${GRAY}   cd backend && cp .env.example .env${NC}"
echo -e "${GRAY}   cd mobile && cp .env.example .env${NC}"
echo -e "${WHITE}3. Run database migrations:${NC}"
echo -e "${GRAY}   cd backend && npm run db:migrate${NC}"
echo -e "${WHITE}4. Start development servers:${NC}"
echo -e "${GRAY}   cd backend && npm run dev${NC}"
echo -e "${GRAY}   cd mobile && npm start${NC}"
echo ""
echo -e "${YELLOW}See docs/SETUP.md for detailed instructions.${NC}"
echo ""
