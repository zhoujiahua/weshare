(function () {
    layui.config({
        //dir: '/res/layui/',//layui.js 所在路径（注意，如果是script单独引入layui.js，无需设定该参数。），一般情况下可以无视
        //version: false, //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
        //debug: false, //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
        base: '/comm/main/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
    }).extend({ //设定模块别名
        comm: 'comm', //如果 comm.js 是在根目录，也可以不用设定别名
        // tools: "tools" //工具方法
        //mod1: 'comm/abc' //相对于上述 base 目录的子目录
    });
}())