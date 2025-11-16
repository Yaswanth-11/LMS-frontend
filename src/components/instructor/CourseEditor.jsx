import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { instructorCourses } from "../../services/instructorService";
import ConfirmDialog from "../common/ConfirmDialog";
import StatusStepper from "../common/StatusStepper";
import { addToast } from "../common/Toasts";

const LOCKED_STATUSES = [
  "submitted",
  "under_review",
  "published",
  "republished",
];

const CourseEditor = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    level: "",
    duration: "",
    price: "",
    courseType: "pre_recorded",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const isLocked = course && LOCKED_STATUSES.includes(course.status);

  // -------------------------------
  // Load course
  // -------------------------------
  const loadCourse = async () => {
    setLoading(true);
    try {
      const data = await instructorCourses.getOne(courseId);
      setCourse(data);

      setForm({
        title: data.title || "",
        subtitle: data.subtitle || "",
        description: data.description || "",
        category: data.category || "",
        level: data.level || "",
        duration: data.duration || "",
        price: data.price || "",
        courseType: data.courseType || "pre_recorded",
      });

      setThumbnailPreview(data.thumbnail || "");
    } catch (err) {
      addToast(err.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const handleInput = (e) => {
    if (isLocked) return addToast("Editing locked for review", "warning");

    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------------------
  // Thumbnail Upload
  // -------------------------------
  const handleThumbnailChange = (e) => {
    if (isLocked) return addToast("Editing locked for review", "warning");

    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addToast("Please upload a valid image", "warning");
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  // -------------------------------
  // Validation
  // -------------------------------
  const validateForm = () => {
    if (!form.title.trim()) {
      addToast("Title is required", "warning");
      return false;
    }
    if (!form.description.trim() || form.description.trim().length < 20) {
      addToast("Description must be at least 20 characters", "warning");
      return false;
    }
    return true;
  };

  // -------------------------------
  // Save Action
  // -------------------------------
  const handleSave = async () => {
    if (isLocked) return addToast("Course is locked for editing", "warning");
    if (!validateForm()) return;

    setSaving(true);
    try {
      // save JSON data
      await instructorCourses.update(courseId, {
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        level: form.level.trim(),
        duration: form.duration || undefined,
        price: form.price || undefined,
        courseType: form.courseType,
      });

      // save thumbnail if changed
      if (thumbnailFile) {
        const fd = new FormData();
        fd.append("thumbnail", thumbnailFile);
        await instructorCourses.update(courseId, fd);
      }

      addToast("Course updated successfully", "success");
      loadCourse();
    } catch (err) {
      addToast(err.message || "Failed to update course", "danger");
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------
  // Submit for Review
  // -------------------------------
  const handleSubmitCourse = async () => {
    setSaving(true);
    try {
      await instructorCourses.submit(courseId);
      addToast("Course submitted for review!", "success");
      loadCourse();
    } catch (err) {
      addToast(err.message || "Failed to submit", "danger");
    } finally {
      setSaving(false);
      setShowSubmitConfirm(false);
    }
  };

  // -------------------------------
  // UI Rendering
  // -------------------------------
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border"></div>
        <p className="mt-2">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">Course not found.</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/instructor" className="btn btn-outline-secondary btn-sm">
          ← Back to Dashboard
        </Link>
        <span className="badge bg-secondary">ID: {courseId}</span>
      </div>

      {/* Page Title */}
      <h3 className="fw-bold mb-3">Edit Course</h3>

      {/* Status Stepper */}
      <div className="mb-4">
        <StatusStepper status={course.status} />
      </div>

      {/* Review Feedback */}
      {course.status === "changes_requested" && (
        <div className="alert alert-warning">
          <strong>Changes Requested:</strong> {course.reviewComment}
        </div>
      )}

      {course.status === "rejected" && (
        <div className="alert alert-danger">
          <strong>Rejected:</strong> {course.reviewComment}
        </div>
      )}

      {/* Thumbnail */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Course Thumbnail</h5>

          <div className="d-flex gap-3 align-items-center">
            <div>
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="thumbnail"
                  className="rounded border"
                  style={{
                    width: "160px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  className="border rounded bg-light d-flex justify-content-center align-items-center"
                  style={{ width: "160px", height: "100px" }}
                >
                  No Image
                </div>
              )}
            </div>

            <div>
              <input
                type="file"
                accept="image/*"
                disabled={isLocked}
                onChange={handleThumbnailChange}
                className="form-control"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Basic Information</h5>

          <div className="mb-3">
            <label className="form-label">Title *</label>
            <input
              className="form-control"
              name="title"
              value={form.title}
              onChange={handleInput}
              disabled={isLocked}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Subtitle</label>
            <input
              className="form-control"
              name="subtitle"
              value={form.subtitle}
              onChange={handleInput}
              disabled={isLocked}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description *</label>
            <textarea
              className="form-control"
              rows="5"
              name="description"
              value={form.description}
              onChange={handleInput}
              disabled={isLocked}
            ></textarea>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Course Details</h5>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Category</label>
              <input
                className="form-control"
                name="category"
                value={form.category}
                onChange={handleInput}
                disabled={isLocked}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Level</label>
              <select
                className="form-select"
                name="level"
                value={form.level}
                onChange={handleInput}
                disabled={isLocked}
              >
                <option value="">Select level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Duration (hours)</label>
              <input
                className="form-control"
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleInput}
                disabled={isLocked}
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Pricing</h5>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Price (INR)</label>
              <input
                className="form-control"
                type="number"
                name="price"
                value={form.price}
                onChange={handleInput}
                disabled={isLocked}
                min="0"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Course Type</label>
              <select
                className="form-select"
                name="courseType"
                value={form.courseType}
                onChange={handleInput}
                disabled={isLocked}
              >
                <option value="pre_recorded">Pre-recorded</option>
                <option value="live">Live Cohort</option>
                <option value="pre_recorded_live">Hybrid</option>
                <option value="workshop">Workshop</option>
                <option value="demo">Demo Session</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex gap-2">
        <button
          className="btn btn-primary"
          disabled={saving || isLocked}
          onClick={handleSave}
        >
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>

        {/* Submit for Review */}
        {!isLocked && (
          <button
            className="btn btn-success"
            onClick={() => setShowSubmitConfirm(true)}
            disabled={saving}
          >
            Submit for Review
          </button>
        )}
      </div>

      {/* Confirm Submit Dialog */}
      <ConfirmDialog
        open={showSubmitConfirm}
        title="Submit Course for Review"
        description="Once submitted, you cannot edit the course until admin reviews it."
        variant="success"
        confirmLabel="Submit"
        cancelLabel="Cancel"
        loading={saving}
        onConfirm={handleSubmitCourse}
        onCancel={() => setShowSubmitConfirm(false)}
      />
    </div>
  );
};

export default CourseEditor;
