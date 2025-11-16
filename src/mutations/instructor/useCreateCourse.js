import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instructorCourses } from "../../services/instructorService";
import { addToast } from "../../components/common/Toasts";

export const useCreateCourse = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: instructorCourses.create,
    onSuccess: () => {
      addToast("Course created successfully", "success");
      qc.invalidateQueries(["instructor-courses"]);
    },
    onError: (err) => addToast(err.message, "danger"),
  });
};
