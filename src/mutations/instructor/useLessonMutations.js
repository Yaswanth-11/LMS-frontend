import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instructorLessons } from "../../services/instructorService";
import { addToast } from "../../components/common/Toasts";

export const useLessonMutations = (courseId, moduleId) => {
  const qc = useQueryClient();

  const refresh = () => {
    qc.invalidateQueries(["lessons", courseId, moduleId]);
  };

  return {
    createLesson: useMutation({
      mutationFn: (payload) =>
        instructorLessons.create(courseId, moduleId, payload),
      onSuccess: () => {
        addToast("Lesson added", "success");
        refresh();
      },
      onError: (err) => addToast(err.message, "danger"),
    }),

    updateLesson: useMutation({
      mutationFn: ({ id, payload }) =>
        instructorLessons.update(courseId, id, payload),
      onSuccess: () => {
        addToast("Lesson updated", "success");
        refresh();
      },
      onError: (err) => addToast(err.message, "danger"),
    }),

    deleteLesson: useMutation({
      mutationFn: (id) => instructorLessons.delete(courseId, id),
      onSuccess: () => {
        addToast("Lesson deleted", "success");
        refresh();
      },
      onError: (err) => addToast(err.message, "danger"),
    }),

    reorderLessons: useMutation({
      mutationFn: (order) =>
        instructorLessons.reorder(courseId, moduleId, order),
      onSuccess: () => {
        addToast("Lessons reordered", "success");
        refresh();
      },
      onError: (err) => addToast(err.message, "danger"),
    }),
  };
};
