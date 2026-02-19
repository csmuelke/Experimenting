# Development Guide

## Code Standards and Best Practices

### General Principles

1. **DRY (Don't Repeat Yourself)** - Extract common logic into reusable functions/components
2. **KISS (Keep It Simple, Stupid)** - Favor simple, readable solutions over clever code
3. **YAGNI (You Aren't Gonna Need It)** - Don't add functionality until needed
4. **Single Responsibility** - Each function/class should have one clear purpose
5. **Type Safety** - Leverage TypeScript fully, avoid `any` types

---

## TypeScript Guidelines

### Type Definitions

**DO:**
```typescript
// Define explicit interfaces
interface User {
  id: string;
  name: string;
  email: string;
}

// Use type inference when obvious
const count = 5; // clearly a number
```

**DON'T:**
```typescript
// Avoid any
const data: any = fetchData();

// Don't over-specify obvious types
const count: number = 5; // redundant
```

### Null Safety

```typescript
// Use optional chaining
const email = user?.email;

// Use nullish coalescing
const name = user?.name ?? 'Anonymous';

// Type guards for checks
if (user && 'email' in user) {
  console.log(user.email);
}
```

---

## Mobile Development (React Native)

### Component Structure

```typescript
// Functional components with TypeScript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  onPress?: () => void;
}

export default function MyComponent({ title, onPress }: Props) {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
```

### State Management

**Use Zustand for global state:**

```typescript
import { create } from 'zustand';

interface StoreState {
  count: number;
  increment: () => void;
}

export const useStore = create<StoreState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

**Use local state for component-specific data:**

```typescript
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <Button onPress={() => setCount(count + 1)}>
      Count: {count}
    </Button>
  );
}
```

### API Calls

**Organize API calls in service modules:**

```typescript
// services/api/sessions.ts
import apiClient from './client';
import { LearningSession } from '@/types';

export const sessionsApi = {
  create: async (data: CreateSessionData) => {
    const response = await apiClient.post('/sessions', data);
    return response.data as LearningSession;
  },
  
  getAll: async (userId?: string) => {
    const response = await apiClient.get('/sessions', {
      params: { userId },
    });
    return response.data as LearningSession[];
  },
};
```

**Use in components:**

```typescript
function SessionList() {
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await sessionsApi.getAll();
        setSessions(data);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) return <ActivityIndicator />;
  
  return <FlatList data={sessions} />;
}
```

### Error Handling

```typescript
// Centralized error handling
const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error || error.message;
    Alert.alert('Error', message);
  } else {
    Alert.alert('Error', 'Something went wrong');
  }
};

// Usage
try {
  await api.createSession(data);
} catch (error) {
  handleError(error);
}
```

---

## Backend Development (Node.js/Express)

### Route Structure

```typescript
// routes/sessions.ts
import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import * as controller from '@/controllers/sessions';

const router = Router();

router.use(authenticate); // All routes require auth

router.post('/', controller.createSession);
router.get('/', controller.getSessions);
router.get('/:id', controller.getSessionById);
router.delete('/:id', controller.deleteSession);

export default router;
```

### Controllers

```typescript
// controllers/sessions.ts
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '@/middleware/auth';
import * as service from '@/services/sessions';

export const createSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await service.createSession({
      ...req.body,
      userId: req.userId!,
    });
    
    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};
```

### Services (Business Logic)

```typescript
// services/sessions.ts
import { prisma } from '@/server';
import { AppError } from '@/middleware/errorHandler';

export const createSession = async (data: CreateSessionDTO) => {
  // Validation
  if (data.duration < 1) {
    throw new AppError('Duration must be positive', 400);
  }

  // Business logic
  const session = await prisma.learningSession.create({
    data: {
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    },
  });

  return session;
};
```

### Validation with Zod

```typescript
import { z } from 'zod';

const createSessionSchema = z.object({
  duration: z.number().min(1),
  content: z.string().min(1).max(5000),
  subject: z.string().optional(),
  tags: z.array(z.string()).optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

// In controller
const data = createSessionSchema.parse(req.body);
```

### Error Handling

```typescript
// Custom error class
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number
  ) {
    super(message);
  }
}

// Throw errors
throw new AppError('User not found', 404);

// Centralized error handler (middleware)
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  console.error(err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};
```

---

## Database Best Practices

### Prisma Queries

**DO:**
```typescript
// Select only needed fields
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// Use includes for relations
const session = await prisma.learningSession.findMany({
  include: {
    user: {
      select: { id: true, name: true },
    },
  },
});
```

**DON'T:**
```typescript
// Don't fetch all fields when not needed
const user = await prisma.user.findUnique({
  where: { id },
}); // Includes password hash!

// Don't forget pagination
const allSessions = await prisma.learningSession.findMany();
// Could return millions of records!
```

### Transactions

```typescript
// Use transactions for related operations
await prisma.$transaction(async (tx) => {
  const session = await tx.learningSession.create({
    data: sessionData,
  });

  await tx.user.update({
    where: { id: userId },
    data: {
      totalSessions: { increment: 1 },
    },
  });
});
```

---

## Git Workflow

### Branch Naming

```
feature/add-user-search
bugfix/fix-login-error
hotfix/security-patch
refactor/improve-auth
```

### Commit Messages

Follow conventional commits:

```
feat: add user search functionality
fix: resolve login token expiry issue
docs: update API documentation
refactor: simplify authentication logic
test: add tests for session creation
chore: update dependencies
```

### Pull Request Process

1. Create feature branch from `main`
2. Make changes with clear commits
3. Update tests if needed
4. Update documentation
5. Create PR with description
6. Request review
7. Address feedback
8. Merge when approved

---

## Code Review Checklist

### For Reviewers

- [ ] Code follows style guidelines
- [ ] TypeScript types are properly used
- [ ] Error handling is comprehensive
- [ ] Security considerations addressed
- [ ] No sensitive data in logs
- [ ] Performance is acceptable
- [ ] Tests are included/updated
- [ ] Documentation is updated

### For Authors

- [ ] Self-review completed
- [ ] Runs locally without errors
- [ ] Tests pass
- [ ] No console.logs left in
- [ ] Environment variables documented
- [ ] PR description is clear

---

## Testing Guidelines

### Unit Tests (Jest)

```typescript
// sum.test.ts
import { sum } from './sum';

describe('sum', () => {
  it('should add two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('should handle negative numbers', () => {
    expect(sum(-1, -2)).toBe(-3);
  });
});
```

### React Native Component Tests

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from './LoginScreen';

describe('LoginScreen', () => {
  it('should call login on submit', () => {
    const mockLogin = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen onLogin={mockLogin} />
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.press(getByText('Login'));

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });
});
```

---

## Performance Optimization

### Mobile App

**Optimize Re-renders:**
```typescript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <View>...</View>;
});

// Use useCallback for functions passed as props
const handlePress = useCallback(() => {
  doSomething();
}, []);

// Use useMemo for expensive calculations
const sortedData = useMemo(
  () => data.sort((a, b) => a.name.localeCompare(b.name)),
  [data]
);
```

**Optimize Lists:**
```typescript
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={renderItem}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
/>
```

### Backend

**Optimize Queries:**
```typescript
// Bad: N+1 query problem
const sessions = await prisma.learningSession.findMany();
for (const session of sessions) {
  session.user = await prisma.user.findUnique({
    where: { id: session.userId },
  });
}

// Good: Use include
const sessions = await prisma.learningSession.findMany({
  include: { user: true },
});
```

**Use Pagination:**
```typescript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 20;
const skip = (page - 1) * limit;

const [data, total] = await Promise.all([
  prisma.learningSession.findMany({
    skip,
    take: limit,
  }),
  prisma.learningSession.count(),
]);
```

---

## Security Checklist

- [ ] Never log passwords or tokens
- [ ] Validate all user input
- [ ] Use parameterized queries (Prisma handles this)
- [ ] Implement rate limiting
- [ ] Use HTTPS in production
- [ ] Set secure JWT secrets
- [ ] Implement CORS properly
- [ ] Use helmet for security headers
- [ ] Hash passwords with bcrypt
- [ ] Validate file uploads (future feature)

---

## Debugging Tips

### Mobile App

```typescript
// Use React Native Debugger
// Install: https://github.com/jhen0409/react-native-debugger

// Log API requests
apiClient.interceptors.request.use((config) => {
  console.log('Request:', config.method, config.url);
  return config;
});

// Use Reactotron for enhanced debugging
// https://github.com/infinitered/reactotron
```

### Backend

```typescript
// Use VS Code debugger
// Add to .vscode/launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "dev"],
  "skipFiles": ["<node_internals>/**"]
}

// Use Morgan for HTTP logging
app.use(morgan('dev'));

// Log Prisma queries
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

---

## Common Patterns

### Loading States

```typescript
function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <EmptyState />;
  
  return <DataDisplay data={data} />;
}
```

### Form Handling

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginForm() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    // Form is validated automatically
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ... */}
    </form>
  );
}
```

---

## Resources

### Documentation
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Express.js Docs](https://expressjs.com/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [Prisma Studio](https://www.prisma.io/studio) - Database GUI
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [VS Code](https://code.visualstudio.com/)

---

**Remember:** Write code that you'll understand in 6 months! 🚀
