import { useQuery } from "@tanstack/react-query";
import { instructorLiveSessions } from "../../services/instructorService";

export const useLiveSessions = (courseId) => {
  return useQuery({
    queryKey: ["live-sessions", courseId],
    queryFn: () => instructorLiveSessions.list(courseId),
    enabled: !!courseId,
  });
};
