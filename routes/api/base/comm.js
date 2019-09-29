const express = require("express");
const router = express.Router();
const Validator = require("validator");
const sendEmail = require("./../../../comm/nodemailer");
const isEmpty = require("./../../../validation/is-empty");
const Tools = require("./../../../comm/tools");
const MainUsers = require("./../../../models/main/MainUsers");
const AdminSubjectClass = require("./../../../models/admin/AdminSubjectClass");
const AdminGradeClass = require("./../../../models/admin/AdminGradeClass");

//验证信息
let msgData;
router.use((res, req, next) => {
    msgData = {
        code: 0,
        msg: ""
    }
    next();
})

// $route  GET api/base/comm/email
// @desc   返回的请求的json数据
// @access public  邮件发送
router.post("/email", (req, res) => {
    let r = req.body;
    const emailConfig = {
        from: "<blooocn@163.com>",
        to: r.email,
        secure: true,
        subject: "重置密码", //主题
        // text: "How are you! 123456", //文本消息
        html: `<p>Very Good!您当前的验证码是：${123456} 请妥善保管！</p>` //html消息
    }
    email(emailConfig).then((info) => {
        res.json(info);
    }).catch(console.error)
})

// $route  GET api/base/comm/vercode
// @desc   返回的请求的json数据
// @access public  发送验证码
router.post("/vercode", (req, res) => {
    let {
        email
    } = req.body, vercode = Tools.generateMixed(4, 9);
    email = !isEmpty(email) ? email.toLowerCase() : "";
    if (!Validator.isEmail(email)) {
        msgData.code = 1;
        msgData.msg = "用户邮箱不合法！"
        return res.json(msgData);
    }

    MainUsers.findOne({
            email
        })
        .then(userInfo => {
            if (userInfo) {
                msgData.code = 1;
                msgData.msg = "当前邮箱已注册，请更换邮箱！"
                return res.json(msgData);
            }
            const emailConfig = {
                from: "<blooocn@163.com>",
                to: email,
                secure: true,
                subject: "用户注册验证", //主题
                // text: "How are you! 123456", //文本消息
                html: `<p>尊敬用户，您当前的验证码是：${vercode} 请妥善保管！</p><p><a href="//blooo.cn" target="_blank" >小掌部落陕西分公司</a></p>` //html消息
            }
            sendEmail(emailConfig).then((sendInfo) => {
                if (sendInfo.responseCode) {
                    msgData.msg = "验证码已发送失败！";
                    msgData.info = sendInfo;
                    return res.json(msgData);
                } else {
                    msgData.msg = "验证码已发送成功，请注意查收！";
                    msgData.info = sendInfo;
                    req.session.vercode = vercode;
                    console.log(req.session.recode);
                    return res.json(msgData);
                }
            }).catch(err => console.log(err))
        })
})

// $route  GET api/base/comm/repasscode
// @desc   返回的请求的json数据
// @access public  发送验证码
router.post("/recode", (req, res) => {
    let {
        email
    } = req.body, recode = Tools.generateMixed(4, 9);
    email = !isEmpty(email) ? email.toLowerCase() : "";
    if (!Validator.isEmail(email)) {
        msgData.code = 1;
        msgData.msg = "用户邮箱不合法！"
        return res.json(msgData);
    }
    MainUsers.findOne({
            email
        })
        .then(userInfo => {
            if (!userInfo) {
                msgData.code = 1;
                msgData.msg = "当前用户不存在，请输入正确的邮箱！"
                return res.json(msgData);
            }
            const emailConfig = {
                from: "<blooocn@163.com>",
                to: email,
                secure: true,
                subject: "密码重置验证", //主题
                // text: "How are you! 123456", //文本消息
                html: `<p>尊敬用户，您正在进行密码重置操作，当前的验证码是：${recode} 请妥善保管！</p><p><a href="//blooo.cn" target="_blank" >小掌部落陕西分公司</a></p>` //html消息
            }
            sendEmail(emailConfig).then((sendInfo) => {
                if (sendInfo.responseCode) {
                    msgData.msg = "验证码已发送失败！";
                    msgData.info = sendInfo;
                    return res.json(msgData);
                } else {
                    msgData.msg = "验证码已发送成功，请注意查收！";
                    msgData.info = sendInfo;
                    req.session.recode = recode;
                    console.log(req.session.recode);
                    return res.json(msgData);
                }
            }).catch(err => console.log(err))
        })
})

// $route  GET api/base/comm/subject
// @desc   返回的请求的json数据
// @access public  学科数据
router.get("/subject", (req, res) => {
    AdminSubjectClass.find().sort({
            subject_sort: "asc"
        })
        .then(data => {
            if (data) {
                msgData.msg = "数据请求成功！";
                msgData.data = data;
                return res.json(msgData);
            }
        })
})

// $route  GET api/base/comm/grade
// @desc   返回的请求的json数据
// @access public  年级数据
router.get("/grade", (req, res) => {
    AdminGradeClass.find().sort({
            grade_sort: "asc"
        })
        .then(data => {
            if (data) {
                msgData.msg = "数据请求成功！";
                msgData.data = data;
                return res.json(msgData);
            }
        })
})

module.exports = router;