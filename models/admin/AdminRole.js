const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AdminRoleSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "admin_user"
    },
    roleCode: {
        type: String
    },
    roleName: {
        type: String
    },
    roleDesc: {
        type: String
    }

})
module.exports = AdminRole = mongoose.model("admin_role", AdminRoleSchema);