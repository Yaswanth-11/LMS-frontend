import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { instructorCourses } from "../../services/instructorService";
import { addToast } from "../common/Toasts";

const InstructorAddCourse = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    courseType: "pre_recorded",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      addToast("Course title is required.", "warning");
      return false;
    }
    return true;
  };

  const handleCreateCourse = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const created = await instructorCourses.create({
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        courseType: form.courseType,
      });

      addToast("Course created successfully!", "success");

      // Backend may return _id or courseId
      const courseId = created?._id || created?.courseId;

      navigate(`/instructor/course/${courseId}`);
    } catch (err) {
      addToast(err?.message || "Failed to create course", "danger");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="fw-bold">Create New Course</h3>
        <Link to="/instructor" className="btn btn-outline-secondary btn-sm">
          ← Back
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {/* Title */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Course Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g., Mastering React.js"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          {/* Subtitle */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              className="form-control"
              placeholder="Optional short description"
              value={form.subtitle}
              onChange={handleChange}
            />
          </div>

          {/* Course Type */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Course Type</label>
            <select
              name="courseType"
              className="form-select"
              value={form.courseType}
              onChange={handleChange}
            >
              <option value="pre_recorded">Pre-recorded</option>
              <option value="live">Live Cohort</option>
              <option value="pre_recorded_live">Hybrid</option>
              <option value="workshop">Workshop</option>
              <option value="demo">Demo Session</option>
            </select>
          </div>

          {/* Actions */}
          <div className="d-flex align-items-center gap-2 mt-4">
            <button
              className="btn btn-primary"
              disabled={saving}
              onClick={handleCreateCourse}
            >
              {saving ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Creating...
                </>
              ) : (
                "Create Course"
              )}
            </button>

            <button
              className="btn btn-outline-secondary"
              disabled={saving}
              onClick={() =>
                setForm({ title: "", subtitle: "", courseType: "pre_recorded" })
              }
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorAddCourse;
