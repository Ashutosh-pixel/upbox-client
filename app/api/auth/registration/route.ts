import {NextApiRequest} from "next";
import {connectDB} from "@/lib/database/dbConnect";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import {UUID} from "bson";
import User from "@/models/User";
import {NextResponse} from "next/server";

export const POST = async (req: NextApiRequest) => {
    try {
        const {name, email, password} = await req.json();

        console.log(name, email, password)

        if(mongoose.connection.readyState === 0){
            await connectDB();
        }

        const filter = {
            email: email
        }

        const existingUser = await User.find(filter)

        console.log("existingUser", existingUser);

        if(existingUser.length !== 0){
            return NextResponse.json({message: "A user with this email already exists."}, {status: 400});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await User.create({
            userId: new UUID().toString(),
            name: name,
            email,
            password: hashedPassword
        })


        return NextResponse.json({message: "user created",  userId: result.userId}, {status: 201});
    }
    catch (error) {
        console.log("signup error", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}