layui.use(['layer', 'form', 'laypage', "comm"], function () {
    var layer = layui.layer,
        laypage = layui.laypage,
        form = layui.form,
        comm = layui.comm,
        $ = layui.$,
        dataKey = {
            key: comm.getQueryString("key") || "小掌部落",
            type: comm.getQueryString("type") || 0
        },
        indexLoad = null,
        timer = null;


    //年级
    $("#subjectNo").click(function () {
        var item = itemMenu.call(this, "data-item");
        allMenu.call(this, "#subjectMenu li", "fontactive");
        var params = indexParams({});
        //检索数据请求
        searchData(setParams({}));
    })
    $("#subjectMenu").on("click", "li", function () {
        var item = itemMenu.call(this, "data-item");
        elemMenu.call(this, "#subjectNo", "fontactive");
        var params = indexParams({});
        //检索数据请求
        searchData(setParams({}));
    })

    //学科
    $("#gradeNo").click(function () {
        var item = itemMenu.call(this, "data-item");
        allMenu.call(this, "#gradeMenu li", "fontactive");
        var params = indexParams({});
        //检索数据请求
        searchData(setParams({}));
    })
    $("#gradeMenu").on("click", "li", function () {
        var item = itemMenu.call(this, "data-item");
        elemMenu.call(this, "#gradeNo", "fontactive");
        var params = indexParams({});
        //检索数据请求
        searchData(setParams({}));
    })

    //学科数据请求
    $.getJSON("/api/base/comm/subject", {},
        function (res, textStatus, jqXHR) {
            if (res.code) return console.error("学科栏目请求失败");
            var listHtml = '';
            $.each(res.data, function (k, v) {
                listHtml += '<li class="layui-col-xs4" data-id=' + v._id + ' data-item="' + v.subject_name + '"><a href="javascript:;">' + v.subject_name + '</a></li>'
            });
            $('#subjectMenu').html(listHtml);
            form.render()
        }
    );

    //年级数据请求
    $.getJSON("/api/base/comm/grade", {},
        function (res, textStatus, jqXHR) {
            if (res.code) return console.error("学科栏目请求失败");
            var listHtml = '';
            $.each(res.data, function (k, v) {
                listHtml += '<li class="layui-col-xs4" data-id=' + v._id + ' data-item="' + v.grade_name + '"><a href="javascript:;">' + v.grade_name + '</a></li>'
            });
            $('#gradeMenu').html(listHtml);
            console.log(res.data)
            form.render()
        }
    );

    //数据初始化
    searchData(setParams({}))

    //构造参数
    function indexParams(o) {
        return {
            subject: $("#subjectMenu .fontactive").attr("data-item") || 1,
            grade: $("#gradeMenu .fontactive").attr("data-item") || 1,
            page: o.page || 1,
            limit: o.limit || 10,
            viewSort: $("#viewSort").attr("data-sort"),
            timeSort: $("#timeSort").attr("data-sort")
        }
    }

    //菜单参数获取
    function itemMenu(item) {
        if (!item) throw new Error("菜单参数不能为空");
        return $(this).attr(item);
    }

    //菜单选中效果
    function elemMenu(elem, item) {
        if (!item || !elem) throw new Error("选中效果参数不能为空");
        $(elem).removeClass(item);
        $(this).addClass(item).siblings().removeClass(item);
    }

    //不限选中效果
    function allMenu(elem, item) {
        if (!item || !elem) throw new Error("选中效果参数不能为空");
        $(elem).removeClass(item);
        $(this).addClass(item);
    }

    //构造参数
    function setParams(o) {
        return {
            page: o.page || 1,
            limit: o.limit || 5,
            key: dataKey.key,
            type: dataKey.type,
            subject: $("#subjectMenu .fontactive").attr("data-item") || "",
            grade: $("#gradeMenu .fontactive").attr("data-item") || ""
        }
    }

    //检索数据请求
    function searchData(o) {
        $.ajax({
            type: "GET",
            url: "/api/main/doc/search",
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
                    return $("#searchList").html('<h1 style="font-size:16px;margin:30px;">' + res.msg + '</h1>');
                } else {
                    $("#searchCount").text(res.count);
                    if (!res.count) {
                        timer = setTimeout(function () {
                            layer.close(indexLoad);
                            clearTimeout(timer);
                        }, 800)
                        $("#searchList").html('<h1 style="font-size:16px;margin:30px;">' + res.msg + '</h1>');
                        return $("#searchListPages").html("");
                    } else if (res.count > o.limit) {
                        laypage.render({ //分页
                            elem: 'searchListPages',
                            count: res.count,
                            limit: o.limit,
                            curr: o.page,
                            theme: "#3f53c3",
                            jump: function (obj, first) {
                                if (first) return false;
                                searchData(setParams({
                                    page: obj.curr,
                                    limit: obj.limit
                                }))

                            }
                        });
                        return listHtml(res.data);
                    } else {
                        return listHtml(res.data);
                    }
                }
            }
        });
    }

    //检索列表元素
    function listHtml(d) {
        var searchHtml = "";
        $.each(d, function (k, v) {
            searchHtml += '<tr data-id=' + v._id + ' class="layui-elip" ><td><div class="list-title"><div class="title-icon"><span class="iconfont icon-geshi_wendangppt"></span></div>\
            <div class="title-con"><h3 class="title-h"><a href="/main/detail/' + v._id + '" target="_blank" class="layui-elip">' + v.titleName + '</a></h3>\
            <div class="title-info layui-elip"><span>上传人：' + v.authorName + ' </span><span>' + moment(v.createDate).format("YYYY-MM-DD HH:mm:ss") + '</span><span>学科：' + v.subjectName + '</span><span>年级：' + v.gradeName + '</span>\
            <span><i class="iconfont icon-liulan"></i><b>' + v.downloads + '</b></span></div></div></div></td>\
             <td><div class="list-btn"><a href="/main/detail/' + v._id + '" target="_blank" class="dow-btn layui-btn layui-btn-warm">查看</a></div></td></tr>';
        });
        $("#searchList").html(searchHtml);
        timer = setTimeout(function () {
            layer.close(indexLoad);
            clearTimeout(timer);
        }, 800)
    }

    //表单初始赋值
    form.val('search', {
        "serachkey": dataKey.key,
        "selectkey": dataKey.type
    })

});