import { useQuery } from "@tanstack/react-query";
import { instructorCourses } from "../../services/instructorService";

export const useInstructorCourses = () => {
  return useQuery({
    queryKey: ["instructor-courses"],
    queryFn: instructorCourses.list,
    staleTime: 1000 * 60 * 5, // 5 min
  });
};
