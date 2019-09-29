const moment = require("moment");
const os = require("os");
const charsArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

module.exports = comm = {
    //时间格式化方法
    dateFormat(timer, format = "YYYY-MM-DD HH:mm:ss") {
        return moment(timer).format(format);
    },
    jsonParse(str) {
        return JSON.parse(str);
    },
    setNum(num) {
        return Math.round(num / 1024);
    },
    setSuffix(str) {
        return str.match(/\.\w+$/)[0].replace(/\./, "");
    },
    suffixViews(str) {
        // let strViews = /pdf|jpg|png|gif/.test(str.match(/\.\w+$/)[0].replace(/\./, ""));
        if (/pdf|jpg|png|gif/.test(str.trim())) return true;
        return false;
    },
    //获取本机IP
    getIPAdress() {
        var interfaces = os.networkInterfaces();
        for (var devName in interfaces) {
            var iface = interfaces[devName];
            for (var i = 0; i < iface.length; i++) {
                var alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    },
    //生成n位随机密码
    getRandomString(len = 32) {
        // len = len || 32;
        let charsStr = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1  
        let maxPos = charsStr.length;
        let pwd = '';
        for (i = 0; i < len; i++) {
            pwd += charsStr.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },
    //随机字数
    getRandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    },
    //随机字符串
    generateMixed(n, s) {
        var res = "";
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * s);
            res += charsArr[id];
        }
        return res;
    }
}