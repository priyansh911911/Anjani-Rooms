const BASE = import.meta.env.VITE_API_URL || "/api";

const headers = (withAuth = false) => {
  const h = { "Content-Type": "application/json" };
  if (withAuth) {
    const token = localStorage.getItem("anjani_token");
    if (token) h["Authorization"] = `Bearer ${token}`;
  }
  return h;
};

const api = {
  // Auth
  login: (email, password) =>
    fetch(`${BASE}/auth/login`, { method: "POST", headers: headers(), body: JSON.stringify({ email, password }) }).then((r) => r.json()),

  logout: () =>
    fetch(`${BASE}/auth/logout`, { method: "POST", headers: headers(true) }).then((r) => r.json()),

  getMe: () =>
    fetch(`${BASE}/auth/me`, { headers: headers(true) }).then((r) => r.json()),

  changePassword: (currentPassword, newPassword) =>
    fetch(`${BASE}/auth/change-password`, { method: "POST", headers: headers(true), body: JSON.stringify({ currentPassword, newPassword }) }).then((r) => r.json()),

  // Rooms
  getRooms: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${BASE}/rooms${q ? "?" + q : ""}`, { headers: headers() }).then((r) => r.json());
  },

  getRoom: (id) =>
    fetch(`${BASE}/rooms/${id}`, { headers: headers() }).then((r) => r.json()),

  createRoom: (data) =>
    fetch(`${BASE}/rooms`, { method: "POST", headers: headers(true), body: JSON.stringify(data) }).then((r) => r.json()),

  updateRoom: (id, data) =>
    fetch(`${BASE}/rooms/${id}`, { method: "PUT", headers: headers(true), body: JSON.stringify(data) }).then((r) => r.json()),

  deleteRoom: (id) =>
    fetch(`${BASE}/rooms/${id}`, { method: "DELETE", headers: headers(true) }).then((r) => r.json()),

  uploadImages: (id, files) => {
    const form = new FormData();
    files.forEach((f) => form.append("images", f));
    return fetch(`${BASE}/rooms/${id}/images`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("anjani_token")}` },
      body: form,
    }).then((r) => r.json());
  },

  deleteImage: (id, imageUrl) =>
    fetch(`${BASE}/rooms/${id}/images`, { method: "DELETE", headers: headers(true), body: JSON.stringify({ imageUrl }) }).then((r) => r.json()),

  getMetaOptions: () =>
    fetch(`${BASE}/rooms/meta/options`, { headers: headers() }).then((r) => r.json()),

  // Categories
  getCategories: (all = false) =>
    fetch(`${BASE}/categories${all ? "?all=true" : ""}`, { headers: headers() }).then((r) => r.json()),

  createCategory: (name) =>
    fetch(`${BASE}/categories`, { method: "POST", headers: headers(true), body: JSON.stringify({ name }) }).then((r) => r.json()),

  updateCategory: (id, data) =>
    fetch(`${BASE}/categories/${id}`, { method: "PUT", headers: headers(true), body: JSON.stringify(data) }).then((r) => r.json()),

  deleteCategory: (id) =>
    fetch(`${BASE}/categories/${id}`, { method: "DELETE", headers: headers(true) }).then((r) => r.json()),

  // Gallery
  getGallery: () =>
    fetch(`${BASE}/gallery`, { headers: headers() }).then((r) => r.json()),

  uploadGalleryImages: (files) => {
    const form = new FormData();
    files.forEach((f) => form.append("images", f));
    return fetch(`${BASE}/gallery`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("anjani_token")}` },
      body: form,
    }).then((r) => r.json());
  },

  deleteGalleryImage: (imageUrl) =>
    fetch(`${BASE}/gallery`, { method: "DELETE", headers: headers(true), body: JSON.stringify({ imageUrl }) }).then((r) => r.json()),

  // Profile Image
  getProfileImage: () =>
    fetch(`${BASE}/profile-image`, { headers: headers() }).then((r) => r.json()),

  uploadProfileImage: (file) => {
    const form = new FormData();
    form.append("image", file);
    return fetch(`${BASE}/profile-image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("anjani_token")}` },
      body: form,
    }).then((r) => r.json());
  },
};

export default api;
