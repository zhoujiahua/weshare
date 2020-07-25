const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const gravatar = require('gravatar');
const Validator = require('validator');
const AdminUser = require("./../../../models/admin/AdminUser");

let msgData;
router.use((req, res, next) => {
    msgData = {
        code: 0,
        msg: ""
    }
    next();
})

// $route  POST api/admin/users/register
// @desc   用户注册 register
// @access public
router.post("/register", (req, res) => {
    let r = req.body;
    console.log(r);
    if (Validator.isEmpty(r.username)) {
        msgData.code = 1;
        msgData.msg = "用户名不能为空！";
        return res.json(msgData);
    }

    if (!Validator.isLength(r.username, {
            min: 3,
            max: 30
        })) {
        msgData.code = 1;
        msgData.msg = "用户名的长度不能小于3位并且不能大于30位!";
        return res.json(msgData);
    }

    if (Validator.isEmpty(r.email)) {
        msgData.code = 1;
        msgData.msg = "邮箱不能为空！";
        return res.json(msgData);
    }

    if (!Validator.isEmail(r.email)) {
        msgData.code = 1;
        msgData.msg = "邮箱不合法!";
        return res.json(msgData);
    }

    if (Validator.isEmpty(r.password)) {
        msgData.code = 1;
        msgData.msg = "密码不能为空!";
        return res.json(msgData);
    }

    if (!Validator.isLength(r.password, {
            min: 6,
            max: 30
        })) {
        msgData.code = 1;
        msgData.msg = "密码的长度不能小于6位并且不能大于30位!";
        return res.json(msgData);
    }

    if (Validator.isEmpty(r.password2)) {
        msgData.code = 1;
        msgData.msg = "确认密码不能为空!";
        return res.json(msgData);
    }

    if (!Validator.equals(r.password, r.password2)) {
        msgData.code = 1;
        msgData.msg = "两次不一致!";
        return res.json(msgData);
    }

    // 查询数据库中是否拥有邮箱
    AdminUser.findOne({
            username: r.username.toLowerCase()
        })
        .then((user) => {
            if (user) {
                msgData.code = 1;
                msgData.msg = "当前用户已存在！";
                return res.json(msgData);
            }

            //gravatar 头像
            const avatar = gravatar.url(r.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            const newUser = new AdminUser({
                username: r.username.toLowerCase(),
                email: r.email,
                avatar,
                password: r.password
            })

            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            msgData.msg = "注册成功！";
                            msgData.data = user;
                            return res.json(msgData);
                        })
                        .catch(err => console.log(err));
                });
            });
        })
})

// $route  POST api/admin/users/login
// @desc   用户登录 login
// @access public
router.post("/login", (req, res) => {
    let r = req.body;
    // console.log(r);

    if (Validator.isEmpty(r.username)) {
        msgData.code = 1;
        msgData.msg = "用户名不能为空！";
        return res.json(msgData);
    }

    if (Validator.isEmpty(r.password)) {
        msgData.code = 1;
        msgData.msg = "密码不能为空!";
        return res.json(msgData);
    }

    // 查询数据库
    AdminUser.findOne({
            username: r.username
        })
        .then(user => {
            if (!user) {
                msgData.code = 1;
                msgData.msg = "当前用户不存在!";
                return res.json(msgData);
            }

            // 密码匹配
            bcrypt.compare(r.password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        req.session.aid = user._id;
                        msgData.msg = "登录成功！";
                        msgData.data = user;
                        return res.json(msgData);
                    } else {
                        msgData.code = 1;
                        msgData.msg = "密码错误!";
                        return res.json(msgData);
                    }
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