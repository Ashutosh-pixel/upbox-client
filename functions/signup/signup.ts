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

        if (output.data.accessToken) {
            console.log("true");
            return output.data.accessToken;
        }

    } catch (error) {
        console.log("error in signup", error)
        return "";
    }
}