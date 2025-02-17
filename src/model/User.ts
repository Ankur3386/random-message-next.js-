import mongoose ,{Schema,Document} from 'mongoose'
export interface Message extends Document{
    content:string;
    createdAt:Date
}
const messageSchema :Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})
export interface User extends Document{
    username:string;
    password:string;
    email:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isverified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[]
}
const userSchema :Schema<User> = new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    verifyCode:{
        type:String,
        required:true
    },
    isverified:{
        type:Boolean,
        required:true
    },
   
   
    verifyCodeExpiry:{
        type:Date,
        required:true,
        
    },
    isAcceptingMessage:{
     type: Boolean,
        required:true
    },
    messages:[messageSchema]

})
const UserModel =(mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>("User",userSchema)
export default UserModel;