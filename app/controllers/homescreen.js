//if (Ti.Platform.displayCaps.platformHeight > 480) {
//$.homescreenWin.backgroundImage = "images/bg/home-iPhone5-Bg.png";
//$.aboutView.top = 65;
//$.staffPluseView.top = 150;
//$.notificationView.top = 150;
//$.downloadsView.top = 320;
//$.litmusTestView.top = 320;
//$.termOfUseView.top = 395;
//$.indicatorView.top = 150;
//} else {
//$.homescreenWin.backgroundImage = "images/bg/home-iPhone4-Bg.png";
//$.aboutView.top = 28;
//$.staffPluseView.top = 105;
//$.notificationView.top = 105;
//$.downloadsView.top = 270;
//$.litmusTestView.top = 270;
//$.termOfUseView.top = 345;
//$.indicatorView.top = 105;
//}

Alloy.Globals.setNotification();
$.indicatorView.add(Alloy.Globals.indicatorLabelHome);

function aboutButtonTouchend() {
	Alloy.Globals.winOpener("aboutus", false, {});
};

function staffPluseButtonTouchend() {
	Alloy.Globals.winOpener("staffpulse1", false, {});
};

function notificationButtonTouchend() {
	Alloy.Globals.winOpener("notificatios", false, {});
};

function haveAnIdeaButtonTouchend() {
	Alloy.Globals.winOpener("feedback1", false, {});
};

function downloadsButtonTouchend() {
	Alloy.Globals.winOpener("downloads", false, {});
};

function litmusTestButtonTouchend() {
	Alloy.Globals.winOpener("litmustest1", false, {});
};

function termUseButtonTouchend() {
	Alloy.Globals.winOpener("termsofuse", false, {});
};

function videoComplete(e) {
	$.videoPlayer.fullscreen = false;
}

function hideVideoPlayer(e) {
	if (e.entering === false) {
		$.videoPlayer.stop();
		$.videoPlayer.hide();
		$.videoPlayer.height = 0;
		//$.videoPlayer.release();
		$.homescreenWin.orientationModes = [Ti.UI.PORTRAIT];
	}
};

function openFullScreenVideoPlayer(_url) {
	var module = require("com.android.rtmp");
	var view = module.createPlayerView({
		streamURL : _url,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
	});

	var mainWindow = Ti.UI.createWindow({
		backgroundColor : 'white',
		fullscreen : true,
		navBarHidden : true,
		theme : "Theme.AppCompat.NoTitleBar.Fullscreen",
		orientationModes : [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT]
	});

	var btn_back = Ti.UI.createButton({
		right : 10,
		height : 35,
		width : 35,
		backgroundImage : '/images/close.png',
	});

	view.addEventListener('stream_status', function(e) {
		//alert('======STREAM STATUS====== ' + JSON.stringify(e));
	});

	var topBar = Ti.UI.createView({
		top : 0,
		height : 65,
		width : Ti.UI.FILL,
	});

	mainWindow.add(view);
	topBar.add(btn_back);
	mainWindow.add(topBar);

	mainWindow.addEventListener('close', function() {
		try {
			view.stopPlaying();
		} catch(e) {
			Ti.API.info('error while stopping the stream');
		}
		mainWindow.remove(view);
		view = null;
		module = null;
	});
	btn_back.addEventListener('click', function() {
		mainWindow.close();
	});
	setTimeout(function() {
		try {
			view.startPlaying();
		} catch(e) {
			Ti.API.info('error while playing the stream');
		}
	}, 3000);
	mainWindow.open();
};

function watchVideoTouchEndFunction() {
	//Alloy.Globals.winOpener('demovedio',false,{});
	var data = Ti.App.Properties.getObject("IFCData", {});
	Ti.API.info('DDDData  ' + data.Company.demo);
	if (Alloy.Globals.OS == 'android') {
		openFullScreenVideoPlayer(data.Company.demo);
	} else {
		$.homescreenWin.orientationModes = [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT, Ti.UI.PORTRAIT];
		$.videoPlayer.url = data.Company.demo;
		//'/media/demo.mp4';
		$.videoPlayer.height = Ti.UI.FILL;
		$.videoPlayer.show();
		$.videoPlayer.fullscreen = true;
		$.videoPlayer.play();
	}
	/*$.activityIndicator.show();

	 var data = Ti.App.Properties.getObject("IFCData", {});
	 _.each(data.Information, function(aboutCmy) {
	 Ti.API.info(aboutCmy);
	 $.aboutTextLabel.text = aboutCmy.info;
	 if (!aboutCmy.multimedia) {
	 $.activityIndicator.hide();
	 return false;
	 }
	 var aboutVideo = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, aboutCmy.multimedia.split('/').pop());
	 if (aboutVideo.exists()) {
	 $.activityIndicator.hide();
	 $.videoPlayer.media = null;
	 setTimeout(function() {
	 $.videoPlayer.media = aboutVideo;
	 $.videoPlayer.play();
	 }, 1000);
	 // aboutVideo.deleteFile();
	 //aboutVideo = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'about.mov');
	 } else {
	 Alloy.Globals.xhr.getFile(aboutCmy.multimedia, function(videoFile) {
	 Ti.API.info(JSON.stringify(videoFile));
	 $.activityIndicator.hide();
	 aboutVideo.write(videoFile.data);
	 $.videoPlayer.media = null;
	 setTimeout(function() {
	 $.videoPlayer.media = aboutVideo;
	 $.videoPlayer.play();
	 }, 1000);
	 }, function(errResult) {
	 Ti.API.info(errResult);
	 $.activityIndicator.hide();
	 }, {}, {});
	 }

	 });*/
}
