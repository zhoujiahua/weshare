const express = require("express");
const router = express.Router();
const Validator = require("validator");
const isEmpty = require("../../../validation/is-empty");
const MainContent = require("./../../../models/main/MainContent");
const MainUsers = require("./../../../models/main/MainUsers");

//验证信息 用户 ID
let msgData, userid;
router.use((res, req, next) => {
    msgData = {
        code: 0,
        msg: ""
    }
    next();
})

//状态拦截
// router.use((req, res, next) => {
//     userid = req.session.userid;
//     next();
// })

router.use((req, res, next) => {
    userid = req.session.userid;
    if (userid) {
        next();
    } else {
        msgData.code = 1;
        msgData.msg = "您没有权限请求当前数据！";
        return res.json(msgData);
    }
})

// $route  GET api/base/reload/userinfo
// @desc   返回的请求的json数据
// @access public  用户信息
router.get("/userinfo", (req, res) => {
    MainUsers.findById(userid).then(users => {
        if (!users) {
            msgData.msg = "用户不存在！";
            msgData.data = users;
            return res.json(msgData);
        }
        users.password = null;
        msgData.msg = "数据请求成功！";
        msgData.data = users;
        return res.json(msgData);
    })
})

// $route  GET api/base/reload/personal
// @desc   返回的请求的json数据
// @access public  个人文件数据
router.get("/personal", (req, res) => {
    let {
        filesUserID,
        page,
        limit
    } = req.query;

    MainContent.find({
        filesUserID
    }).count().then(count => {
        if (!count) {
            msgData.msg = "当前暂无数据！";
            msgData.count = 0;
            msgData.data = [];
            return res.json(msgData);
        }
        MainContent.find({
            filesUserID
        }).skip(limit * (Number(page) ? page - 1 : 0)).limit(Number(limit)).sort({
            createDate: "desc"
        }).then(info => {
            if (info) {
                msgData.msg = "数据请求成功！";
                msgData.count = count;
                msgData.data = info;
                return res.json(msgData);
            }
        })
    })
})

// $route  GET api/base/reload/public
// @desc   返回的请求的json数据
// @access public  公共文件
router.get("/public", (req, res) => {
    let {
        page,
        limit
    } = req.query;
    page = !isEmpty(page) ? page : "";
    limit = !isEmpty(limit) ? limit : "";

    if (Validator.isEmpty(page)) {
        msgData.code = 1;
        msgData.msg = "页码不能为空！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(limit)) {
        msgData.code = 1;
        msgData.msg = "条数不能为空！"
        return res.json(msgData);
    }

    MainContent.find({
        shareState: true
    }).count().then(count => {
        if (!count) {
            msgData.msg = "当前暂无数据！";
            msgData.count = 0;
            msgData.data = [];
            return res.json(msgData);
        }
        MainContent.find({
            shareState: true
        }).skip(limit * (Number(page) ? page - 1 : 0)).limit(Number(limit)).sort({
            createDate: "desc"
        }).then(info => {
            if (info) {
                msgData.msg = "数据请求成功！";
                msgData.count = count;
                msgData.data = info;
                return res.json(msgData);
            }
        })
    })

})

// $route  GET api/base/reload/hotdata
// @desc   返回的请求的json数据
// @access public  热点数据
router.get("/hotdata", (req, res) => {
    let {
        page,
        limit
    } = req.query;
    page = !isEmpty(page) ? page : "";
    limit = !isEmpty(limit) ? limit : "";

    if (Validator.isEmpty(page)) {
        msgData.code = 1;
        msgData.msg = "页码不能为空！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(limit)) {
        msgData.code = 1;
        msgData.msg = "条数不能为空！"
        return res.json(msgData);
    }

    //查询条件
    const findKey = {
        shareState: true
    }

    //数据条数返回
    MainContent.find(findKey).count((err, data) => {
        if (err) throw err;
        if (!err && data != 0) return data;
        if (!err && data === 0) {
            msgData.msg = "当前暂无数据！";
            msgData.count = 0;
            msgData.data = [];
            return res.json(msgData);
        }
    }).then(count => {
        //数据返回
        MainContent.find(findKey).skip(limit * (Number(page) ? page - 1 : 0)).limit(Number(limit)).sort({
                pageView: "desc"
            })
            .then(data => {
                if (data) {
                    msgData.msg = "数据请求成功！";
                    msgData.count = count;
                    msgData.data = data;
                    return res.json(msgData);
                }
            })
    })
})

// $route  GET api/base/reload/topdata
// @desc   返回的请求的json数据
// @access public  置顶推送轮播
router.get("/topdata", (req, res) => {
    let {
        page,
        limit
    } = req.query;
    page = !isEmpty(page) ? page : "";
    limit = !isEmpty(limit) ? limit : "";

    if (Validator.isEmpty(page)) {
        msgData.code = 1;
        msgData.msg = "页码不能为空！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(limit)) {
        msgData.code = 1;
        msgData.msg = "条数不能为空！"
        return res.json(msgData);
    }

    //查询条件
    const findKey = {
        shareState: true
    }

    //数据条数返回
    MainContent.find(findKey).count((err, data) => {
        if (err) throw err;
        if (!err && data != 0) return data;
        if (!err && data === 0) {
            msgData.msg = "当前暂无数据！";
            msgData.count = 0;
            msgData.data = [];
            return res.json(msgData);
        }
    }).then(count => {
        //数据返回
        MainContent.find(findKey).skip(limit * (Number(page) ? page - 1 : 0)).limit(Number(limit)).sort({
                sortDate: "desc"
            })
            .then(data => {
                if (data) {
                    msgData.msg = "数据请求成功！";
                    msgData.count = count;
                    msgData.data = data;
                    return res.json(msgData);
                }
            })
    })
})

// $route  GET api/base/reload/delete
// @desc   返回的请求的json数据
// @access public  个人文件数据删除
router.get("/delete", (req, res) => {
    let {
        mainid,
        fileid
    } = req.query;
    mainid = !isEmpty(mainid) ? mainid : "";
    fileid = !isEmpty(fileid) ? fileid : "";

    if (Validator.isEmpty(mainid)) {
        msgData.code = 1;
        msgData.msg = "用户ID不能为空"
        return res.json(msgData);
    }
    if (Validator.isEmpty(fileid)) {
        msgData.code = 1;
        msgData.msg = "文件ID不能为空！"
        return res.json(msgData);
    }
    //数据查询
    MainContent.findById(fileid).then(data => {
        if (!data) {
            msgData.msg = "数据不存在！";
            msgData.data = data;
            return res.json(msgData);
        }
        if (data.filesUserID != mainid) {
            msgData.code = 1;
            msgData.msg = "用户ID不匹配！"
            return res.json(msgData);
        }
        if (data.shareState) {
            msgData.code = 1;
            msgData.msg = "当前数据处于共享状态无法删除！"
            return res.json(msgData);
        } else {
            MainContent.findById(fileid).remove().then(state => {
                if (state) {
                    msgData.msg = "数据删除成功！";
                    msgData.data = data;
                    msgData.state = state;
                    return res.json(msgData);
                }
            })
        }
    })
})

module.exports = router;