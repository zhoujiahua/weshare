layui.use(["layer", "element", "util", "meth"], function () {
    var layer = layui.layer,
        util = layui.util,
        element = layui.element,
        meth = layui.meth,
        $ = layui.$,
        userData = JSON.parse($("#userData").attr("data-item")),
        viewFlag = true,
        viewPageClick = $("#viewsPages");

    //用户数据本地化
    layui.sessionData("auserInfo", {
        key: "data",
        value: userData
    })

    //侧边栏事件
    util.event("lay-actvie", {
        sva: function (e) {
            // e.preventDefault();
            var leftAside = $("#leftAside"),
                rightAside = $("#rightAside");

            if (viewFlag) {
                leftAside.animate({
                    left: "-11%"
                })
                rightAside.animate({
                    left: "0"
                })
                $(this).children(".layui-icon").removeClass("layui-icon-spread-right").addClass("layui-icon-spread-left");
            } else {
                leftAside.animate({
                    left: "0"
                })
                rightAside.animate({
                    left: "11%"
                })
                $(this).children(".layui-icon").removeClass("layui-icon-spread-left").addClass("layui-icon-spread-right");
            }
            viewFlag = !viewFlag;
        },
        svb: function (e) {
            var indexLoad = layer.load(1, {
                    shade: [0.4, '#fff']
                }),
                timer = setTimeout(function () {
                    clearTimeout(timer);
                    layer.close(indexLoad);
                    window.open("/");
                }, 800);

        },
        svc: function (e) {
            var indexLoad = layer.load(1, {
                    shade: [0.4, '#fff']
                }),
                timer = setTimeout(function () {
                    clearTimeout(timer);
                    layer.close(indexLoad);
                    window.location.reload();
                }, 800);
        }
    })

    //页面跳转
    $("#leftSideUl").on("click", "li", function (e) {
        var pagelink = $(this).attr("data-link");
        viewPageClick.attr("src", pagelink);
    })

    //用户下拉
    $("#userInfoDl").on("click", "dd", function () {
        var pagelink = $(this).attr("data-link");
        viewPageClick.attr("src", pagelink);
    })

    //网站配置信息
    meth.getWebData(function (d) {
        layui.sessionData("webInfo", {
            key: "data",
            value: d
        })
    })

    //注销用户
    $("#loginout").on("click", meth.loginout);

})