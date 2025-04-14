import { createAdminClient } from "@/lib/server/appwrite";
import { ID, Query } from "node-appwrite";

// checking user exist or not
export const getUserByEmail = async(email: string) => {
    const {database} = await createAdminClient();
    const result = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION!,
        [Query.equal("email", [email])]
    );

    return result.total > 0 ? result.documents[0] : null;
}


export const createMagicToken = async (email: string) => {
    const {account} = await createAdminClient();
    const token = await account.createMagicURLToken(ID.unique(), email, 'http://localhost:3000/redirect');
    return token.userId;
}