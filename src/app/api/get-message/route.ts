import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from 'next-auth'
import mongoose from "mongoose";
export async function GET(request:Request){
    const session = await getServerSession(authOptions)
    const _user:User= session?.user
    if(!session||!_user){
        return Response.json({
            success:false,
            message:'not authenticated'
        },{status:400})
    }
    const userid =new mongoose.Types.ObjectId(_user._id)
    try {
        const user = await UserModel.aggregate([
            {$match:{_id:userid}},
            {$unwind:'$message'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',message:{$push:'messages'}}}
        ]).exec();
        if(!user||user.length===0){
            return Response.json({
                success:false,
                message:'User not found'
            },{status:400})
        }  return Response.json({
            success:false,
            messages:user[0].messages
        },{status:400})

    } catch (error) {
        console.error('An unexpecting error occured', error);
        return Response.json(
          { success: false, message: 'Internal server error' },
          { status: 500 }
        );
    }
}