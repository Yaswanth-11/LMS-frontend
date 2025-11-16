// src/services/instructorService.js
import api from "./api";

/** Helper to safely unwrap Axios data */
const unwrap = (res) => res?.data || res;

/* ------------------------------------------------------------------ */
/*  COURSES                                                            */
/* ------------------------------------------------------------------ */
export const instructorCourses = {
  /** GET: All courses created by instructor */
  list: async () => {
    const res = await api.get("/api/instructor/courses");
    return unwrap(res);
  },

  /** POST: Create draft course */
  create: async (payload) => {
    const res = await api.post("/api/instructor/courses", payload);
    return unwrap(res);
  },

  /** GET: Course with modules, lessons, live sessions */
  getOne: async (courseId) => {
    const res = await api.get(`/api/instructor/courses/${courseId}`);
    return unwrap(res);
  },

  /** PUT: Update basic info or thumbnail (FormData supported) */
  update: async (courseId, payload) => {
    const isFormData = payload instanceof FormData;

    const res = await api.put(`/api/instructor/courses/${courseId}`, payload, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
    });

    return unwrap(res);
  },

  /** DELETE: Delete draft course */
  delete: async (courseId) => {
    const res = await api.delete(`/api/instructor/courses/${courseId}`);
    return unwrap(res);
  },

  /** POST: Submit course for review */
  submit: async (courseId) => {
    const res = await api.post(`/api/instructor/courses/${courseId}/submit`);
    return unwrap(res);
  },
};

/* ------------------------------------------------------------------ */
/*  MODULES (SECTIONS)                                                 */
/* ------------------------------------------------------------------ */
export const instructorModules = {
  list: async (courseId) => {
    const res = await api.get(`/api/instructor/courses/${courseId}`);
    return unwrap(res).modules || [];
  },

  create: async (courseId, payload) => {
    const res = await api.post(
      `/api/instructor/courses/${courseId}/sections`,
      payload
    );
    return unwrap(res);
  },

  update: async (courseId, moduleId, payload) => {
    const res = await api.put(
      `/api/instructor/courses/${courseId}/sections/${moduleId}`,
      payload
    );
    return unwrap(res);
  },

  delete: async (courseId, moduleId) => {
    const res = await api.delete(
      `/api/instructor/courses/${courseId}/sections/${moduleId}`
    );
    return unwrap(res);
  },

  reorder: async (courseId, orderIds) => {
    const res = await api.post(
      `/api/instructor/courses/${courseId}/sections/reorder`,
      { order: orderIds }
    );
    return unwrap(res);
  },
};

/* ------------------------------------------------------------------ */
/*  LESSONS                                                            */
/* ------------------------------------------------------------------ */
export const instructorLessons = {
  /** Return ONLY lessons for a specific module */
  list: async (courseId, moduleId) => {
    const res = await api.get(`/api/instructor/courses/${courseId}`);
    const course = unwrap(res);
    return course.modules?.find((m) => m._id === moduleId)?.lessons || [];
  },

  create: async (courseId, moduleId, payload) => {
    const res = await api.post(
      `/api/instructor/courses/${courseId}/sections/${moduleId}/lessons`,
      payload
    );
    return unwrap(res);
  },

  update: async (courseId, lessonId, payload) => {
    const res = await api.put(
      `/api/instructor/courses/${courseId}/lessons/${lessonId}`,
      payload
    );
    return unwrap(res);
  },

  delete: async (courseId, lessonId) => {
    const res = await api.delete(
      `/api/instructor/courses/${courseId}/lessons/${lessonId}`
    );
    return unwrap(res);
  },

  reorder: async (courseId, moduleId, orderIds) => {
    const res = await api.post(
      `/api/instructor/courses/${courseId}/sections/${moduleId}/lessons/reorder`,
      { order: orderIds }
    );
    return unwrap(res);
  },
};

/* ------------------------------------------------------------------ */
/*  LIVE SESSIONS                                                      */
/* ------------------------------------------------------------------ */
export const instructorLiveSessions = {
  list: async (courseId) => {
    const res = await api.get(
      `/api/instructor/courses/${courseId}/live-sessions`
    );
    return unwrap(res).liveSessions || [];
  },

  create: async (courseId, payload) => {
    const res = await api.post(
      `/api/instructor/courses/${courseId}/live-sessions`,
      payload
    );
    return unwrap(res);
  },

  update: async (courseId, sessionId, payload) => {
    const res = await api.put(
      `/api/instructor/courses/${courseId}/live-sessions/${sessionId}`,
      payload
    );
    return unwrap(res);
  },

  delete: async (courseId, sessionId) => {
    const res = await api.delete(
      `/api/instructor/courses/${courseId}/live-sessions/${sessionId}`
    );
    return unwrap(res);
  },
};
