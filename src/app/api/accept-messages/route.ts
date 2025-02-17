import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from 'next-auth'
export async function POST(request:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user:User=session?.user
    if(!session||!session.user){
        return Response.json({
            success:false,
            message:'not authenticated'
        },{status:400})
    }
    const UserId= user._id
    const { acceptMessage}= await request.json();
    try {
        const updatedUser =await UserModel.findByIdAndUpdate(
            UserId,
            {isAcceptingMessage: acceptMessage},
            {new:true}
        )
        if(!updatedUser){
            return Response.json({
                success:false,
                message:'unable to find user to update message'
            },{status:400})
        }
        return Response.json({
            success:true,
            message:'Message acceptance status updated successfully'
        },{status:200})
    } catch (error) {
        console.error('Error updating message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error updating message acceptance status' },
      { status: 500 }
    );
    }
    }
    export async function GET(request:Request){
        const session = await getServerSession(authOptions)
        const user =session?.user
        if(!session||!user){
            return Response.json({
                success:false,
                message:'not authenticated'
            },{status:400})
        }
        try {
            const foundUser= await UserModel.findById(user._id)
            if(!foundUser){
                return Response.json({
                    success:false,
                    message:'user not found while '
                },{status:400})
            }
            return Response.json({
                success:true,
             isAcceptingMessage:foundUser.isAcceptingMessage,
            },{status:200})

        } catch (error) {
          
                console.error('Error retrieving message acceptance status:', error);
                return Response.json(
                  { success: false, message: 'Error retrieving message acceptance status' },
                  { status: 500 }
                );
        }
    }

