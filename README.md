# LearnSocial - Social Learning Time Tracking App

A mobile application that allows users to track their learning time, share progress with peers, and engage with a community of learners - similar to Strava, but for education.

## 🎯 Project Overview

LearnSocial enables users to:
- Track learning sessions with precise time tracking (hh:mm:ss)
- Document what they've learned during each session
- Share their learning activities with followers
- Like and kudos peers' learning achievements
- Build a learning community through social features
- Maintain detailed user profiles with educational background

## 🏗️ Architecture

```
superlernensocialdingens/
├── mobile/              # React Native mobile application (iOS & Android)
├── backend/            # Node.js/Express API server
├── database/           # Database schemas and migrations
├── shared/             # Shared TypeScript types and utilities
└── docs/               # Comprehensive documentation
```

## 🛠️ Technology Stack

### Mobile App
- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **State Management**: Redux Toolkit / Zustand
- **Navigation**: React Navigation
- **UI Components**: React Native Paper / NativeBase
- **API Client**: Axios
- **Authentication**: JWT + Secure Storage

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **API Documentation**: Swagger/OpenAPI

### DevOps & Tools
- **Version Control**: Git
- **API Testing**: Postman / REST Client
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest, React Native Testing Library

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm/yarn
- PostgreSQL 15+
- iOS: Xcode and CocoaPods (macOS only)
- Android: Android Studio and Android SDK
- Expo CLI (for React Native development)

### Installation

**Option 1: Automated Installation (Recommended)**

```powershell
# Windows PowerShell
.\install.ps1

# Or quick install (silent)
.\install-quick.ps1
```

```bash
# macOS/Linux
chmod +x install.sh
./install.sh
```

**Option 2: Manual Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd superlernensocialdingens
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your .env file
   npm run db:migrate
   npm run dev
   ```

3. **Set up the mobile app**
   ```bash
   cd mobile
   npm install
   cp .env.example .env
   # Configure your .env file
   npm start
   ```

## 📚 Documentation

Detailed documentation is available in the `/docs` folder:

- [Setup Guide](docs/SETUP.md) - Complete installation and configuration
- [Architecture Overview](docs/ARCHITECTURE.md) - System design and technical decisions
- [Database Schema](docs/DATABASE.md) - Data models and relationships
- [API Documentation](docs/API.md) - REST API endpoints and examples
- [Development Guide](docs/DEVELOPMENT.md) - Coding standards and workflows
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions

## 🎯 Development Roadmap

### Phase 1 - MVP (Weeks 1-6)
- [x] Project setup and architecture
- [ ] User authentication (register, login, logout)
- [ ] User profile management
- [ ] Learning session timer
- [ ] Session history and details
- [ ] Basic mobile UI/UX

### Phase 2 - Social Features (Weeks 7-10)
- [ ] Follow/unfollow users
- [ ] Activity feed
- [ ] Like/kudos system
- [ ] User discovery and search
- [ ] Notifications

### Phase 3 - Enhanced Features (Weeks 11+)
- [ ] Learning analytics and statistics
- [ ] Subject/topic categorization
- [ ] Streak tracking
- [ ] Achievements and badges
- [ ] Comments on activities
- [ ] Study groups/communities

## 🤝 Contributing

Please read [DEVELOPMENT.md](docs/DEVELOPMENT.md) for details on our code of conduct and development process.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- Project initiated: February 2026
- Maintainer: [Your Name]

## 📞 Support

For questions and support, please open an issue in the repository.

---

**Happy Learning! 📚✨**
