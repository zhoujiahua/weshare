const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AdminGradeClassSchema = new Schema({
    grade_name: {
        type: String,
        default: ""
    },
    grade_sort: {
        type: Number,
        default: 10
    },
    grade_status: {
        type: Boolean,
        default: true
    },
    grade_time: {
        type: Date,
        default: Date.now
    }
})

module.exports = AdminGradeClass = mongoose.model("grade_classes", AdminGradeClassSchema);