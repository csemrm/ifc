var video = arguments[0] || {};

function retakeVideo() {
	$.videoplayerWindow.close();
	Alloy.Globals.backFromPlayer = true;

};
var counter =  0, indicator = true;
function timerIncrement() {
	counter++;
	$.timeLbl.text = '00:' + (counter < 10 ? '0' + counter : counter);
	
	if(counter > video.time){
		clearTimer();
	}
	
};

function clearTimer() {
	counter = 0;
	$.timeLbl.text = '00:00';
	clearInterval(timer);
};

var timer = null;
function playVideo() {
	$.videoPlayer.media = null;
	timer = setInterval(timerIncrement, 1000);
	$.videoPlayer.media = video.media;
	$.videoPlayer.play();
};

function saveVideo () {
  
};