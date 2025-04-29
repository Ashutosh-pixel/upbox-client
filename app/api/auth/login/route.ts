import {NextRequest, NextResponse} from "next/server";
import mongoose from "mongoose";
import {connectDB} from "@/lib/database/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as process from "node:process";

export const POST = async (req: NextRequest) => {
    try {
        const {email, password} = await req.json();
        const filter = {
            email: email.trim(),
        }

        if(mongoose.connection.readyState === 0){
            await connectDB();
        }

        const existingUser = await User.findOne(filter);


        if(existingUser){
            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
            if(isPasswordCorrect){
                const response = NextResponse.json({message: "Password match!", userId: existingUser.userId}, {status: 200});
                const token = jwt.sign({userId: existingUser.userId}, process.env.JWT_SECRET!, {
                    expiresIn: '7d'
                });

                response.cookies.set('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: 'strict',
                    maxAge: 7*24*60*60,
                    path: '/'
                })

                return response;
            }
            else{
                return NextResponse.json({message: "Password do not match", userId: null}, {status: 200});
            }
        }

        return NextResponse.json({message: "Account not found", userId: null}, {status: 200});
    }
    catch(error){
        console.log("login error", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}