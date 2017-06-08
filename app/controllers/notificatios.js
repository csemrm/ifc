$.notificatiosWin.add(Alloy.createController("headerview", {
	title : "Notifications",
	logoImage : "/images/button/notifications-Btn.png",
	titleColor : "#51c4d4"
}).getView());

function notificatiosWinFocus() {
	$.activityIndicator.show();
	Alloy.Globals.dataSynchronize(function(success) {
		var data = Ti.App.Properties.getObject("IFCData", {});
		var readNotifications = Ti.App.Properties.getList("readNotification", []);
		var tableData = [];
		_.each(data.Notification, function(Notification) {
			var notificationTableViewRow = Ti.UI.createTableViewRow({
				width : 300,
				xdata : Notification,
				//selectionStyle : Titanium.UI.iOS.TableViewCellSelectionStyle.GRAY,
				hasChild : true
			});
			if (Alloy.Globals.OS != 'android') {
				notificationTableViewRow.selectionStyle = Titanium.UI.iOS.TableViewCellSelectionStyle.GRAY;
			}
			var titleLabel = Ti.UI.createLabel({
				text : Notification.notification,
				font : {
					fontSize : 15,
					fontWeight : (readNotifications.indexOf(Notification.id) != -1) ? 'normal' : 'bold'
				},
				left : 15,
				color : '#000'
			});
			notificationTableViewRow.add(titleLabel);
			tableData.push(notificationTableViewRow);
		});
		$.notificationsTableView.setData(tableData);
		$.activityIndicator.hide();
	});
};

function notificationsTableViewClick(e) {
	Alloy.Globals.winOpener("notificationsDetails", false, e.rowData.xdata);
};
function tableDeleteFunction(e) {
	var data = Ti.App.Properties.getObject("IFCData", {});
	data.Notification = _.reject(data.Notification, function(obj) {
		return obj.id == e.rowData.xdata.id;
	});
	Ti.App.Properties.setObject("IFCData", data);

	var readNotifications = Ti.App.Properties.getList("readNotification", []);
	readNotifications = _.reject(readNotifications, function(num) {
		return num == e.rowData.xdata.id;
	});
	Ti.App.Properties.setList("readNotification", readNotifications);
	Alloy.Globals.setNotification();
};

