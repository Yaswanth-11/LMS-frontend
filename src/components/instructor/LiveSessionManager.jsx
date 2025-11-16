import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  instructorLiveSessions,
  instructorCourses,
} from "../../services/instructorService";

import ConfirmDialog from "../common/ConfirmDialog";
import { addToast } from "../common/Toasts";

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const SESSION_TYPES = [
  { value: "live", label: "Live" },
  { value: "workshop", label: "Workshop" },
  { value: "hybrid", label: "Hybrid" },
  { value: "demo", label: "Demo Session" },
];

const LOCKED_STATUSES = [
  "submitted",
  "under_review",
  "published",
  "republished",
];

const toLocalInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

const toISO = (value) => {
  if (!value) return null;
  return new Date(value).toISOString();
};

const LiveSessionManager = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [sessions, setSessions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    sessionType: "live",
    status: "scheduled",
    startTime: "",
    endTime: "",
    meetingUrl: "",
    meetingPlatform: "",
    timezone: "Asia/Kolkata",
    agenda: "",
    instructorNotes: "",
    recordingUrl: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    sessionId: null,
  });

  const isLocked = course && LOCKED_STATUSES.includes(course.status);

  // ------------------------------
  // Load Course + Sessions
  // ------------------------------
  const loadData = async () => {
    setLoading(true);
    try {
      const courseData = await instructorCourses.getOne(courseId);
      setCourse(courseData);

      const sessionData = await instructorLiveSessions.list(courseId);
      setSessions(sessionData || []);
    } catch (err) {
      addToast(err.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  // ------------------------------
  // Handle Form
  // ------------------------------
  const handleInput = (e) => {
    if (isLocked) return addToast("Editing locked during review", "warning");

    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      addToast("Title is required.", "warning");
      return false;
    }
    if (!form.startTime) {
      addToast("Start time is required.", "warning");
      return false;
    }
    if (form.endTime && new Date(form.endTime) <= new Date(form.startTime)) {
      addToast("End time must be after start time.", "warning");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: "",
      sessionType: "live",
      status: "scheduled",
      startTime: "",
      endTime: "",
      meetingUrl: "",
      meetingPlatform: "",
      timezone: "Asia/Kolkata",
      agenda: "",
      instructorNotes: "",
      recordingUrl: "",
    });
  };

  // ------------------------------
  // Save (Create or Update)
  // ------------------------------
  const handleSave = async () => {
    if (!validateForm()) return;
    if (isLocked) return addToast("Course locked", "warning");

    setSaving(true);
    try {
      const payload = {
        ...form,
        startTime: toISO(form.startTime),
        endTime: toISO(form.endTime),
      };

      if (editingId) {
        await instructorLiveSessions.update(courseId, editingId, payload);
        addToast("Live session updated", "success");
      } else {
        await instructorLiveSessions.create(courseId, payload);
        addToast("Live session created", "success");
      }

      resetForm();
      loadData();
    } catch (err) {
      addToast(err.message, "danger");
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------
  // Edit Session
  // ------------------------------
  const startEditing = (session) => {
    setEditingId(session._id);
    setForm({
      title: session.title || "",
      sessionType: session.sessionType || "live",
      status: session.status || "scheduled",
      startTime: toLocalInput(session.startTime),
      endTime: toLocalInput(session.endTime),
      meetingUrl: session.meetingUrl || "",
      meetingPlatform: session.meetingPlatform || "",
      timezone: session.timezone || "Asia/Kolkata",
      agenda: session.agenda || "",
      instructorNotes: session.instructorNotes || "",
      recordingUrl: session.recordingUrl || "",
    });
  };

  // ------------------------------
  // Delete
  // ------------------------------
  const handleDelete = async () => {
    setSaving(true);
    try {
      await instructorLiveSessions.delete(courseId, confirmDelete.sessionId);
      addToast("Session deleted", "success");
      loadData();
    } catch (err) {
      addToast(err.message, "danger");
    } finally {
      setSaving(false);
      setConfirmDelete({ open: false, sessionId: null });
    }
  };

  // ------------------------------
  // UI Rendering
  // ------------------------------
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border"></div>
        <p className="mt-2">Loading live sessions...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Manage Live Sessions</h3>

        <Link
          to={`/instructor/course/${courseId}`}
          className="btn btn-outline-secondary btn-sm"
        >
          ← Back to Course
        </Link>
      </div>

      {isLocked && (
        <div className="alert alert-warning">
          <strong>Course is locked.</strong> You cannot modify sessions while
          the course is under review or published.
        </div>
      )}

      {/* Add/Edit Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">
            {editingId ? "Edit Session" : "Create New Session"}
          </h5>

          {/* Title */}
          <div className="mb-3">
            <label className="form-label">Title *</label>
            <input
              className="form-control"
              name="title"
              value={form.title}
              disabled={isLocked}
              onChange={handleInput}
              placeholder="e.g., Orientation, AMA, Project Q&A"
            />
          </div>

          {/* Session Type + Status */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Session Type</label>
              <select
                className="form-select"
                name="sessionType"
                disabled={isLocked}
                value={form.sessionType}
                onChange={handleInput}
              >
                {SESSION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="status"
                disabled={isLocked}
                value={form.status}
                onChange={handleInput}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Start & End Time */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Start Time *</label>
              <input
                type="datetime-local"
                name="startTime"
                className="form-control"
                disabled={isLocked}
                value={form.startTime}
                onChange={handleInput}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                className="form-control"
                disabled={isLocked}
                value={form.endTime}
                onChange={handleInput}
              />
            </div>
          </div>

          {/* Meeting Info */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Meeting URL</label>
              <input
                className="form-control"
                name="meetingUrl"
                disabled={isLocked}
                value={form.meetingUrl}
                onChange={handleInput}
                placeholder="https://zoom.com/..."
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Platform</label>
              <input
                className="form-control"
                name="meetingPlatform"
                disabled={isLocked}
                value={form.meetingPlatform}
                onChange={handleInput}
                placeholder="Zoom / Meet / Teams"
              />
            </div>
          </div>

          {/* Timezone */}
          <div className="mb-3">
            <label className="form-label">Timezone</label>
            <input
              className="form-control"
              name="timezone"
              disabled={isLocked}
              value={form.timezone}
              onChange={handleInput}
            />
          </div>

          {/* Agenda */}
          <div className="mb-3">
            <label className="form-label">Agenda</label>
            <textarea
              className="form-control"
              rows={3}
              name="agenda"
              disabled={isLocked}
              value={form.agenda}
              onChange={handleInput}
            ></textarea>
          </div>

          {/* Instructor Notes */}
          <div className="mb-3">
            <label className="form-label">Instructor Notes</label>
            <textarea
              className="form-control"
              rows={3}
              name="instructorNotes"
              disabled={isLocked}
              value={form.instructorNotes}
              onChange={handleInput}
            ></textarea>
          </div>

          {/* Recording URL */}
          <div className="mb-3">
            <label className="form-label">Recording URL</label>
            <input
              className="form-control"
              name="recordingUrl"
              disabled={isLocked}
              value={form.recordingUrl}
              onChange={handleInput}
              placeholder="https://..."
            />
          </div>

          {/* Submit Buttons */}
          <button
            className="btn btn-primary"
            disabled={saving || isLocked}
            onClick={handleSave}
          >
            {saving
              ? "Saving..."
              : editingId
              ? "Update Session"
              : "Create Session"}
          </button>

          {editingId && (
            <button
              className="btn btn-outline-secondary ms-2"
              disabled={saving}
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* Sessions List */}
      <h5 className="fw-bold mb-3">Scheduled Sessions</h5>

      {sessions.length === 0 ? (
        <div className="alert alert-info">No live sessions added yet.</div>
      ) : (
        <div className="list-group">
          {sessions.map((s) => (
            <div
              key={s._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{s.title}</strong>
                <div className="text-muted small">
                  {s.startTime
                    ? new Date(s.startTime).toLocaleString()
                    : "No time"}
                </div>
                {s.meetingUrl && (
                  <a
                    href={s.meetingUrl}
                    className="text-primary small"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Join Link
                  </a>
                )}
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  disabled={isLocked}
                  onClick={() => startEditing(s)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-outline-danger"
                  disabled={isLocked}
                  onClick={() =>
                    setConfirmDelete({ open: true, sessionId: s._id })
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={confirmDelete.open}
        title="Delete Live Session"
        description="Are you sure you want to delete this live session? This cannot be undone."
        variant="danger"
        confirmLabel="Delete"
        loading={saving}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete({ open: false, sessionId: null })}
      />
    </div>
  );
};

export default LiveSessionManager;
