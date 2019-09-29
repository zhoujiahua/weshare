const express = require("express");
const router = express.Router();
const Validator = require('validator');
const isEmpty = require("./../../../validation/is-empty");
const AdminWebInfo = require("../../../models/admin/AdminWebInfo");
const AdminSubjectClass = require("../../../models/admin/AdminSubjectClass");
const AdminGradeClass = require("../../../models/admin/AdminGradeClass");
const MainContent = require("../../../models/main/MainContent");

let msgData;
router.use((req, res, next) => {
    msgData = {
        code: 0,
        msg: ""
    }
    next();
})

// $route  POST api/admin/pages/system
// @desc   系统信息 system
// @access public
router.post("/system", (req, res) => {
    let r = req.body;
    console.log(r);
    AdminWebInfo.findOne().then(info => {
        let webInfoConfig = {
            "web_config": {
                "web_name": r.web_name || "小掌部落文件系统",
                "web_domain": r.web_domain || "www.blooo.cn",
                "web_email": r.web_email || "zjh10403@blooo.cn",
                "is_cache": r.is_cache || true,
                "is_static": r.is_static || true,
                "web_icp": r.web_icp || "陕ICP备18021353号-2",
                "web_copyright": r.web_copyright || "小掌部落陕西分公司 版权所有",
                "web_statistical": r.web_statistical || "<p>小掌部落陕西分公司<p>"
            },
            "seo_config": {
                "seo_title": r.seo_title || "文件管理系统",
                "seo_keys": r.seo_keys || ["文件", "管理", "文件"],
                "seo_desc": r.seo_desc || "小掌部落陕西分公司，文件管理系统！"
            },
            "email_config": {
                "email_pattern": r.email_pattern || "1",
                "email_server": r.email_server || "smtp.blooo.cn",
                "email_port": r.email_port || "25",
                "email_addresser": r.email_addresser || "zjh10403@blooo.cn",
                "email_name": r.email_name || "JiaHua管理员",
                "email_user": r.email_user || "admin",
                "email_pass": r.email_pass || "admin123456"
            },
            "comment_config": {
                "is_open": r.is_open || true,
                "comment_time": r.comment_time || 60
            }
        }
        if (!info) {
            const newWebInfo = new AdminWebInfo(webInfoConfig);
            newWebInfo.save().then(newInfo => {
                return res.json(newInfo);
            })
        } else {
            AdminWebInfo.update(info, {
                $set: webInfoConfig
            }).then(updateInfo => {
                return res.json(updateInfo);
            })
        }

    })
})

// $route  POST api/admin/pages/subject
// @desc   学科设置 subject
// @access public
router.post("/subject", (req, res) => {
    let r = req.body;
    r.subject_sort = r.subject_sort || 10;
    r.subject_status = r.subject_status || 1;
    console.log(r);
    if (Validator.isEmpty(r.subject_name)) {
        msgData.code = 1;
        msgData.msg = "学科字段不能为空！";
        return res.json(msgData);
    }
    if (isNaN(r.subject_sort)) {
        msgData.code = 1;
        msgData.msg = "排序字段必须为整数数字类型！";
        return res.json(msgData);
    }

    if (isNaN(r.subject_status)) {
        msgData.code = 1;
        msgData.msg = "状态字段只能整数数字！";
        return res.json(msgData);
    }

    if (r.subject_status == 0 || r.subject_status == 1) {
        AdminSubjectClass.findOne({
            subject_name: r.subject_name
        }).then(subjectInfo => {
            if (subjectInfo) {
                msgData.code = 1;
                msgData.msg = "当前学科已存在！";
                return res.json(msgData);
            }
            const newSubjectInfo = new AdminSubjectClass({
                subject_name: r.subject_name,
                subject_sort: r.subject_sort,
                subject_status: r.subject_status
            })
            newSubjectInfo.save().then(subjectInfo => {
                msgData.msg = "添加成功！";
                msgData.data = subjectInfo;
                return res.json(msgData);
            })
        })
    } else {
        msgData.code = 1;
        msgData.msg = "状态字段只能为0或1！";
        return res.json(msgData);
    }
})

// $route  POST api/admin/pages/subject/edit
// @desc   学科编辑 /subject/edit
// @access public
router.post("/subject/edit", (req, res) => {
    let r = req.body;
    r.subject_sort = r.subject_sort || 10;
    r.subject_status = r.subject_status || 1;
    console.log(r);

    if (Validator.isEmpty(r.id)) {
        msgData.code = 1;
        msgData.msg = "ID不能为空！";
        return res.json(msgData);
    }

    if (Validator.isEmpty(r.subject_name)) {
        msgData.code = 1;
        msgData.msg = "学科字段不能为空！";
        return res.json(msgData);
    }
    if (isNaN(r.subject_sort)) {
        msgData.code = 1;
        msgData.msg = "排序字段必须为整数数字类型！";
        return res.json(msgData);
    }

    if (isNaN(r.subject_status)) {
        msgData.code = 1;
        msgData.msg = "状态字段只能整数数字！";
        return res.json(msgData);
    }

    if (r.subject_status == 1 || r.subject_status == 0) {
        AdminSubjectClass.findById(r.id).then(info => {
            // console.log(info)
            if (!info) {
                msgData.code = 1;
                msgData.msg = "当前数据不存在！";
                return res.json(msgData);
            }
            //构造编辑数据
            const updateInfo = {
                subject_name: r.subject_name,
                subject_sort: r.subject_sort,
                subject_status: r.subject_status
            }
            AdminSubjectClass.findOne({
                subject_name: r.subject_name
            }).then(nameInfo => {
                if (!nameInfo || nameInfo._id == r.id) {
                    AdminSubjectClass.updateOne(info, {
                        $set: updateInfo
                    }).then(editInfo => {
                        // console.log(editInfo)
                        msgData.msg = "更新成功";
                        return res.json(msgData);
                    })
                } else {
                    msgData.code = 1;
                    msgData.msg = "当前学科已存在！";
                    return res.json(msgData);
                }
            })

        })
    } else {
        msgData.code = 1;
        msgData.msg = "状态字段只能为0或1！";
        return res.json(msgData);
    }
})

// $route  GET api/admin/pages/subject/delete
// @desc   学科删除 /subject/delete
// @access public
router.get("/subject/delete/:id", (req, res) => {
    let r = req.params;
    console.log(r);
    if (Validator.isEmpty(r.id)) {
        msgData.code = 1;
        msgData.msg = "ID不能为空！";
        return res.json(msgData);
    }
    AdminSubjectClass.remove({
        _id: r.id
    }).then(removeInfo => {
        if (removeInfo.n) {
            msgData.msg = "删除成功！";
            return res.json(msgData);
        } else {
            msgData.code = 1;
            msgData.msg = "删除失败！";
            return res.json(msgData);
        }
    })
})

// $route  POST api/admin/pages/grade
// @desc   年级设置 grade
// @access public
router.post("/grade", (req, res) => {
    let r = req.body;
    r.grade_sort = r.grade_sort || 10;
    r.grade_status = r.grade_status || 1;
    console.log(r);
    if (Validator.isEmpty(r.grade_name)) {
        msgData.code = 1;
        msgData.msg = "年级字段不能为空！";
        return res.json(msgData);
    }
    if (isNaN(r.grade_sort)) {
        msgData.code = 1;
        msgData.msg = "排序字段必须为整数数字类型！";
        return res.json(msgData);
    }
    if (isNaN(r.grade_status)) {
        msgData.code = 1;
        msgData.msg = "状态字段只能整数数字！";
        return res.json(msgData);
    }
    if (r.grade_status == 0 || r.grade_status == 1) {
        AdminGradeClass.findOne({
            grade_name: r.grade_name
        }).then(subjectInfo => {
            if (subjectInfo) {
                msgData.code = 1;
                msgData.msg = "当前年级已存在！";
                return res.json(msgData);
            }
            const newGradeInfo = new AdminGradeClass({
                grade_name: r.grade_name,
                grade_sort: r.grade_sort,
                grade_status: r.grade_status
            })
            newGradeInfo.save().then(gradeInfo => {
                msgData.msg = "添加成功！";
                msgData.data = gradeInfo;
                return res.json(msgData);
            })
        })
    } else {
        msgData.code = 1;
        msgData.msg = "状态字段只能为0或1！";
        return res.json(msgData);
    }
})

// $route  POST api/admin/pages/grade/edit
// @desc   年级编辑 /grade/edit
// @access public
router.post("/grade/edit", (req, res) => {
    let r = req.body;
    r.grade_sort = r.grade_sort || 10;
    r.grade_status = r.grade_status || 1;
    console.log(r);

    if (Validator.isEmpty(r.id)) {
        msgData.code = 1;
        msgData.msg = "ID不能为空！";
        return res.json(msgData);
    }

    if (Validator.isEmpty(r.grade_name)) {
        msgData.code = 1;
        msgData.msg = "年级字段不能为空！";
        return res.json(msgData);
    }
    if (isNaN(r.grade_sort)) {
        msgData.code = 1;
        msgData.msg = "排序字段必须为整数数字类型！";
        return res.json(msgData);
    }

    if (isNaN(r.grade_status)) {
        msgData.code = 1;
        msgData.msg = "状态字段只能整数数字！";
        return res.json(msgData);
    }

    if (r.grade_status == 1 || r.grade_status == 0) {
        AdminGradeClass.findById(r.id).then(info => {
            // console.log(info)
            if (!info) {
                msgData.code = 1;
                msgData.msg = "当前数据不存在！";
                return res.json(msgData);
            }
            //构造编辑数据
            const updateInfo = {
                grade_name: r.grade_name,
                grade_sort: r.grade_sort,
                grade_status: r.grade_status
            }
            AdminGradeClass.findOne({
                grade_name: r.grade_name
            }).then(nameInfo => {
                if (!nameInfo || nameInfo._id == r.id) {
                    AdminGradeClass.updateOne(info, {
                        $set: updateInfo
                    }).then(editInfo => {
                        // console.log(editInfo)
                        msgData.msg = "更新成功";
                        return res.json(msgData);
                    })
                } else {
                    msgData.code = 1;
                    msgData.msg = "当前年级已存在！";
                    return res.json(msgData);
                }
            })

        })
    } else {
        msgData.code = 1;
        msgData.msg = "状态字段只能为0或1！";
        return res.json(msgData);
    }
})

// $route  GET api/admin/pages/grade/delete
// @desc   年级删除 /grade/delete
// @access public
router.get("/grade/delete/:id", (req, res) => {
    let r = req.params;
    console.log(r);
    if (Validator.isEmpty(r.id)) {
        msgData.code = 1;
        msgData.msg = "ID不能为空！";
        return res.json(msgData);
    }
    AdminGradeClass.remove({
        _id: r.id
    }).then(removeInfo => {
        if (removeInfo.n) {
            msgData.msg = "删除成功！";
            return res.json(msgData);
        } else {
            msgData.code = 1;
            msgData.msg = "删除失败！";
            return res.json(msgData);
        }
    })
})

// $route  POST api/admin/pages/plan/edit
// @desc   文件编辑 /plan/edit
// @access public
router.post("/plan/edit", (req, res) => {
    let r = req.body;
    r._id = !isEmpty(r._id) ? r._id : "";
    r.downloads = !isEmpty(r.downloads) ? r.downloads : 0;
    r.pageView = !isEmpty(r.pageView) ? r.pageView : 0;
    r.sortDate = !isEmpty(r.sortDate) ? r.sortDate : "";
    // console.log(r);

    if (Validator.isEmpty(r._id)) {
        msgData.code = 1;
        msgData.msg = "ID不能为空！";
        return res.json(msgData);
    }

    //数据查询
    MainContent.findById(r._id).then(data => {
        if (!data) {
            msgData.code = 1;
            msgData.msg = "数据不存在！";
            return res.json(msgData);
        }
        if (!data.shareState) {
            msgData.code = 1;
            msgData.msg = "无法删除个人私有数据！";
            return res.json(msgData);
        }

        //更新数据
        MainContent.updateOne(data, {
            $set: r
        }).then(editInfo => {
            if (editInfo) {
                msgData.msg = "更新成功";
                return res.json(msgData);
            }
        })
    })
})

// $route  GET api/admin/pages/plan/delete
// @desc   文件删除 plan/delete
// @access public
router.get("/plan/delete/:id", (req, res) => {
    let {
        id
    } = req.params;
    // console.log(id);
    id = !isEmpty(id) ? id : "";

    if (Validator.isEmpty(id)) {
        msgData.code = 1;
        msgData.msg = "ID不能为空！";
        return res.json(msgData);
    }

    //数据查询
    MainContent.findById(id).then(data => {
        if (!data) {
            msgData.code = 1;
            msgData.msg = "数据不存在！";
            return res.json(msgData);
        }
        //删除方法
        MainContent.remove({
            _id: id
        }).then(reInfo => {
            msgData.msg = "删除成功！";
            return res.json(msgData);
        })
    })

})

// $route  POST api/admin/pages/users/edit
// @desc   用户编辑 /users/edit
// @access public
router.post("/users/edit", (req, res) => {
    let r = req.body;
    r._id = !isEmpty(r._id) ? r._id : "";
    r.avatar = !isEmpty(r.avatar) ? r.avatar : "";
    r.username = !isEmpty(r.username) ? r.username : "";
    r.email = !isEmpty(r.email) ? r.email : "";
    console.log(r);

    if (Validator.isEmpty(r._id)) {
        msgData.code = 1;
        msgData.msg = "ID不能为空！";
        return res.json(msgData);
    }

    if (Validator.isEmpty(r.avatar)) {
        msgData.code = 1;
        msgData.msg = "用户图像不能为空！";
        return res.json(msgData);
    }
    if (Validator.isEmpty(r.username)) {
        msgData.code = 1;
        msgData.msg = "用户名称不能为空！";
        return res.json(msgData);
    }
    if (!Validator.isEmail(r.email)) {
        msgData.code = 1;
        msgData.msg = "邮箱不合法！";
        return res.json(msgData);
    }

    //数据查询
    MainUsers.findById(r._id).then(data => {
        if (!data) {
            msgData.code = 1;
            msgData.msg = "用户不存在！";
            return res.json(msgData);
        }
        MainUsers.findOne({
            email: data.email
        }).then(users => {
            if (users && users._id != r._id) {
                msgData.code = 1;
                msgData.msg = "当前邮箱已存在！";
                return res.json(msgData);
            }

            //更新用户数据
            MainUsers.where({
                _id: users._id
            }).update({
                $set: r
            }).then(editInfo => {
                if (editInfo) {
                    msgData.msg = "修改成功！";
                    return res.json(msgData);
                }
            })


            //更新对应数据
            // MainContent.find({
            //     filesUserID: users._id
            // }).then(conInfo => {
            //     console.log(conInfo)
            //     if (!conInfo) {
            //         //更新用户数据
            //         MainUsers.where({
            //             _id: users._id
            //         }).update({
            //             $set: r
            //         }).then(editInfo => {
            //             if (editInfo) {
            //                 msgData.msg = "修改成功！";
            //                 return res.json(msgData);
            //             }
            //         })
            //     } else {
            //         //更新用户数据
            //         MainUsers.where({
            //             _id: users._id
            //         }).update({
            //             $set: r
            //         }).then(editInfo => {
            //             if (editInfo) {
            //                 //更新对应文件数据
            //                 MainContent.where({
            //                     filesUserID: users._id
            //                 }).update({
            //                     authorName: r.authorName
            //                 }, false, true).then(conMsgs => {
            //                     if (conMsgs) {
            //                         msgData.msg = "修改成功！";
            //                         return res.json(msgData);
            //                     }
            //                 })
            //             }
            //         })
            //     }
            // })

            //更新用户数据
            // MainUsers.where({
            //     _id: users._id
            // }).update(r).then(editInfo => {
            //     if (editInfo) {
            //         //对应数据查询
            //         MainContent.find({
            //             filesUserID: users._id
            //         }).then(conData => {
            //             console.log(conData)
            //             if (!conData) {
            //                 msgData.msg = "修改成功！";
            //                 return res.json(msgData);
            //             } else {
            //                 //更新对应文件数据
            //                 MainContent.where({
            //                     filesUserID: users._id
            //                 }).update({
            //                     $set: {
            //                         authorName: "林飞飞22"
            //                     }
            //                 }, false, true).then(conMsgs => {
            //                     if (conMsgs) {
            //                         msgData.msg = "修改成功！";
            //                         return res.json(msgData);
            //                     }
            //                 })
            //             }
            //         })
            //     }
            // })


            // MainContent.update({
            //     filesUserID: users._id
            // }, {
            //     $set: {
            //         authorName: "林飞飞33"
            //     }
            // }, false, true).then(conMsgs => {
            //     if (conMsgs) {
            //         msgData.msg = "修改成功！";
            //         return res.json(msgData);
            //     }
            // })

        })

    })
})

// $route  GET api/admin/pages/users/delete
// @desc   用户删除 users/delete
// @access public
router.get("/users/delete/:id", (req, res) => {
    let {
        id
    } = req.params;
    console.log(id);
    id = !isEmpty(id) ? id : "";

    if (Validator.isEmpty(id)) {
        msgData.code = 1;
        msgData.msg = "ID不能为空！";
        return res.json(msgData);
    }

    //数据查询
    MainUsers.findById(id).then(data => {
        if (!data) {
            msgData.code = 1;
            msgData.msg = "用户不存在！";
            return res.json(msgData);
        }
        //删除方法
        MainUsers.remove({
            _id: id
        }).then(reInfo => {
            msgData.msg = "删除成功！";
            return res.json(msgData);
        })
    })

})

// $route  POST api/admin/users/loginout
// @desc   注销登录 loginout
// @access public
router.get("/loginout", (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            msgData.msg = "注销成功！";
            return res.json(msgData);
        }
        msgData.code = 1;
        msgData.msg = "注销失败！";
        return res.json(msgData);
    });
})

module.exports = router;