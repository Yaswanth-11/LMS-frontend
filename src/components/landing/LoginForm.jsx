// src/components/landing/LoginForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { login, me, resendVerification } from "../../services/authService";
import { useNavigate } from "react-router-dom";

/*
  Props:
    onSuccess(userData) - called after successful login (optional)
*/
const LoginForm = ({ onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [resendStatus, setResendStatus] = useState("");
  const [isResending, setIsResending] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      const res = await login({ email: data.email, password: data.password });
      // assume backend sets httpOnly cookie; if access token returned in body, backend should be reviewed
      // fetch me to get role (best-effort)
      try {
        const meRes = await me();
        const role = meRes.user?.role;
        if (onSuccess) onSuccess(meRes);
        if (role === "admin") navigate("/admin");
        else if (role === "instructor") navigate("/instructor");
        else if (role === "seller") navigate("/seller/products");
        else navigate("/dashboard");
      } catch {
        // fallback
        navigate("/dashboard");
      }
    } catch (err) {
      // detect verification required
      if (
        err?.response?.status === 401 &&
        (err?.response?.data?.msg ===
          "Please verify your email before logging in." ||
          err?.response?.data?.message ===
            "Please verify your email before logging in.")
      ) {
        setServerError("Please verify your email before logging in.");
      } else {
        setServerError(err?.message || "Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (email) => {
    setResendStatus("");
    setIsResending(true);
    try {
      await resendVerification(email);
      setResendStatus("A new verification email has been sent.");
    } catch (err) {
      setResendStatus(err?.message || "Failed to resend verification email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      {serverError && (
        <div className="alert alert-danger text-center">{serverError}</div>
      )}

      <div className="mb-3">
        <label htmlFor="loginEmail" className="form-label">
          Email
        </label>
        <input
          id="loginEmail"
          type="email"
          className="form-control"
          {...register("email", { required: "Email required" })}
        />
        {errors.email && (
          <small className="text-danger">{errors.email.message}</small>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="loginPassword" className="form-label">
          Password
        </label>
        <input
          id="loginPassword"
          type="password"
          className="form-control"
          {...register("password", { required: "Password required" })}
        />
        {errors.password && (
          <small className="text-danger">{errors.password.message}</small>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-gradient w-100 py-2"
        disabled={loading}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </button>

      {serverError === "Please verify your email before logging in." && (
        <>
          <div className="text-center mt-3">
            <button
              type="button"
              className="btn btn-link"
              onClick={() =>
                handleResend(
                  // get email from form value; fallback to empty if not provided
                  document.getElementById("loginEmail")?.value
                )
              }
              disabled={isResending}
            >
              {isResending ? "Resending..." : "Resend verification email"}
            </button>
            {resendStatus && (
              <div className="alert alert-info mt-3">{resendStatus}</div>
            )}
          </div>
        </>
      )}
    </form>
  );
};

export default LoginForm;
