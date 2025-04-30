import { Document, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    userName: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        userName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
    },
    { timestamps: true }
);

// Remove these lines to avoid duplicate index warnings
// userSchema.index({ email: 1 }, { unique: true });
// userSchema.index({ userName: 1 }, { unique: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export default model<IUser>("Users", userSchema);