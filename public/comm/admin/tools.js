(function () {
    layui.define(["layer"], function (exprots) {
        var layer = layui.layer,
            $ = layui.$,
            tools = {};
        // localStorage 方法
        tools.Storage = function () {}
        tools.Storage.prototype.setItem = function (k, v) {
            localStorage.setItem(k, JSON.stringify(v));
        }
        tools.Storage.prototype.getItem = function (k) {
            return JSON.parse(localStorage.getItem(k));
        }
        tools.Storage.prototype.removeItem = function (k) {
            localStorage.removeItem(k)
        }
        tools.Storage.prototype.clear = function () {
            localStorage.clear();
        }

        exprots("tools", tools)
    });
}())