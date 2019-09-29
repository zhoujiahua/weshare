const express = require('express');
const router = express.Router();
const Validator = require("validator");
const fs = require("fs");
const multer = require('multer');
const pathUpload = multer({
    dest: 'uploads/'
});
const isEmpty = require("./../../validation/is-empty");

//统一返回信息
let msgData;
router.use((req, res, next) => {
    msgData = {
        code: 0,
        msg: ""
    }
    next();
})

//封面文件上传
router.post('/monofile', multer({
    //设置文件存储路径 upload文件如果不存在则会自己创建一个。
    dest: 'uploads/doccover'
}).single('file'), (req, res, next) => {
    //判断一下文件是否存在，也可以在前端代码中进行判断。
    if (req.file.length === 0) {
        msgData.code = 1;
        msgData.msg = "上传文件不能为空！"
        return res.json(msgData);
    } else {
        let file = req.file,
            fileSuffix = file.originalname.match(/\.\w+$/)[0],
            filesData = {};
        console.log(file);
        fs.renameSync("./uploads/doccover/" + file.filename, './uploads/doccover/' + file.filename + fileSuffix);
        // 获取文件信息
        filesData.mimetype = file.mimetype;
        filesData.originalname = file.originalname;
        filesData.newfilename = file.filename + fileSuffix;
        filesData.suffix = fileSuffix.replace(/\./, "");
        filesData.size = file.size;
        filesData.path = file.path + fileSuffix;

        // 设置响应类型及编码
        res.set({
            'content-type': 'application/json; charset=utf-8'
        });

        //数据返回
        msgData.msg = "文件上传成功！";
        msgData.data = filesData;
        return res.json(msgData);
    }
});

//附件文件上传
router.post('/multifile', multer({
    //设置文件存储路径
    dest: 'uploads/content/'
}).array('file', 10), function (req, res, next) { //这里10表示最大支持的文件上传数目
    let files = req.files;
    if (files.length === 0) {
        msgData.code = 1;
        msgData.msg = "上传文件不能为空！"
        return res.json(msgData);
    } else {
        let filesDataArr = [];
        for (var i in files) {
            let file = files[i],
                fileSuffix = file.originalname.match(/\.\w+$/)[0],
                filesData = {};

            //这里修改文件名
            fs.renameSync('./uploads/content/' + file.filename, './uploads/content/' + file.filename + fileSuffix);

            //获取文件基本信息
            filesData.mimetype = file.mimetype;
            filesData.originalname = file.originalname;
            filesData.newfilename = file.filename + fileSuffix;
            filesData.suffix = fileSuffix.replace(/\./, "");
            filesData.size = file.size;
            filesData.path = file.path + fileSuffix;
            filesDataArr.push(filesData);
        }

        // 设置响应类型及编码
        res.set({
            'content-type': 'application/json; charset=utf-8'
        });

        //数据返回
        msgData.msg = "文件上传成功！";
        msgData.data = filesDataArr;
        return res.json(msgData);
    }
});

//同步文件删除
router.get("/sydelete", (req, res) => {
    let {
        filename
    } = req.query,
        filePath = "./uploads/" + filename;
    filename = !isEmpty(filename) ? filename : "";
    if (Validator.isEmpty(filename)) {
        msgData.code = 1;
        msgData.msg = "文件名称不能为空！"
        return res.json(msgData);
    }
    if (!fs.unlinkSync(filePath)) {
        msgData.msg = "文件删除成功！";
        return res.json(msgData);
    } else {
        msgData.code = 1;
        msgData.msg = "当前文件不存在！";
        return res.json(msgData);
    }
})

//异步文件删除
router.get("/fsdelete", (req, res) => {
    let {
        filename
    } = req.query,
        filePath = "./" + filename;
    filename = !isEmpty(filename) ? filename : "";
    if (Validator.isEmpty(filename)) {
        msgData.code = 1;
        msgData.msg = "文件名称不能为空！"
        return res.json(msgData);
    }

    fs.unlink(filePath, (err) => {
        if (!err) {
            msgData.msg = "文件删除成功！";
            return res.json(msgData);
        } else {
            msgData.code = 1;
            msgData.msg = "当前文件不存在！";
            return res.json(msgData);
        }
    })
})

module.exports = router;