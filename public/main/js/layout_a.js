layui.use(["layer", "form", "element", "comm"], function () {
    var layer = layui.layer,
        form = layui.form,
        comm = layui.comm,
        element = layui.element,
        $ = layui.$,
        users = layui.sessionData("users").data;

    //请求用户信息
    if (!users) {
        comm.getUsersData(function (d) {
            layui.sessionData("users", {
                key: "data",
                value: d.data
            })
        })
        setInitUsersInfo(users);
    }

    //初始化用户信息
    setInitUsersInfo(users);

    function setInitUsersInfo(o) {
        $("#userInfo").attr("data-id", o.id).html('<img src="' + o.avatar + '" class="layui-nav-img"><span data-email=' + o.email + ' >' + users.username + '</span>');
    }

    //检索验证
    form.verify({
        searchKey: function (value) {
            if (value.trim().length <= 0) {
                return '检索内容不能为空！';
            }
        }
    });

    //检索
    form.on('submit(searchBtn)', function (data) {
        var d = data.field,
            tiemr = null,
            indexLoad = layer.load();
        console.log(d)
        tiemr = setTimeout(function () {
            window.clearTimeout(tiemr);
            layer.close(indexLoad);
            window.location.href = "/main/search?key=" + encodeURIComponent(d.serachkey) + "&type=" + d.selectkey;
        }, 600)
        return false;
    });

    //注销
    $("#loginout").click(function () {
        var indexLoad, tiemr = null;
        $.ajax({
            type: "GET",
            url: "/api/main/users/loginout",
            data: {},
            dataType: "json",
            beforeSend: function () {
                indexLoad = layer.load(0, {
                    shade: [0.4, '#fff']
                });
            },
            success: function (res) {
                if (res.code) {
                    tiemr = setTimeout(function () {
                        return layer.msg(res.msg, {
                            icon: 2,
                            tiem: 500
                        }, function () {
                            layer.close(indexLoad);
                            clearTimeout(tiemr);
                        })
                    }, 800)
                } else {
                    //清除用户本地信息
                    layui.sessionData("users", null);
                    layui.sessionData("flagInfo", null);
                    tiemr = setTimeout(function () {
                        layer.msg(res.msg, {
                            icon: 1,
                            tiem: 500
                        }, function () {
                            layer.close(indexLoad);
                            clearTimeout(tiemr);
                            window.location.reload();
                        })
                    }, 800)
                }
            }
        });
    })

})