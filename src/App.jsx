// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleBasedRoute from "./routes/RoleBasedRoute";

// Global Toast Container
import ToastsContainer from "./components/common/Toasts.jsx";

// Landing
import LandingPage from "./components/landing/LandingPage.jsx";

// Instructor screens
import InstructorDashboard from "./components/instructor/InstructorDashboard.jsx";
import InstructorAddCourse from "./components/instructor/InstructorAddCourse.jsx";
import CourseEditor from "./components/instructor/CourseEditor.jsx";
import ModuleManager from "./components/instructor/ModuleManager.jsx";
import LessonManager from "./components/instructor/LessonManager.jsx";
import LiveSessionManager from "./components/instructor/LiveSessionManager.jsx";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Global Toasts */}
        <ToastsContainer />

        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />

          {/* Instructor Dashboard */}
          <Route
            path="/instructor"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["instructor", "admin"]}>
                  <InstructorDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/add-course"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["instructor", "admin"]}>
                  <InstructorAddCourse />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/course/:courseId"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["instructor", "admin"]}>
                  <CourseEditor />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/course/:courseId/modules"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["instructor", "admin"]}>
                  <ModuleManager />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/course/:courseId/modules/:moduleId/lessons"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["instructor", "admin"]}>
                  <LessonManager />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/course/:courseId/live-sessions"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["instructor", "admin"]}>
                  <LiveSessionManager />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
