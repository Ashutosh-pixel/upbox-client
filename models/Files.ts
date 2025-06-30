import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    filename: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    storagePath: {
        type: String,
        required: true
    },
    uploadTime: {
        type: Date,
        required: true,
        default: Date.now
    },
}, {timestamps: true})

export default mongoose.models.File || mongoose.model('File', FileSchema);

