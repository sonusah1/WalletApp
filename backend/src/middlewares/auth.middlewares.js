
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { User } from '../models/User.models.js';


export const verifyJWT = asyncHandler(async (req, res, next) => {
    let token = req.cookies?.accessToken;

    if (!token && req.header("Authorization")) {
        const authHeader = req.header("Authorization");
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.slice(7).trim(); // Remove 'Bearer ' and trim whitespace
        }
    }

    if (!token) {
        throw new ApiError(401, "Unauthorized: No token provided");
    }


    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "User not found for token");
        }

        req.user = user;
        next();
    } catch (err) {
        throw new ApiError(401, "Invalid or expired access token");
    }
});

export const admin = asyncHandler(async (req,res,next)=>{
    if(!req.user || ! req.user.isAdmin)
    {
        throw new ApiError(401,"not authorized as an admin")
    }

    next();
})
