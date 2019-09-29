layui.use(["layer", "form", "element"], function () {
    var layer = layui.layer,
        element = layui.element,
        form = layui.form,
        $ = layui.$;

    //监听提交
    form.on('submit(searchBtn)', function (data) {
        layer.msg(JSON.stringify(data.field));
        return false;
    });
})