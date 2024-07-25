import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    fullname: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    phone: {
        type: Number,
        required: [true, "Phone is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: String,
        required: [true],
        enum: ["Student", "Recuriter"] // used for the options
    },
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        resume: { type: String },
        resumeName: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'company' }, //company relation.
        profilePhoto: {
            type: String,
            default: ""
        }
    }
}, { timestamps: true })

export default User = mongoose.model("User", userSchema);