import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { instructorCourses } from "../../services/instructorService";
import StatusStepper from "../common/StatusStepper";
import { addToast } from "../common/Toasts";

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCourses = async () => {
    try {
      const res = await instructorCourses.list();
      setCourses(res || []);
    } catch (err) {
      addToast(err.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border"></div>
        <p className="mt-3">Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Instructor Dashboard</h2>
        <Link to="/instructor/add-course" className="btn btn-primary">
          + Create New Course
        </Link>
      </div>

      {/* Courses List */}
      {courses.length === 0 ? (
        <div className="alert alert-info text-center py-4">
          <h5>No courses found.</h5>
          <p>Create your first course to get started!</p>
          <Link className="btn btn-primary" to="/instructor/add-course">
            Create Course
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((course) => (
            <div key={course._id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="fw-bold">{course.title}</h5>
                  <p className="text-muted small">
                    {course.subtitle || "No subtitle"}
                  </p>

                  <span
                    className={`badge ${
                      course.status === "published"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    Status: {course.status.replace("_", " ")}
                  </span>

                  <hr />

                  {/* Status Stepper */}
                  <StatusStepper status={course.status} />

                  <hr />

                  {/* Actions */}
                  <div className="d-grid gap-2">
                    <Link
                      to={`/instructor/course/${course._id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Edit Course
                    </Link>

                    <Link
                      to={`/instructor/course/${course._id}/modules`}
                      className="btn btn-outline-secondary btn-sm"
                    >
                      Manage Modules
                    </Link>

                    <Link
                      to={`/instructor/course/${course._id}/live-sessions`}
                      className="btn btn-outline-dark btn-sm"
                    >
                      Live Sessions
                    </Link>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() =>
                        addToast("Delete course feature coming soon", "warning")
                      }
                    >
                      Delete (Disabled)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
