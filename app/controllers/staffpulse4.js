$.staffpulseWin4.add(Alloy.createController("headerview", {
	title : "Staff Pulse",
	logoImage : "/images/button/staffPluse-Btn.png",
	titleColor : "#e74c3c"
}).getView());
var args = arguments[0] || {};
var data = Ti.App.Properties.getObject("IFCData", {});
var pulseCategory = data.PulseCategory[2];
$.motivationLabel.text = pulseCategory.name;

_.each(_.where(data.Pulse, {
	pulse_category_id : pulseCategory.id
}), function(pulse) {
	$.questionView.add(Alloy.createController('singlePulseQuestion', pulse).getView());
	// $.labelLookForward.text = pulse.question;
	// $.labelEnthusiastic.text = pulse.question;
	// $.labelTimePass.text = pulse.question;
});
function backFunction() {
	if (Alloy.Globals.OS == 'android') {
		$.staffpulseWin4.close();
	} else {
		Alloy.Globals.navWin.closeWindow($.staffpulseWin4);
	}
};

function backBtnClick() {
	if (Alloy.Globals.OS == 'android') {
		$.staffpulseWin4.close();
	} else {
		Alloy.Globals.navWin.closeWindow($.staffpulseWin4);
	}
};
function submitClickFn() {
	$.activityIndicator.show();
	Alloy.Globals.xhr.post(Alloy.Globals.pulseSubmitURL, Alloy.Globals.PulseFormData, function(pulseSuccessResult) {
		Ti.API.info(JSON.stringify(pulseSuccessResult));
		if (!!pulseSuccessResult.data.success) {
			$.activityIndicator.hide();
			Alloy.Globals.alertDialog.show();
			Alloy.Globals.PulseFormData = {};
		} else {
			$.activityIndicator.hide();
		}
	}, function(errResult) {
		Ti.API.info(errResult);
		$.activityIndicator.hide();
	}, {});
}
