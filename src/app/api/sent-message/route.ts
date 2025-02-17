import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {Message} from "@/model/User";
export async function POST(request:Request){
await dbConnect()
const {username,content}=await request.json()
try {
    const user =await UserModel.findOne({username})
    if(!user){
        return Response.json({success:false,
            message:'user not found'
           },{status:404})
    }
    // checking if user is Accepting message
    if(!user.isAcceptingMessage){
        return Response.json({success:false,
            message:'user not accepting message'
           },{status:200})
    }
    const newMessage ={content,createdAt:new Date()}
    //push message to the user message array
    user.messages.push(newMessage as Message)
    await user.save()
    return Response.json({success:true,
        message:'message sent successfully'
       },{status:201})
} catch (error) {
    console.error('Error adding message :', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
}
}

