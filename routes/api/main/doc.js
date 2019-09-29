const express = require("express");
const router = express.Router();
const Validator = require("validator");
const isEmpty = require("./../../../validation/is-empty");
const MainContent = require("../../../models/main/MainContent");

//验证信息
let msgData;
router.use((res, req, next) => {
    msgData = {
        code: 0,
        msg: ""
    }
    next();
})

// $route  GET api/main/doc/test
// @desc   返回的请求的json数据
// @access public  测试接口
router.get("/test", (req, res) => {
    res.json("Hello World!");
})

// $route  GET api/main/doc/add
// @desc   返回的请求的json数据
// @access public  文档上传
router.post("/add", (req, res) => {
    let {
        titleName,
        authorName,
        subjectName,
        gradeName,
        shareState,
        coverImg,
        introText,
        attachment,
        createDate,
        sortDate
    } = req.body;

    titleName = !isEmpty(titleName) ? titleName : "";
    authorName = !isEmpty(authorName) ? authorName : "";
    subjectName = !isEmpty(subjectName) ? subjectName : "";
    gradeName = !isEmpty(gradeName) ? gradeName : "";
    shareState = !isEmpty(shareState) ? shareState : "";
    coverImg = !isEmpty(coverImg) ? coverImg : "";
    introText = !isEmpty(introText) ? introText : "";
    attachment = !isEmpty(attachment) ? attachment : "";
    createDate = !isEmpty(createDate) ? createDate : "";
    sortDate = !isEmpty(sortDate) ? sortDate : "";

    if (Validator.isEmpty(titleName)) {
        msgData.code = 1;
        msgData.msg = "文档标题不能为空！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(authorName)) {
        msgData.code = 1;
        msgData.msg = "文档作者不能为空！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(subjectName)) {
        msgData.code = 1;
        msgData.msg = "学科不能为空！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(gradeName)) {
        msgData.code = 1;
        msgData.msg = "年级不能为空！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(coverImg)) {
        msgData.code = 1;
        msgData.msg = "封面不能为空！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(introText)) {
        msgData.code = 1;
        msgData.msg = "简介不能为空！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(attachment)) {
        msgData.code = 1;
        msgData.msg = "附件不能为空！"
        return res.json(msgData);
    }

    //构造内容
    const newContent = new MainContent({
        filesUserID: req.session.userid,
        titleName,
        authorName,
        subjectName,
        gradeName,
        shareState,
        coverImg,
        introText,
        attachment,
        createDate,
        sortDate
    })

    //存储方法
    newContent.save()
        .then(contentInfo => {
            if (contentInfo) {
                msgData.msg = "文件上传成功！";
                msgData.data = contentInfo;
                return res.json(msgData);
            }
        })
})

// $route  POST api/main/doc/edit
// @desc   返回的请求的json数据
// @access public  编辑页面数据
router.post("/edit", (req, res) => {
    let {
        id,
        mainid,
        titleName,
        authorName,
        subjectName,
        gradeName,
        shareState,
        coverImg,
        introText,
        attachment,
        createDate,
    } = req.body;

    id = !isEmpty(id) ? id : "";
    mainid = !isEmpty(mainid) ? mainid : "";
    titleName = !isEmpty(titleName) ? titleName : "";
    authorName = !isEmpty(authorName) ? authorName : "";
    subjectName = !isEmpty(subjectName) ? subjectName : "";
    gradeName = !isEmpty(gradeName) ? gradeName : "";
    shareState = !isEmpty(shareState) ? shareState : "";
    coverImg = !isEmpty(coverImg) ? coverImg : "";
    introText = !isEmpty(introText) ? introText : "";
    attachment = !isEmpty(attachment) ? attachment : "";
    createDate = !isEmpty(createDate) ? createDate : "";

    if (Validator.isEmpty(id)) {
        msgData.code = 1;
        msgData.msg = "文档ID不能为空！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(mainid)) {
        msgData.code = 1;
        msgData.msg = "用户ID不能为空！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(titleName)) {
        msgData.code = 1;
        msgData.msg = "文档标题不能为空！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(authorName)) {
        msgData.code = 1;
        msgData.msg = "文档作者不能为空！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(subjectName)) {
        msgData.code = 1;
        msgData.msg = "学科不能为空！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(gradeName)) {
        msgData.code = 1;
        msgData.msg = "年级不能为空！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(coverImg)) {
        msgData.code = 1;
        msgData.msg = "封面不能为空！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(introText)) {
        msgData.code = 1;
        msgData.msg = "简介不能为空！"
        return res.json(msgData);
    }
    if (Validator.isEmpty(createDate)) {
        msgData.code = 1;
        msgData.msg = "发布时间不能为空！"
        return res.json(msgData);
    }

    //构造内容
    const editContent = {
        filesUserID: req.session.userid,
        titleName,
        authorName,
        subjectName,
        gradeName,
        shareState,
        coverImg,
        introText,
        attachment,
        createDate
    }

    MainContent.findById(id).then(data => {
        if (!data) {
            msgData.code = 1;
            msgData.msg = "当前数据不存在！";
            return res.json(msgData);
        }
        if (data.filesUserID != mainid) {
            msgData.code = 1;
            msgData.msg = "用户ID不匹配！";
            return res.json(msgData);
        } else {
            MainContent.updateOne(data, {
                $set: editContent
            }).then(editInfo => {
                if (editInfo) {
                    msgData.msg = "数据更新成功!";
                    msgData.data = editInfo;
                    return res.json(msgData);
                }
            })
        }
    })

})

// $route  GET api/main/doc/detail
// @desc   返回的请求的json数据
// @access public  详情页面
router.get("/detail", (req, res) => {
    res.json("详情页面");
})

// $route  GET api/main/doc/search
// @desc   返回的请求的json数据
// @access public  检索接口
router.get("/search", (req, res) => {
    let {
        key,
        type,
        page,
        limit,
        sorts,
        subject,
        grade
    } = req.query, sortKey = {}, findKey = {};

    key = !isEmpty(key) ? key : "";
    type = !isEmpty(type) ? type : "";
    page = !isEmpty(page) ? page : "";
    limit = !isEmpty(limit) ? limit : "";
    sorts = !isEmpty(sorts) ? sorts : "";
    subject = !isEmpty(subject) ? subject : "";
    grade = !isEmpty(grade) ? grade : "";

    if (Validator.isEmpty(key)) {
        msgData.code = 1;
        msgData.msg = "检索内容不能为空！";
        return res.json(msgData);
    }
    if (Validator.isEmpty(type)) {
        msgData.code = 1;
        msgData.msg = "检索类型不能为空！";
        return res.json(msgData);
    }
    if (Validator.isEmpty(page)) {
        msgData.code = 1;
        msgData.msg = "分页不能为空！";
        return res.json(msgData);
    }
    if (Validator.isEmpty(limit)) {
        msgData.code = 1;
        msgData.msg = "展示条数不能为空！";
        return res.json(msgData);
    }

    //排序条件
    sortKey = sorts ? JSON.parse(sorts) : {
        createDate: "desc"
    };

    //检索条件
    Number(type) === 0 ? findKey.titleName = new RegExp(key) : findKey.authorName = new RegExp(key);
    subject ? findKey.subjectName = subject : "";
    grade ? findKey.gradeName = grade : "";
    findKey.shareState = true;

    console.log(subject, grade);

    //数据查询
    MainContent.find(findKey).count().then(count => {
        if (!count) {
            msgData.msg = "当前暂无数据！";
            msgData.count = 0;
            msgData.data = [];
            return res.json(msgData);
        }
        MainContent.find(findKey).skip(limit * (Number(page) ? page - 1 : 0)).limit(Number(limit)).sort(sortKey).then(data => {
            if (data) {
                msgData.msg = "数据请求成功！";
                msgData.count = count;
                msgData.data = data;
                return res.json(msgData);
            }
        })
    })

})


// $route  GET api/main/doc/likedata
// @desc   返回的请求的json数据
// @access public  模糊查询
router.get("/likedata", (req, res) => {
    let {
        key,
        title
    } = req.query, queryStr = {};
    queryStr.authorName = new RegExp(key);
    queryStr.titleName = new RegExp(title);

    MainContent.find(queryStr).then(info => {
        res.json(info);
    })

})

// $route  GET api/main/doc/commlist
// @desc   返回的请求的json数据
// @access public  检索接口
router.get("/commlist", (req, res) => {
    let {
        page,
        limit,
        sorts,
        subject,
        grade
    } = req.query, sortKey = {}, findKey = {};

    page = !isEmpty(page) ? page : "";
    limit = !isEmpty(limit) ? limit : "";
    sorts = !isEmpty(sorts) ? sorts : "";
    subject = !isEmpty(subject) ? subject : "";
    grade = !isEmpty(grade) ? grade : "";

    if (Validator.isEmpty(page)) {
        msgData.code = 1;
        msgData.msg = "分页不能为空！";
        return res.json(msgData);
    }
    if (Validator.isEmpty(limit)) {
        msgData.code = 1;
        msgData.msg = "展示条数不能为空！";
        return res.json(msgData);
    }

    //排序条件
    sortKey = sorts ? JSON.parse(sorts) : {
        createDate: "desc"
    };

    //检索条件
    findKey.shareState = true;
    subject ? findKey.subjectName = subject : "";
    grade ? findKey.gradeName = grade : "";

    //数据查询
    MainContent.find(findKey).count().then(count => {
        if (!count) {
            msgData.msg = "当前暂无数据！";
            msgData.count = 0;
            msgData.data = [];
            return res.json(msgData);
        }
        MainContent.find(findKey).skip(limit * (Number(page) ? page - 1 : 0)).limit(Number(limit)).sort(sortKey).then(data => {
            if (data) {
                msgData.msg = "数据请求成功！";
                msgData.count = count;
                msgData.data = data;
                return res.json(msgData);
            }
        })
    })

})


// $route  GET api/main/doc/count
// @desc   返回的请求的json数据
// @access public  浏览下载统计
router.get("/count", (req, res) => {
    let {
        id,
        types
    } = req.query;

    id = !isEmpty(id) ? id : "";
    types = !isEmpty(types) ? types : "0";

    if (Validator.isEmpty(id)) {
        msgData.code = 1;
        msgData.msg = "ID不能为空！";
        return res.json(msgData);
    }
    if (Validator.isEmpty(types)) {
        msgData.code = 1;
        msgData.msg = "类型不能为空！";
        return res.json(msgData);
    }
    // if (!req.session.flagID) {
    //     msgData.code = 1;
    //     msgData.msg = "不能重复记录数量！";
    //     return res.json(msgData);
    // }

    //数据查询
    let setData = {}; //构造记录条件
    MainContent.findById(id).then(data => {
        if (!data) {
            msgData.code = 1;
            msgData.msg = "数据不存在！";
            return res.json(msgData);
        }
        Number(types) ? setData.downloads = data.downloads + 1 : setData.pageView = data.pageView + 1;
        //更新方法
        MainContent.where({
                _id: data._id
            }).updateOne(setData)
            .then(msgs => {
                msgData.msg = "记录成功！";
                msgData.data = msgs;
                return res.json(msgData);
            })
    })
})

module.exports = router;