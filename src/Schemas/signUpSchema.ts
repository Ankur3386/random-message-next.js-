import {z} from 'zod'
export const usernamevalidation =z
.string()
.min(2,'username should bet atleast 2 character')
.max(20,"username cannot exceed 20 character")
.regex(/^[a-zA-Z0-9]+$/,"username cannot contain special character")
export const signUpSchema =z.object({
    username:usernamevalidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"password should be atlaest 6 character"})
})