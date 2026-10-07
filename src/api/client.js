import { getApiBaseUrl } from "./config";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const buildUrl = (path) => `${getApiBaseUrl()}/${path.replace(/^\/+/, "")}`;

const getErrorMessage = async (response, profileUpdate) => {
  try {
    const data = await response.json();
    if (profileUpdate && response.status === 422 && Array.isArray(data.errors) &&
      data.errors.some((error) => error.path === "Password" && error.msg === "Password is required")) {
      return "Password is required";
    }
    return data.message || data.error || "The request could not be completed.";
  } catch {
    return "The request could not be completed.";
  }
};

export const request = async (path, options = {}) => {
  const { token, body, headers, profileUpdate = false, ...fetchOptions } = options;
  const response = await fetch(buildUrl(path), {
    ...fetchOptions,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    throw new ApiError(await getErrorMessage(response, profileUpdate), response.status);
  }

  if (response.status === 204) {
    return undefined;
  }

  const contentLength = response.headers?.get?.("content-length");
  if (contentLength === "0") {
    return undefined;
  }

  try {
    return await response.json();
  } catch {
    return undefined;
  }
};

const encode = encodeURIComponent;

export const api = {
  login: (credentials) => request("login", { method: "POST", body: credentials }),
  signup: (user) => request("users", { method: "POST", body: user }),
  getMovies: (token, signal) => request("movies", { token, signal }),
  updateUser: (username, updates, token) =>
    request(`users/${encode(username)}`, { method: "PUT", body: updates, token, profileUpdate: true }),
  deleteUser: (username, token) =>
    request(`users/${encode(username)}`, { method: "DELETE", token }),
  addFavorite: (username, movieId, token) =>
    request(`users/${encode(username)}/movies/${encode(movieId)}`, {
      method: "POST",
      token,
    }),
  removeFavorite: (username, movieId, token) =>
    request(`users/${encode(username)}/movies/${encode(movieId)}`, {
      method: "DELETE",
      token,
    }),
};
