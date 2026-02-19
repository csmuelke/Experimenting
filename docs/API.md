# API Documentation

## Base URL

```
Development: http://localhost:3000/api
Production: https://api.learnsocial.com/api
```

## Authentication

Most endpoints require authentication using JWT (JSON Web Tokens).

### Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Token Lifecycle

- **Access Token**: 15 minutes (short-lived)
- **Refresh Token**: 7 days (stored securely)
- Refresh tokens before expiry using `/api/auth/refresh`

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { /* response data */ }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasMore": true
  }
}
```

---

## Endpoints

## Authentication

### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe",
  "dateOfBirth": "1995-05-15",
  "school": "Optional High School",
  "university": "Optional University"
}
```

**Validation:**
- Email must be valid format
- Password minimum 8 characters
- Name minimum 2 characters
- Date of birth must be valid date string

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "dateOfBirth": "1995-05-15T00:00:00.000Z",
      "school": "Optional High School",
      "university": "Optional University",
      "bio": null,
      "profileImage": null,
      "createdAt": "2026-02-19T10:00:00.000Z",
      "updatedAt": "2026-02-19T10:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

**Error Responses:**
- 400: Validation error or user already exists

---

### POST /api/auth/login

Authenticate existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

**Error Responses:**
- 401: Invalid credentials

---

### POST /api/auth/refresh

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "new_access_token",
      "refreshToken": "new_refresh_token"
    }
  }
}
```

**Error Responses:**
- 401: Invalid or expired refresh token

---

### GET /api/auth/me

Get current authenticated user's profile.

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "dateOfBirth": "1995-05-15T00:00:00.000Z",
    "school": "Optional High School",
    "university": "Optional University",
    "bio": "Learning enthusiast",
    "profileImage": "https://...",
    "followersCount": 42,
    "followingCount": 35,
    "totalLearningTime": 125400,
    "createdAt": "2026-02-19T10:00:00.000Z",
    "updatedAt": "2026-02-19T10:00:00.000Z"
  }
}
```

---

### POST /api/auth/logout

Logout and invalidate refresh tokens.

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Users

### GET /api/users/:id

Get user profile by ID.

**Authentication:** Required

**Path Parameters:**
- `id` (string): User ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "dateOfBirth": "1995-05-15T00:00:00.000Z",
    "school": "High School",
    "university": "University",
    "bio": "Learning enthusiast",
    "profileImage": "https://...",
    "followersCount": 42,
    "followingCount": 35,
    "totalLearningTime": 125400,
    "isFollowing": true,
    "createdAt": "2026-02-19T10:00:00.000Z"
  }
}
```

**Error Responses:**
- 404: User not found

---

### GET /api/users?q=search_query

Search for users by name or email.

**Authentication:** Required

**Query Parameters:**
- `q` (string, required): Search query

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "profileImage": "https://...",
      "school": "High School",
      "university": "University"
    }
  ]
}
```

**Limits:**
- Maximum 20 results

---

### POST /api/users/:id/follow

Follow a user.

**Authentication:** Required

**Path Parameters:**
- `id` (string): User ID to follow

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "followerId": "your_user_id",
    "followingId": "followed_user_id",
    "createdAt": "2026-02-19T10:00:00.000Z"
  }
}
```

**Error Responses:**
- 400: Cannot follow yourself or already following
- 404: User not found

---

### DELETE /api/users/:id/follow

Unfollow a user.

**Authentication:** Required

**Path Parameters:**
- `id` (string): User ID to unfollow

**Success Response (200):**
```json
{
  "success": true,
  "message": "Unfollowed successfully"
}
```

**Error Responses:**
- 400: Not following this user

---

### GET /api/users/:id/followers

Get list of user's followers.

**Authentication:** Required

**Path Parameters:**
- `id` (string): User ID

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Follower Name",
      "email": "follower@example.com",
      "profileImage": "https://..."
    }
  ]
}
```

---

### GET /api/users/:id/following

Get list of users that this user follows.

**Authentication:** Required

**Path Parameters:**
- `id` (string): User ID

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "User Name",
      "email": "user@example.com",
      "profileImage": "https://..."
    }
  ]
}
```

---

## Learning Sessions

### POST /api/sessions

Create a new learning session.

**Authentication:** Required

**Request Body:**
```json
{
  "duration": 3600,
  "content": "Learned React Native navigation and state management",
  "subject": "React Native",
  "tags": ["react", "mobile", "javascript"],
  "startTime": "2026-02-19T10:00:00.000Z",
  "endTime": "2026-02-19T11:00:00.000Z"
}
```

**Validation:**
- Duration must be at least 1 second
- Content is required (minimum 1 character)
- Start and end times must be valid dates

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "user_uuid",
    "duration": 3600,
    "content": "Learned React Native navigation...",
    "subject": "React Native",
    "tags": ["react", "mobile", "javascript"],
    "startTime": "2026-02-19T10:00:00.000Z",
    "endTime": "2026-02-19T11:00:00.000Z",
    "createdAt": "2026-02-19T11:05:00.000Z",
    "updatedAt": "2026-02-19T11:05:00.000Z",
    "user": {
      "id": "user_uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "profileImage": "https://..."
    }
  }
}
```

---

### GET /api/sessions

Get learning sessions for a user.

**Authentication:** Required

**Query Parameters:**
- `userId` (string, optional): User ID (defaults to current user)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "user_uuid",
      "duration": 3600,
      "content": "Learned React Native...",
      "subject": "React Native",
      "tags": ["react", "mobile"],
      "startTime": "2026-02-19T10:00:00.000Z",
      "endTime": "2026-02-19T11:00:00.000Z",
      "likesCount": 5,
      "isLikedByCurrentUser": true,
      "user": { /* user object */ },
      "createdAt": "2026-02-19T11:05:00.000Z"
    }
  ]
}
```

---

### GET /api/sessions/:id

Get a specific learning session by ID.

**Authentication:** Required

**Path Parameters:**
- `id` (string): Session ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "user_uuid",
    "duration": 3600,
    "content": "Learned React Native navigation and state management",
    "subject": "React Native",
    "tags": ["react", "mobile", "javascript"],
    "startTime": "2026-02-19T10:00:00.000Z",
    "endTime": "2026-02-19T11:00:00.000Z",
    "likesCount": 5,
    "isLikedByCurrentUser": true,
    "user": { /* user object */ },
    "createdAt": "2026-02-19T11:05:00.000Z",
    "updatedAt": "2026-02-19T11:05:00.000Z"
  }
}
```

**Error Responses:**
- 404: Session not found

---

### POST /api/sessions/:id/like

Like a learning session.

**Authentication:** Required

**Path Parameters:**
- `id` (string): Session ID

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "your_user_id",
    "sessionId": "session_id",
    "createdAt": "2026-02-19T11:10:00.000Z"
  }
}
```

**Error Responses:**
- 400: Already liked this session
- 404: Session not found

---

### DELETE /api/sessions/:id/like

Unlike a learning session.

**Authentication:** Required

**Path Parameters:**
- `id` (string): Session ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Unlike successful"
}
```

**Error Responses:**
- 404: Like not found

---

### DELETE /api/sessions/:id

Delete a learning session (owner only).

**Authentication:** Required

**Path Parameters:**
- `id` (string): Session ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Session deleted successfully"
}
```

**Error Responses:**
- 403: Not authorized (not session owner)
- 404: Session not found

---

## Feed

### GET /api/feed

Get activity feed from followed users.

**Authentication:** Required

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "user_uuid",
      "duration": 3600,
      "content": "Learned advanced TypeScript patterns",
      "subject": "TypeScript",
      "tags": ["typescript", "programming"],
      "startTime": "2026-02-19T10:00:00.000Z",
      "endTime": "2026-02-19T11:00:00.000Z",
      "likesCount": 12,
      "isLikedByCurrentUser": false,
      "user": {
        "id": "user_uuid",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "profileImage": "https://..."
      },
      "createdAt": "2026-02-19T11:05:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasMore": true
  }
}
```

---

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

- **Default**: 100 requests per minute per IP
- **Authenticated**: 1000 requests per minute per user
- Headers returned: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "dateOfBirth": "1995-01-01"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Session (with auth)
```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "duration": 3600,
    "content": "Learned API development",
    "subject": "Backend",
    "startTime": "2026-02-19T10:00:00Z",
    "endTime": "2026-02-19T11:00:00Z"
  }'
```

---

## Postman Collection

A complete Postman collection is available in `/docs/postman_collection.json`.

Import it into Postman for easy API testing.
