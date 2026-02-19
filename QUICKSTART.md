# Quick Start Guide

Get LearnSocial running in 10 minutes!

## Prerequisites

- Node.js 20+ installed
- PostgreSQL 15+ installed
- Git installed

## Quick Setup

### 1. Clone the Repository

```bash
git clone <repo-url>
cd superlernensocialdingens
```

### 2. Install All Dependencies (Automated)

**Windows (PowerShell):**
```powershell
.\install.ps1
```

**macOS/Linux:**
```bash
chmod +x install.sh
./install.sh
```

**Or manually:**
```bash
npm install
cd backend && npm install
cd ../mobile && npm install
cd ..
```

### 3. Setup Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` - Update these:
- `DATABASE_URL` with your PostgreSQL credentials
- Generate new `JWT_SECRET` values

```bash
npm run db:migrate
npm run dev
```

Backend running at http://localhost:3000 ✅

### 4. Setup Mobile (New Terminal)

```bash
cd mobile
cp .env.example .env
npm start
```

Press `i` for iOS or `a` for Android ✅

## Test It Out

1. Open app on simulator/device
2. Register a new account
3. Create your first learning session
4. Start learning! 🎉

## Need Help?

- Full setup: [docs/SETUP.md](docs/SETUP.md)
- Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- API docs: [docs/API.md](docs/API.md)

## Common Issues

**Database connection failed?**
- Check PostgreSQL is running
- Verify DATABASE_URL in backend/.env

**Can't see app on device?**
- Ensure device and computer are on same WiFi
- Check firewall settings

**Port already in use?**
- Change PORT in backend/.env
- Or kill the process using the port

---

Happy coding! 🚀
