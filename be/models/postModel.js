import { Schema, model } from "mongoose";

const schema = new Schema({
    title: { type: String, required: true },
    category: {
        type: String,
        enum: [
            "Agriculture",
            "Business",
            "Education",
            "Entertainment",
            "Art",
            "Investment",
            "Uncategorized",
            "Weather"
        ],
        message: "{VALUE} is not supported"
    },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    thumbnail: { type: String, required: true }
}, { timestamps: true });

export default model("Post", schema);
