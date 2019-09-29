const express = require("express");
const router = express.Router();

//首页重定向
router.get("/", (req, res, next) => {
    res.redirect("/main/index");
})

module.exports = router;