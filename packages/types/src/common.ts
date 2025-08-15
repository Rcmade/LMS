import { GetCourseByIdT } from "./api";

type Course = NonNullable<GetCourseByIdT["res"]["course"]>;
export type Chapter = Course["chapters"][number];
