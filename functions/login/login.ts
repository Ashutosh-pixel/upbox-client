import { setAccessToken } from "@/lib/token"
import { api } from "../../lib/api"

export async function handleLogin(email: string, password: string) {
    try {
        const output = await api.post("/auth/login", {
            email,
            password
        })

        setAccessToken(output.data.accessToken);

        if (output.data.accessToken) {
            console.log("true");
            return output.data.accessToken;
        }

    } catch (error) {
        console.log("error in login", error)
        return "";
    }
}