"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { handleSignup } from "@/functions/signup/signup";

const Signup = () => {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");

    const router = useRouter();

    const { login, loading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace('/drive/image');
            return;
        }
    }, [loading, isAuthenticated])


    return (
        <form action="POST" onSubmit={async (e) => {
            e.preventDefault();

            const output = await handleSignup(email, password, name);

            if (output) {
                login(output);
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
                type="text"
                id="name"
                required
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}>
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

export default Signup;