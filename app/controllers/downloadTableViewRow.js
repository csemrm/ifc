var pdf = arguments[0] || {};
$.activityIndicator.show();
Alloy.Globals.getLocalFile(pdf.filename, function(fileResult) {
	if (fileResult.success) {
		Ti.API.info(fileResult.url);
		$.downloadPdfWebView.url = fileResult.url;
	} else {
		alert(fileResult.msg);
	}
	$.activityIndicator.hide();
});
Alloy.Globals.navWin.width = null;
$.winTitleLabel.text = pdf.title;

function backBtnTouchend() {
	if (Alloy.Globals.OS == 'android') {
		$.downloadsPdfWin.close();
	} else {
		Alloy.Globals.navWin.closeWindow($.downloadsPdfWin);
	}
};

function downloadCloseFn() {
	Alloy.Globals.navWin.width = Ti.Platform.displayCaps.platformWidth;
}
