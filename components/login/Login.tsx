"use client"

import { handleLogin } from "@/functions/login/login";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/redux/slice/userSlice";

export const Login = () => {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const router = useRouter();
    const dispatch = useDispatch();

    const { login, loading, isAuthenticated } = useAuth();


    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace('/drive/');
            return;
        }

    }, [loading, isAuthenticated])


    return (
        <form action="POST" onSubmit={async (e) => {
            e.preventDefault();

            const output = await handleLogin(email, password);

            if (output && output.accessToken) {
                login(output.accessToken);
                dispatch(setUser({ email: output.email, name: output.name }))
                router.push("/drive/");
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