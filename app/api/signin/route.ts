import { createAdminClient } from "@/lib/server/appwrite";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse){
    try {
        const {userId, secret} = await req.json();

        if(!userId || !secret){
            return new Response(JSON.stringify({message: "Failed to verify user"}), {status: 404});
        }

        const {account} = await createAdminClient();

        const session = await account.createSession(userId, secret);

        const response = new Response(JSON.stringify({message: "Success", sessionId: session.$id}), {status: 200});

        (await cookies()).set("my-custom-session", session.secret, {
            httpOnly: true,
            sameSite: "none",
            secure: false,
            path: '/'
        })

        return response;
    
    } catch (error) {
        console.log("error is", error);
        return new Response(JSON.stringify({error}), {status: 404});
    }
}