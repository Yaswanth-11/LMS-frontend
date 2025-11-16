import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instructorLiveSessions } from "../../services/instructorService";
import { addToast } from "../../components/common/Toasts";

export const useLiveSessionMutations = (courseId) => {
  const qc = useQueryClient();

  const refresh = () => {
    qc.invalidateQueries(["live-sessions", courseId]);
  };

  return {
    createSession: useMutation({
      mutationFn: (payload) => instructorLiveSessions.create(courseId, payload),
      onSuccess: () => {
        addToast("Session created", "success");
        refresh();
      },
      onError: (err) => addToast(err.message, "danger"),
    }),

    updateSession: useMutation({
      mutationFn: ({ id, payload }) =>
        instructorLiveSessions.update(courseId, id, payload),
      onSuccess: () => {
        addToast("Session updated", "success");
        refresh();
      },
      onError: (err) => addToast(err.message, "danger"),
    }),

    deleteSession: useMutation({
      mutationFn: (id) => instructorLiveSessions.delete(courseId, id),
      onSuccess: () => {
        addToast("Session deleted", "success");
        refresh();
      },
      onError: (err) => addToast(err.message, "danger"),
    }),
  };
};
