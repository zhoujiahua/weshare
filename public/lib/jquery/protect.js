document.onkeydown = function () {
        var e = window.event || arguments[0];
        if (e.keyCode == 123) {
                alert('请尊重劳动成果！www.blooo.cn');
                return false;
        } else if ((e.ctrlKey) && (e.shiftKey) && (e.keyCode == 73)) {
                alert('请尊重劳动成果！www.blooo.cn');
                return false;
        } else if ((e.ctrlKey) && (e.keyCode == 85)) {
                alert('请尊重劳动成果！www.blooo.cn');
                return false;
        } else if ((e.ctrlKey) && (e.keyCode == 83)) {
                alert('请尊重劳动成果！www.blooo.cn');
                return false;
        }
}
document.oncontextmenu = function () {
        alert('请尊重劳动成果！www.blooo.cn');
        return false;
}