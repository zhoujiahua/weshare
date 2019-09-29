const express = require("express");
const router = express.Router();
const Validator = require('validator');
const bcrypt = require("bcrypt");
const isEmpty = require("./../../../validation/is-empty");
const AdminSubjectClass = require("../../../models/admin/AdminSubjectClass");
const AdminGradeClass = require("../../../models/admin/AdminGradeClass");
const MainContent = require("../../../models/main/MainContent");
const MainUsers = require("../../../models/main/MainUsers");
const AdminUser = require("../../../models/admin/AdminUser");
const AdminWebInfo = require("../../../models/admin/AdminWebInfo");

let msgData;
router.use((req, res, next) => {
    msgData = {
        code: 0,
        msg: ""
    }
    next();
})

// $route  GET api/admin/comm/subjectid
// @desc   学科编辑数据获取 /subjectid
// @access public
router.get("/subjectid/:id", (req, res) => {
    let r = req.params;
    if (Validator.isEmpty(r._id)) {
        msgData.code = 1;
        msgData.msg = "ID不能为空！";
        return res.json(msgData);
    }

    AdminSubjectClass.findById(JSON.parse(r._id)).then(info => {
        if (!info) {
            msgData.code = 1;
            msgData.msg = "当前数据不存在！";
            return res.json(msgData);
        }

        msgData.data = info;
        return res.json(msgData);
    })
})

// $route  GET api/admin/comm/subject/pages
// @desc   学科列表分页数据 /subjec/pages
// @access public
router.get("/subject/pages", (req, res) => {
    let r = req.query;
    r.limit = r.limit || 10;
    r.page = r.page || 1;

    if (isNaN(r.limit)) {
        msgData.code = 1;
        msgData.msg = "展示条数不能为空必须为整数！";
        return res.json(msgData);
    }

    if (r.limit > 100 || r.limit < 0) {
        msgData.code = 1;
        msgData.msg = "每页少展示0条最多展示100条！";
        return res.json(msgData);
    }

    if (isNaN(r.page) || r.page < 0) {
        msgData.code = 1;
        msgData.msg = "选中页码不能为空且必须为整数";
        return res.json(msgData);
    }

    //类型转换
    let limit = Number(r.limit),
        curr = Number(r.page);

    AdminSubjectClass.count().then(countInfo => {
        if (!countInfo) {
            msgData.code = 1;
            msgData.msg = "当前数据不存在！";
            msgData.data = "";
            return res.json(msgData);
        }
        AdminSubjectClass.find().sort({
                subject_sort: "asc"
            })
            .skip(limit * (curr ? curr - 1 : 0)).limit(limit).then(dataInfo => {
                msgData.count = countInfo;
                msgData.data = dataInfo;
                return res.json(msgData);
            })
    })
})

// $route  GET api/admin/comm/grade/pages
// @desc   年级列表分页数据 /subjec/pages
// @access public
router.get("/grade/pages", (req, res) => {
    let r = req.query;
    r.limit = r.limit || 10;
    r.page = r.page || 1;

    if (isNaN(r.limit)) {
        msgData.code = 1;
        msgData.msg = "展示条数不能为空必须为整数！";
        return res.json(msgData);
    }

    if (r.limit > 100 || r.limit < 0) {
        msgData.code = 1;
        msgData.msg = "每页少展示0条最多展示100条！";
        return res.json(msgData);
    }

    if (isNaN(r.page) || r.page < 0) {
        msgData.code = 1;
        msgData.msg = "选中页码不能为空且必须为整数";
        return res.json(msgData);
    }

    //类型转换
    let limit = Number(r.limit),
        curr = Number(r.page);

    AdminGradeClass.count().then(countInfo => {
        if (!countInfo) {
            msgData.code = 1;
            msgData.msg = "当前数据不存在！";
            msgData.data = "";
            return res.json(msgData);
        }
        AdminGradeClass.find().sort({
                grade_sort: "asc"
            })
            .skip(limit * (curr ? curr - 1 : 0)).limit(limit).then(dataInfo => {
                msgData.count = countInfo;
                msgData.data = dataInfo;
                return res.json(msgData);
            })
    })
})


// $route  GET api/admin/comm/plan/pages
// @desc   文件管理数据
// @access public
router.get("/plan/pages", (req, res) => {
    let {
        limit,
        page
    } = req.query;
    limit = !isEmpty(limit) ? limit : "";
    page = !isEmpty(page) ? page : "";

    if (Validator.isEmpty(limit)) {
        msgData.code = 1;
        msgData.msg = "展示条数不能为空！";
        return res.json(msgData);
    }
    if (Validator.isEmpty(page)) {
        msgData.code = 1;
        msgData.msg = "分页数不能为空！";
        return res.json(msgData);
    }

    //类型转换
    limit = Number(limit);
    page = Number(page);

    if (isNaN(limit)) {
        msgData.code = 1;
        msgData.msg = "展示条数必须为整数！";
        return res.json(msgData);
    }

    if (isNaN(page) || page < 0) {
        msgData.code = 1;
        msgData.msg = "选中页码必须为整数";
        return res.json(msgData);
    }

    if (limit > 100 || limit < 0) {
        msgData.code = 1;
        msgData.msg = "每页少展示0条最多展示100条！";
        return res.json(msgData);
    }

    //数据查询
    MainContent.count().then(count => {
        if (!count) {
            msgData.code = 1;
            msgData.count = count;
            msgData.msg = "当前数据不存在！";
            return res.json(msgData);
        }
        MainContent.find({
                shareState: true
            }).sort({
                createDate: "desc"
            })
            .skip(limit * (page ? page - 1 : 0)).limit(limit).then(data => {
                msgData.count = count;
                msgData.data = data;
                return res.json(msgData);
            })
    })

})

// $route  GET api/admin/comm/users/pages
// @desc   用户管理
// @access public
router.get("/users/pages", (req, res) => {
    let {
        limit,
        page
    } = req.query;
    limit = !isEmpty(limit) ? limit : "";
    page = !isEmpty(page) ? page : "";

    if (Validator.isEmpty(limit)) {
        msgData.code = 1;
        msgData.msg = "展示条数不能为空！";
        return res.json(msgData);
    }
    if (Validator.isEmpty(page)) {
        msgData.code = 1;
        msgData.msg = "分页数不能为空！";
        return res.json(msgData);
    }

    //类型转换
    limit = Number(limit);
    page = Number(page);

    if (isNaN(limit)) {
        msgData.code = 1;
        msgData.msg = "展示条数必须为整数！";
        return res.json(msgData);
    }

    if (isNaN(page) || page < 0) {
        msgData.code = 1;
        msgData.msg = "选中页码必须为整数";
        return res.json(msgData);
    }

    if (limit > 100 || limit < 0) {
        msgData.code = 1;
        msgData.msg = "每页少展示0条最多展示100条！";
        return res.json(msgData);
    }

    //数据查询
    MainUsers.count().then(count => {
        if (!count) {
            msgData.code = 1;
            msgData.count = count;
            msgData.msg = "当前数据不存在！";
            return res.json(msgData);
        }
        MainUsers.find().sort({
                date: "desc"
            })
            .skip(limit * (page ? page - 1 : 0)).limit(limit).then(data => {
                msgData.count = count;
                msgData.data = data;
                return res.json(msgData);
            })
    })

})

// $route  GET api/admin/comm/web/info
// @desc   站点信息配置 
// @access public
router.get("/web/info", (req, res) => {
    AdminWebInfo.find().then(data => {
        if (!data) {
            msgData.code = 1;
            msgData.msg = "当前数据不存在！";
            return res.json(msgData);
        }
        msgData.data = data;
        return res.json(msgData);
    })
})

// $route  GET api/admin/comm/web/edit
// @desc   站点信息配置编辑 
// @access public
router.post("/web/edit", (req, res) => {
    let r = req.body,
        web_info = {};
    r._id = !isEmpty(r._id) ? r._id : "";
    if (Validator.isEmpty(r._id)) {
        msgData.code = 1;
        msgData.msg = "ID不能为空！";
        return res.json(msgData);
    }

    //条件更新
    switch (r.types) {
        case "1":
            web_info.web_config = r;
            break;
        case "2":
            web_info.seo_config = r;
            break;
        case "3":
            web_info.email_config = r;
            break;
        case "4":
            web_info.comment_config = r;
            break;
    }

    //站点信息查询
    AdminWebInfo.findById(r._id).then(data => {
        if (!data) {
            msgData.code = 1;
            msgData.msg = "当前数据不存在！";
            return res.json(msgData);
        }
        //信息更新
        AdminWebInfo.where({
            _id: data._id
        }).update(web_info).then(msgs => {
            msgData.data = data;
            msgData.msgs = msgs;
            msgData.msg = "更新成功！";
            return res.json(msgData);
        })
    })
})



// $route  GET api/admin/comm/ausers/edit
// @desc   管理员信息编辑
// @access public
router.post("/ausers/edit", (req, res) => {
    let r = req.body;
    r._id = !isEmpty(r._id) ? r._id : "";
    if (Validator.isEmpty(r._id)) {
        msgData.code = 1;
        msgData.msg = "ID不能为空！";
        return res.json(msgData);
    }

    AdminUser.findById(r._id).then(data => {
        if (!data) {
            msgData.code = 1;
            msgData.msg = "数据不存在！";
            return res.json(msgData);
        }
        //用户信息更新
        AdminUser.where({
            _id: data._id
        }).update({
            email: r.email,
            desc: r.desc
        }).then(msgs => {
            msgData.msg = "修改成功！";
            msgData.data = data;
            msgData.msgs = msgs;
            return res.json(msgData);
        })
    })
})

// $route  GET api/admin/comm/ausers/repass
// @desc   管理员密码修改
// @access public
router.post("/ausers/repass", (req, res) => {
    let r = req.body;
    r._id = !isEmpty(r._id) ? r._id : "";
    r.oldpass = !isEmpty(r.oldpass) ? r.oldpass : "";
    r.password = !isEmpty(r.password) ? r.password : "";
    r.password2 = !isEmpty(r.password2) ? r.password2 : "";

    if (Validator.isEmpty(r._id)) {
        msgData.code = 1;
        msgData.msg = "ID不能为空！";
        return res.json(msgData);
    }
    if (Validator.isEmpty(r.oldpass)) {
        msgData.code = 1;
        msgData.msg = "原始密码不能为空！";
        return res.json(msgData);
    }
    if (Validator.isEmpty(r.password) || r.password.length < 6) {
        msgData.code = 1;
        msgData.msg = "新密码不能为空且密码长度不能少于6位！";
        return res.json(msgData);
    }
    if (r.password !== r.password2) {
        msgData.code = 1;
        msgData.msg = "两次密码不一致！";
        return res.json(msgData);
    }

    //管理员信息查询
    AdminUser.findById(r._id).then(data => {
        if (!data) {
            msgData.code = 1;
            msgData.msg = "数据不存在！";
            return res.json(msgData);
        }

        //密码验证
        bcrypt.compare(r.oldpass, data.password)
            .then(isMatch => {
                if (isMatch) {
                    // 密码加密
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) throw err;
                        bcrypt.hash(r.password, salt, (err, hash) => {
                            if (err) throw err;
                            //密码更新
                            AdminUser.where({
                                _id: data._id
                            }).update({
                                password: hash
                            }).then(msgs => {
                                msgData.msg = "修改成功！";
                                msgData.msgs = msgs;
                                return res.json(msgData);
                            })
                        })
                    })
                } else {
                    msgData.code = 1;
                    msgData.msg = "密码错误!";
                    return res.json(msgData);
                }
            })
    })
})

module.exports = router;