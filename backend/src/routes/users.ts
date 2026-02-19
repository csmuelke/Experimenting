import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/users/:id - Get user profile
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        dateOfBirth: true,
        school: true,
        university: true,
        bio: true,
        profileImage: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Calculate total learning time
    const sessions = await prisma.learningSession.findMany({
      where: { userId: id },
      select: { duration: true },
    });

    const totalLearningTime = sessions.reduce((sum, s) => sum + s.duration, 0);

    // Check if current user follows this user
    const isFollowing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.userId!,
          followingId: id,
        },
      },
    });

    res.json({
      success: true,
      data: {
        ...user,
        followersCount: user._count.followers,
        followingCount: user._count.following,
        totalLearningTime,
        isFollowing: !!isFollowing,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/search?q=query - Search users
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      throw new AppError('Search query required', 400);
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        school: true,
        university: true,
      },
      take: 20,
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/users/:id/follow - Follow a user
router.post('/:id/follow', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.userId) {
      throw new AppError('Cannot follow yourself', 400);
    }

    // Check if user exists
    const userToFollow = await prisma.user.findUnique({ where: { id } });
    if (!userToFollow) {
      throw new AppError('User not found', 404);
    }

    // Create follow relationship
    const follow = await prisma.follow.create({
      data: {
        followerId: req.userId!,
        followingId: id,
      },
    });

    res.status(201).json({
      success: true,
      data: follow,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return next(new AppError('Already following this user', 400));
    }
    next(error);
  }
});

// DELETE /api/users/:id/follow - Unfollow a user
router.delete('/:id/follow', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: req.userId!,
          followingId: id,
        },
      },
    });

    res.json({
      success: true,
      message: 'Unfollowed successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return next(new AppError('Not following this user', 400));
    }
    next(error);
  }
});

// GET /api/users/:id/followers - Get user's followers
router.get('/:id/followers', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const followers = await prisma.follow.findMany({
      where: { followingId: id },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: followers.map((f) => f.follower),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:id/following - Get users that user follows
router.get('/:id/following', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const following = await prisma.follow.findMany({
      where: { followerId: id },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: following.map((f) => f.following),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
