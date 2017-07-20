Alloy.Globals.PulseFormData = {};
Alloy.Globals.litmustestFormData = {};
Alloy.Globals.feedbackFormData = {};

Alloy.Globals.alertDialog = Ti.UI.createAlertDialog({
	buttonNames : ['OK'],
	message : 'Thank you for your submission.'
});
Alloy.Globals.alertDialog.addEventListener('click', function(e) {
	if (e.index === 0) {
		Alloy.Globals.winOpener('homescreen', true, {});
	};
});
Alloy.Globals.device = (Ti.Platform.displayCaps.platformHeight > 480) ? 'iphone5' : 'iphone4';

//all url of ifca
//Alloy.Globals.root = "http://custom-ifc-live.appinstitute.co.uk/";
Alloy.Globals.root = "http://custom-ifc-live.appinstitute.co.uk/";
Alloy.Globals.allDataURL = "companies/g/1/" + Alloy.Globals.device;
Alloy.Globals.deviceTokenURL = "users/device_entry/";
Alloy.Globals.pulseSubmitURL = "pulses_users/add/";
Alloy.Globals.litmustestSubmitURL = "litmustestsUsers/add";
Alloy.Globals.feedbackSubmitURL = "feedbacks/add";
Alloy.Globals.imageURL = Alloy.Globals.root + "files/image/";
Alloy.Globals.notificationURL = "notifications/n_d/";
Alloy.Globals.PasswordRetrieveURL = "companies/iforgot";
Alloy.Globals.loginURL = "companies/login";
Alloy.Globals.termsOfUseURL = Alloy.Globals.root + "information/terms_of_uses/";
//network request
var XHR = require("xhr");
Alloy.Globals.xhr = new XHR();

Alloy.Globals.OS = Ti.Platform.osname;
Alloy.Globals.dataSynchronize = require('downloadAllData').downloadData;
Alloy.Globals.getLocalFile = require('downloadAllData').getLocalFile;
Alloy.Globals.navWin = null;
Alloy.Globals.currentWins = [];
Alloy.Globals.isClosed = true;
Alloy.Globals.winOpener = function(winName, closePrevWins, winParams) {
	var win = Alloy.createController(winName, winParams || {}).getView();
	if (Alloy.Globals.OS == 'android') {
		win.open();
		Alloy.Globals.navWin = win;
	} else {

		if (closePrevWins === true || Alloy.Globals.navWin === null) {
			var navWin = Ti.UI.iOS.createNavigationWindow({
				window : win,
				backgroundColor : '#fff',
				width : Ti.Platform.displayCaps.platformWidth
			});
			navWin.left = (Alloy.Globals.navWin === null) ? 0 : 320;
			navWin.open({
				animated : false // highly effective to eliminate the black screen delay during launch!
			});
			if (navWin.left) {
				navWin.animate({
					left : 0,
					curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
				}, function() {
					// make the left menu invisible after animation is complete
					//Alloy.Globals.leftMenu.hide();
				});
			}
			if (Alloy.Globals.navWin !== null) {
				Alloy.Globals.navWin.close();
				// make the currentWins array empty as the containing NavigationWindow for these windows is closed
				Alloy.Globals.currentWins = [];
			}
			Alloy.Globals.navWin = navWin;
		} else {
			Alloy.Globals.navWin.openWindow(win);
		}
		//Set Title of Win
		Alloy.Globals.st(win, win.getTitle());
	}
	// push win to currentWins array, this is used during backButton click event. Close the top most win from this array to go back
	Alloy.Globals.currentWins.push(win);
};

Alloy.Globals.st = function(win, title) {
	win.setTitleControl(Ti.UI.createLabel({
		text : title,
		color : '#d93d7f',
		font : {
			fontSize : 18,
			//fontWeight : 'bold'
		}
	}));
};
Alloy.Globals.ab = function(e) {
	//Alloy.Globals.b();
	//alert(e);
	return false;
};
// android back for some certain pages containing secondary/inner windows
// b = back
Alloy.Globals.b = function(e) {
	if (Alloy.Globals.currentWins.length > 1) {
		Alloy.Globals.navWin.closeWindow(Alloy.Globals.currentWins.pop());
	}
};

//notification indicator label
Alloy.Globals.indicatorLabelHome = Ti.UI.createLabel({
	backgroundColor : "#f35050",
	text : "10",
	color : "#fff",
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	width : Ti.UI.FILL,
	height : Ti.UI.FILL,
	visible : false
});

Alloy.Globals.indicatorLabelSidePanel = Ti.UI.createLabel({
	backgroundColor : "#f35050",
	text : "10",
	color : "#fff",
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	width : Ti.UI.FILL,
	height : Ti.UI.FILL,
	visible : false
});

Alloy.Globals.setNotification = function() {
	Ti.API.info('total ' + Ti.App.Properties.getObject("IFCData", {}).Notification.length);
	Ti.API.info('read ' + Ti.App.Properties.getList("readNotification", []).length);
	var count = Ti.App.Properties.getObject("IFCData", {}).Notification.length - Ti.App.Properties.getList("readNotification", []).length;
	if (!!count) {
		Alloy.Globals.indicatorLabelSidePanel.text = count;
		Alloy.Globals.indicatorLabelHome.text = count;
		Alloy.Globals.indicatorLabelHome.show();
		Alloy.Globals.indicatorLabelSidePanel.show();
	} else {
		Alloy.Globals.indicatorLabelHome.hide();
		Alloy.Globals.indicatorLabelSidePanel.hide();
	}
};

if (Alloy.Globals.OS != 'android') {
	// push notifications source
	var UrbanAirship = require('ti.urbanairship');
	Ti.API.info("module is => " + UrbanAirship);

	/*
	* Urban Airship will load the options from an AirshipConfig.plist file that
	* should be stored in the application bundle. You will find an example
	* AirshipConfig.plist file in the 'example/platform/iphone' folder of the module.
	*/

	// Set UA options
	UrbanAirship.tags = ['IdeasForChange'];
	UrbanAirship.alias = 'IdeasForChange';
	UrbanAirship.autoBadge = true;
	UrbanAirship.autoResetBadge = true;
	Ti.UI.iOS.setAppBadge(null);
}

function eventCallback(e) {
	//alert(e.data);
	// Pass the notification to the module
	UrbanAirship.handleNotification(e.data);
	Ti.API.info('Push message received');
	Ti.API.info('  Message: ' + e.data.alert);
	Ti.API.info('  Payload: ' + e.data.aps);

	Alloy.Globals.dataSynchronize(function(success) {
		Alloy.Globals.setNotification();
	});

	/*if (!!e.data.aps && !!e.data.aps.notification_id) {
	 Alloy.Globals.xhr.get(Alloy.Globals.notificationURL + e.data.aps.notification_id, function(notificationResult) {
	 Ti.API.info('nofication result == ' + JSON.stringify(notificationResult));
	 if (notificationResult.data.success) {
	 var data = Ti.App.Properties.getObject("IFCData", {});
	 data.Notification.unshift(notificationResult.data.Notification);
	 Ti.App.Properties.setObject("IFCData", data);
	 } else {

	 }
	 }, function(errResult) {
	 Ti.API.info(errResult);
	 }, {});
	 }*/
}

function eventSuccess(e) {
	// *MUST* pass the received token to the module
	UrbanAirship.registerDevice(e.deviceToken);

	Ti.API.info('Received device token: ' + e.deviceToken);
	Alloy.Globals.deviceToken = e.deviceToken;
}

function eventError(e) {
	Ti.API.info('Error:' + e.error);
	var alert = Ti.UI.createAlertDialog({
		title : 'Error',
		message : e.error
	});
	alert.show();
}

// Wait for user settings to be registered before registering for push notifications
function registerForPush() {
	Ti.Network.registerForPushNotifications({
		success : eventSuccess,
		error : eventError,
		callback : eventCallback
	});
	// Remove event listener once registered for push notifications
	Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);
}

if (Alloy.Globals.OS != 'android') {
	Ti.App.iOS.addEventListener('usernotificationsettings', registerForPush);
	//Register notification types to use
	Ti.App.iOS.registerUserNotificationSettings({
		types : [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
	});
}

Alloy.Globals.validateEmail = function(emailAddress) {
	var validate;
	var str = emailAddress;
	var filter = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if (filter.test(str)) {
		validate = true;
	} else {
		validate = false;
	}
	return (validate);
};
