layui.use(['layer', 'form', 'element', 'upload', 'laydate', 'comm'], function () {
    var form = layui.form,
        layer = layui.layer,
        element = layui.element,
        laydate = layui.laydate,
        upload = layui.upload,
        comm = layui.comm,
        $ = layui.$,
        coverImg,
        filesListsImg = $("filesListsImg"),
        tableListView = $('#filesListsHtml'),
        uploadListImg = null,
        uploadListIns = null,
        deleteAttaFiles = layui.sessionData("deleteInfo").data || [],
        newAddAttaFileDele = layui.sessionData("newDeleInfo").data || [],
        deleteImgArr = layui.sessionData("deleteImgInfo").data || [],
        createDate = new Date(),
        sortDate = new Date(),
        randomNum = comm.getRandomNum(1, 6),
        randomLink = comm.commdata().hotLink[randomNum],
        dataItem = JSON.parse($("#dataID").attr("data-item")),
        users = layui.sessionData("users").data,
        fileLists = JSON.parse(dataItem.attachment),
        testImages = /\/main\/images/.test(dataItem.coverImg);

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

    //清空本地数据
    layui.sessionData("attachmentFiles", null);
    layui.sessionData("dataitem", null);
    if (deleteAttaFiles.length) deleteAtta(deleteAttaFiles, "deleteInfo");
    if (newAddAttaFileDele.length) deleteAtta(newAddAttaFileDele, "newDeleInfo");
    if (deleteImgArr.length) deleteAtta(deleteImgArr, "deleteImgInfo");

    //页面数据本地化
    layui.sessionData("dataitem", {
        key: "data",
        value: dataItem
    })


    //数据输出
    console.log(dataItem)
    console.log(fileLists)
    console.log(deleteAttaFiles)
    console.log(newAddAttaFileDele)
    console.log(deleteImgArr)
    console.log(testImages)

    //附件加载
    setAttaLists();

    //发布时间
    laydate.render({
        elem: '#createDate',
        type: 'datetime',
        value: comm.setFormatDate(dataItem.createDate),
        done: function (v, d) {
            createDate = new Date(v);
        }
    });

    //监听提交
    form.on('submit(submitBtn)', function (data) {
        var indexLoad = null,
            timer = null,
            d = data.field;
        d.id = dataItem._id;
        d.mainid = dataItem.filesUserID;
        d.coverImg = coverImg || randomLink;
        d.attachment = JSON.stringify(fileLists);
        d.createDate = createDate;
        d.sortDate = sortDate;
        d.shareState = d.shareState ? 1 : 0;
        $.ajax({
            type: "POST",
            url: "/api/main/doc/edit",
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
                    //更新需要删除的数据
                    layui.sessionData("deleteInfo", {
                        key: "data",
                        value: deleteAttaFiles
                    })

                    //清除不需要删除的数据
                    layui.sessionData("newDeleInfo", null);

                    layui.sessionData("deleteImgInfo", {
                        key: "data",
                        value: testImages ? [] : [dataItem.coverImg]
                    })

                    //更新成功提示
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
            //封面图片数据本地化
            deleteImgArr.push(res.data.path);
            layui.sessionData("deleteImgInfo", {
                key: "data",
                value: deleteImgArr
            })
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

    //删除附件
    tableListView.on("click", ".demo-delete", function (e) {
        e.preventDefault();
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        var that = $(this),
            parentTr = that.parents("tr"),
            fileName = parentTr.attr("data-path");
        parentTr.remove();
        if (_.indexOf(deleteAttaFiles, fileName) === -1) {
            deleteAttaFiles.push(fileName);
            fileLists = deleArrElement(fileLists, fileName);
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

                //本地化上传新数据
                newAddAttaFileDele.push(res.data[0].path);
                layui.sessionData("newDeleInfo", {
                    key: "data",
                    value: newAddAttaFileDele
                })

                //路径属性绑定
                $(tr).attr("data-path", res.data[0].path)

                //删除
                $(tr).click(function (e) {
                    e.preventDefault();
                    var that = $(this),
                        fileName = that.attr("data-path");
                    deleteAttaFiles.push(fileName);
                    fileLists = deleArrElement(fileLists, fileName);
                    console.log(fileLists);
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
            "titleName": dataItem.titleName,
            "authorName": dataItem.authorName,
            "subjectName": dataItem.subjectName,
            "gradeName": dataItem.gradeName,
            "shareState": dataItem.shareState,
            "introText": dataItem.introText,
        })
    }

    //附件初始化
    function setAttaLists() {
        var attaLists = "";
        $.each(fileLists, function (k, v) {
            attaLists += '<tr data-path="' + v.path + '"><td><h2 class="layui-elip">' + v.originalname + '</h2></td>\
            <td><span style="color: #5FB878;">上传成功</span></td><td>' + Math.round(v.size / 1024) + 'kb</td><td>' + v.suffix + '</td><td>\
            <button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button></td></tr>';
        });
        tableListView.html(attaLists);
    }

    //附件删除提交
    function deleteAtta(fileNameArr, dataInfo) {
        $.each(fileNameArr, function (k, v) {
            $.ajax({
                type: "GET",
                url: "/upload/fsdelete",
                data: {
                    filename: v
                },
                dataType: "json",
                success: function (res) {
                    if (res.code) {
                        console.log(res.msg);
                    } else {
                        console.log(res.msg);
                    }
                }
            });
        });

        //清除本地数据
        layui.sessionData(dataInfo, null);
    }

    //移除数组元素
    function deleArrElement(oldArr, elemName) {
        return _.remove(oldArr, function (o) {
            return o.path != elemName;
        })
    }

});