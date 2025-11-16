import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instructorModules } from "../../services/instructorService";
import { addToast } from "../../components/common/Toasts";

export const useModuleMutations = (courseId) => {
  const qc = useQueryClient();

  const refresh = () => {
    qc.invalidateQueries(["modules", courseId]);
    qc.invalidateQueries(["instructor-course", courseId]);
  };

  return {
    createModule: useMutation({
      mutationFn: (payload) => instructorModules.create(courseId, payload),
      onSuccess: () => {
        addToast("Module added", "success");
        refresh();
      },
      onError: (err) => addToast(err.message, "danger"),
    }),

    updateModule: useMutation({
      mutationFn: ({ id, payload }) =>
        instructorModules.update(courseId, id, payload),
      onSuccess: () => {
        addToast("Module updated", "success");
        refresh();
      },
      onError: (err) => addToast(err.message, "danger"),
    }),

    deleteModule: useMutation({
      mutationFn: (id) => instructorModules.delete(courseId, id),
      onSuccess: () => {
        addToast("Module deleted", "success");
        refresh();
      },
      onError: (err) => addToast(err.message, "danger"),
    }),

    reorderModules: useMutation({
      mutationFn: (order) => instructorModules.reorder(courseId, order),
      onSuccess: () => {
        addToast("Modules reordered", "success");
        refresh();
      },
      onError: (err) => addToast(err.message, "danger"),
    }),
  };
};
