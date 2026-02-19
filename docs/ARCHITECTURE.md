# Architecture Overview

## System Architecture

LearnSocial follows a client-server architecture with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile Application                    │
│                  (React Native + Expo)                   │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Screens │  │Navigation│  │Components│             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │             │              │                    │
│       └─────────────┴──────────────┘                    │
│                     │                                   │
│            ┌────────▼────────┐                          │
│            │  State (Zustand)│                          │
│            └────────┬────────┘                          │
│                     │                                   │
│            ┌────────▼────────┐                          │
│            │   API Client    │                          │
│            │    (Axios)      │                          │
│            └────────┬────────┘                          │
└─────────────────────┼────────────────────────────────────┘
                      │
                      │ HTTPS/REST
                      │
┌─────────────────────▼────────────────────────────────────┐
│                  Backend API Server                       │
│                (Node.js + Express)                        │
│                                                           │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐            │
│  │  Routes  │──│Controllers│──│  Services  │            │
│  └──────────┘  └──────────┘  └─────┬──────┘            │
│                                     │                    │
│  ┌──────────┐                      │                    │
│  │Middleware│                      │                    │
│  │- Auth    │                      │                    │
│  │- Error   │                      │                    │
│  └──────────┘              ┌───────▼────────┐           │
│                            │  Prisma ORM    │           │
│                            └───────┬────────┘           │
└────────────────────────────────────┼────────────────────┘
                                     │
                                     │ SQL
                                     │
                        ┌────────────▼──────────┐
                        │   PostgreSQL Database │
                        │                       │
                        │  - Users             │
                        │  - Learning Sessions │
                        │  - Likes             │
                        │  - Follows           │
                        │  - Refresh Tokens    │
                        └─────────────────────┘
```

---

## Technology Stack

### Mobile Application

**Framework:** React Native with Expo
- **Why?** Cross-platform development (iOS & Android), fast development, large ecosystem
- **Alternative considered:** Flutter (excellent but requires Dart knowledge)

**Language:** TypeScript
- **Why?** Type safety, better IDE support, fewer runtime errors
- **Compile target:** ES2020

**State Management:** Zustand
- **Why?** Simple, minimal boilerplate, React hooks-based
- **Alternative:** Redux Toolkit (more complex but industry standard)

**Navigation:** React Navigation
- **Why?** Standard for React Native, well-documented, flexible

**UI Components:** React Native Paper
- **Why?** Material Design components, customizable, accessible

**HTTP Client:** Axios
- **Why?** Interceptors for auth, better error handling than fetch

**Form Handling:** React Hook Form + Zod
- **Why?** Performant, excellent TypeScript support, easy validation

---

### Backend API

**Runtime:** Node.js 20+
- **Why?** JavaScript everywhere, async I/O, large ecosystem
- **Alternative:** Python/FastAPI (good but wanted consistency with frontend)

**Framework:** Express.js
- **Why?** Mature, minimal, flexible, huge ecosystem
- **Alternative:** Fastify (faster but less ecosystem)

**Language:** TypeScript
- **Why?** Type safety across stack, better refactoring, self-documenting

**ORM:** Prisma
- **Why?** Type-safe, excellent DX, auto-generated client, migrations
- **Alternative:** TypeORM (more features but more complex)

**Authentication:** JWT (jsonwebtoken)
- **Why?** Stateless, scalable, standard approach
- **Token strategy:** Access (15m) + Refresh (7d) tokens

**Validation:** Zod
- **Why?** TypeScript-first, runtime validation, shares schemas with frontend

**Security:**
- Helmet.js - Security headers
- bcrypt - Password hashing
- CORS - Cross-origin protection

---

### Database

**Database:** PostgreSQL 15+
- **Why?** ACID compliant, feature-rich, excellent performance, JSON support
- **Alternative:** MongoDB (considered for flexibility but relational model fits better)

**Features Used:**
- UUID primary keys (security, distribution)
- Array types (tags)
- Indexes (performance)
- Foreign keys with cascade deletes (data integrity)
- Timestamps with timezone

---

## Application Layers

### Mobile App Layers

```
Presentation Layer (UI)
├── Screens (page-level components)
├── Components (reusable UI elements)
└── Navigation (routing logic)
          │
          ▼
Business Logic Layer
├── State Management (Zustand stores)
├── Custom Hooks
└── Utilities
          │
          ▼
Data Access Layer
├── API Client (Axios instance)
├── API Services (organized by domain)
└── Type Definitions
```

### Backend Layers

```
Presentation Layer
├── Routes (endpoint definitions)
└── Request/Response DTOs
          │
          ▼
Business Logic Layer
├── Controllers (request handling)
├── Services (business logic)
└── Validation (Zod schemas)
          │
          ▼
Data Access Layer
├── Prisma Client
├── Models (database entities)
└── Repositories (optional abstraction)
          │
          ▼
Infrastructure Layer
├── Middleware (auth, errors, logging)
├── Configuration
└── Utilities
```

---

## Design Patterns

### Mobile App Patterns

**1. Custom Hooks Pattern**
```typescript
// Encapsulate logic in reusable hooks
const useTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  // ... timer logic
  return { isRunning, elapsed, start, pause, reset };
};
```

**2. Container/Presentational Components**
- Containers: Handle logic, data fetching
- Presentational: Pure UI, receive props

**3. Store Pattern (Zustand)**
```typescript
// Global state management
const useAuthStore = create((set) => ({
  user: null,
  login: async (credentials) => { /* ... */ },
  logout: () => set({ user: null }),
}));
```

### Backend Patterns

**1. Repository Pattern** (optional, via Prisma)
```typescript
// Data access abstraction
class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id }});
  }
}
```

**2. Service Pattern**
```typescript
// Business logic separation
class AuthService {
  async register(data: RegisterDTO) {
    // Validation, hashing, user creation
  }
}
```

**3. Middleware Pattern**
```typescript
// Cross-cutting concerns
const authenticate = (req, res, next) => {
  // Verify JWT, attach user to req
  next();
};
```

**4. Error Handling Pattern**
```typescript
// Centralized error handling
class AppError extends Error {
  statusCode: number;
}
// ... error handler middleware
```

---

## Data Flow

### Authentication Flow

```
1. User enters credentials
   ↓
2. Mobile: authStore.login()
   ↓
3. API POST /auth/login
   ↓
4. Backend: Validate → Hash check → Generate JWT
   ↓
5. Return {user, accessToken, refreshToken}
   ↓
6. Mobile: Store tokens in SecureStore
   ↓
7. Mobile: Update authStore state
   ↓
8. Navigate to authenticated routes
```

### Learning Session Creation Flow

```
1. User records time, enters content
   ↓
2. Submit to API
   ↓
3. API: Authenticate request
   ↓
4. Validate session data (Zod)
   ↓
5. Create session in database (Prisma)
   ↓
6. Return created session
   ↓
7. Mobile: Update local state/UI
   ↓
8. Session appears in feed for followers
```

### Feed Loading Flow

```
1. User opens Home screen
   ↓
2. Fetch GET /api/feed
   ↓
3. Backend: Get user's following list
   ↓
4. Query sessions from followed users
   ↓
5. Check like status for current user
   ↓
6. Return paginated results
   ↓
7. Mobile: Display in FlatList
   ↓
8. Infinite scroll loads more pages
```

---

## Security Architecture

### Authentication

**Token Strategy:**
- Short-lived access tokens (15 minutes)
- Long-lived refresh tokens (7 days)
- Refresh tokens stored in database for revocation
- Access tokens verified on each request

**Password Security:**
- Bcrypt with 10 rounds (configurable)
- Passwords never logged or sent in responses
- Minimum 8 characters enforced

### API Security

**Headers:**
- Helmet.js applies security headers
- CORS configured for specific origins
- Content-Type validation

**Input Validation:**
- Zod schemas validate all inputs
- Type coercion prevents type confusion
- Sanitization for XSS prevention

**Rate Limiting:**
- Per-IP limits (planned)
- Per-user limits (planned)

### Mobile Security

**Token Storage:**
- Expo SecureStore (iOS Keychain, Android Keystore)
- Never stored in AsyncStorage
- Cleared on logout

**API Communication:**
- HTTPS only in production
- Certificate pinning (planned)

---

## Scalability Considerations

### Current Architecture (MVP)

- Single server instance
- Direct database connection
- Suitable for: 1-10K users

### Future Scaling Path

**Stage 1: Horizontal Scaling** (10K-100K users)
- Load balancer (Nginx/AWS ALB)
- Multiple API server instances
- Connection pooling (PgBouncer)
- Redis for session storage

**Stage 2: Caching Layer** (100K-1M users)
- Redis for frequently accessed data
- CDN for static assets
- Database read replicas
- Query optimization

**Stage 3: Microservices** (1M+ users)
- Split into services: Auth, User, Session, Feed
- Message queue (RabbitMQ/SQS)
- Elasticsearch for search
- S3 for file storage

---

## Database Design Decisions

### Why PostgreSQL?

1. **ACID Compliance**: Data integrity for user accounts, sessions
2. **Relational Model**: Natural fit for users, follows, likes
3. **Performance**: Excellent indexing, query optimization
4. **JSON Support**: Flexibility for tags, metadata
5. **Scalability**: Proven at large scale

### Normalization

- 3NF (Third Normal Form) mostly followed
- Some denormalization for performance (counts)
- Calculated fields (totalLearningTime) computed on query

### Indexing Strategy

**Indexed Fields:**
- Primary keys (automatic)
- Foreign keys (followerId, followingId, userId, sessionId)
- Email (unique, frequently queried)
- CreatedAt on sessions (feed sorting)

**Composite Indexes:**
- (userId, sessionId) on Likes - prevent duplicates
- (followerId, followingId) on Follows - prevent duplicates

---

## API Design Principles

### RESTful Design

- Resource-based URLs (`/users`, `/sessions`)
- HTTP verbs (GET, POST, PUT, DELETE)
- Stateless requests
- Standard status codes

### Consistency

- Consistent response format
- Predictable error messages
- Uniform naming conventions (camelCase)

### Versioning Strategy

- Not implemented yet
- Future: `/api/v1/`, `/api/v2/`
- Or: Accept header versioning

---

## Testing Strategy (Planned)

### Mobile Tests

**Unit Tests:**
- Utility functions
- Custom hooks
- State management

**Integration Tests:**
- API service calls
- Navigation flows

**E2E Tests:**
- Critical user journeys
- Authentication flow
- Session creation

### Backend Tests

**Unit Tests:**
- Services
- Validation schemas
- Utility functions

**Integration Tests:**
- API endpoints
- Database operations

**E2E Tests:**
- Full user workflows

---

## Development Philosophy

### Code Quality

- TypeScript for type safety
- ESLint for code consistency
- Prettier for formatting
- Clear, descriptive naming

### Documentation

- Code comments for complex logic
- README for each major module
- API documentation (this file!)
- Inline JSDoc for functions

### Performance

- Lazy loading where possible
- Pagination for lists
- Optimized queries (select specific fields)
- Memoization in React components

### User Experience

- Loading states
- Error handling with user-friendly messages
- Offline support (planned)
- Smooth animations

---

## Deployment Architecture (Future)

```
Internet
   │
   ▼
┌──────────────┐
│ Load Balancer│
│   (AWS ALB)  │
└──────┬───────┘
       │
       ├──────────────┬──────────────┐
       ▼              ▼              ▼
   ┌────────┐    ┌────────┐    ┌────────┐
   │  API   │    │  API   │    │  API   │
   │ Server │    │ Server │    │ Server │
   └───┬────┘    └───┬────┘    └───┬────┘
       │             │              │
       └─────────────┴──────────────┘
                     │
            ┌────────┴────────┐
            ▼                 ▼
       ┌────────┐        ┌────────┐
       │ Primary│────────│  Read  │
       │   DB   │        │Replica │
       └────────┘        └────────┘
```

---

## Technology Alternatives Considered

| Component | Chosen | Alternative | Why Chosen |
|-----------|--------|-------------|------------|
| Mobile Framework | React Native | Flutter | JS knowledge, ecosystem |
| Backend Runtime | Node.js | Python/FastAPI | JS everywhere |
| Database | PostgreSQL | MongoDB | Relational model fit |
| ORM | Prisma | TypeORM | Better DX, type safety |
| State Mgmt | Zustand | Redux Toolkit | Simplicity |
| Auth | JWT | Session-based | Scalability |

---

## Future Enhancements

### Technical
- GraphQL API option
- WebSocket for real-time updates
- Push notifications
- Offline-first architecture
- Image upload (S3)

### Features
- Comments on sessions
- Study groups
- Leaderboards
- Achievements/badges
- Analytics dashboard

---

This architecture is designed to be:
- ✅ **Scalable**: Can grow with user base
- ✅ **Maintainable**: Clear structure, separation of concerns
- ✅ **Secure**: Multiple security layers
- ✅ **Testable**: Modular design enables testing
- ✅ **Developer-friendly**: Good DX with TypeScript, Prisma, React
