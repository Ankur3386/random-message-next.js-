import {resend} from '@/lib/resend'
import VerificationEmail from "../../emails/verificationEmail"
import { ApiResponse } from '@/types/ApiResponse'
export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string,
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'hello world',
            react: VerificationEmail({username,otp:verifyCode}),
          });
          return{success:true,message:" verification Code send successfully"}
    } catch (Emailerror) {
        console.error("error sending verification Code",Emailerror)
        return{success:false,message:"error sending verification Code"}
        
    }
}
