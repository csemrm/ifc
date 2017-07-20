function loginClick() {
	Alloy.Globals.winOpener('loginpinscreen', false, {});
}

var data = Ti.App.Properties.getObject("IFCData", {});

$.infoscreenWin.add(require("ImageSlideView").slideView(data.Slide, 4000, "left", Ti.Platform.osname == "android" ? 120 : 60));

$.infoscreenWin.addEventListener('open', function() {

	if (Alloy.Globals.OS == 'android') {
		function writeFile() {
			var filenameBase = new Date().getTime();
			var file = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory + filenameBase + '.txt');
			file.write("a");
			return file.exists();
		}

		if (Ti.Platform.version >= 6.0) {
			if (Titanium.Android.hasPermission('android.permission.RECORD_AUDIO')) {
				Ti.API.info('HAS RECORD_AUDIO PERMISSION');
			} else {
				Titanium.Android.requestPermissions(['android.permission.RECORD_AUDIO', 'android.permission.WRITE_EXTERNAL_STORAGE'], function(e) {
					Ti.API.info('HAS RECORD_AUDIO PERMISSION ' + JSON.stringify(e));
				});
			}
		}

		if (Ti.Media.hasCameraPermissions()) {
			Ti.API.info('CAMERA PERMISSION IS AVAILABLE');
		} else {
			Ti.Media.requestCameraPermissions(function(e) {
				if (writeFile()) {
					Ti.API.info('CAMERA PERMISSION GRANTED WRITE FILE');
				}
				if (e.success === true) {
					Ti.API.info('CAMERA PERMISSION GRANTED');
				} else {
					Ti.API.info('CAMERA PERMISSION DENIED');
				}
			});
		}
	}

});
