import { User } from '../models/User.models.js';
import { Request } from '../models/requst.models.js';
import { Transaction } from '../models/transaction.models.js';

import crypto from 'crypto'

import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';


export const transferAmount = asyncHandler(async (req, res) => {
    const { receiver, amount, transactionType, reference } = req.body;

    if (!receiver || !amount || !transactionType || !reference) {
        throw new ApiError(400, "All fields are required.");
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new ApiError(400, "Amount must be a valid number greater than zero.");
    }

    try {
        const receiverUser = await User.findById(receiver);

        if (!receiverUser) {
            throw new ApiError(404, "Receiver not found.");
        }

        if (!req.user.isVerified || !receiverUser.isVerified) {
            throw new ApiError(403, "Both sender and receiver must be verified.");
        }

        const transfer = await Transaction.create({
            sender: req.user._id,
            receiver,
            amount: numericAmount,
            transactionType,
            reference,
            transactionId: crypto.randomBytes(5).toString('hex'),
        });

        await User.findByIdAndUpdate(
            req.user._id,
            {
                $inc: { balance: -numericAmount, moneySend: 1 },
            },
            { new: true }
        );

        await User.findByIdAndUpdate(
            receiver,
            {
                $inc: { balance: numericAmount, moneyReceived: 1 },
            },
            { new: true }
        );

        return res.status(200).json(
            new ApiResponse(200, transfer, "Amount transferred successfully")
        );
    } catch (error) {
        console.error("Transfer Error:", error);
        throw new ApiError(500, error.message || "Internal server error during transfer.");
    }
});


export const verifyReceiver = asyncHandler(async (req, res) => {
    const { receiver } = req.body;

    try {
        const receiverUser = await User.findById(receiver).select("-password -refreshToken");

        if (!receiverUser) {
            throw new ApiError(401, "No Receiver is found")
        }

        return res.status(200).json(new ApiResponse(200, receiverUser, "Receiver is valid"))
    } catch (error) {
        throw new ApiError(500, error.message || "Error while fetching the receiver");
    }
});

export const getTransactions = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
        $or: [{ sender: id }, { receiver: id }]
    }).sort({ createdAt: -1 })
        .populate([
            { path: 'sender', select: 'name email' },
            { path: 'receiver', select: 'name email' }
        ])

    if (!transaction) {
        throw new ApiError(401, "No transaction present")
    }

    return res.status(200).json(new ApiResponse(200, transaction, "Transaction is fetched Sucessfully"));
});

export const getMoneySendTransactions = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findOne({ sender: req.user?._id })
        .sort({ createdAt: -1 })
        .populate([
            { path: 'sender', select: 'name email' },
            { path: 'receiver', select: 'name email' }
        ]);

    if (!transaction) {
        throw new ApiError(404, "No transactions found for the current user.");
    }

    return res.status(200).json(
        new ApiResponse(200, transaction, "Latest sent transaction retrieved successfully.")
    );
});

export const getMoneyReceiveTransactions = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findOne({ receiver: req.user?._id })
        .sort({ createdAt: -1 })
        .populate([
            { path: 'sender', select: 'name email' },
            { path: 'receiver', select: 'name email' }
        ])

    if (!transaction) {
        throw new ApiError(404, "No Receving transactions found for the current user.");
    }

    return res.status(200).json(
        new ApiResponse(200, transaction, "Latest received transaction retrieved successfully.")
    );
});


export const deposit = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
        throw new ApiError(400, "Amount must be a valid number greater than 0.");
    }


    const updatedIser= await User.findByIdAndUpdate(
        req.user?._id,
        {
            $inc: {
                balance: amount
            }
        },
        {
            new: true,
            select:"-password -refreshToken"
        }
    )

    return res.status(200).json(new ApiResponse(200, updatedIser, "Amount is deposited sucessfully"))
})
