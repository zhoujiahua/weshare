const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AdminUserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    roleCode: {
        type: String
    },
    desc: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = AdminUser = mongoose.model("admin_user", AdminUserSchema)