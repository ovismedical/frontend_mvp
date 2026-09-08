import { authAPI } from "./api.js";

export async function validateToken() {
  try {
    const storedToken = JSON.parse(localStorage.getItem("token"))?.access_token;
    if (!storedToken) return false;

    await authAPI.getUserInfo();
    return true;
  } catch {
    return false;
  }
}

/** Normalise the backend user document into what the UI needs, including the role. */
export function normalizeUser(data) {
  if (!data) return null;
  const isDoctor = Boolean(data.isDoctor);
  return {
    ...data,
    username: data.username,
    name: data.full_name || data.username,
    dob: data.dob || data.birthdate || null,
    sex: data.sex || data.gender || null,
    isDoctor,
    role: isDoctor ? "doctor" : "patient",
  };
}

export const homeFor = (user) => (user?.isDoctor ? "/doctor_home" : "/home");

export async function getUserInfo() {
  try {
    const data = await authAPI.getUserInfo();
    return normalizeUser(data);
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}
