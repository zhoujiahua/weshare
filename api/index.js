const express = require("express");
const router = express.Router();

let msgData;
router.use((req, res, next) => {
    msgData = {
        code: 0,
        msg: ""
    }
    next();
})

// $route  GET api/test
// @desc   站点信息配置 
// @access public
router.get("/test", (req, res) => {
    msgData.data = {};
    return res.json(msgData);
})

module.exports = router;