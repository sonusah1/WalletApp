import ApiError from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import crypto from 'crypto'
import ApiRespose from '../utils/ApiResponse.js'

import { Request } from '../models/requst.models.js';
import { User} from "../models/User.models.js"
import { Transaction } from '../models/transaction.models.js';

const requestAmount = asyncHandler(async (req, res) => {
    const { receiver, amount, description,status } = req.body;

    try {
        if (!receiver || !amount || !description) {
            throw new ApiError(400, "All fields are Required");
        }
        const moneyReceiverUser = await User.findById(receiver);

        if (!moneyReceiverUser) {
            throw new ApiError(400, "User doesnt found ")
        }

        if (req.user._id == receiver) {
            throw new ApiError(400, "Request not send")
        }

        const request = await Request.create({
            sender: req.user._id,
            receiver,
            amount,
            description,
            status
        })

        await User.findByIdAndUpdate(
            receiver,
            {
                $inc: {
                    requestReceived: 1
                }
            },
            {
                new: true
            }
        );

        return res.status(200).json(new ApiRespose(200,request,"Receiver Requested Sucessfully"));

    } catch (error) {
        throw new ApiError(400,error.message|| "Requesting from receiver is failed");
    }
});

const getAllRequest = asyncHandler(async(req,res)=>{

    const request = await Request.find({
        $or:[{sender:req.user._id},{receiver:req.user._id}]
    })
    .populate("sender","-password -refreshToken")
    .populate("receiver","-password -refreshToken")
    .sort({ createdAt: -1 })

    if(!request)
    {
        throw new ApiError(400,"No requests found")
    }

    return res.status(200).json(new ApiRespose(200,request,"All the request are fetched"))
});

const getRequestSendTransaction = asyncHandler(async(req,res)=>{
    const request = await Request.find({sender:req.user?._id})
    .sort({createdAt:-1})
    .populate([
        {path:"sender",select: "name avatar"},
        {path:"receiver",select: "name avatar"}
    ]);

    if(!request)
    {
        throw new ApiError(400,"No requests found")
    }

    return res.status(200).json(new ApiRespose(200,request,"Request for send Transaction are Fetched"))
});


const getRequestReceivedTransaction = asyncHandler(async(req,res)=>{
    const request = await Request.find({receiver:req.user?._id})
    .sort({createdAt:-1})
    .populate([
        {path:"sender",select:"name avatar"},
        {path:"receiver",select:"name avatar"}
    ])


    if(!request)
    {
        throw new ApiError(401,"Receive Request doesnt exists")
    }

    return res.status(200).json(new ApiRespose(200,request,"ReceiveRequest fetched sucessfully"));
});

const updateRequestStats = asyncHandler(async(req,res)=>{
    const {_id,sender,receiver,amount, transactionType, reference, status} = req.body

    try {
        if(status == 'Accepted')
        {
            const transaction = await Transaction.create({
                sender:sender,
                receiver,
                amount,
                transactionType,
                transactionId: crypto.randomBytes(5).toString('hex'),
                reference
            })
        }

        await Promise.all([
            User.findByIdAndUpdate(sender,{$inc:{balance:-amount}},{new : true}),
            User.findByIdAndUpdate(receiver,{$inc:{balance:amount}},{new : true}),
            Request.findByIdAndUpdate(
                _id,
                {
                    $set:{
                        status:status
                    }
                },
                {new : true}
            )
        ])

        // //deduced the amount from sender
        // await User.findByIdAndUpdate(
        //     sender,
        //     {
        //         $inc:{
        //             balance:-amount
        //         }
        //     },
        //     {
        //         new : true
        //     }
        // )

        // //add amount to receiver
        // await User.findByIdAndUpdate(
        //     receiver,
        //     {
        //         $inc:{
        //             balance:amount
        //         }
        //     },
        //     {new : true}
        // )
        // // change the status
        // await Request.findByIdAndUpdate(
        //     _id,
        //     {
        //         $set:{
        //             status:status
        //         }
        //     },
        //     {new : true}
        // )

        return res.status(200).json(new ApiRespose(200,transaction,"Transaction updates sucessfully"));

    } catch (error) {
        
    }
})

export {requestAmount,getAllRequest,getRequestSendTransaction,getRequestReceivedTransaction,updateRequestStats}