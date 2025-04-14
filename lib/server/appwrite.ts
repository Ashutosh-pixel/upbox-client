"use server"
import { Account, Client, Databases } from "node-appwrite";
import { cookies } from "next/headers"

export async function createSessionClient() {
    const client = new Client()
    .setEndpoint(process.env.Appwrite_Base_URL as string)
    .setProject(process.env.Appwrite_Project_ID as string)

    const session = (await cookies()).get("my-custom-session");

    if(!session || !session.value){
        throw new Error("No session");
    }

    client.setSession(session.value);

    return {
        get account() {
            return new Account(client);
        }
    }

}

export async function createAdminClient() {
    const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!)

    return {
        get account() {
            return new Account(client);
        },
        get database(){
            return new Databases(client);
        }
    }
}
