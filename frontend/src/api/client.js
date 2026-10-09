
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "sw_token";

/**
 * Turns a stored upload path into a full URL on the API host.
 */
export function assetUrl(path) {
  if (!path) return "";
  if (/^https?:/i.test(path) || path.startsWith("/images/")) {
    return path;
  }
  return `${BASE_URL.replace(/\/api\/?$/, "")}${path}`;
}

/**
 * Use sessionStorage to isolate authentication tokens by browser tab.
 * The token survives page refreshes in the same tab.
 */
export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Sends API requests with the current tab's authentication token.
 */
export async function apiFetch(
  path,
  { method = "GET", body, headers } = {}
) {
  const token = getToken();
  const isForm =
    typeof FormData !== "undefined" && body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body:
      body !== undefined && body !== null
        ? isForm
          ? body
          : JSON.stringify(body)
        : undefined,
  });

  let data = null;

  try {
    data = await res.json();
  } catch {
    // Some responses, such as HTTP 204, have no JSON body.
  }

  if (res.status === 401 && token && !path.startsWith("/auth/login")) {
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