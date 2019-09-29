const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AdminWebInfoSchema = new Schema({
    web_config: {
        web_name: {
            type: String
        },
        web_domain: {
            type: String
        },
        web_email: {
            type: String
        },
        is_cache: {
            type: Boolean,
            default: true
        },
        is_static: {
            type: Boolean,
            default: true
        },
        web_icp: {
            type: String
        },
        web_copyright: {
            type: String
        },
        web_statistical: {
            type: String
        }
    },
    seo_config: {
        seo_title: {
            type: String
        },
        seo_keys: {
            type: String
        },
        seo_desc: {
            type: String
        }
    },
    email_config: {
        email_pattern: {
            type: String
        },
        email_server: {
            type: String
        },
        email_port: {
            type: String
        },
        email_addresser: {
            type: String
        },
        email_name: {
            type: String
        },
        email_user: {
            type: String
        },
        email_pass: {
            type: String
        }
    },
    comment_config: {
        is_open: {
            type: Boolean,
            default: true
        },
        comment_time: {
            type: Number,
            default: 60
        }
    }
})

module.exports = AdminWebInfo = mongoose.model("web_info", AdminWebInfoSchema);