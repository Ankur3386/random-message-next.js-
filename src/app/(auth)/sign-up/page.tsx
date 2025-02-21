'use client'
import { useForm } from "react-hook-form";
import * as z from'zod'
import Link from "next/link";
import { useEffect, useState } from "react";
import {  useDebouncedCallback } from 'use-debounce';
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { signUpSchema } from "@/Schemas/signUpSchema";
import { zodResolver } from '@hookform/resolvers/zod';
import axios ,{AxiosError}from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
 // Adjust the import path as necessary
const page = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebouncedCallback(setUsername, 300);
  // add toaster in layout file import from sonner 
  // initiating toast 
  function useToast() {
    return {
      toast: (message: string) => {
        // Assuming 'sonner' provides a toast function
        toast(message);
      }
    };
  }
  // used to send user from one place to other comes from nextjs
  const router = useRouter();
  // zod implementation
  // we will put value here so that why our form willbe destrucutre bellow
  const form = useForm({
    // zodResolver needs schema
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },

  });
  //jaisa user field ma change ho  tab muje ya pata chale ki usernam available ha database ma 
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
      setIsCheckingUsername(true);
      setUsernameMessage('');
      try {
      const response=  await axios.get(`/api/check-username-unique?username=${debounced}`)
      setUsernameMessage(response.data.message)
      } catch (error) {
        console.error(error);
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(axiosError.response?.data.message ??'error checking username')

      }finally{
        //finally always run in both try and catch and if we dont want to write finally than we have to write    setIsCheckingUsername(false); in both try and catch at last
        setIsCheckingUsername(false);
      }
    }
  }
  checkUsernameUnique();
  
},  [username]);
const onSubmit = async(data: z.infer<typeof signUpSchema>)=>{
setIsSubmitting(true);
try {
  const response = await axios.post<ApiResponse>('/api/sign-up',data);
toast('Success: ' + response.data.message);
//make verify page and there we will take username from url and code from user
router.replace(`/verify/${username}`)
} catch (error) {
  console.error(" Error in signUp of user",error);
  const axiosError = error as AxiosError<ApiResponse>;
  let errorMessage = axiosError.response?.data.message
  toast("signUp failed" + errorMessage);
  setIsSubmitting(false);
}
}
 //download input pesonally from sahdcn rest are alredy downloaded so just ctrl space and enter
return (
  <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md"  >
    <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Random Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-6">
      <FormField
  control={form.control}
  name="username"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Username</FormLabel>
      <FormControl >
       
        <Input placeholder="username"
         {...field}
         onChange={(e)=>{
          field.onChange(e)
          debounced(e.target.value)
         }} />

      </FormControl>
      {isCheckingUsername && <Loader2 className="animate-spin"/>}
      <p className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}>test {usernameMessage}</p>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl >
       
        <Input placeholder="Email"
         {...field} />
      </FormControl>
      
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="password"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Password</FormLabel>
      <FormControl >
       
        <Input type="password" placeholder="Password"
         {...field} />
      </FormControl>
      
      <FormMessage />
    </FormItem>
  )}
/>
<Button type="submit" disabled={isSubmitting} >
{
  isSubmitting ? ( <>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />

    </>):('Signup')
}
</Button>
      </form>
    </Form>
    </div>
  </div>
)
};
export default page;



