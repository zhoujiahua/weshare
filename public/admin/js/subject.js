//学科设置
layui.use(["layer", "form", "tool"], function () {
    var layer = layui.layer,
        form = layui.form,
        tool = layui.tool,
        $ = layui.$;

    //添加
    $(".add-btn").on("click", function (e) {
        e.preventDefault();
        layer.open({
            type: 1,
            title: "添加学科",
            closeBtn: 1,
            area: '380px;',
            shade: 0.8,
            id: 'LAY_layuipro', //设定一个id，防止重复弹出
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            resize: false,
            move: true,
            moveType: 1, //拖拽模式，0或者1
            content: $("#addHtml").html(),
            success: function (layero) {
                form.render();
                form.on('switch(subject_status)', function (data) {
                    if (this.checked) {
                        this.value = 1
                    } else {
                        this.value = 0
                    }
                })
            },
            yes: function (index, layero) {
                var subject_name = $('[name="subject_name"]').val(),
                    subject_sort = $('[name="subject_sort"]').val(),
                    subject_status = $('[name="subject_status"]').val(),
                    loadIndex = null;
                if (!subject_name.trim()) {
                    return layer.msg("学科名称不能为空", {
                        icon: 2
                    });
                }
                // if (!Number(subject_sort.trim())) {
                // 	return layer.msg("排序字段不能为空且必须为数字", {
                // 		icon: 2
                // 	});
                // }

                $.ajax({
                    type: "POST",
                    url: "/api/admin/pages/subject",
                    data: {
                        subject_name: subject_name,
                        subject_sort: subject_sort,
                        subject_status: subject_status
                    },
                    dataType: "json",
                    beforeSend: function () {
                        loadIndex = layer.load(1);
                    },
                    success: function (res) {
                        var timer = null;
                        if (res.code) {
                            timer = setTimeout(function () {
                                layer.msg(res.msg, {
                                    icon: 2
                                })
                                layer.close(loadIndex);
                                window.clearTimeout(timer);
                                return false;
                            }, 600);
                        } else {
                            layer.msg(res.msg, {
                                icon: 1,
                                time: 800
                            }, function () {
                                layer.close(loadIndex);
                                window.location.reload();
                            });
                        }
                    }
                });
            }
        });
    })

    //编辑
    $(".go-btn").on("click", function (e) {
        e.preventDefault();
        var that = this;
        layer.open({
            type: 1,
            title: "学科编辑",
            closeBtn: 1,
            area: '380px;',
            shade: 0.8,
            id: 'LAY_layuipro', //设定一个id，防止重复弹出
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            resize: false,
            move: true,
            moveType: 1, //拖拽模式，0或者1
            content: $("#editHtml").html(),
            success: function (layero) {
                var id = $(that).attr("data-id");
                form.on('switch(subject_status)', function (data) {
                    if (this.checked) {
                        this.value = 1
                    } else {
                        this.value = 0
                    }
                })
                $.getJSON("/api/admin/comm/subjectid/" + id, function (res) {
                    if (res.code) return layer.msg(res.msg);
                    var d = res.data;
                    console.log(d)
                    $('[name="subject_id"]').val(d._id);
                    $('[name="subject_name"]').val(d.subject_name);
                    $('[name="subject_sort"]').val(d.subject_sort);
                    $('[name="subject_status"]').val(d.subject_status ? 1 : 0);
                    if (d.subject_status) {
                        $('[name="subject_status"]').prop("checked", true);
                    } else {
                        $('[name="subject_status"]').prop("checked", false);
                    }
                    form.render();
                });
            },
            yes: function (index, layero) {
                var subject_id = $('[name="subject_id"]').val(),
                    subject_name = $('[name="subject_name"]').val(),
                    subject_sort = $('[name="subject_sort"]').val(),
                    subject_status = $('[name="subject_status"]').val(),
                    loadIndex = null;
                if (!subject_name.trim()) {
                    return layer.msg("学科名称不能为空", {
                        icon: 2
                    });
                }
                $.ajax({
                    type: "POST",
                    url: "/api/admin/pages/subject/edit",
                    data: {
                        id: subject_id,
                        subject_name: subject_name,
                        subject_sort: subject_sort,
                        subject_status: subject_status
                    },
                    dataType: "json",
                    beforeSend: function () {
                        loadIndex = layer.load(1);
                    },
                    success: function (res) {
                        var timer = null;
                        if (res.code) {
                            timer = setTimeout(function () {
                                layer.msg(res.msg, {
                                    icon: 2
                                })
                                layer.close(loadIndex);
                                window.clearTimeout(timer);
                                return false;
                            }, 600);
                        } else {
                            layer.msg(res.msg, {
                                icon: 1,
                                time: 800
                            }, function () {
                                layer.close(loadIndex);
                                window.location.reload();
                            });
                        }
                    }
                });
            }
        });
    })

    //删除
    $('#table-list').on('click', '.del-btn', function (e) {
        e.preventDefault();
        var id = $(this).attr("data-id");
        console.log(id)
        layer.confirm('您确定要进行删除吗？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            $.getJSON("/api/admin/pages/subject/delete/" + id, {},
                function (res) {
                    if (res.code) {
                        return layer.msg(res.msg, {
                            icon: 2
                        });
                    }

                    layer.msg(res.msg, {
                        icon: 1,
                        time: 800
                    }, function () {
                        window.location.reload();
                    });
                }
            );

        }, function () {
            layer.msg("取消了");
        });
    })

    //分页
    // subjectPages({
    //     limit: 2,
    //     curr: 1,
    //     elem: "pageid"
    // });

    // function subjectPages(o) {
    //     $.getJSON("/api/admin/comm/subject/pages", {
    //         limit: o.limit,
    //         curr: o.curr
    //     }, function (res) {
    //         console.log(res.data)
    //         tool.pages({
    //             elem: o.elem,
    //             count: res.count,
    //             limit: o.limit,
    //             curr: o.curr,
    //             jump: function (obj, first) {
    //                 if (first) return false;
    //                 console.log(obj)
    //                 subjectPages({
    //                     limit: obj.limit,
    //                     curr: obj.curr,
    //                     elem: obj.elem
    //                 })
    //             }
    //         });
    //     });

    // }

});