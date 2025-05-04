import {NextRequest, NextResponse} from "next/server";
import mongoose from "mongoose";
import {connectDB} from "@/lib/database/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

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
        // console.log('existing', existingUser)

        if(existingUser){
            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
            console.log('isPasswordCorrect', isPasswordCorrect)
            if(isPasswordCorrect){
                return NextResponse.json({message: "Password match!", user: {id: existingUser._id, email: existingUser.email, name: existingUser.name}}, {status: 200});
            }
            else{
                return NextResponse.json({message: "Password do not match"}, {status: 401});
            }
        }

        return NextResponse.json({message: "Account not found"}, {status: 401});
    }
    catch(error){
        console.log("login error", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}