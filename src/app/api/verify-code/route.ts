import UserModel from "@/model/User";

import dbConnect from "@/lib/dbConnect";
export async function POST(request:Request){
    await dbConnect();
try {
    const {username,code}= await request.json()
    const user =await UserModel.findOne({username})
    if(!user){
        return Response.json({success:false,
            message:' username is wrong'
           },{status:400})
    }
    const isCodeVerified = code===user.verifyCode
    const isCodeExpired = new Date(user.verifyCodeExpiry)>new Date();
    if(isCodeExpired&&isCodeVerified){
        user.isverified=true
        await user.save()
        return Response.json({success:true,
            message:'Account verifieed successfully'
           },{status:200})
    }
    else if(!isCodeExpired){
        //cpde has expired
        return Response.json({success:false,
            message:'Code has expired'
           },{status:400})
    }
    else{
        //code is incorrect
        return Response.json({success:false,
            message:'Incorrect verification code'
           },{status:200})
    }
} catch (error) {
    console.log('errors checking username',error)
    return Response.json({success:false,
      message:'errors verifying user'
     },{status:500})
}
}