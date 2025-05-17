import axios from "axios";

export const instance = axios.create({
    baseURL: "https://buildfolio-backend-ts.onrender.com",
    withCredentials: true
});

instance.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error)=>Promise.reject(error)
)

// error handling response
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("authToken");
        }
        return Promise.reject(error);
    }
)