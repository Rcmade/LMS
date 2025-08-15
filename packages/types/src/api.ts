import type {
  CreateChapterSchemaT,
  CreateCourseSchemaT,
  EditChapterSchemaT,
  EditCourseSchemaT,
  ReorderChapterSchemaT,
} from "@workspace/zod-validator";

// Generic response wrapper
export type CommonResponse<T> = T | { error?: string };
export type WithCommonResponse<T extends { res: any }> = Omit<T, "res"> & {
  res: CommonResponse<T["res"]>;
};

// Define the API shape
export type CreateCourseApiT = {
  endPointExample: "/courses";
  method: "POST";
  req: CreateCourseSchemaT;
  res: {
    title: string;
    userId: string;
    id: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    price: number | null;
    isPublished: boolean;
    categoryId: string | null;
  };
};

export type CreateCourseBackendT = WithCommonResponse<CreateCourseApiT>;

export type GetCourseByIdT = {
  endPointExample: "/courses/c/:courseId";

  method: "GET";

  params: {
    courseId: string;
  };
  res: {
    course:
      | ({
          attachments: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string;
            url: string;
          }[];
          chapters: {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isPublished: boolean;
            courseId: string;
            position: number;
            videoUrl: string | null;
            isFree: boolean;
          }[];
        } & {
          title: string;
          id: string;
          userId: string;
          image: string | null;
          createdAt: Date;
          updatedAt: Date;
          description: string | null;
          price: number | null;
          isPublished: boolean;
          categoryId: string | null;
        })
      | null;
    categories: {
      name: string;
      id: string;
      createdAt: Date;
      updatedAt: Date;
    }[];
  };
};

export type GetCourseByIdBackendT = WithCommonResponse<GetCourseByIdT>;

export type GetCoursesT = {
  endPointExample: "/courses";
  method: "GET";

  res: {
    title: string;
    description: string | null;
    categoryId: string | null;
    price: number | null;
    id: string;
    userId: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    isPublished: boolean;
  }[];
};

export type GetCoursesBackendT = WithCommonResponse<GetCoursesT>;

export type EditCourseApiT = {
  endPointExample: "/courses/c/:courseId";
  method: "PATCH";
  params: {
    courseId: string;
  };
  req: Partial<EditCourseSchemaT>;
  res: {
    message: string;
  } & {
    data: {
      id: string;
      userId: string;
      image: string | null;
      createdAt: Date;
      updatedAt: Date;
      title: string;
      description: string | null;
      price: number | null;
      isPublished: boolean;
      categoryId: string | null;
    };
  };
};

export type EditCourserBackendT = WithCommonResponse<EditCourseApiT>;

export type UploadCourseImageApiT = {
  endPointExample: "/upload/c/:courseId/image";
  method: "POST";
  params: {
    courseId: string;
  };
  req: {
    image: File;
  };
  res: {
    message: string;
    data: { image: string };
  };
};

export type UploadCourseImageBackendT =
  WithCommonResponse<UploadCourseImageApiT>;

export type PublishCourseApiT = {
  endPointExample: "/courses/c/:courseId/publish";
  method: "PATCH";
  params: {
    courseId: string;
  };
  req: {};
  res: {
    message: string;
    data: {
      title: string;
      description: string | null;
      categoryId: string | null;
      price: number | null;
      userId: string;
      id: string;
      image: string | null;
      createdAt: Date;
      updatedAt: Date;
      isPublished: boolean;
    };
  };
};

export type PublishCourseBackendT = WithCommonResponse<PublishCourseApiT>;

export type UnPublishCourseApiT = {
  endPointExample: "/courses/c/:courseId/unpublish";
  method: "PATCH";
  params: {
    courseId: string;
  };
  req: {};
  res: {
    message: string;
    data: {
      title: string;
      description: string | null;
      categoryId: string | null;
      price: number | null;
      userId: string;
      id: string;
      image: string | null;
      createdAt: Date;
      updatedAt: Date;
      isPublished: boolean;
    };
  };
};

export type UnPublishCourseBackendT = WithCommonResponse<UnPublishCourseApiT>;

export type DeleteCourseApiT = {
  endPointExample: " /courses/c/:courseId";
  method: "DELETE";
  params: {
    courseId: string;
  };
  req: {};
  res: {
    message: string;
    data: { id: string };
  };
};

export type DeleteCourseBackendT = WithCommonResponse<DeleteCourseApiT>;

export type CreateChapterApiT = {
  endPointExample: "/chapters/c/:courseId";
  method: "POST";
  req: CreateChapterSchemaT;
  prams: {
    courseId: string;
  };
  res: {
    message: string;
    data: {
      title: string;
      courseId: string;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      description: string | null;
      isPublished: boolean;
      videoUrl: string | null;
      position: number;
      isFree: boolean;
    };
  };
};

export type CreateChapterBackendT = WithCommonResponse<CreateChapterApiT>;

export type ReorderChapterApiT = {
  endPointExample: "/chapters/c/:courseId/reorder";
  method: "POST";
  req: ReorderChapterSchemaT;
  prams: {
    courseId: string;
  };
  res: {
    message: string;
    data:
      | ({
          chapters: {
            title: string;
            courseId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isPublished: boolean;
            videoUrl: string | null;
            position: number;
            isFree: boolean;
          }[];
        } & {
          title: string;
          id: string;
          userId: string;
          image: string | null;
          createdAt: Date;
          updatedAt: Date;
          description: string | null;
          price: number | null;
          isPublished: boolean;
          categoryId: string | null;
        })
      | null;
  };
};

export type ReorderChapterBackendT = WithCommonResponse<ReorderChapterApiT>;

export type GetChapterByIdT = {
  endPointExample: "/chapters/c/:courseId/c/:chapterId";

  method: "GET";

  params: {
    courseId: string;
    chapterId: string;
  };
  res:
    | ({
        muxData: {
          id: string;
          assetId: string;
          playbackId: string | null;
          chapterId: string;
        } | null;
      } & {
        title: string;
        id: string;
        position: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        videoUrl: string | null;
        isPublished: boolean;
        isFree: boolean;
        courseId: string;
      })
    | null;
};

export type GetChapterByIdBackendT = WithCommonResponse<GetChapterByIdT>;

export type EditChapterApiT = {
  endPointExample: "/chapters/c/:courseId/c/:chapterId";
  method: "PATCH";
  params: {
    courseId: string;
    chapterId: string;
  };
  req: Partial<EditChapterSchemaT>;
  res: {
    message: string;
    data: {
      title: string;
      id: string;
      position: number;
      createdAt: Date;
      updatedAt: Date;
      description: string | null;
      videoUrl: string | null;
      isPublished: boolean;
      isFree: boolean;
      courseId: string;
    };
  };
};

export type EditChapterBackendT = WithCommonResponse<EditChapterApiT>;

export type DeleteChapterApiT = {
  endPointExample: " /chapters/c/:courseId/c/:chapterId";
  method: "DELETE";
  params: {
    chapterId: string;
    courseId: string;
  };
  res: {
    message: string;
    data: {
      title: string;
      id: string;
      position: number;
      createdAt: Date;
      updatedAt: Date;
      description: string | null;
      videoUrl: string | null;
      isPublished: boolean;
      isFree: boolean;
      courseId: string;
    };
  };
};

export type DeleteChapterBackendT = WithCommonResponse<DeleteChapterApiT>;

export type UploadChapterVideoApiT = {
  endPointExample: "/upload/c/:courseId/c/:chapterId/video";
  method: "POST";
  params: {
    courseId: string;
    chapterId: string;
  };
  req: {
    image: File;
  };
  res: {
    message: string;
    data: {
      chapter: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        videoUrl: string | null;
        position: number;
        isPublished: boolean;
        isFree: boolean;
        courseId: string;
      };
      mux: {
        assetId: string | null;
        playbackId: string | null;
      };
    };
  };
};

export type UploadChapterVideoBackendT =
  WithCommonResponse<UploadChapterVideoApiT>;

export type PublishChapterApiT = {
  endPointExample: "/chapters/c/:courseId/c/:chapterId/publish";
  method: "PATCH";
  params: {
    courseId: string;
    chapterId: string;
  };
  req: {};
  res: {
    message: string;
    data: {
      id: string;
      title: string;
      description: string | null;
      isPublished: boolean;
      createdAt: Date;
      updatedAt: Date;
      videoUrl: string | null;
      position: number;
      isFree: boolean;
      courseId: string;
    };
  };
};

export type PublishChapterBackendT = WithCommonResponse<PublishChapterApiT>;

export type UnPublishChapterApiT = {
  endPointExample: "/chapters/c/:courseId/c/:chapterId/unpublish";
  method: "PATCH";
  params: {
    courseId: string;
    chapterId: string;
  };
  req: {};
  res: {
    message: string;
    data: {
      id: string;
      title: string;
      description: string | null;
      isPublished: boolean;
      createdAt: Date;
      updatedAt: Date;
      videoUrl: string | null;
      position: number;
      isFree: boolean;
      courseId: string;
    };
  };
};

export type UnPublishChapterBackendT = WithCommonResponse<UnPublishChapterApiT>;

export type GetCategoriesT = {
  endPointExample: "/category";
  method: "GET";

  res: {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export type GetCategoriesBackendT = WithCommonResponse<GetCategoriesT>;

export type GetUserCourseProgressT = {
  endPointExample: "/user/course-progress/c/:courseId";
  method: "GET";
  params: {
    courseId: string;
  };
  res: {
    progress: number;
  };
};

export type GetUserCourseProgressBackendT =
  WithCommonResponse<GetUserCourseProgressT>;

export type GetUserPurchasedCoursesByIdApiT = {
  endPointExample: "/user/c/:courseId";
  method: "GET";
  params: {
    courseId: string;
  };
  res: {
    progress: number;
    purchase: {
      courseId: string;
      userId: string;
      id: string;
      createdAt: Date;
      updatedAt: Date;
    };
  } | null;
};

export type GetUserPurchasedCoursesByIdBackendT =
  WithCommonResponse<GetUserPurchasedCoursesByIdApiT>;

export type GetUserCourseT = {
  endPointExample: "/user/courses";
  method: "GET";
  query: { title?: string; categoryId?: string };
  res: {
    progress: number | null;
    category: {
      name: string;
      id: string;
      createdAt: Date;
      updatedAt: Date;
    } | null;
    chapters: {
      id: string;
    }[];
    purchases: {
      userId: string;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      courseId: string;
    }[];
    title: string;
    categoryId: string | null;
    userId: string;
    id: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    price: number | null;
    isPublished: boolean;
  }[];
};

export type GetUserCourseBackendT = WithCommonResponse<GetUserCourseT>;

export type GetPublicCourseByIdApiT = {
  endPointExample: "/public/c/:courseId";
  method: "GET";
  params: { courseId: string };
  res:
    | ({
        chapters: {
          id: string;
          createdAt: Date;
          updatedAt: Date;
          title: string;
          description: string | null;
          isPublished: boolean;
          courseId: string;
          position: number;
          isFree: boolean;
        }[];
      } & {
        id: string;
        userId: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        price: number | null;
        isPublished: boolean;
        categoryId: string | null;
      })
    | null;
};

export type GetPublicCourseByIdBackendT =
  WithCommonResponse<GetPublicCourseByIdApiT>;

export type GetChapterInfoByIdApiT = {
  endPointExample: "/chapter/c/:courseId/c/:chapterId";
  method: "GET";
  params: { chapterId: string; courseId: string };
  res: {
    chapter: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      title: string;
      description: string | null;
      isPublished: boolean;
      courseId: string;
      videoUrl: string | null | undefined;
      position: number;
      isFree: boolean;
    } | null;
    course: {
      price: number | null;
    } | null;
    muxData: {
      id: string;
      chapterId: string;
      assetId: string;
      playbackId: string | null;
    } | null;
    attachments: {
      name: string;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      courseId: string;
      url: string;
    }[];
    nextChapter: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      title: string;
      description: string | null;
      isPublished: boolean;
      courseId: string;
      videoUrl: string | null;
      position: number;
      isFree: boolean;
    } | null;
    userProgress: {
      chapterId: string;
      userId: string;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      isCompleted: boolean;
    } | null;
    purchase: {
      courseId: string;
      userId: string;
      id: string;
      createdAt: Date;
      updatedAt: Date;
    } | null;
  };
};

export type GetChapterInfoBackendT = WithCommonResponse<GetChapterInfoByIdApiT>;

export type CheckoutCourseApiT = {
  endPointExample: "/checkout/c/:courseId";
  method: "POST";
  params: { courseId: string };
  res: {
    message: string;
    courseId: string;
  };
};

export type CheckoutCourseBackendT = WithCommonResponse<CheckoutCourseApiT>;

export type GetDashboardCoursesApiT = {
  endPointExample: "/user/courses/dashboard";
  method: "GET";
  res: {
    completedCourses: {
      progress: number;
      category: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
      } | null;
      chapters: {
        courseId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        isPublished: boolean;
        videoUrl: string | null;
        position: number;
        isFree: boolean;
      }[];
      userId: string;
      id: string;
      image: string | null;
      createdAt: Date;
      updatedAt: Date;
      title: string;
      description: string | null;
      price: number | null;
      isPublished: boolean;
      categoryId: string | null;
    }[];
    coursesInProgress: {
      progress: number;
      category: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
      } | null;
      chapters: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        isPublished: boolean;
        title: string;
        description: string | null;
        videoUrl: string | null;
        position: number;
        isFree: boolean;
      }[];
      userId: string;
      id: string;
      image: string | null;
      createdAt: Date;
      updatedAt: Date;
      isPublished: boolean;
      title: string;
      description: string | null;
      price: number | null;
      categoryId: string | null;
    }[];
  };
};

export type GetDashboardCoursesBackendT =
  WithCommonResponse<GetDashboardCoursesApiT>;

export type GetTeacherAnalyticsApiT = {
  endPointExample: "/user/analytics";
  method: "GET";
  res: {
    data: {
      name: string;
      total: number;
    }[];
    totalRevenue: number;
    totalSales: number;
  };
};

export type GetTeacherAnalyticsBackendT =
  WithCommonResponse<GetTeacherAnalyticsApiT>;
