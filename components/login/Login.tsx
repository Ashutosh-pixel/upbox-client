"use client"

import { handleLogin } from "@/functions/login/login";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Login = () => {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const router = useRouter();


    return (
        <form action="POST" onSubmit={async (e) => {
            e.preventDefault();

            const output = await handleLogin(email, password);

            if (output) {
                router.push("/drive/image");
            }

        }}>
            <input
                type="email"
                id="email"
                required
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}>
            </input>

            <input
                type="password"
                id="password"
                required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}>
            </input>

            <button type="submit">Submit</button>
        </form>
    )
}

export default Login