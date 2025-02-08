import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import bcrypt from 'bcryptjs'
export async function POST(request:Request){
    await dbConnect()
    try {
       const {username,email,password} =await request.json()
        const existingUserVerifiedByUsername=await UserModel.findOne({
        username,
        isverified:true
       })
    if(existingUserVerifiedByUsername){
        return Response.json({
            success:false,
            message:"username already taken"
        },{
            status:400
        });
    }
    //checking for if we don't get username or is not verified
    const existingUserByEmail =await UserModel.findOne({email})
    const verifyCode =Math.floor(1000+Math.random()*90000).toString();
    if(existingUserByEmail){
       if(existingUserByEmail.isverified){
        return Response.json({
            success:false,
            message:"user already exist with this email"
        },{
            status:400
        });
       } 
       else{
        //for user having email but not verified so we will just update his detail
      const hashedPassword = await bcrypt.hash(password,10)
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verifyCode= verifyCode;
      existingUserByEmail.verifyCodeExpiry =new Date( Date.now()+3600)
  await existingUserByEmail.save()
       }
    }
    //in here we didnot existingUserByEmail so this means user came here for first time
    else{

   const hashedPassword =await bcrypt.hash(password,10);
   const expiryDate =new Date()
   expiryDate.setHours(expiryDate.getHours()+1)
   const newUser = new UserModel({
    username,
        password:hashedPassword,
        email,
        verifyCode:verifyCode,
        verifyCodeExpiry:expiryDate,
        isverified:false,
        isAcceptingMessage:true,
        message:[]
   });
   await newUser.save();
    }
    //we have saved the user so now will send verification email
    const emailResponse =await sendVerificationEmail(
        username,
        email,
        verifyCode
    )
    if(!emailResponse.success){
        return Response.json({
            success:false,
            message:email.message,
        },{
            status:500
        });
    }
    return Response.json({
        success:true,
        message:"user registered successfully please verify your account",
    },{
        status:201
    });
    } catch (error) {
        console.error("Error registering user",error)
        return Response.json(
            {
                success:false,
                message:"Error registering user"
            },{
                status:500
            }
        )
    }
}