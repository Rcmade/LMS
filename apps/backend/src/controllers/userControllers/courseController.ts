import { db } from "@/db/db";
import { getProgress } from "@/queries/getUserProgress";
import { getAuth } from "@clerk/express";
import {
  GetDashboardCoursesBackendT,
  GetTeacherAnalyticsBackendT,
  GetUserCourseBackendT,
  GetUserCourseProgressBackendT,
  GetUserPurchasedCoursesByIdBackendT,
} from "@workspace/types";
import { Request, Response } from "express";

export const getCourseProgress = async (
  req: Request<GetUserCourseProgressBackendT["params"]>,
  res: Response<GetUserCourseProgressBackendT["res"]>
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ progress: 0 });
    }

    const { courseId } = req.params;
    const progressPercentage = await getProgress(userId, courseId);

    return res.json({ progress: progressPercentage || 0 });
  } catch (error) {
    console.error("[GET_COURSE_PROGRESS]", error);
    return res.status(500).json({ progress: 0 });
  }
};

export const getCourses = async (
  req: Request<{}, {}, {}, GetUserCourseBackendT["query"]>,
  res: Response<GetUserCourseBackendT["res"]>
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, categoryId } = req.query;

    // fetch courses
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: title
          ? {
              contains: title as string,
              mode: "insensitive",
            }
          : undefined,
        categoryId: categoryId as string | undefined,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null,
          };
        }

        const progressPercentage = await getProgress(userId, course.id);

        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );

    return res.json(coursesWithProgress);
  } catch (error) {
    console.error("[GET_COURSES]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserPurchasedCoursesById = async (
  req: Request<GetUserPurchasedCoursesByIdBackendT["params"]>,
  res: Response<GetUserPurchasedCoursesByIdBackendT["res"]>
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.json({});
    }

    const { courseId } = req.params;

    // Get purchased course
    const purchase = await db.purchase.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (!purchase) {
      return res.status(404).json({});
    }
    const progress = (await getProgress(userId, courseId)) || 0;
    const data = { progress, purchase };
    return res.status(200).json(data);
  } catch (error) {
    console.error("[GET_COURSE_PROGRESS]", error);
    return res.status(500).json({});
  }
};

export const getDashboardCourses = async (
  req: Request,
  res: Response<GetDashboardCoursesBackendT["res"]>
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        completedCourses: [],
        coursesInProgress: [],
      });
    }

    const purchasedCourses = await db.purchase.findMany({
      where: { userId },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: { isPublished: true },
            },
          },
        },
      },
    });

    const courses = purchasedCourses.map((purchase) => ({
      ...purchase.course,
      progress: 0,
    }));

    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
      course.progress = progress || 0;
    }

    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );

    const coursesInProgress = courses.filter(
      (course) => ((course as any).progress ?? 0) < 100
    );
    const data = {
      completedCourses,
      coursesInProgress,
    };
    return res.status(200).json(data);
  } catch (error) {
    console.error("[GET_DASHBOARD_COURSES]", error);
    return res.status(500).json({
      completedCourses: [],
      coursesInProgress: [],
    });
  }
};

export const getAnalytics = async (
  req: Request,
  res: Response<GetTeacherAnalyticsBackendT["res"]>
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        data: [],
        totalRevenue: 0,
        totalSales: 0,
      });
    }

    const purchases = await db.purchase.findMany({
      where: {
        course: { userId },
      },
      include: { course: true },
    });

    const groupByCourse = (purchasesInput: typeof purchases) => {
      const grouped: { [courseTitle: string]: number } = {};
      purchasesInput.forEach((purchase) => {
        const courseTitle = purchase.course.title;
        if (!grouped[courseTitle]) {
          grouped[courseTitle] = 0;
        }
        grouped[courseTitle] += purchase.course.price || 0;
      });
      return grouped;
    };

    const groupedEarnings = groupByCourse(purchases);

    const grouped = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({
        name: courseTitle,
        total,
      })
    );

    const totalRevenue = grouped.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = purchases.length;

    const data = {
      data: grouped,
      totalRevenue,
      totalSales,
    };
    return res.status(200).json(data);
  } catch (error) {
    console.error("[GET_ANALYTICS]", error);
    return res.status(500).json({
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    });
  }
};
