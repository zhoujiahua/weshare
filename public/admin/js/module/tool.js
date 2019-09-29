layui.define(['layer', "form", "laypage"], function (exports) {
    var layer = layui.layer,
        form = layui.form,
        laypage = layui.laypage,
        $ = layui.$;

    var tool = {
        /**
         * 移除数组的值
         * @param arr   数组
         * @param val   删除的值
         */
        removeByValue: function (arr, val) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == val) {
                    arr.splice(i, 1);
                    break;
                }
            }
        },

        /**
         * 转义字符，防止xxs
         * @param str
         * @returns {string}
         */
        stringEncode: function (str) {
            var div = document.createElement('div');
            if (div.innerText) {
                div.innerText = str;
            } else {
                div.textContent = str; //Support firefox
            }
            return div.innerHTML;
        },

        //分页
        pages: function (o) {
            laypage.render({
                elem: o.elem || 'pageid', //注意，这里的 pageid 是 ID，不用加 # 号
                count: o.count || 100, //数据总数，从服务端得到
                limit: o.limit || 10, //每页显示条数
                curr: o.curr || 1, //选中页码
                theme: o.theme || "#1E9FFF", //分页颜色
                jump: o.jump || function (obj, first) { //回调函数
                    console.log("first", first)
                    console.log("obj", obj)
                }
            });
        }

    };

    exports('tool', tool);
});