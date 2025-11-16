import React, { useState } from "react";
import { addToast } from "../common/Toasts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
  });

  const handleInput = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      college: "",
    });
  };

  const validate = () => {
    if (activeTab === "register") {
      if (!form.name.trim()) return addToast("Name is required", "warning");
      if (!form.email.trim()) return addToast("Email is required", "warning");
      if (!form.password.trim())
        return addToast("Password required", "warning");
      if (form.password !== form.confirmPassword)
        return addToast("Passwords do not match", "warning");
    } else {
      if (!form.email.trim() || !form.password.trim())
        return addToast("Email & password required", "warning");
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const endpoint =
        activeTab === "login"
          ? `${API_URL}/api/auth/login`
          : `${API_URL}/api/auth/register`;

      const payload =
        activeTab === "login"
          ? { email: form.email, password: form.password }
          : {
              name: form.name,
              email: form.email,
              password: form.password,
              confirmPassword: form.confirmPassword,
              college: form.college,
              role: "student",
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      addToast(
        activeTab === "login"
          ? "Login successful!"
          : "Registration successful! Check your email.",
        "success"
      );

      window.location.href = "/dashboard";
    } catch (err) {
      addToast(err.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3">
        <div className="container">
          <span className="navbar-brand fw-bold">⚡ Teckspark Daily</span>

          <button
            className="btn btn-outline-light me-2"
            onClick={() => {
              setShowAuth(true);
              switchTab("login");
            }}
          >
            Login
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowAuth(true);
              switchTab("register");
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="bg-dark text-light py-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">
            Build Your <span className="text-primary">Tech Future</span>
          </h1>
          <p className="lead mt-3 mx-auto" style={{ maxWidth: "700px" }}>
            Daily coding challenges, tech stories, and college leaderboards —
            designed to elevate your skills and career.
          </p>

          <div className="mt-4">
            <button
              className="btn btn-primary btn-lg me-3"
              onClick={() => {
                setShowAuth(true);
                switchTab("register");
              }}
            >
              Join Now
            </button>
            <button className="btn btn-outline-light btn-lg">
              Watch Demo →
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-4">Why Teckspark Daily?</h2>

        <div className="row g-4 text-center">
          <div className="col-md-3">
            <div className="card shadow-sm p-3">
              <h5 className="fw-bold">Daily Challenges</h5>
              <p>Level up with real-world coding problems.</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm p-3">
              <h5 className="fw-bold">Tech Stories</h5>
              <p>Stay inspired with curated tech knowledge.</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm p-3">
              <h5 className="fw-bold">Leaderboards</h5>
              <p>Compete and showcase your college ranking.</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm p-3">
              <h5 className="fw-bold">Community</h5>
              <p>Connect with students and tech mentors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AUTH MODAL */}
      {showAuth && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAuth(false);
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {activeTab === "login" ? "Login" : "Create Account"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowAuth(false)}
                ></button>
              </div>

              <div className="modal-body">
                {/* Tabs */}
                <div className="btn-group w-100 mb-3">
                  <button
                    className={`btn ${
                      activeTab === "login"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => switchTab("login")}
                  >
                    Login
                  </button>
                  <button
                    className={`btn ${
                      activeTab === "register"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => switchTab("register")}
                  >
                    Register
                  </button>
                </div>

                {/* FORM FIELDS */}
                {activeTab === "register" && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        className="form-control"
                        name="name"
                        onChange={handleInput}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">College</label>
                      <input
                        className="form-control"
                        name="college"
                        onChange={handleInput}
                      />
                    </div>
                  </>
                )}

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-control"
                    name="email"
                    type="email"
                    onChange={handleInput}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    className="form-control"
                    name="password"
                    type="password"
                    onChange={handleInput}
                  />
                </div>

                {activeTab === "register" && (
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                      className="form-control"
                      name="confirmPassword"
                      type="password"
                      onChange={handleInput}
                    />
                  </div>
                )}

                <button
                  className="btn btn-primary w-100"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </span>
                  ) : activeTab === "login" ? (
                    "Login"
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingPage;
