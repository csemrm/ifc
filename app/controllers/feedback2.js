var header = Alloy.createController("headerview", {
	title : "Feedback",
	logoImage : "/images/button/feedback-Logo.png",
	titleColor : "#e67e22"
}).getView();
$.feedback2Win.add(header);

var playerCounter = 0,
    playerTimer = null;

function feedback2WinFocus() {
	// ML text area value check
	if (!!Alloy.Globals.feedbackFormData['data[Feedback][problem]']) {
		$.MLTextArea.value = Alloy.Globals.feedbackFormData['data[Feedback][problem]'];
		//$.nextBtn.enabled = true;
		//$.nextBtn.backgroundColor = "#e67e22";
		//$.nextBtn.color = "#fff";
		$.MLTextArea.color = "#000";
	} else {
		$.nextBtn.enabled = false;
		$.nextBtn.backgroundColor = "#67cee3";
		$.nextBtn.color = "#3dbfd9";
	}

	//sol text area value check
	if (!!Alloy.Globals.feedbackFormData['data[Feedback][message]']) {
		$.solTextArea.value = Alloy.Globals.feedbackFormData['data[Feedback][message]'];
		$.nextBtn.enabled = true;
		$.nextBtn.backgroundColor = "#e67e22";
		$.nextBtn.color = "#fff";
		$.solTextArea.color = "#000";
	} else {
		$.nextBtn.enabled = false;
		$.nextBtn.backgroundColor = "#67cee3";
		$.nextBtn.color = "#3dbfd9";
	}
	// if (!!Alloy.Globals.feedbackFormData['data[Feedback][problem]']) {
	// $.MLTextArea.value = Alloy.Globals.feedbackFormData['data[Feedback][problem]'];
	// }
};

function MLTextAreaChangeFunction(e) {
	Ti.API.info(JSON.stringify(e));
	// if (!!e.source.value) {
	// $.nextBtn.enabled = true;
	// $.nextBtn.backgroundColor = "#e67e22";
	// $.nextBtn.color = "#fff";
	// } else {
	// $.nextBtn.enabled = false;
	// $.nextBtn.backgroundColor = "#67cee3";
	// $.nextBtn.color = "#3dbfd9";
	// }
};

function MLTextAreaFocus(e) {
	if (e.source.value == "Please suggest your idea...") {
		e.source.value = "";
		e.source.color = "#000";
	}
};

function MLTextAreaBlur(e) {
	if (e.source.value == '') {
		e.source.value = "Please suggest your idea...";
		e.source.color = "#999";
	}
};
function MLTextAreaReturnFunction() {
	Alloy.Globals.feedbackFormData['data[Feedback][problem]'] = $.MLTextArea.value;
};

function solTextAreaChangeFunction(e) {
	Ti.API.info(JSON.stringify(e));
	if (!!e.source.value) {
		$.nextBtn.enabled = true;
		$.nextBtn.backgroundColor = "#e67e22";
		$.nextBtn.color = "#fff";
	} else {
		$.nextBtn.enabled = false;
		$.nextBtn.backgroundColor = "#67cee3";
		$.nextBtn.color = "#3dbfd9";
	}
};

function solTextAreaFocus(e) {
	if (e.source.value == "Please suggest possible solution...") {
		e.source.value = "";
		e.source.color = "#000";
	}
};

function solTextAreaBlur(e) {
	if (e.source.value == '') {
		e.source.value = "Please suggest possible solution...";
		e.source.color = "#999";
	}
};

function solTextAreaReturnFunction() {
	Alloy.Globals.feedbackFormData['data[Feedback][message]'] = $.solTextArea.value;
};

var currentCamera = null;
var counter = 0,
    videoLength = 0;
var timer = null,
    timeElapsed = 0;
var recordedVideo = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'feedback.mp4');

var video_capturing = false;
function recordVideoBtnClick() {
	clearTimer();
	$.cameraOverlayView.show();
	currentCamera = null;
	Ti.Media.showCamera({
		success : function(e) {
			if (e.success) {
				clearTimer();
				$.recordBtn.visible = true;
				$.stopBtn.visible = false;

				if (recordedVideo.exists()) {
					recordedVideo.deleteFile();
					recordedVideo = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'feedback.mp4');
				}
				// bug fix for video player caching issue :)
				$.videoPlayer.media = null;
				recordedVideo.write(e.media);
				$.videoPlayer.show();

				header.hide();
				$.feedback2Win.fullscreen = true;

				Ti.Media.hideCamera();
				videoLength = counter;
				//clearTimer();

				setTimeout(function() {
					$.videoPlayer.media = recordedVideo;
					// $.videoPlayer.play();
					$.playBtn.visible = true;
					$.pauseBtn.visible = false;
					// playerTimer = setInterval(playerTimerIncrement, 1000);
				}, 1000);
			}
		},
		error : function(error) {
			clearTimer();
			var a = Ti.UI.createAlertDialog({
				title : 'Camera'
			});
			if (error.code == Ti.Media.NO_CAMERA) {
				a.setMessage('Device does not have video recording capabilities');
			} else {
				a.setMessage('Unexpected error: ' + error.code);
			}
			a.show();
		},
		overlay : $.cameraOverlayView, //cameraWrapperViewBugFixing,
		videoMaximumDuration : 30000,
		videoQuality : Titanium.Media.QUALITY_HIGH,
		showControls : false,
		allowEditing : false, //
		autohide : false,
		mediaTypes : Ti.Media.MEDIA_TYPE_VIDEO,
		animated : false,
		transform : Ti.UI.create2DMatrix().scale(1)
	});
	switchCamera();
};

Alloy.Globals.backFromPlayer = false;
function clearTimer() {
	clearInterval(timer);
	counter = 0;
	$.timeLbl.text = '00:00';
	$.recordingIndicator.hide();
};

$.feedback2Win.addEventListener('focus', function() {
	if (Alloy.Globals.backFromPlayer) {
		// clearTimer();
		recordVideoBtnClick();
		Alloy.Globals.backFromPlayer = false;
	}
});

function onCancelBtnClick() {
	clearTimer();
	$.cameraOverlayView.hide();
	currentCamera = null;
	header.show();
	Ti.Media.hideCamera();
	$.nextBtn.enabled = false;
	$.nextBtn.backgroundColor = "#67cee3";
	$.nextBtn.color = "#3dbfd9";
	if (!!video_capturing)
		stopVideoCapture();
}

var indicator = true;
function timerIncrement() {
	counter++;
	$.timeLbl.text = '00:' + (counter < 10 ? '0' + counter : counter);
	if (indicator) {
		$.recordingIndicator.show();
		indicator = false;
	} else {
		$.recordingIndicator.hide();
		indicator = true;
	}
};

function startVideoCapture() {
	video_capturing = true;
	counter = 0;
	indicator = true;
	Ti.Media.startVideoCapture();
	timer = setInterval(timerIncrement, 1000);
	$.recordBtn.visible = false;
	$.stopBtn.visible = true;
};

function stopVideoCapture() {
	video_capturing = false;
	Ti.Media.stopVideoCapture();
	$.recordBtn.visible = true;
	$.stopBtn.visible = false;
};

function switchCamera() {
	if (currentCamera === Ti.Media.CAMERA_FRONT)
		currentCamera = Ti.Media.CAMERA_REAR;
	else
		currentCamera = Ti.Media.CAMERA_FRONT;
	setTimeout(function() {
		Ti.Media.switchCamera(currentCamera);
	}, 300);
};

// video palyer
function retakeVideo() {
	recordVideoBtnClick();
	$.feedback2Win.fullscreen = false;
	$.videoPlayer.hide();
	$.videoPlayer.stop();
};

function videoPlayerComplete() {
	$.pauseBtn.visible = false;
	playerClearTimer();
	$.playBtn.visible = true;
}

function playerTimerIncrement() {
	playerCounter = Math.round($.videoPlayer.currentPlaybackTime / 1000);
	$.playerTimeLbl.text = '00:' + (playerCounter < 10 ? '0' + playerCounter : playerCounter);
};

function playerClearTimer() {
	clearInterval(playerTimer);
	$.playerTimeLbl.text = '00:00';
};

function playVideo() {
	$.playBtn.visible = false;
	$.pauseBtn.visible = true;
	if ($.videoPlayer.media === null)
		$.videoPlayer.media = recordedVideo;
	$.videoPlayer.play();
	playerTimer = setInterval(playerTimerIncrement, 1000);
};

function PauseVideo() {
	$.pauseBtn.visible = false;
	$.playBtn.visible = true;
	$.videoPlayer.pause();
	clearInterval(playerTimer);
};

function saveVideoTouchend() {
	Alloy.Globals.feedbackFormData['data[Feedback][vdo]'] = recordedVideo.read();
	header.show();
	$.videoPlayer.stop();
	$.videoPlayer.hide();
	$.cameraOverlayView.hide();
	$.nextBtn.enabled = true;
	$.nextBtn.backgroundColor = "#e67e22";
	$.nextBtn.color = "#fff";
	$.dialog.show();
};
// End Video Player
function backBtnClick() {
	if (Alloy.Globals.OS == 'android') {
		$.feedback2Win.close();
	} else {
		Alloy.Globals.navWin.closeWindow($.feedback2Win);
	}
};

function nextBtnClick() {
	Alloy.Globals.winOpener("feedback3", false, {});
};