export async function validateToken() {
  try {
    const storedToken = JSON.parse(localStorage.getItem('token')).access_token;
    if (!storedToken) return false;
    const apiUrl = import.meta.env.VITE_API_URL || 'https://ovis-backend-mvp.onrender.com'
    const response = await fetch('${apiUrl}/userinfo', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${storedToken}`
      }
    });

    if (response.ok) {
      return true; 
    } else {
      return false; 
    }
  } catch (error) {
    return false;
  }
}
