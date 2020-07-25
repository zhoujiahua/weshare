layui.use(['layer', 'form', 'element', 'upload', 'laydate', 'comm'], function () {
    var form = layui.form,
        layer = layui.layer,
        element = layui.element,
        laydate = layui.laydate,
        upload = layui.upload,
        comm = layui.comm,
        $ = layui.$,
        coverImg,
        fileLists = [],
        filesListsImg = $("filesListsImg"),
        tableListView = $('#filesLists'),
        uploadListImg = null,
        uploadListIns = null,
        // createDate = new Date(),
        // sortDate = new Date(),
        randomNum = comm.getRandomNum(1, 6),
        randomLink = comm.commdata().hotLink[randomNum],
        users = layui.sessionData("users").data;

    //验证
    form.verify({
        titleName: function (value) {
            if (value.trim().length <= 0) {
                return '文档标题不能为空！';
            }
        },
        authorName: function (value) {
            if (value.trim().length <= 0) {
                return '老师名称不能！';
            }
        },
        introText: function (value) {
            if (value.trim().length <= 0) {
                return '文档简介不能为空！';
            }
        }
    });

    //初始化本地存储
    layui.sessionData("attachmentFiles", null);

    //发布时间
    laydate.render({
        elem: '#createDate',
        type: 'datetime',
        value: new Date(),
        done: function (v, d) {
            createDate = new Date(v);
        }
    });

    //监听提交
    form.on('submit(submitBtn)', function (data) {
        var indexLoad = null,
            timer = null,
            d = data.field;

        d.coverImg = coverImg || randomLink;
        d.attachment = JSON.stringify(fileLists);
        d.createDate = new Date();
        d.shareState = d.shareState ? 1 : 0;
        $.ajax({
            type: "POST",
            url: "/api/main/doc/add",
            data: d,
            dataType: "json",
            beforeSend: function () {
                indexLoad = layer.load(0, {
                    shade: [0.6, '#fff']
                });
            },
            success: function (res) {
                if (res.code) {
                    timer = setTimeout(function () {
                        return layer.msg(res.msg, {
                            icon: 2,
                            time: 1000
                        }, function () {
                            window.clearTimeout(timer);
                            layer.close(indexLoad);
                        })
                    }, 800)
                } else {
                    timer = setTimeout(function () {
                        layer.msg(res.msg, {
                            icon: 1,
                            time: 1000
                        }, function () {
                            window.clearTimeout(timer);
                            layer.close(indexLoad);
                            window.location.reload();
                        })
                    }, 800)
                }
            }
        });

        return false;
    });

    //封面上传
    uploadListImg = upload.render({
        elem: '#selectImg',
        url: '/upload/monofile',
        auto: false,
        multiple: true,
        auto: false,
        bindAction: '#startImg',
        before: function (obj) {
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, file, result) {
                $('#uploadImg').attr('src', result); //图片链接（base64）
            });
        },
        done: function (res) {
            //如果上传失败
            if (res.code) {
                return layer.msg('上传失败');
            }
            //上传成功
            console.log(res)
            coverImg = res.data.path;
        },
        error: function () {
            //演示失败状态，并实现重传
            var imgMsgText = $('#imgMsgText');
            imgMsgText.html(
                '<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>'
            );
            imgMsgText.find('.demo-reload').on('click', function () {
                uploadInst.upload();
            });
        }
    });

    //附件上传
    uploadListIns = upload.render({
        elem: '#selectFiles',
        url: '/upload/multifile',
        accept: 'file',
        multiple: true,
        auto: false,
        bindAction: '#actionBtn',
        choose: function (obj) {
            var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function (index, file, result) {
                var fileFormat = file.name.match(/\.\w+$/)[0].replace(/^\./, ""),
                    tr = $(['<tr id="upload-' + index + '">',
                        '<td><h2 class="layui-elip">' + file.name +
                        '</h2></td>',
                        '<td><div class="layui-elip">等待上传</div></td>',
                        '<td>' + (file.size / 1014).toFixed(1) + 'kb</td>', '<td>' +
                        fileFormat + '</td>', '<td>',
                        '<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>',
                        '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>',
                        '</td>', '</tr>'
                    ].join(''));

                //单个重传
                tr.find('.demo-reload').on('click', function () {
                    obj.upload(index, file);
                });

                //删除
                tr.find('.demo-delete').on('click', function () {
                    delete files[index]; //删除对应的文件
                    tr.remove();
                    //清空 input file 值，以免删除后出现同名文件不可选
                    uploadListIns.config.elem.next()[0].value = '';
                });

                tableListView.append(tr);
                element.init();
            });
        },
        done: function (res, index, upload) {
            if (res.code == 0) { //上传成功
                var tr = tableListView.find('tr#upload-' + index),
                    tds = tr.children();
                tds.eq(1).html('<span style="color: #5FB878;">上传成功</span>');
                tds.eq(4).html(
                    '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                ); //清空操作

                //返回数据合并
                fileLists.push(res.data[0]);
                layui.sessionData("attachmentFiles", {
                    key: 'data',
                    value: fileLists
                })

                //路径属性绑定
                $(tr).attr("data-path", res.data[0].path)

                //删除
                $(tr).click(function (e) {
                    e.preventDefault();
                    var that = $(this),
                        fileName = that.attr("data-path"),
                        timer = null,
                        indexLoad;
                    $.ajax({
                        type: "GET",
                        url: "/upload/fsdelete",
                        data: {
                            filename: fileName
                        },
                        dataType: "json",
                        beforeSend: function () {
                            indexLoad = layer.load(1, {
                                shade: [0.1, '#fff'] //0.1透明度的白色背景
                            });
                        },
                        success: function (res) {
                            if (res.code) {
                                timer = setTimeout(function () {
                                    return layer.msg(res.msg, {
                                        icon: 2,
                                        time: 600
                                    }, function () {
                                        clearTimeout(timer);
                                        layer.close(
                                            indexLoad);
                                    })
                                }, 800)
                            } else {
                                fileLists = _.remove(fileLists,
                                    function (o) {
                                        return o.path != fileName;
                                    })
                                layui.sessionData("attachmentFiles", {
                                    key: 'data',
                                    value: fileLists
                                })
                                timer = setTimeout(function () {
                                    return layer.msg(res.msg, {
                                        icon: 1,
                                        time: 600
                                    }, function () {
                                        clearTimeout(timer);
                                        that.remove();
                                        layer.close(
                                            indexLoad);
                                    })
                                }, 800)
                            }
                        }
                    });
                });
                // console.log(res)
                return delete this.files[index]; //删除文件队列已经上传成功的文件
            }
            this.error(index, upload);
        },
        error: function (index, upload) {
            var tr = tableListView.find('tr#upload-' + index),
                tds = tr.children();
            tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
            tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
        }
    });

    //学科数据请求
    $.getJSON("/api/base/comm/subject", {},
        function (res, textStatus, jqXHR) {
            if (res.code) return console.error("学科栏目请求失败");
            var listHtml = '<option value=""></option>';
            $.each(res.data, function (k, v) {
                listHtml += '<option data-id=' + v._id + ' value=' + v.subject_name + '>' + v
                    .subject_name + '</option>';
            });
            $('[name="subjectName"]').html(listHtml);
            form.render();
            initValue();
        }
    );

    //年级数据请求
    $.getJSON("/api/base/comm/grade", {},
        function (res, textStatus, jqXHR) {
            if (res.code) return console.error("学科栏目请求失败");
            var listHtml = '<option value=""></option>';
            $.each(res.data, function (k, v) {
                listHtml += '<option data-id=' + v._id + ' value=' + v.grade_name + '>' + v
                    .grade_name + '</option>';
            });
            $('[name="gradeName"]').html(listHtml);
            form.render();
            initValue();
        }
    );

    //表单初始赋值
    function initValue() {
        form.val('addText', {
            "titleName": "（精校版）2019年全国卷高考模拟试题文档版（含答案） 热点",
            "authorName": users.username,
            "subjectName": "数学",
            "gradeName": "一年级",
            "shareState": true,
            "introText": "小掌部落知识发现网络平台—面向海内外读者提供中国学术文献、外文文献、学位论文、报纸、会议、年鉴、工具书等各类资源统一检索、统一导航、在线阅读和下载服务。",
        })
    }
});