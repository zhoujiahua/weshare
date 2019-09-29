layui.use(['layer', 'laypage', 'form'], function () {
    var layer = layui.layer,
        laypage = layui.laypage,
        form = layui.form,
        $ = layui.$,
        users = layui.sessionData("users").data,
        indexLoad = null,
        timer = null;

    //初始化数据
    getInvidiData(setParamas({}));

    //构造参数
    function setParamas(o) {
        return {
            filesUserID: users.id,
            page: o.page || 1,
            limit: o.limit || 10
        }
    }

    //个人文件数据请求
    function getInvidiData(o) {
        $.ajax({
            type: "GET",
            url: "/api/base/reload/personal",
            data: o,
            dataType: "json",
            beforeSend: function () {
                indexLoad = layer.load(1, {
                    shade: [0.6, '#fff']
                });
            },
            success: function (res) {
                if (res.code) {
                    timer = setTimeout(function () {
                        layer.close(indexLoad);
                        clearTimeout(timer);
                    }, 800)
                    return $(".content-list").html('<h1 style="font-size:16px;margin:30px;">' + res.msg + '</h1>');
                } else {
                    if (!res.count) {
                        timer = setTimeout(function () {
                            layer.close(indexLoad);
                            clearTimeout(timer);
                        }, 800)
                        $(".content-list").html('<h1 style="font-size:16px;margin:30px;">' + res.msg + '</h1>');
                        return $("#indiviPages").html("");
                    } else if (res.count > o.limit) {
                        laypage.render({
                            elem: 'indiviPages',
                            limit: o.limit,
                            curr: o.page,
                            count: res.count,
                            theme: "#3f53c3",
                            jump: function (obj, first) {
                                if (first) return false;
                                getInvidiData(setParamas({
                                    limit: obj.limit,
                                    page: obj.curr
                                }));
                            }
                        });
                        return listHtmlData(res.data);
                    } else {
                        return listHtmlData(res.data);
                    }
                }

            }
        });
    }

    //数据挂载
    function listHtmlData(d) {
        var listHtml = "";
        $.each(d, function (k, v) {
            listHtml += '<tr data-id=' + v._id + '><td><a href="/main/detail/' + v._id + '" class="title-btn" title="' + v.titleName + '">' + v.titleName + '</a></td>\
                            <td>' + moment(v.createDate).format("YYYY-MM-DD HH:mm:ss") + '</td><td>' + v.downloads + '</td>\
                            <td><span>' + (v.shareState ? "是" : "否") + '</span></td><td id="operationList">\
                                <a href="/main/edit/' + v._id + '" class="edit-btn layui-btn layui-btn-normal layui-btn-sm"><i class="layui-icon">&#xe642;</i></a>\
                                <button class="remove-btn layui-btn layui-btn-danger layui-btn-sm"><i class="layui-icon">&#xe640;</i></button></td></tr>';
        });
        $("#indiviList").html(listHtml);
        timer = setTimeout(function () {
            layer.close(indexLoad);
            clearTimeout(timer);
        }, 800)
    }

    //数据删除操作
    $("#indiviList").on("click", ".remove-btn", function () {
        var that = $(this),
            indexLoad = null,
            timer = null,
            fileid = that.parents("tr").attr("data-id");

        //请求删除操作
        layer.confirm('您确认删除当前数据吗？', {
            btn: ['确认', '取消'] //按钮
        }, function (index) {
            layer.close(index);
            $.ajax({
                type: "GET",
                url: "/api/base/reload/delete",
                data: {
                    mainid: users.id,
                    fileid: fileid
                },
                dataType: "json",
                beforeSend: function () {
                    indexLoad = layer.load(1, {
                        shade: [0.4, '#fff']
                    });
                },
                success: function (res) {
                    if (res.code) {
                        timer = setTimeout(function () {
                            return layer.msg(res.msg, {
                                icon: 2,
                                time: 2000
                            }, function () {
                                window.clearTimeout(timer);
                                layer.close(indexLoad);
                            })
                        }, 800)
                    } else {
                        timer = setTimeout(function () {
                            layer.msg(res.msg, {
                                icon: 1,
                                time: 2000
                            }, function () {
                                window.clearTimeout(timer);
                                layer.close(indexLoad);
                                window.location.reload();
                            })
                        }, 800)
                    }
                }
            });
        })
    });

});