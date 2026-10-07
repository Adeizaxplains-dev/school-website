const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "sw_token";

/** Turns a stored upload path like /uploads/passports/x.jpg into a full URL on the API host. */
export function assetUrl(path) {
  if (!path) return "";
  if (/^https?:/i.test(path) || path.startsWith("/images/")) return path;
  return `${BASE_URL.replace(/\/api\/?$/, "")}${path}`;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

/**
 * Thin fetch wrapper: attaches the bearer token, parses JSON, and throws a
 * plain Error with the backend's message so callers can show it directly.
 */
export async function apiFetch(path, { method = "GET", body, headers } = {}) {
  const token = getToken();
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      // For FormData the browser sets the multipart boundary itself.
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. 204)
  }

  if (res.status === 401 && token && !path.startsWith("/auth/login")) {
    // Token expired or account disabled: drop it so the route guard sends the user to sign in.
    setToken(null);
    window.dispatchEvent(new Event("sw:unauthorized"));
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  get: (path) => apiFetch(path),
  post: (path, body) => apiFetch(path, { method: "POST", body }),
  put: (path, body) => apiFetch(path, { method: "PUT", body }),
  delete: (path) => apiFetch(path, { method: "DELETE" }),
};
