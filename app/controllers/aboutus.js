$.aboutUSWin.add(Alloy.createController("headerview", {
	title : "About Us",
	logoImage : "/images/button/about-Btn.png",
	titleColor : "#51c4d4"
}).getView());

$.activityIndicator.show();

function videoError(_error) {
	Ti.API.info('videoError ' + JSON.stringify(_error));
};

function videoLoaded(_event) {
	$.activityIndicator.hide();
	Ti.API.info('videoLoaded ' + JSON.stringify(_event));
}

var data = Ti.App.Properties.getObject("IFCData", {});
_.each(data.Information, function(aboutCmy) {
	Ti.API.info(" aboutCmy  " + aboutCmy);
	Ti.API.info(" media url " + aboutCmy.multimedia);
	$.aboutTextLabel.text = aboutCmy.info;
	if (!aboutCmy.multimedia) {
		$.activityIndicator.hide();
		return false;
	}
	var aboutVideo = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, aboutCmy.multimedia.split('/').pop());
	Ti.API.info(" aboutVideo " + aboutCmy.multimedia.split('/').pop());
	if (aboutVideo.exists()) {
		Ti.API.info('aboutVideo inside');
		$.activityIndicator.hide();
		$.videoPlayer.media = null;
		if (Alloy.Globals.OS == 'android') {
			$.videoPlayer.url = Ti.Filesystem.applicationDataDirectory + '/' + aboutCmy.multimedia.split('/').pop();
		} else {
			setTimeout(function() {
				$.videoPlayer.media = aboutVideo;
				//$.videoPlayer.play();
			}, 1000);
		}
		// aboutVideo.deleteFile();
		// aboutVideo = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'about.mov');
	} else {
		Alloy.Globals.xhr.getFile(aboutCmy.multimedia, function(videoFile) {
			Ti.API.info(" videoFile " + JSON.stringify(videoFile));
			$.activityIndicator.hide();
			aboutVideo.write(videoFile.data);
			$.videoPlayer.media = null;
			setTimeout(function() {
				$.videoPlayer.media = aboutVideo;
				//$.videoPlayer.play();
			}, 1000);
		}, function(errResult) {
			Ti.API.info(errResult);
			$.activityIndicator.hide();
		}, {}, {});
	}
});

