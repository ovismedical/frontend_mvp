import { authAPI } from "./api.js";

export async function validateToken() {
  try {
    const storedToken = JSON.parse(localStorage.getItem("token"))?.access_token;
    if (!storedToken) return false;

    await authAPI.getUserInfo();
    return true;
  } catch (error) {
    return false;
  }
}

export async function getUserInfo() {
  try {
    const data = await authAPI.getUserInfo();
    return {
      name: data.full_name,
      dob: data.birthdate,
      sex: data.gender,
      username: data.username,
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}
