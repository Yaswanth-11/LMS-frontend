import { useQuery } from "@tanstack/react-query";
import { instructorModules } from "../../services/instructorService";

export const useModules = (courseId) => {
  return useQuery({
    queryKey: ["modules", courseId],
    queryFn: () => instructorModules.list(courseId),
    enabled: !!courseId,
  });
};
