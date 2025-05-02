import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter the name"]
        },
        email: {
            type: String,
            required: [true, "Enter the email"],
            unique: true
        },
        phone: {
            type: String,
            required: [true, "Please add a phone number"]
        },
        password: {
            type: String,
            required: [true, "Please enter a password"],
            min: [6, "Password must contain atleast 6 number"],
            max: 12
        },
        identificationType: {
            type: String,
            required: [true, "please add identifaction Type"],
            enum: ["Driving Lisence", "passport", "National ID"]
        },
        identificationNumber: {
            type: String,
            required: [true, "please enter the identification Number"],
            min: [6, "atleast 6 numbers"],
            max: 12,
            unique: true
        },
        balance: {
            type: Number,
            default: 1000
        },
        moneySend: {
            type: Number,
            default: 0,
        },
        moneyReceived: {
            type: Number,
            default: 0,
        },
        requestReceived: {
            type: Number,
            default: 0,
        },
        transactionLimit: {
            type: Number,
            default: 5000,
        },
        address: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String
        }
    },
    { timestamps: true });

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email,
        identificationType: this.identificationType
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", UserSchema)