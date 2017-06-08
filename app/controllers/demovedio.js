$.videoPlayer.url = '/media/Innovation+For+Health-SD.mp4';
$.videoPlayer.addEventListener('complete', function() {
	if (Alloy.Globals.OS == 'android') {
		$.videoplayerWindow.close();
	} else {
		Alloy.Globals.navWin.closeWindow($.videoplayerWindow);
	}
});
$.videoPlayer.addEventListener('fullscreen', function(e) {
	if (!e.entering) {
		$.videoPlayer.stop();
		$.videoPlayer.release();
		if (Alloy.Globals.OS == 'android') {
			$.videoplayerWindow.close();
		} else {
			Alloy.Globals.navWin.closeWindow($.videoplayerWindow);
		}
	}
});
