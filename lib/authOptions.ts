import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import {Loginvalues} from "@/types/formvalues";
import axios from "axios";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
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
            }
        })
    ]
}