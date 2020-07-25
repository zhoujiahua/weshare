layui.use(['carousel'], function () {
    var carousel = layui.carousel,
        $ = layui.$,
        users = layui.sessionData("users").data;

    //优秀文件数据
    $.getJSON("/api/base/reload/hotdata", {
            page: 1,
            limit: 6
        },
        function (res, textStatus, jqXHR) {
            // console.log(res.data);
            var listHtml = "";
            $.each(res.data, function (k, v) {
                listHtml += '<li class="layui-col-xs4"><a href="/main/detail/' + v._id + '">\
                             <img src="/' + v.coverImg + '" alt="' + v.titleName + '">\
                             <h2 class="layui-elip" title=' + v.titleName + ' >' + v.titleName + '</h2></a></li>';
            });

            $("#hotImg").html(listHtml);
        }
    );

    //热点推送轮播
    $.getJSON("/api/base/reload/topdata", {
            page: 1,
            limit: 6
        },
        function (res, textStatus, jqXHR) {
            // console.log(res.data);
            var listHtml = "";
            $.each(res.data, function (k, v) {
                listHtml += '<li><a href="/main/detail/' + v._id + '"><img src="/' + v.coverImg + '" alt="' + v.titleName + '"></a></li>';
            });

            $("#sliderBarUl").html(listHtml);

            //轮播图渲染
            carousel.render({
                elem: '#sliderBar',
                width: '100%',
                height: '368px',
                interval: 5000
            });
        }
    );

    //个人文件数据 
    $.getJSON("/api/base/reload/personal", {
        filesUserID: users.id,
        page: 1,
        limit: 5
    }, function (res, textStatus, jqXHR) {
        var listHtml = "";
        $.each(res.data, function (k, v) {
            listHtml += '<li><h3 class="list-title"><a href="/main/detail/' + v._id + '" class="layui-elip">' + v.titleName + '</a></h3>\
                            <div class="list-info clearfix"><strong>上传人：<span>' + v.authorName + '</span></strong><span>' + moment(v.createDate).format("YYYY-MM-DD") + '</span></div></li>'
        });
        $("#indiviInfo").html(listHtml);
    });

    //公共文件数据 
    $.getJSON("/api/base/reload/public", {
        page: 1,
        limit: 5
    }, function (res, textStatus, jqXHR) {
        var listHtml = "";
        $.each(res.data, function (k, v) {
            listHtml += '<li><h3 class="list-title"><a href="/main/detail/' + v._id + '" class="layui-elip">' + v.titleName + '</a></h3>\
                        <div class="list-info clearfix"><strong>上传人：<span>' + v.authorName + '</span></strong><span>' + moment(v.createDate).format("YYYY-MM-DD") + '</span></div></li>'
        });
        $("#publicInfo").html(listHtml);
    });
});