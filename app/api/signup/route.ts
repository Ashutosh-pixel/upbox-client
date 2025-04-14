import { createMagicToken, getUserByEmail } from "@/functions/signup";
import { createAdminClient } from "@/lib/server/appwrite";
import { NextRequest } from "next/server";
import { Account, Databases, ID, Query } from "node-appwrite";


export async function POST(req:NextRequest, res: NextRequest){
    try {
        const {firstname, lastname, email, contact, password, confirmpassword} = await req.json();
        const {account, database} = await createAdminClient();
        console.log(req.body);

        if(!firstname || !lastname || !email || !contact || !password || !confirmpassword){
            return new Response(JSON.stringify({message: "Kindly fill all details", type: false}), {
                status: 404
            });
        }

        const existingUser = await getUserByEmail(email);
        if(existingUser){
            return new Response(JSON.stringify({message: "User already exists", type: false}), {
                status: 404
            });
        }
        
        const userId = await createMagicToken(email);
        console.log("userId", userId);
        if(!userId){
            return new Response(JSON.stringify({message: "Failed to send Link", type: false}), {
                status: 404
            });
        }

        await database.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION!,
            ID.unique(),
            {
                firstname,
                lastname,
                email,
                contact,
                password,
                confirmpassword
            }
        )
        
        return new Response(JSON.stringify({message: "Account created successfully", type: true, data: userId}), {
            status: 200
        });

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({error}), {status: 404});
    }
} 
