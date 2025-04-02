import { createAdminClient } from "@/lib/server/appwrite";
import { NextRequest } from "next/server";
import { Account, Databases, ID, Query } from "node-appwrite";

// checking user exist or not
const getUserByEmail = async(email: string) => {
    const {database} = await createAdminClient();
    const result = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION!,
        [Query.equal("email", [email])]
    );

    return result.total > 0 ? result.documents[0] : null;
}


// send OTP for verification
const sendEmailOTP = async(email: string) => {
    try {
        const {account} = await createAdminClient();
        const session = await account.createEmailToken(ID.unique(), email);
        return session.userId;
    } catch (error) {
        throw error;
    }
}

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
        
        const accountId = await sendEmailOTP(email);
        if(!accountId){
            return new Response(JSON.stringify({message: "Failed to send an OTP", type: false}), {
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
        
        return new Response(JSON.stringify({message: "Account created successfully", type: true}), {
            status: 200
        });

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({error}), {status: 404});
    }
} 
