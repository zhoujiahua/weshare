(function () {
    layui.define(["layer", "form"], function (exprots) {
        var layer = layui.layer,
            form = layui.form,
            $ = layui.$,
            comm = {};

        //网站配置信息
        comm.getWebData = function (fn) {
            $.getJSON("/api/admin/comm/web/info", {},
                function (res, textStatus, jqXHR) {
                    fn(res);
                }
            );
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
                        layui.sessionData("auserInfo", null);
                        window.location.href = "/admin/users/login";
                    }, 600)
                }
            });
        }

        //对外接口
        exprots("comm", comm)
    });
}())