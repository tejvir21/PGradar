import axios from "axios";

export function getToken() {
  return localStorage.getItem("jwt") || "";
}
export function saveToken(token) {
  localStorage.setItem("jwt", token);
}
export function clearToken() {
  localStorage.removeItem("jwt");
}
export async function apiFetch(path, options = {}, token = null) {
  if (!token) token = getToken();

  try {
    const response = await axios({
      url: `${process.env.REACT_APP_API_BASE_URL}${path}`,
      method: options.method || 'GET',
      data: options.body ? JSON.parse(options.body) : undefined, // axios expects JS object in 'data'
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      params: options.params, // Optional URL params if you want to support this
    });
    return response.data;
  } catch (error) {
    // Axios errors: error.response.data has the server error response.
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'API error');
    } else {
      throw new Error(error.message || 'Network error');
    }
  }
}
