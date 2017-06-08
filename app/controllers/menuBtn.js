function slideMenu() {
	Ti.API.info('slideMenu');
	if (Alloy.Globals.isClosed === true) {
		if (Alloy.Globals.OS == 'android') {
			var menuparent = Ti.UI.createView({
				height : Titanium.UI.FILL,
				width : Titanium.UI.FILL,
			});
			var menuView = Alloy.createController('leftmenu').getView();
			var menubtn_shadow = Alloy.createController('menubtn_shadow').getView();
			menuView.width = 250;
			menuView.left = 0;
			menuparent.add(menuView);
			menuparent.add(menubtn_shadow);
			Alloy.Globals.navWin.add(menuparent);
		} else {
			Alloy.Globals.navWin.animate({
				left : 250,
				curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
			});
		}

		Alloy.Globals.isClosed = false;
	} else {
		if (Alloy.Globals.OS == 'android') {
			Alloy.Globals.navWin.remove(Alloy.Globals.navWin.children[Alloy.Globals.navWin.children.length - 1]);
		} else {
			Alloy.Globals.navWin.animate({
				left : 0,
				curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
			}, function() {
			});
		}
		Alloy.Globals.isClosed = true;
	}
}