layui.use(['layer', 'form', 'element', 'dialog'], function () {
	var layer = layui.layer;
	var element = layui.element;
	var form = layui.form;
	var $ = layui.$;
	var dialog = layui.dialog;
	var hideBtn = $('#hideBtn');
	var mainLayout = $('#main-layout');
	var mainMask = $('.main-mask');
	//监听导航点击
	element.on('nav(leftNav)', function (elem) {
		var id = this.getAttribute('data-id'),
			url = this.getAttribute('data-url'),
			text = this.getAttribute('data-text');
		if (!url) {
			return;
		}
		var isActive = $('.main-layout-tab .layui-tab-title').find("li[lay-id=" + id + "]");
		if (isActive.length > 0) {
			//切换到选项卡
			element.tabChange('tab', id);
		} else {
			element.tabAdd('tab', {
				title: text,
				content: '<iframe src="' + url + '" name="iframe' + id + '" class="iframe" framborder="0" data-id="' + id + '" scrolling="auto" width="100%"  height="100%"></iframe>',
				id: id
			});
			element.tabChange('tab', id);
		}
		mainLayout.removeClass('hide-side');
	});
	//监听导航点击
	element.on('nav(rightNav)', function (elem) {
		var id = this.getAttribute('data-id'),
			url = this.getAttribute('data-url'),
			text = this.getAttribute('data-text');
		if (!url) {
			return;
		}
		var isActive = $('.main-layout-tab .layui-tab-title').find("li[lay-id=" + id + "]");
		if (isActive.length > 0) {
			//切换到选项卡
			element.tabChange('tab', id);
		} else {
			element.tabAdd('tab', {
				title: text,
				content: '<iframe src="' + url + '" name="iframe' + id + '" class="iframe" framborder="0" data-id="' + id + '" scrolling="auto" width="100%"  height="100%"></iframe>',
				id: id
			});
			element.tabChange('tab', id);

		}
		mainLayout.removeClass('hide-side');
	});
	//菜单隐藏显示
	hideBtn.on('click', function () {
		if (!mainLayout.hasClass('hide-side')) {
			mainLayout.addClass('hide-side');
		} else {
			mainLayout.removeClass('hide-side');
		}
	});

	//遮罩点击隐藏
	mainMask.on('click', function () {
		mainLayout.removeClass('hide-side');
	})
});