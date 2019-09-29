const express = require("express");
const router = express.Router();

//后台登录
router.get("/login", (req, res) => {
    res.render("admin/users/login", {
        title: "后台登录"
    })
})

//后台注册
router.get("/register", (req, res) => {
    res.render("admin/users/register", {
        title: "后台登录"
    })
})

//重置密码
router.get("/repass", (req, res) => {
    res.render("admin/users/repass", {
        title: "后台登录"
    })
})

module.exports = router;