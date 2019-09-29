const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MainContentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "main_users"
    },
    filesUserID: {
        type: String,
        required: true
    },
    titleName: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    subjectName: {
        type: String,
        required: true
    },
    gradeName: {
        type: String,
        required: true
    },
    shareState: {
        type: Boolean,
        default: false
    },
    coverImg: {
        type: String,
        required: true
    },
    introText: {
        type: String,
        required: true
    },
    attachment: {
        type: String,
        required: true
    },
    scoreNumber: {
        type: Number,
        default: 0
    },
    downloads: {
        type: Number,
        default: 0
    },
    pageView: {
        type: Number,
        default: 0
    },
    scoreNumber: {
        type: Number,
        default: 0
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    sortDate: {
        type: Date
    }
})
module.exports = MainContent = mongoose.model("main_content", MainContentSchema);