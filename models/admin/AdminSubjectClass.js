const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AdminSubjectClassSchema = new Schema({
    subject_name: {
        type: String,
        default: ""
    },
    subject_sort: {
        type: Number,
        default: 10
    },
    subject_status: {
        type: Boolean,
        default: true
    },
    subject_time: {
        type: Date,
        default: Date.now
    }
})
module.exports = AdminSubjectClass = mongoose.model("subjec_classes", AdminSubjectClassSchema);