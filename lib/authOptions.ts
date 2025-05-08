import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import {Loginvalues} from "@/types/formvalues";
import axios from "axios";
import * as process from "node:process";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const formValues: Loginvalues = {
                    email: credentials?.email || "",
                    password: credentials?.password || ""
                }

                try {
                    const response = await axios.post('http://localhost:3000/api/auth/login', formValues)

                    if(response.data && response.data.user){
                        return {
                            id: response.data.user.id,
                            email: response.data.user.email,
                            name: response.data.user.name
                        };
                    }

                    return null;
                }
                catch (error){
                    console.log('Authorize error:', error);
                    return null;
                }
            },

        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
    ],
    callbacks: {
        async signIn({user, profile, account}){
            console.log("user, profile", user, profile, account);
            try {
                const response = await axios.post('http://localhost:3000/api/googleauth/registration', user);

                if(!response.data){
                    return false;
                }

                return true;
            }
            catch (error){
                console.log('Authorize error:', error);
                return false;
            }
        },
        async redirect({ baseUrl }){
            console.log("baseUrl", baseUrl)
            return `${baseUrl}`
        },
    },
    secret: process.env.NEXTAUTH_SECRET
}