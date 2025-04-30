import { Schema, model, Document } from "mongoose";

interface IProfile extends Document {
    userId: Schema.Types.ObjectId;  
    firstName: string;
    lastName: string;
    profilePic?: string;
    bio?: string;
    slug?: string;
    skills?: Schema.Types.ObjectId[];
    socialLinks?: {
        github?: string;
        twitter?: string;
        linkedin?: string;
    };
}

const profileSchema = new Schema<IProfile>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        firstName: { type: String },
        lastName: { type: String },
        profilePic: { type: String },
        bio: { type: String },
        slug: { type: String },
        skills: [{ type: Schema.Types.ObjectId, ref: "Skills" }],
        socialLinks: {
            github: { type: String },
            twitter: { type: String },
            linkedin: { type: String },
        },
    },
    { timestamps: true }
);

export default model<IProfile>("Profiles", profileSchema);
