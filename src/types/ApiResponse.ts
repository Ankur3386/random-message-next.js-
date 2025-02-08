import { Message } from "@/model/User";
export interface ApiResponse{
    success:boolean;
    message:string;
    isAcceptingmessage?: boolean;
  messages?:Array<Message>;
}