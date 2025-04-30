import { Document, Schema, model } from "mongoose";

export interface ISkill extends Document {
    name: string;
    category?: string;
}

const skillSchema = new Schema<ISkill>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        category: {
            type: String,
        },
    },
    { timestamps: true }
);

export default model<ISkill>("Skills", skillSchema);