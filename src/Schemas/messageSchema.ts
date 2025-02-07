 import {z } from 'zod'
 export const messageSchema=z.object({
content:z.string()
.min(10,{message:'content must me atleast 10 charcter'})
.max(300,{message:"Content should not exceed more than 300 chharcter"})
 })