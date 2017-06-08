$.indexWin.open();

$.indexWin.addEventListener('open', function() {

	if (Alloy.Globals.OS == 'android') {
		function writeFile() {
			var filenameBase = new Date().getTime();
			var file = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory + filenameBase + '.txt');
			file.write("a");
			return file.exists();
		}

		writeFile();
	}

});

/*var url = Ti.App.Properties.getBool('firstRun', true) ? Alloy.Globals.allDataURL : (Alloy.Globals.allDataURL + '/' + Ti.App.Properties.getString("downloadTime"));
 Ti.API.info(url);

 function extend_(destination, source) {
 _.each(source, function(d) {
 var index = destination.indexOf(_.findWhere(destination, {
 id : d.id
 }));
 if (index === -1)
 destination.unshift(d);
 else
 destination[index] = d;
 });
 return destination;
 };
 */
Alloy.Globals.dataSynchronize(function(successResult) {
	if (successResult.success || Ti.App.Properties.getObject("IFCData", null)) {
		if (Ti.App.Properties.getBool("loggedin", false)) {
			Alloy.Globals.winOpener("homescreen", false, {});
		} else {
			Alloy.Globals.winOpener('infoscreen', true, {});
		}
		setTimeout(function() {
			$.indexWin.add(Alloy.createController('leftmenu').getView());
		}, 500);
	} else {
		alert(successResult.msg);
	}
});
/*
 if (Alloy.Globals.xhr.isOnline()) {
 var files = [];
 Alloy.Globals.xhr.get(url, function(IFCAllData) {
 Ti.API.info("IFCAllData == " + JSON.stringify(IFCAllData));
 if (!!IFCAllData.data.success) {
 if (Ti.App.Properties.getObject("IFCData", null)) {
 var IFCData = Ti.App.Properties.getObject("IFCData", {});
 Ti.API.info('old data === ' + JSON.stringify(IFCData));
 _.each(IFCData, function(element, model) {
 if (model != 'Company') {
 IFCData[model] = _.where(extend_(IFCData[model], IFCAllData.data.all_info[model]), {
 is_deleted : false
 });
 if (model == 'Document') {
 _.each(IFCData[model], function(doc) {
 files.push(doc.filename);
 });
 } else if (model == 'Information') {
 _.each(IFCData[model], function(inf) {
 files.push(inf.multimedia);
 });
 }
 } else {
 IFCData[model] = _.extend(IFCData[model], IFCAllData.data.all_info[model]);
 }
 });
 Ti.API.info('files ' + JSON.stringify(files));
 Ti.App.Properties.setObject("IFCData", IFCData);
 Ti.API.info('new data === ' + JSON.stringify(IFCData));
 Ti.App.Properties.setString("downloadTime", IFCAllData.data.download_time);

 } else {
 Ti.App.Properties.setBool('firstRun', false);
 Ti.App.Properties.setObject("IFCData", IFCAllData.data.all_info);
 Ti.App.Properties.setString("downloadTime", IFCAllData.data.download_time);
 }
 if (Ti.App.Properties.getBool("loggedin", false)) {
 Alloy.Globals.winOpener("homescreen", false, {});
 } else {
 Alloy.Globals.winOpener('infoscreen', true, {});
 }
 setTimeout(function() {
 $.indexWin.add(Alloy.createController('leftmenu').getView());
 }, 500);
 } else {
 alert("Data is not available. Please try again later");
 }
 }, function(errResult) {
 alert("Network request problem. Please try again later");
 Ti.API.info(errResult);
 }, {});
 } else {
 alert("No Network Connection!");
 }
 */

if (Alloy.Globals.OS == 'android') {
	$.indexWin.backgroundImage = Ti.App.Android.R.drawable.background;
	var img = Ti.UI.createImageView({
		// 1. Finding the launch image
		image : (function getImage() {
			if (Ti.Platform.name === 'iPhone OS') {
				// Working around orientation-bug
				if (Ti.Platform.osname === 'ipad' || Math.max(Ti.Platform.displayCaps.platformWidth, Ti.Platform.displayCaps.platformHeight) === 736) {
					return 'Default-' + (Ti.Gesture.isPortrait() ? 'Portrait' : 'Landscape') + '.png';
				} else {
					return 'Default.png';
				}

			} else if (Ti.Platform.name === 'android') {
				return Ti.App.Android.R.drawable.background;
			}

		})(),
		// Working around 9-patch drawable bug
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
	});
	var view = Ti.UI.createView({

		// Working around pixel bug
		height : Ti.Platform.displayCaps.platformHeight / Ti.Platform.displayCaps.logicalDensityFactor,
		bottom : 0
	});

	view.add(img);
	$.indexWin.add(view);
}
