import {z} from 'zod'
export const signInSchema =z.object({
    identifer:z.string(),
    password:z.string()
})