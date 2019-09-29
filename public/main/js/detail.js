layui.use(['layer', 'form', 'element', 'rate'], function () {
    var layer = layui.layer,
        rate = layui.rate,
        os = layui.device(),
        $ = layui.$,
        filesBtn = $("#attachmentLists tr"),
        dataItem = JSON.parse($("#pageData").attr("data-item")),
        flagInfo = layui.sessionData("flagInfo");

    // 评分渲染
    var rateIns = rate.render({
        elem: "#rateElem",
        half: true,
        value: dataItem.scoreNumber,
        readonly: true
    })

    filesBtn.on("click", "#titleBtn", function () {
        var docPath = $(this).parent("tr").attr("data-path");
        $("#fileViews").attr("src", docPath).height("860");
    })

    filesBtn.on("click", ".doc-views", function () {
        var docPath = $(this).parents("tr").attr("data-path"),
            docTitle = $(this).parents("tr").find("#titleBtn").text();
        layer.open({
            type: 2,
            title: docTitle,
            closeBtn: 1, //不显示关闭按钮
            maxmin: true, //开启最大化最小化按钮
            shade: [0],
            area: ['80%', '80%'],
            offset: 'c', //右下角弹出
            anim: 2,
            content: [docPath, 'no'], //iframe的url，no代表不显示滚动条
            end: function () { //此处用于演示
            }
        });
    });

    //下载统计
    filesBtn.on("click", ".doc-down", function (e) {
        e.preventDefault();
        setPageVieNuber(dataItem._id, 1);
        window.open($(this).attr("href"));
    })

    //浏览量下载量统计
    if (!flagInfo || flagInfo.flag != dataItem._id) {
        setPageVieNuber(dataItem._id);
    }

    //记录信息提交
    function setPageVieNuber(id, types) {
        $.getJSON("/api/main/doc/count", {
                id: id,
                types: types
            },
            function (res) {
                console.log(res);
                layui.sessionData("flagInfo", {
                    key: "flag",
                    value: dataItem._id
                })
            }
        );
    }
});