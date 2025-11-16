import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  instructorModules,
  instructorCourses,
} from "../../services/instructorService";

import ConfirmDialog from "../common/ConfirmDialog";
import { addToast } from "../common/Toasts";

const ModuleManager = () => {
  const { courseId } = useParams();

  const [modules, setModules] = useState([]);
  const [course, setCourse] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [editingModuleId, setEditingModuleId] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    moduleId: null,
  });

  const isLocked =
    course &&
    ["submitted", "under_review", "published", "republished"].includes(
      course.status
    );

  // -------------------------------
  // Load Modules + Course
  // -------------------------------
  const loadModules = async () => {
    setLoading(true);
    try {
      const courseData = await instructorCourses.getOne(courseId);
      setCourse(courseData);

      const list = await instructorModules.list(courseId);
      setModules(list || []);
    } catch (err) {
      addToast(err.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, [courseId]);

  // -------------------------------
  // Add / Edit Module
  // -------------------------------
  const handleSaveModule = async () => {
    if (!formTitle.trim()) {
      return addToast("Module title is required.", "warning");
    }
    if (isLocked) {
      return addToast("Course is locked for editing.", "warning");
    }

    setSaving(true);
    try {
      if (editingModuleId) {
        await instructorModules.update(courseId, editingModuleId, {
          title: formTitle.trim(),
        });
        addToast("Module updated", "success");
      } else {
        await instructorModules.create(courseId, {
          title: formTitle.trim(),
        });
        addToast("Module added", "success");
      }
      setFormTitle("");
      setEditingModuleId(null);
      loadModules();
    } catch (err) {
      addToast(err.message, "danger");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (module) => {
    setEditingModuleId(module._id);
    setFormTitle(module.title);
  };

  // -------------------------------
  // Delete Module (confirm)
  // -------------------------------
  const handleDelete = async () => {
    if (isLocked) {
      return addToast("Course is locked for editing.", "warning");
    }

    setSaving(true);
    try {
      await instructorModules.delete(courseId, confirmDelete.moduleId);
      addToast("Module deleted", "success");
      loadModules();
    } catch (err) {
      addToast(err.message, "danger");
    } finally {
      setSaving(false);
      setConfirmDelete({ open: false, moduleId: null });
    }
  };

  // -------------------------------
  // Reorder (Up/Down)
  // -------------------------------
  const moveModule = async (index, direction) => {
    if (isLocked) {
      return addToast("Course is locked for editing.", "warning");
    }

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= modules.length) return;

    const updatedOrder = [...modules];
    const temp = updatedOrder[index];
    updatedOrder[index] = updatedOrder[newIndex];
    updatedOrder[newIndex] = temp;

    setModules(updatedOrder);

    try {
      await instructorModules.reorder(
        courseId,
        updatedOrder.map((m) => m._id)
      );
      addToast("Modules reordered", "success");
    } catch (err) {
      addToast(err.message, "danger");
      loadModules();
    }
  };

  // -------------------------------
  // UI
  // -------------------------------
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border"></div>
        <p className="mt-2">Loading modules...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="fw-bold">Manage Modules</h3>

        <Link
          to={`/instructor/course/${courseId}`}
          className="btn btn-outline-secondary btn-sm"
        >
          ← Back to Course
        </Link>
      </div>

      {isLocked && (
        <div className="alert alert-warning">
          <strong>Course is locked.</strong> Modules cannot be edited while the
          course is under review or published.
        </div>
      )}

      {/* Add/Edit Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">
            {editingModuleId ? "Edit Module" : "Add New Module"}
          </h5>

          <input
            className="form-control mb-3"
            placeholder="Module Title"
            value={formTitle}
            disabled={isLocked}
            onChange={(e) => setFormTitle(e.target.value)}
          />

          <button
            className="btn btn-primary"
            disabled={isLocked || saving}
            onClick={handleSaveModule}
          >
            {saving
              ? "Saving..."
              : editingModuleId
              ? "Update Module"
              : "Add Module"}
          </button>

          {editingModuleId && (
            <button
              className="btn btn-outline-secondary ms-2"
              disabled={saving}
              onClick={() => {
                setEditingModuleId(null);
                setFormTitle("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Modules List */}
      {modules.length === 0 ? (
        <div className="alert alert-info text-center">No modules yet.</div>
      ) : (
        <div className="list-group">
          {modules.map((module, index) => (
            <div
              key={module._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{module.title}</strong>
              </div>

              <div className="d-flex gap-2">
                {/* Move Up */}
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={isLocked || index === 0}
                  onClick={() => moveModule(index, -1)}
                >
                  ↑
                </button>

                {/* Move Down */}
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={isLocked || index === modules.length - 1}
                  onClick={() => moveModule(index, +1)}
                >
                  ↓
                </button>

                {/* Edit */}
                <button
                  className="btn btn-sm btn-outline-primary"
                  disabled={isLocked}
                  onClick={() => startEditing(module)}
                >
                  Edit
                </button>

                {/* Lessons */}
                <Link
                  to={`/instructor/course/${courseId}/modules/${module._id}/lessons`}
                  className="btn btn-sm btn-dark"
                >
                  Lessons
                </Link>

                {/* Delete */}
                <button
                  className="btn btn-sm btn-outline-danger"
                  disabled={isLocked}
                  onClick={() =>
                    setConfirmDelete({ open: true, moduleId: module._id })
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDelete.open}
        title="Delete Module"
        description="Are you sure you want to delete this module? This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={saving}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete({ open: false, moduleId: null })}
      />
    </div>
  );
};

export default ModuleManager;
