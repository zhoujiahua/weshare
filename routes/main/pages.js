const express = require("express");
const router = express.Router();
const tools = require("./../../comm/tools");
const MainUsers = require("./../../models/main/MainUsers");
const MainContent = require("./../../models/main/MainContent");

//用户ID
let userid;

//状态拦截
router.use((req, res, next) => {
    userid = req.session.userid;
    if (userid) {
        next();
    } else {
        res.redirect("/users/login");
    }
})

//用户主页 index
router.get("/index", (req, res) => {
    res.render("main/index", {
        title: "主页",
        data: {},
        msg: "当前暂无内容..."
    })

})

//优秀文件 excellent
router.get("/excellent", (req, res) => {
    res.render("main/excellent", {
        title: "优秀文件",
        data: {},
        msg: "当前暂无内容..."
    })
})

//个人文件 individual
router.get("/individual", (req, res) => {
    res.render("main/individual", {
        title: "个人文件",
        data: {},
        msg: "当前暂无内容..."
    })
})

//公共文件 common
router.get("/common", (req, res) => {
    res.render("main/common", {
        title: "公共文件",
        data: {},
        msg: "当前暂无内容..."
    })
})

//检索页面 search
router.get("/search", (req, res) => {
    res.render("main/search", {
        title: "检索页面",
        data: {},
        msg: "当前暂无内容..."
    })
})

//上传页面 add
router.get("/add", (req, res) => {
    res.render("main/doc/add", {
        title: "文件上传",
        data: {},
        msg: "当前暂无内容..."
    })
})

//编辑页面 edit
router.get("/edit/:id", (req, res) => {
    let {
        id
    } = req.params;
    MainContent.findById(id).then(data => {
        res.render("main/doc/edit", {
            title: "编辑页面",
            data,
            tools,
            msg: "当前暂无内容..."
        })
    })
})

//详情页面 detail
router.get("/detail/:id", (req, res) => {
    let {
        id
    } = req.params;
    MainContent.findById(id).then(data => {
        res.render("main/doc/detail", {
            title: "详情页面",
            data,
            tools,
            msg: "当前暂无内容..."
        })
    })
})

//修改密码页面 repass
router.get("/repass", (req, res) => {
    res.render("main/repass", {
        title: "修改密码",
        data: {},
        msg: "当前暂无内容..."
    })
})

module.exports = router;