export async function validateToken() {
  try {
    const storedToken = JSON.parse(localStorage.getItem("token"))?.access_token;
    if (!storedToken) return false;

    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/userinfo`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function getUserInfo() {
  try {
    const storedToken = JSON.parse(localStorage.getItem("token"))?.access_token;
    if (!storedToken) return null;

    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/userinfo`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return {
      name: data.full_name,
      dob: data.dob,
      sex: data.sex,
      username: data.username,
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}
