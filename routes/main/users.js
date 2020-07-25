const express = require("express");
const router = express.Router();

//登录 login
router.get("/login", (req, res) => {
    res.render("main/users/login", {
        title: "登录"
    })
})

//注册 register
router.get("/register", (req, res) => {
    res.render("main/users/register", {
        title: "注册"
    })
})

//忘记密码 forgetpwd
router.get("/forgetpwd", (req, res) => {
    res.render("main/users/forgetpwd", {
        title: "忘记密码"
    })
})

module.exports = router;