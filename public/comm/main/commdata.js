(function () {
    layui.define(["layer", "form"], function (exprots) {
        var layer = layui.layer,
            form = layui.form,
            $ = layui.$,
            commdata = {};

        commdata.subjectdata = function () {
            $.getJSON("/api/base/comm/grade", {},
                function (res, textStatus, jqXHR) {
                    
                }
            );
        }

        //对外接口
        exprots("commdata", commdata)
    });
}())