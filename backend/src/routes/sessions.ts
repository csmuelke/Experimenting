import { Router } from 'express';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation schema
const createSessionSchema = z.object({
  duration: z.number().min(1),
  content: z.string().min(1),
  subject: z.string().optional(),
  tags: z.array(z.string()).optional(),
  startTime: z.string().refine((date) => !isNaN(Date.parse(date))),
  endTime: z.string().refine((date) => !isNaN(Date.parse(date))),
});

// POST /api/sessions - Create a learning session
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const data = createSessionSchema.parse(req.body);

    const session = await prisma.learningSession.create({
      data: {
        ...data,
        userId: req.userId!,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Validation error: ' + error.errors[0].message, 400));
    }
    next(error);
  }
});

// GET /api/sessions - Get user's learning sessions
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.query;
    const targetUserId = (userId as string) || req.userId!;

    const sessions = await prisma.learningSession.findMany({
      where: { userId: targetUserId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        _count: {
          select: { likes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Check which sessions are liked by current user
    const sessionsWithLikes = await Promise.all(
      sessions.map(async (session) => {
        const isLiked = await prisma.like.findUnique({
          where: {
            userId_sessionId: {
              userId: req.userId!,
              sessionId: session.id,
            },
          },
        });

        return {
          ...session,
          likesCount: session._count.likes,
          isLikedByCurrentUser: !!isLiked,
        };
      })
    );

    res.json({
      success: true,
      data: sessionsWithLikes,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/sessions/:id - Get a specific session
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const session = await prisma.learningSession.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        _count: {
          select: { likes: true },
        },
      },
    });

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    const isLiked = await prisma.like.findUnique({
      where: {
        userId_sessionId: {
          userId: req.userId!,
          sessionId: id,
        },
      },
    });

    res.json({
      success: true,
      data: {
        ...session,
        likesCount: session._count.likes,
        isLikedByCurrentUser: !!isLiked,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/sessions/:id/like - Like a session
router.post('/:id/like', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    // Check if session exists
    const session = await prisma.learningSession.findUnique({ where: { id } });
    if (!session) {
      throw new AppError('Session not found', 404);
    }

    const like = await prisma.like.create({
      data: {
        userId: req.userId!,
        sessionId: id,
      },
    });

    res.status(201).json({
      success: true,
      data: like,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return next(new AppError('Already liked this session', 400));
    }
    next(error);
  }
});

// DELETE /api/sessions/:id/like - Unlike a session
router.delete('/:id/like', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    await prisma.like.delete({
      where: {
        userId_sessionId: {
          userId: req.userId!,
          sessionId: id,
        },
      },
    });

    res.json({
      success: true,
      message: 'Unlike successful',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return next(new AppError('Like not found', 404));
    }
    next(error);
  }
});

// DELETE /api/sessions/:id - Delete a session (only owner)
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const session = await prisma.learningSession.findUnique({ where: { id } });

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    if (session.userId !== req.userId) {
      throw new AppError('Not authorized to delete this session', 403);
    }

    await prisma.learningSession.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Session deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
