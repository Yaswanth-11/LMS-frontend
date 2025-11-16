import { useQuery } from "@tanstack/react-query";
import { instructorLessons } from "../../services/instructorService";

export const useLessons = (courseId, moduleId) => {
  return useQuery({
    queryKey: ["lessons", courseId, moduleId],
    queryFn: () => instructorLessons.list(courseId, moduleId),
    enabled: !!courseId && !!moduleId,
  });
};
