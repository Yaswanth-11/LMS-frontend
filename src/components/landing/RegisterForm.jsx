// src/components/landing/RegisterForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { register as registerUser } from "../../services/authService";

const RegisterForm = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    setServerMsg(null);
    setLoading(true);
    try {
      // remove confirmPassword when sending
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        college: data.college,
        role: data.role || "student",
      };
      const res = await registerUser(payload);
      setSuccess(true);
      setServerMsg(
        "Registration successful! A verification link has been sent to your email. Please check your inbox to activate your account."
      );
      if (onSuccess) onSuccess(res);
    } catch (err) {
      setSuccess(false);
      setServerMsg(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const pw = watch("password", "");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {serverMsg && (
        <div
          className={`alert mt-2 ${
            success ? "alert-success" : "alert-danger"
          } text-center`}
        >
          {serverMsg}
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Full name</label>
        <input
          className="form-control"
          {...register("name", { required: "Full name required" })}
        />
        {errors.name && (
          <small className="text-danger">{errors.name.message}</small>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">College / University</label>
        <select className="form-select" {...register("college")}>
          <option value="">Select your college</option>
          <option value="MIT">MIT</option>
          <option value="Stanford">Stanford University</option>
          <option value="CMU">Carnegie Mellon</option>
          <option value="Berkeley">UC Berkeley</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          {...register("email", { required: "Email required" })}
        />
        {errors.email && (
          <small className="text-danger">{errors.email.message}</small>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          {...register("password", {
            required: "Password required",
            minLength: { value: 8, message: "Minimum 8 characters" },
          })}
        />
        {errors.password && (
          <small className="text-danger">{errors.password.message}</small>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Confirm password</label>
        <input
          type="password"
          className="form-control"
          {...register("confirmPassword", {
            required: "Confirm password",
            validate: (v) => v === pw || "Passwords must match",
          })}
        />
        {errors.confirmPassword && (
          <small className="text-danger">
            {errors.confirmPassword.message}
          </small>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Role</label>
        <select className="form-select" {...register("role")}>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="seller">Seller</option>
        </select>
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
            ></span>
            Creating...
          </>
        ) : (
          "Create account"
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
