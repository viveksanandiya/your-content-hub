import mongoose, {Schema, Document} from "mongoose";

export interface User extends Document{
    username: string;
    email: string;
    password: string;
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: true,
        unique:true
    },
    email: {
        type:String,
        required: true,
        unique:true,
    },
    password: {
        type:String,
        required: true,
    }
})

export default (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)    
// if created already get model ELSE create model
