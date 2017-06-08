var args = arguments[0] || {};
Ti.API.info(JSON.stringify(args));
$.winTitleLabel.text = args.notification;
$.detailsTextLabel.text = args.body;
var readNotifications = Ti.App.Properties.getList("readNotification", []);
Ti.API.info("read notification === " + JSON.stringify(readNotifications));
if (readNotifications.indexOf(args.id) == -1) {
	Ti.API.info(args.id);
	readNotifications.push(args.id);
	Ti.App.Properties.setList("readNotification", readNotifications);
	Alloy.Globals.setNotification();
}
function backBtnTouchend() {
	if (Alloy.Globals.OS == 'android') {
		$.notificationsDetailsWin.close();
	} else {
		Alloy.Globals.navWin.closeWindow($.notificationsDetailsWin);
	}
};

