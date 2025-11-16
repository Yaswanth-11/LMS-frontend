import { useQuery } from "@tanstack/react-query";
import { instructorCourses } from "../../services/instructorService";

export const useInstructorCourse = (courseId) => {
  return useQuery({
    queryKey: ["instructor-course", courseId],
    queryFn: () => instructorCourses.getOne(courseId),
    enabled: !!courseId,
  });
};
