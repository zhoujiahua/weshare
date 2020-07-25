const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.163.com",
    port: 465,
    secure: true, //默认为true 465 端口 其他端口为false（例如开启https时）
    auth: {
        user: "blooocn@163.com",
        pass: "zhoujiahua123456"
    }
});

module.exports = (email) => {
    // console.log(email)
    return new Promise((resolved, reject) => {
        transporter.sendMail(email, (err, info) => {
            if (!err) {
                console.log(info);
                return resolved(info);
            } else {
                console.log(err);
                return resolved(err);
            }
        });
    })

}