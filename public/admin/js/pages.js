layui.define(["laypage"], function (exprots) {
    var laypage = layui.laypage;
    //执行一个laypage实例
    laypage.render({
        elem: 'pageid', //注意，这里的 pageid 是 ID，不用加 # 号
        count: 100, //数据总数，从服务端得到
        limit: 10,
        curr: 1,
        theme: "#1E9FFF",
        jump: function (obj, first) {
            console.log(obj)
            console.log(first)
        }
    });
});
