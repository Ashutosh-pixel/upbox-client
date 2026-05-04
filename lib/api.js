import axios from "axios";
import { clearAccessToken, getAccessToken, setAccessToken } from "./token";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true
})

api.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})

api.interceptors.response.use((res) => res, async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry && !original.url.includes("/auth/refresh")) {
        original._retry = true;

        try {
            const res = await api.post("/auth/refresh");
            setAccessToken(res.data.accessToken);
            original.headers.Authorization = "Bearer " + res.data.accessToken

            return api(original);

        } catch {
            // refresh failed - logout
            clearAccessToken();
            window.location.href = "/login";
        }

    }
    return Promise.reject(err);
}
);

