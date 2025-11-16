import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  instructorLessons,
  instructorCourses,
} from "../../services/instructorService";

import ConfirmDialog from "../common/ConfirmDialog";
import { addToast } from "../common/Toasts";

const LessonManager = () => {
  const { courseId, moduleId } = useParams();

  const [course, setCourse] = useState(null);
  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [lessonTitle, setLessonTitle] = useState("");
  const [editingLessonId, setEditingLessonId] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    lessonId: null,
  });

  const isLocked =
    course &&
    ["submitted", "under_review", "published", "republished"].includes(
      course.status
    );

  // ---------------------------------------
  // Load course and lessons
  // ---------------------------------------
  const loadLessons = async () => {
    setLoading(true);

    try {
      const data = await instructorCourses.getOne(courseId);
      setCourse(data);

      const section = data.modules?.find((m) => m._id === moduleId);
      setModule(section);

      const lessonList = await instructorLessons.list(courseId, moduleId);
      setLessons(lessonList || []);
    } catch (err) {
      addToast(err.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, [courseId, moduleId]);

  // ---------------------------------------
  // Add or Edit Lesson
  // ---------------------------------------
  const handleSaveLesson = async () => {
    if (!lessonTitle.trim()) {
      return addToast("Lesson title is required.", "warning");
    }
    if (isLocked) {
      return addToast("Course is locked for editing.", "warning");
    }

    setSaving(true);
    try {
      if (editingLessonId) {
        await instructorLessons.update(courseId, editingLessonId, {
          title: lessonTitle.trim(),
        });
        addToast("Lesson updated", "success");
      } else {
        await instructorLessons.create(courseId, moduleId, {
          title: lessonTitle.trim(),
        });
        addToast("Lesson added", "success");
      }

      setLessonTitle("");
      setEditingLessonId(null);
      loadLessons();
    } catch (err) {
      addToast(err.message, "danger");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (lesson) => {
    setEditingLessonId(lesson._id);
    setLessonTitle(lesson.title);
  };

  // ---------------------------------------
  // Delete Lesson
  // ---------------------------------------
  const handleDeleteLesson = async () => {
    if (isLocked) return addToast("Course is locked for editing.", "warning");

    setSaving(true);
    try {
      await instructorLessons.delete(courseId, confirmDelete.lessonId);
      addToast("Lesson deleted", "success");
      loadLessons();
    } catch (err) {
      addToast(err.message, "danger");
    } finally {
      setSaving(false);
      setConfirmDelete({ open: false, lessonId: null });
    }
  };

  // ---------------------------------------
  // Reorder lessons
  // ---------------------------------------
  const moveLesson = async (index, direction) => {
    if (isLocked) return addToast("Course is locked for editing.", "warning");

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= lessons.length) return;

    const newOrder = [...lessons];
    const temp = newOrder[index];
    newOrder[index] = newOrder[newIndex];
    newOrder[newIndex] = temp;

    setLessons(newOrder);

    try {
      await instructorLessons.reorder(
        courseId,
        moduleId,
        newOrder.map((l) => l._id)
      );

      addToast("Lessons reordered", "success");
    } catch (err) {
      addToast(err.message, "danger");
      loadLessons();
    }
  };

  // ---------------------------------------
  // UI
  // ---------------------------------------
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border"></div>
        <p className="mt-2">Loading lessons...</p>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">Module not found.</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="fw-bold">Manage Lessons – {module.title}</h3>

        <Link
          to={`/instructor/course/${courseId}/modules`}
          className="btn btn-outline-secondary btn-sm"
        >
          ← Back to Modules
        </Link>
      </div>

      {isLocked && (
        <div className="alert alert-warning">
          <strong>Course is locked.</strong> Lessons cannot be edited while the
          course is under review or published.
        </div>
      )}

      {/* Add/Edit Lesson */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">
            {editingLessonId ? "Edit Lesson" : "Add New Lesson"}
          </h5>

          <input
            className="form-control mb-3"
            placeholder="Lesson Title"
            disabled={isLocked}
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
          />

          <button
            className="btn btn-primary"
            disabled={saving || isLocked}
            onClick={handleSaveLesson}
          >
            {saving
              ? "Saving..."
              : editingLessonId
              ? "Update Lesson"
              : "Add Lesson"}
          </button>

          {editingLessonId && (
            <button
              className="btn btn-outline-secondary ms-2"
              disabled={saving}
              onClick={() => {
                setEditingLessonId(null);
                setLessonTitle("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Lesson List */}
      {lessons.length === 0 ? (
        <div className="alert alert-info text-center">No lessons yet.</div>
      ) : (
        <div className="list-group">
          {lessons.map((lesson, index) => (
            <div
              key={lesson._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{lesson.title}</strong>
              </div>

              <div className="d-flex gap-2">
                {/* Move Up */}
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={index === 0 || isLocked}
                  onClick={() => moveLesson(index, -1)}
                >
                  ↑
                </button>

                {/* Move Down */}
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={index === lessons.length - 1 || isLocked}
                  onClick={() => moveLesson(index, +1)}
                >
                  ↓
                </button>

                {/* Edit */}
                <button
                  className="btn btn-sm btn-outline-primary"
                  disabled={isLocked}
                  onClick={() => startEditing(lesson)}
                >
                  Edit
                </button>

                {/* Delete */}
                <button
                  className="btn btn-sm btn-outline-danger"
                  disabled={isLocked}
                  onClick={() =>
                    setConfirmDelete({ open: true, lessonId: lesson._id })
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={confirmDelete.open}
        title="Delete Lesson"
        description="Are you sure you want to delete this lesson? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={saving}
        onConfirm={handleDeleteLesson}
        onCancel={() => setConfirmDelete({ open: false, lessonId: null })}
      />
    </div>
  );
};

export default LessonManager;
