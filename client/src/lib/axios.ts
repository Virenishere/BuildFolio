import axios from "axios";

export const instance = axios.create({
  baseURL: "https://buildfolio-backend-ts.onrender.com",
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function drainQueue(token: string | null, error: unknown) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingQueue = [];
}

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Only attempt refresh on 401 and only once per request
    if (
      error.response?.status !== 401 ||
      original._retried ||
      // Don't retry auth endpoints themselves
      original.url?.includes("/api/auth/")
    ) {
      return Promise.reject(error);
    }

    original._retried = true;

    if (isRefreshing) {
      // Queue subsequent 401s while a refresh is already in flight
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(instance(original));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const res = await instance.post("/api/auth/refresh-token");
      const newToken: string = res.data.accessToken;
      localStorage.setItem("token", newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      drainQueue(newToken, null);
      return instance(original);
    } catch (refreshError) {
      drainQueue(null, refreshError);
      // Refresh failed — clear session and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);