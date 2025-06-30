import {NextApiRequest} from "next";
import mongoose from "mongoose";
import {connectDB} from "@/lib/database/dbConnect";
import User from "@/models/User";
import {NextResponse} from "next/server";
import {UUID} from "bson";


export const POST = async (req: NextApiRequest) => {
    try {
        const {email, name} = await req.json();
        if(mongoose.connection.readyState === 0){
            await connectDB();
        }

        const filter = {
            email: email
        }

        const existingUser = await User.find(filter);

        if(existingUser.length !== 0){
            return NextResponse.json({message: "user created"}, {status: 201});
        }

        await User.create({
            userId: new UUID().toString(),
            name: name,
            email: email,
            password: new UUID().toString()
        })

        return NextResponse.json({message: "user created"}, {status: 201});
    }
    catch (error){
        console.log("login error", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}