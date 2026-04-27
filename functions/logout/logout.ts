import { api } from "@/lib/api";
import { clearAccessToken } from "@/lib/token";

export async function logout() {
    await api.post("/auth/logout");

    clearAccessToken();

    window.location.href = "/login";
}