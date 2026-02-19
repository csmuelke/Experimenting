# Database Schema Documentation

## Overview

LearnSocial uses PostgreSQL as its primary database with Prisma ORM for type-safe database access. The schema is designed to support social learning features including user profiles, learning sessions, likes/kudos, and follower relationships.

## Database Diagram

```
┌─────────────┐
│    User     │
├─────────────┤
│ id          │──┐
│ email       │  │
│ password    │  │
│ name        │  │
│ dateOfBirth │  │
│ school      │  │
│ university  │  │
│ bio         │  │
│ profileImage│  │
│ createdAt   │  │
│ updatedAt   │  │
└─────────────┘  │
       │         │
       │         │
       ├─────────┼──────┐
       │         │      │
       ▼         ▼      ▼
┌──────────────┐ ┌────────┐ ┌─────────────┐
│LearningSession│ │ Follow │ │    Like     │
├──────────────┤ ├────────┤ ├─────────────┤
│ id           │ │ id     │ │ id          │
│ userId       │ │followerId  sessionId   │
│ duration     │ │followingId userId      │
│ content      │ │createdAt│ │ createdAt   │
│ subject      │ └────────┘ └─────────────┘
│ tags         │
│ startTime    │
│ endTime      │
│ createdAt    │
│ updatedAt    │
└──────────────┘
```

## Tables

### User

Stores user account information and profile data.

**Fields:**
- `id` (UUID, Primary Key): Unique user identifier
- `email` (String, Unique): User's email address for login
- `password` (String): Bcrypt hashed password
- `name` (String): User's full name
- `dateOfBirth` (DateTime): User's date of birth
- `school` (String, Optional): School name
- `university` (String, Optional): University name
- `bio` (String, Optional): User biography/description
- `profileImage` (String, Optional): URL to profile image
- `createdAt` (DateTime): Account creation timestamp
- `updatedAt` (DateTime): Last profile update timestamp

**Relations:**
- One-to-many with `LearningSession` (user's learning sessions)
- One-to-many with `Like` (likes given by user)
- One-to-many with `Follow` as follower (users this user follows)
- One-to-many with `Follow` as following (users following this user)
- One-to-many with `RefreshToken`

**Indexes:**
- Unique index on `email`

---

### LearningSession

Records individual learning sessions with time tracking and content.

**Fields:**
- `id` (UUID, Primary Key): Unique session identifier
- `userId` (UUID, Foreign Key): Owner of the learning session
- `duration` (Integer): Duration in seconds
- `content` (String): Description of what was learned
- `subject` (String, Optional): Subject/topic of learning
- `tags` (String[], Default: []): Tags for categorization
- `startTime` (DateTime): When the session started
- `endTime` (DateTime): When the session ended
- `createdAt` (DateTime): Record creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relations:**
- Many-to-one with `User` (session owner)
- One-to-many with `Like` (likes on this session)

**Indexes:**
- Index on `userId`
- Index on `createdAt` (for feed sorting)

**Delete Behavior:**
- Cascade delete when user is deleted

---

### Like (Kudos)

Represents user appreciation for learning sessions.

**Fields:**
- `id` (UUID, Primary Key): Unique like identifier
- `userId` (UUID, Foreign Key): User who liked
- `sessionId` (UUID, Foreign Key): Liked learning session
- `createdAt` (DateTime): When the like was given

**Relations:**
- Many-to-one with `User` (who liked)
- Many-to-one with `LearningSession` (liked session)

**Indexes:**
- Index on `userId`
- Index on `sessionId`
- Unique constraint on (`userId`, `sessionId`)

**Delete Behavior:**
- Cascade delete when user or session is deleted

**Business Rules:**
- A user can only like a session once (enforced by unique constraint)

---

### Follow

Manages follower/following relationships between users.

**Fields:**
- `id` (UUID, Primary Key): Unique follow relationship identifier
- `followerId` (UUID, Foreign Key): User who is following
- `followingId` (UUID, Foreign Key): User being followed
- `createdAt` (DateTime): When the follow relationship was created

**Relations:**
- Many-to-one with `User` as follower
- Many-to-one with `User` as following

**Indexes:**
- Index on `followerId`
- Index on `followingId`
- Unique constraint on (`followerId`, `followingId`)

**Delete Behavior:**
- Cascade delete when either user is deleted

**Business Rules:**
- A user cannot follow themselves (enforced at application level)
- A user can only follow another user once (enforced by unique constraint)

---

### RefreshToken

Stores JWT refresh tokens for secure authentication.

**Fields:**
- `id` (UUID, Primary Key): Unique token identifier
- `token` (String, Unique): The refresh token string
- `userId` (UUID, Foreign Key): Token owner
- `expiresAt` (DateTime): Token expiration time
- `createdAt` (DateTime): Token creation timestamp

**Relations:**
- Many-to-one with `User`

**Indexes:**
- Index on `userId`
- Unique index on `token`

**Delete Behavior:**
- Cascade delete when user is deleted

---

## Data Types

### UUIDs
All primary keys use UUID v4 for security and distribution. PostgreSQL's `uuid_ossp` or `pgcrypto` extension handles generation.

### Timestamps
All timestamps use PostgreSQL's `TIMESTAMP WITH TIME ZONE` for proper international handling.

### Arrays
The `tags` field in `LearningSession` uses PostgreSQL's native array type.

---

## Common Queries

### Get user's total learning time
```sql
SELECT SUM(duration) as total_time
FROM learning_sessions
WHERE user_id = $1;
```

### Get user's feed (followed users' sessions)
```sql
SELECT ls.*
FROM learning_sessions ls
INNER JOIN follows f ON ls.user_id = f.following_id
WHERE f.follower_id = $1
ORDER BY ls.created_at DESC;
```

### Get session with like status
```sql
SELECT ls.*, 
       COUNT(l.id) as likes_count,
       EXISTS(
         SELECT 1 FROM likes 
         WHERE session_id = ls.id AND user_id = $2
       ) as is_liked
FROM learning_sessions ls
LEFT JOIN likes l ON ls.id = l.session_id
WHERE ls.id = $1
GROUP BY ls.id;
```

---

## Migration Strategy

1. **Initial Setup**: Run `prisma migrate dev` to create initial schema
2. **Development**: Create new migrations with `prisma migrate dev --name description`
3. **Production**: Apply migrations with `prisma migrate deploy`

### Important Notes
- Always backup database before migrations
- Test migrations in staging environment
- Use transactions for data migrations
- Keep migrations small and focused

---

## Scaling Considerations

### Indexes
Current indexes support:
- Fast user lookup by email
- Efficient feed queries (followers' sessions)
- Quick like checks
- Follow relationship lookups

### Future Optimization Opportunities
1. **Materialized Views**: For user statistics (total time, followers count)
2. **Partitioning**: Learning sessions by date for large datasets
3. **Caching**: Redis for frequently accessed data (user profiles, feed)
4. **Read Replicas**: For heavy read operations (feed, search)

---

## Data Retention

### Current Policy
- All data retained indefinitely
- Soft deletes not implemented

### Future Considerations
- GDPR compliance: Right to deletion
- Data archival after N years of inactivity
- Session aggregation after time period

---

## Security

### Password Storage
- Bcrypt with configurable rounds (default: 10)
- Never store plaintext passwords
- Password validation at application level

### Sensitive Data
- Passwords never returned in API responses
- Date of birth restricted to owner/admin
- Email visibility configurable

### Cascading Deletes
All user data (sessions, likes, follows) automatically deleted when user account is deleted.
