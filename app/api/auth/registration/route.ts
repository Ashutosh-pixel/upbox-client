import {NextApiRequest} from "next";
import {connectDB} from "@/lib/database/dbConnect";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import {UUID} from "bson";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import * as process from "node:process";
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

        const token = jwt.sign({userId: result.userId}, process.env.JWT_SECRET!, {
            expiresIn: '7d'
        });


        const response = NextResponse.json({message: "user created",  userId: result.userId}, {status: 201});

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 7*24*60*60,
            path: '/'
        });

        return response;
    }
    catch (error) {
        console.log("signup error", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}