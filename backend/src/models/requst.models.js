import mongoose,{Schema, Types} from 'mongoose';


const requestSchema = new Schema(
    {
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref : "User",
            required:true
        },
        receiver:{
            type:mongoose.Schema.Types.ObjectId,
            ref : "User",
            required:true
        },
        amount:{
            type:Number,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        status:{
            type:String,
            default:"Pending",
            enum :['Pending', 'Accepted', 'Canceled']
        }
    },
    {
        timestamps:true
    }
)


export const Request = mongoose.model("Request",requestSchema)