import UserModel from "@/model/User";
import {z} from 'zod'
import dbConnect from "@/lib/dbConnect";
import { usernamevalidation } from "@/Schemas/signUpSchema";
const UsernameQuerySchema =z.object({
    username:usernamevalidation
})
 export async function GET(request:Request) {
      await dbConnect()
      try {
        const {searchParams} = new URL(request.url);
        const queryParams ={
            username :searchParams.get('username'),
           
        }
        const result = UsernameQuerySchema.safeParse(queryParams)
      //  console.log(result);
        

if(!result.success){
  const usernameErrors =result.error.format().username?._errors||[]
   return Response.json({success:false,
    message:
    usernameErrors?.length>0?usernameErrors.join(' '):'Invalid query parameter'
   },{status:400})
}
const {username} =result.data
const existingVerifiedUser =await UserModel.findOne({username,
  isverified:true
})
if(existingVerifiedUser){
  return Response.json({success:false,
    message:'username is already taken'
   },{status:200})
}
return Response.json({success:true,
  message:'username is unique'
 },{status:200})

      } catch (error) {
        console.log('errors checking username',error)
        return Response.json({success:false,
          message:'errors checking usetrname'
         },{status:500})
      }
 }