import { api } from "@/lib/api";
import { setAccessToken } from "@/lib/token";

export async function handleSignup(email: string, password: string, name: string) {
    try {
        const output = await api.post("/auth/signup", {
            email,
            password,
            name
        })

        setAccessToken(output.data.accessToken);

        if (output && output.data.accessToken) {
            console.log("true");
            return { accessToken: output.data.accessToken, name: output.data.user.name, email: output.data.user.email, totalStorage: output.data.user.totalStorage, usedStorage: output.data.user.usedStorage };
        }
    } catch (error) {
        console.log("error in signup", error)
        return "";
    }
}