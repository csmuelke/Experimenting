# Setup Guide

This guide will walk you through setting up the LearnSocial development environment from scratch.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v20.0.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** or **yarn** (package manager)
   - Comes with Node.js
   - Verify: `npm --version`

3. **PostgreSQL** (v15 or higher)
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Verify: `psql --version`

4. **Git**
   - Download from: https://git-scm.com/downloads
   - Verify: `git --version`

### For Mobile Development

#### iOS (macOS only)
- **Xcode** (latest version)
- **CocoaPods**: `sudo gem install cocoapods`

#### Android (All platforms)
- **Android Studio**
- **Android SDK** (API level 33+)
- **Java JDK** (bundled with Android Studio)

#### Expo CLI
```bash
npm install -g expo-cli
```

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd superlernensocialdingens
```

### 2. Install Root Dependencies

```bash
npm install
```

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Set Up PostgreSQL Database

#### Create Database

Open PostgreSQL command line (psql):

```bash
psql -U postgres
```

Create the database:

```sql
CREATE DATABASE learnsocial;
\q
```

#### Alternative: Using pgAdmin

1. Open pgAdmin
2. Right-click on "Databases"
3. Select "Create" → "Database"
4. Name it "learnsocial"
5. Click "Save"

### 4. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/learnsocial?schema=public"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:8081

# Security
BCRYPT_ROUNDS=10
```

**Important:** Update the following:
- `your_password` in DATABASE_URL with your PostgreSQL password
- `JWT_SECRET` and `JWT_REFRESH_SECRET` with strong random strings

**Generate Secure Secrets:**
```bash
# On Windows PowerShell:
[System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# On macOS/Linux:
openssl rand -base64 32
```

### 5. Run Database Migrations

Generate Prisma Client:

```bash
npm run db:generate
```

Run migrations to create database tables:

```bash
npm run db:migrate
```

You'll be prompted to name the migration. Use a descriptive name like "initial_schema".

### 6. Start Backend Server

Development mode (with auto-reload):

```bash
npm run dev
```

The server should start on http://localhost:3000

Verify it's running:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-02-19T..."}
```

---

## Mobile App Setup

### 1. Navigate to Mobile Directory

Open a **new terminal window** (keep backend running):

```bash
cd mobile
```

### 2. Install Mobile Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# API Configuration
API_URL=http://localhost:3000/api

# Environment
NODE_ENV=development
```

**Note for Physical Devices:**
- If testing on a physical device, replace `localhost` with your computer's IP address
- Find your IP: `ipconfig` (Windows) or `ifconfig` (macOS/Linux)
- Example: `API_URL=http://192.168.1.100:3000/api`

### 4. Start Expo Development Server

```bash
npm start
```

This will open the Expo Developer Tools in your browser.

### 5. Run on iOS (macOS only)

Press `i` in the terminal or click "Run on iOS simulator" in Expo DevTools.

First time setup:
```bash
cd ios
pod install
cd ..
```

### 6. Run on Android

Press `a` in the terminal or click "Run on Android emulator" in Expo DevTools.

Make sure you have an Android emulator running or a physical device connected.

### 7. Run on Physical Device

1. Install **Expo Go** app from App Store (iOS) or Play Store (Android)
2. Scan the QR code shown in the terminal with your device
3. The app will load on your device

---

## Verifying Installation

### Backend Health Check

```bash
curl http://localhost:3000/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

### Database Connection

Open Prisma Studio to view your database:

```bash
cd backend
npm run db:studio
```

This opens a web interface at http://localhost:5555

### Mobile App Test

1. Open the app on simulator/device
2. You should see the Login screen
3. Try creating an account

---

## Common Issues and Solutions

### Issue: Database Connection Failed

**Error:** `Can't reach database server`

**Solution:**
1. Verify PostgreSQL is running:
   ```bash
   # Windows
   Get-Service postgresql*
   
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Check DATABASE_URL in `.env` is correct
3. Verify database exists: `psql -U postgres -l`

### Issue: Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
1. Find process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # macOS/Linux
   lsof -i :3000
   ```

2. Kill the process or change PORT in `.env`

### Issue: Prisma Migration Failed

**Error:** `Migration failed to apply`

**Solution:**
1. Reset database:
   ```bash
   npm run db:push
   ```

2. Or drop and recreate:
   ```bash
   psql -U postgres
   DROP DATABASE learnsocial;
   CREATE DATABASE learnsocial;
   \q
   npm run db:migrate
   ```

### Issue: Expo Not Loading on Device

**Solution:**
1. Ensure device and computer are on same WiFi network
2. Check firewall isn't blocking connections
3. Try tunneling: `npm start --tunnel`

### Issue: iOS Build Failed

**Error:** CocoaPods errors

**Solution:**
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Issue: Android Build Failed

**Solution:**
1. Clear cache:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

2. Verify Android SDK is installed
3. Check `ANDROID_HOME` environment variable is set

---

## Development Workflow

### Recommended Terminal Setup

Open 2-3 terminals:

1. **Terminal 1** - Backend server
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2** - Mobile app
   ```bash
   cd mobile
   npm start
   ```

3. **Terminal 3** - Running commands, testing API, etc.

### Useful Commands

**Backend:**
```bash
npm run dev          # Start development server
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Create new migration
npm test            # Run tests
npm run lint        # Lint code
```

**Mobile:**
```bash
npm start           # Start Expo
npm run android     # Run on Android
npm run ios         # Run on iOS
npm test           # Run tests
npm run lint       # Lint code
```

---

## IDE Setup

### VS Code (Recommended)

**Recommended Extensions:**
- Prisma
- ESLint
- Prettier
- React Native Tools
- GitLens
- Thunder Client (for API testing)

**Settings:**
Add to `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## Next Steps

1. ✅ Verify all installations work
2. 📚 Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system design
3. 🔌 Review [API.md](./API.md) for API documentation
4. 💾 Check [DATABASE.md](./DATABASE.md) for database schema details
5. 💻 Read [DEVELOPMENT.md](./DEVELOPMENT.md) for coding guidelines
6. 🚀 Start building features!

---

## Getting Help

- Check the [README.md](../README.md) for project overview
- Review documentation in `/docs` folder
- Search existing issues in the repository
- Create a new issue with detailed information

---

**Happy Coding! 🎉**
