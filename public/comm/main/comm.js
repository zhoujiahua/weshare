(function () {
    layui.define(["layer", "form"], function (exprots) {
        var layer = layui.layer,
            form = layui.form,
            $ = layui.$,
            comm = {};

        //随机字数
        comm.getRandomNum = function (Min, Max) {
            var Range = Max - Min;
            var Rand = Math.random();
            return (Min + Math.round(Rand * Range));
        }

        //URL参数获取
        comm.getQueryString = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]);
            return null;
        }

        //绑定键盘按键
        comm.bindKeyEvent = function (el, num, event) {
            if (!el) return console.error("绑定触发元素不能为空！");
            $(document).keydown(function (e) {
                e = window.event || e;
                if (e.keyCode == (num || 13)) {
                    $(el).trigger(event || "click");
                }
            });
        }

        //邮箱验证
        comm.isEmail = function (email) {
            if (!email) return false;
            var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if (reg.test(email)) {
                return true;
            } else {
                return false;
            }
        }

        //时间格式化
        comm.setFormatDate = function (str, suffix) {
            suffix = suffix || "YYYY-MM-DD HH:mm:ss";
            return moment(str).format(suffix);
        }

        //注销方法
        comm.loginout = function () {
            var loadIndex;
            $.ajax({
                type: "GET",
                url: "/api/admin/users/loginout",
                data: {},
                dataType: "json",
                beforeSend: function () {
                    loadIndex = layer.load(2, {
                        shade: [0.4, '#fff']
                    })
                },
                success: function (res) {
                    var timer = null;
                    if (res.code) {
                        timer = setTimeout(function () {
                            window.clearTimeout(timer);
                            loadIndex = layer.load(res.msg, {
                                icon: 2
                            })
                            return layer.close(loadIndex);
                        }, 600)
                    }

                    timer = setTimeout(function () {
                        window.clearTimeout(timer);
                        layer.close(loadIndex);
                        window.location.href = "/admin/users/login";
                    }, 600)
                }
            });
        }

        //公共数据
        comm.commdata = function () {
            return {
                logo: "main/images/logo.png",
                hotLink: [
                    'main/images/good/1.jpg',
                    'main/images/good/2.jpg',
                    'main/images/good/3.jpg',
                    'main/images/good/4.jpg',
                    'main/images/good/5.jpg',
                    'main/images/good/6.jpg'
                ],
                silderLink: [
                    'main/images/slider/1.jpg',
                    'main/images/slider/2.jpg',
                    'main/images/slider/3.jpg',
                    'main/images/slider/4.jpg',
                    'main/images/slider/5.jpg',
                    'main/images/slider/6.jpg'
                ]
            }
        }

        //获取用户数据
        comm.getUsersData = function (fn) {
            $.getJSON("/api/base/reload/userinfo", {},
                function (data) {
                    fn(data)
                }
            );
        }

        //对外接口
        exprots("comm", comm)
    });
}())