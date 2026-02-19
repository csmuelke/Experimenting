# LearnSocial Backend API

Express.js + TypeScript + Prisma + PostgreSQL backend for LearnSocial.

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Server runs at http://localhost:3000

## Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:generate  # Generate Prisma Client
npm test            # Run tests
npm run lint        # Lint code
```

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── src/
│   ├── server.ts          # Application entry point
│   ├── routes/            # API route definitions
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── sessions.ts
│   │   └── feed.ts
│   ├── middleware/        # Express middleware
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   └── services/          # Business logic (future)
└── dist/                  # Compiled output
```

## Environment Variables

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/learnsocial"
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:8081
BCRYPT_ROUNDS=10
```

## API Documentation

See [/docs/API.md](../docs/API.md) for complete API documentation.

### Key Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/sessions` - Create learning session
- `GET /api/feed` - Get activity feed
- `POST /api/users/:id/follow` - Follow user

## Database

Uses PostgreSQL with Prisma ORM.

### Migrations

```bash
# Create new migration
npm run db:migrate

# View database in GUI
npm run db:studio
```

### Schema

See [/docs/DATABASE.md](../docs/DATABASE.md) for schema details.

## Authentication

- JWT-based authentication
- Access token (15 min) + Refresh token (7 days)
- Tokens stored in database for revocation

## Development

See [/docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md) for coding guidelines.

### Adding a New Endpoint

1. Create route in `src/routes/`
2. Add controller logic
3. Update API documentation
4. Add tests

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

## Production

See [/docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md) for deployment guide.

```bash
npm run build
npm start
```

## Troubleshooting

**Database connection failed**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env

**Port already in use**
- Change PORT in .env
- Or: `lsof -ti:3000 | xargs kill` (macOS/Linux)

**Migration failed**
- Reset: `npm run db:push`
- Or recreate database

## Learn More

- [Setup Guide](../docs/SETUP.md)
- [Architecture](../docs/ARCHITECTURE.md)
- [API Documentation](../docs/API.md)
- [Database Schema](../docs/DATABASE.md)
