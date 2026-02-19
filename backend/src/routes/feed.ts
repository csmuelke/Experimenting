import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../server';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/feed - Get activity feed from followed users
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Get users that current user follows
    const following = await prisma.follow.findMany({
      where: { followerId: req.userId },
      select: { followingId: true },
    });

    const followingIds = following.map((f: { followingId: string }) => f.followingId);

    // Get learning sessions from followed users
    const sessions = await prisma.learningSession.findMany({
      where: {
        userId: { in: followingIds },
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
        _count: {
          select: { likes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    // Get total count for pagination
    const total = await prisma.learningSession.count({
      where: {
        userId: { in: followingIds },
      },
    });

    // Check which sessions are liked by current user
    const sessionsWithLikes = await Promise.all(
      sessions.map(async (session: any) => {
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
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        hasMore: skip + limitNum < total,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
