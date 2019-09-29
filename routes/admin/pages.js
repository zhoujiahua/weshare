const express = require("express");
const router = express.Router();
const tools = require("./../../comm/tools");
const AdminUser = require("./../../models/admin/AdminUser");

let msgData, aid;
router.use((req, res, next) => {
    msgData = {
        code: 0,
        msg: ""
    }
    next();
})

router.use((req, res, next) => {
    aid = req.session.aid;
    if (aid) {
        next();
    } else {
        res.redirect("/admin/users/login");
    }
})

//后台管理
router.get("/", (req, res) => {
    AdminUser.findById(aid).then(users => {
        users.password = null;
        res.render("admin/admin", {
            title: "后台管理",
            data: users
        })
    })
})

//后台主页
router.get("/home", (req, res) => {
    res.render("admin/pages/home", {
        title: "后台主页"
    })
})

//用户管理
router.get("/users", (req, res) => {
    res.render("admin/pages/users", {
        title: "用户管理"
    })
})

//文件管理
router.get("/plan", (req, res) => {
    res.render("admin/pages/plan", {
        title: "文件管理"
    })
})

//学科设置
router.get("/subject", (req, res) => {
    res.render("admin/pages/subject", {
        title: "学科设置"
    });
})

//年级设置
router.get("/grade", (req, res) => {
    res.render("admin/pages/grade", {
        title: "年级设置"
    })
})

//个人信息
router.get("/infos", (req, res) => {
    res.render("admin/pages/infos", {
        title: "个人信息"
    })
})

//系统设置
router.get("/system", (req, res) => {
    res.render("admin/pages/system", {
        title: "系统设置"
    })
})

module.exports = router;