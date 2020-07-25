// @login & register 
const express = require("express");
const router = express.Router();
const Validator = require("validator");
const bcrypt = require("bcrypt");
const avatar = require("gravatar");
const Tools = require("./../../../comm/tools");
const sendEmail = require("./../../../comm/nodemailer");
const isEmpty = require("./../../../validation/is-empty");
const MainUsers = require("../../../models/main/MainUsers");

//验证信息
let msgData;
router.use((res, req, next) => {
    msgData = {
        code: 0,
        msg: ""
    }
    next();
})

// $route  GET /api/main/users/test
// @desc   返回的请求的json数据
// @access public  测试接口
router.get("/test", (req, res) => {
    res.json("Hello World!");
})

// $route  GET /api/main/users/login
// @desc   返回的请求的json数据
// @access public  登录
router.post("/login", (req, res) => {
    let {
        email,
        password
    } = req.body;

    email = !isEmpty(email) ? email.toLowerCase() : "";
    password = !isEmpty(password) ? password : "";

    if (!Validator.isEmail(email)) {
        msgData.code = 1;
        msgData.msg = "用户邮箱不合法！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(password) || password.length < 6) {
        msgData.code = 1;
        msgData.msg = "密码不能为空并且不能少于6位！"
        return res.json(msgData);
    }

    //登录查询
    MainUsers.findOne({
        email
    }).then((userInfo) => {
        if (!userInfo) {
            msgData.code = 1;
            msgData.msg = "当前用户不存在！"
            return res.json(msgData);
        }

        //登录校验
        bcrypt.compare(password, userInfo.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                req.session.userid = userInfo._id;
                msgData.msg = "恭喜你，登录成功！"
                msgData.users = {
                    id: userInfo._id,
                    username: userInfo.username,
                    email: userInfo.email,
                    avatar: userInfo.avatar
                };
                return res.json(msgData);
            } else {
                msgData.code = 1;
                msgData.msg = "登录密码不正确请重新输入！"
                return res.json(msgData);
            }
        })
    })
})

// $route  GET /api/main/users/register
// @desc   返回的请求的json数据
// @access public  注册
router.post("/register", (req, res) => {
    let {
        username,
        email,
        password,
        password2,
        vercode
    } = req.body;
    username = !isEmpty(username) ? username : "";
    email = !isEmpty(email) ? email.toLowerCase() : "";
    password = !isEmpty(password) ? password : "";
    vercode = !isEmpty(vercode) ? vercode.toLowerCase() : "";

    if (Validator.isEmpty(username) || username.length < 3) {
        msgData.code = 1;
        msgData.msg = "用户名不能为空并且不能少于3位！"
        return res.json(msgData);
    }
    if (!Validator.isEmail(email)) {
        msgData.code = 1;
        msgData.msg = "邮箱不合法！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(password) || password.length < 6) {
        msgData.code = 1;
        msgData.msg = "密码不能为空并且不能少于6位！"
        return res.json(msgData);
    }
    if (password != password2) {
        msgData.code = 1;
        msgData.msg = "两次密码输入不一致请重新输入！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(vercode)) {
        msgData.code = 1;
        msgData.msg = "验证码不能为空！"
        return res.json(msgData);
    }
    if (req.session.vercode != vercode) {
        msgData.code = 1;
        msgData.msg = "验证码有误，请重新输入！"
        return res.json(msgData);
    }

    const newUser = new MainUsers({
        username,
        email,
        password,
        avatar
    })

    //密码加密
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            //password hash
            newUser.password = hash;

            //gravatar 用户图像
            newUser.avatar = avatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            //存储方法
            MainUsers.findOne({
                email
            }).then(findInfo => {
                if (findInfo) {
                    msgData.code = 1;
                    msgData.msg = "当前邮箱已被注册！"
                    return res.json(msgData);
                }
                newUser.save().then((userInfo) => {
                    if (userInfo) {
                        msgData.msg = "恭喜你，用户注册成功！";
                        msgData.info = userInfo;
                        res.json(msgData);
                    }
                }).catch(err => console.log(err))
            })
        })
    })
})

// $route  GET /api/main/users/forgetpwd
// @desc   返回的请求的json数据
// @access public  忘记密码
router.post("/forgetpwd", (req, res) => {
    let {
        email,
        vercode
    } = req.body;
    email = !isEmpty(email) ? email.toLowerCase() : "";
    vercode = !isEmpty(vercode) ? vercode : "";

    if (!Validator.isEmail(email)) {
        msgData.code = 1;
        msgData.msg = "邮箱不合法！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(vercode)) {
        msgData.code = 1;
        msgData.msg = "验证码不能为空！"
        return res.json(msgData);
    }
    if (req.session.recode != vercode) {
        msgData.code = 1;
        msgData.msg = "验证码有误，请重新输入！"
        return res.json(msgData);
    }

    //密码重置
    MainUsers.findOne({
            email
        })
        .then(userInfo => {
            if (!userInfo) {
                msgData.code = 1;
                msgData.msg = "当前用户不存在！";
                return res.json(msgData);
            } else {
                //重置密码加密
                let repwd = Tools.getRandomString(6);
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(repwd, salt, (err, hash) => {
                        if (err) throw err;
                        MainUsers.updateOne(userInfo, {
                            $set: {
                                password: hash
                            }
                        }).then(repasInfo => {
                            if (!repasInfo) throw err;
                            const emailConfig = {
                                from: "<blooocn@163.com>",
                                to: userInfo.email,
                                secure: true,
                                subject: "密码重置", //主题
                                // text: "How are you! 123456", //文本消息
                                html: `<p>尊敬用户，您的账户密码重置成功！当前密码为：${repwd} 请妥善保管！</p><p><a href="//blooo.cn" target="_blank" >小掌部落陕西分公司</a></p>` //html消息
                            }
                            sendEmail(emailConfig).then((sendInfo) => {
                                if (sendInfo.responseCode) {
                                    msgData.msg = "密码重置失败，请稍后重试！";
                                    msgData.info = sendInfo;
                                    return res.json(msgData);
                                } else {
                                    msgData.msg = "密码重置成功已发送至您的邮箱，请注意查收！";
                                    msgData.info = sendInfo;
                                    msgData.pwd = repwd;
                                    return res.json(msgData);
                                }
                            }).catch(err => console.log(err))
                        })
                    })
                })
            }
        })
})

// $route  GET /api/main/users/repass
// @desc   返回的请求的json数据
// @access public  修改密码
router.post("/repass", (req, res) => {
    let {
        oldpass,
        newpass,
        newpass2
    } = req.body;
    oldpass = !isEmpty(oldpass) ? oldpass : "";
    newpass = !isEmpty(newpass) ? newpass : "";
    newpass2 = !isEmpty(newpass2) ? newpass2 : "";

    if (Validator.isEmpty(oldpass)) {
        msgData.code = 1;
        msgData.msg = "原始密码不能为空！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(newpass)) {
        msgData.code = 1;
        msgData.msg = "新密码码不能为空！"
        return res.json(msgData);
    }
    if (newpass2 != newpass) {
        msgData.code = 1;
        msgData.msg = "两次密码不一致！"
        return res.json(msgData);
    }

    //密码修改
    MainUsers.findById(req.session.userid).then(userInfo => {
        bcrypt.compare(oldpass, userInfo.password, (err, isMatch) => { //密码校验
            if (err) throw err;
            if (isMatch) {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newpass, salt, (err, hash) => {
                        if (err) throw err;
                        MainUsers.updateOne(userInfo, {
                            $set: {
                                password: hash
                            }
                        }).then(repasInfo => {
                            if (repasInfo) {
                                msgData.msg = "密码修改成功！";
                                msgData.pwd = repasInfo;
                                return res.json(msgData);
                            }
                        })
                    })
                })
            } else {
                msgData.code = 1;
                msgData.msg = "原始密码不正确请重新输入！"
                return res.json(msgData);
            }
        })
    })

})

// $route  GET /api/main/users/loginout
// @desc   返回的请求的json数据
// @access public  用户注销
router.get("/loginout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            msgData.code = 1;
            msgData.msg = "用户注销失败！";
            msgData.err = err;
            return res.json(msgData);
        } else {
            msgData.msg = "用户注销成功！";
            return res.json(msgData);
        }
    })
})


module.exports = router;