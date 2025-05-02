import mongoose,{Schema} from "mongoose";


const transactionSchema = new Schema(
    {
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref : "User",
            required:true
        },
        receiver:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        amount:{
            type:Number,
            required:true
        },
        transactionType:{
            type:String,
            required:true,
            default:"Payment",
            enum:['Payment','Transfer','Deposit','Refund']
        },
        transactionId: {
            type: String,
        },
        reference: {
            type: String,
            required: true,
            enum: ['Transaction ID', 'Payment for services'],
        },
    },
    {
        timestamps:true
    });


export const Transaction = mongoose.model("Transaction",transactionSchema);