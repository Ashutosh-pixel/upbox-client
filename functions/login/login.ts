import { setAccessToken } from "@/lib/token"
import { api } from "../../lib/api"

export async function handleLogin(email: string, password: string) {
    try {
        const output = await api.post("/auth/login", {
            email,
            password
        })

        setAccessToken(output.data.accessToken);

        if (output && output.data.accessToken) {
            console.log("true");
            return { accessToken: output.data.accessToken, name: output.data.name, email: output.data.email };
        }

    } catch (error) {
        console.log("error in login", error)
        return "";
    }
}