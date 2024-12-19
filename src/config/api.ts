export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const ENDPOINTS = {
  AUTH: {
    SIGNUP: `/api/auth/signup`,
    LOGIN: `/api/auth/login`,
  },
  MEDIA: {
    GETALL: `/api/media/all`,
  },
};
