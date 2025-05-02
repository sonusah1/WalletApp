import crypto from 'crypto'

import {User} from '../models/User.models.js';
import ApiError from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import uploadOnCloudinary from '../utils/cloudinary.js'
import ApiRespose from '../utils/ApiResponse.js'

const generateAccessAndRefereshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating token")
    }
}


const register = asyncHandler(async (req, res) => {
    const { name, email, phone, password, identificationType,
        address
    } = req.body;

    const balance = Number(req.body.balance || 0);
    const moneySend = Number(req.body.moneySend || 0);
    const moneyReceived = Number(req.body.moneyReceived || 0);
    const requestReceived = Number(req.body.requestReceived || 0);

    if (!name || !email || !password || !phone || !identificationType || !balance || !address) {
        throw new ApiError(400, "All fileds are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(404, "User already exists");
    }

    const avatarLocalPath = req.file?.path;

    const avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : null;
    //console.log(avatar.url);
    

    const user = await User.create({
        name,
        email,
        balance,
        password,
        phone,
        address,
        identificationType,
        moneySend,
        moneyReceived,
        requestReceived,
        identificationNumber: crypto.randomBytes(6).toString('hex'),
        isAdmin: false,
        isVerified: true,
        avatar: avatar? avatar.url : null
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser)
    {
        throw new ApiError(404,"User not Found")
    }

    return res.status(200).json(
        new ApiRespose(200,createdUser,"User registered Successfully")
    )
})

const login = asyncHandler(async (req,res)=>{
    const { email, password } = req.body;

    const user = await User.findOne({email});

    if(!user)
    {
        throw new ApiError(400,"User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user Credentials");
    }

    const {accessToken,refreshToken}=await generateAccessAndRefereshToken(user._id);

    const logedInUser = await User.findById(user._id).select('-password ');

    const options ={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie('accessToken',accessToken,options)
    .cookie('refreshToken',refreshToken,options)
    .json(
        new ApiRespose(200,logedInUser,"User LoggedIn Sucessfully")
    )
});

const logOut = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {new : true}
    )

    const options ={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiRespose(200,{},"User Logged Out"));
})


const currentUser = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.user?._id).select("-password");

    return res.status(200).json(new ApiRespose(200,user,"User Fetched SuccessFully"));

})

const getAllUser = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');

    const currentUserId = req.user?._id?.toString();

    const otherUsers = users.filter(user => user._id.toString() !== currentUserId);

    if (otherUsers.length === 0) {
        throw new ApiError(400, "You are the only user || No other users are present");
    }

    return res.status(200).json(new ApiRespose(200, otherUsers, "All users fetched successfully"));
});


const updateVerify = asyncHandler(async (req,res)=>{
    const {SetisVerified}=req.body;

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            $set:{
                isVerified: SetisVerified
            }
        },
        {
            new : true
        }
    ).select('-password')

    return res.status(200).json(new ApiRespose(200,user,"User verified sucessfully"));
});

const getImage = asyncHandler(async (req,res)=>{
    const user= await User.findById(req.user?._id);

    if(!user)
    {
        throw new ApiError(400,"User not found");
    }
    const avatar = user.avatar

    if(!avatar)
    {
        throw new ApiError(401,"No Image found")
    }

    return res.status(200).json(new ApiRespose(200,avatar,"Image Fetched Sucessfully"));


})

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Please upload a valid image");
    }

    const image = await uploadOnCloudinary(avatarLocalPath)

    if (!image.url) {
        throw new ApiError(400, "Error while uploading avatar image");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { avatar: image.url } },
        { new: true }
    ).select("-password");

    return res.status(200).json(
        new ApiRespose(200, user, "Avatar uploaded or updated successfully")
    );
});


export {register,login,logOut,currentUser,getAllUser,updateVerify,getImage,updateAvatar}