$.litmusTest2Win.add(Alloy.createController("headerview", {
	title : "'Litmus Test'",
	logoImage : "/images/button/litmusTest-Btn.png",
	titleColor : "#3cb878"
}).getView());

var data = Ti.App.Properties.getObject("IFCData", {});
var litmustestId = null;
_.each(data.Litmustest, function(litQuestion) {
	$.recommendedServiceLabel.text = litQuestion.question;
	litmustestId = litQuestion.id;
});

function litmusTest2WinFocus() {
	if (Alloy.Globals.litmustestFormData['data[LitmustestsUser][answer]'] == 1) {
		$.yesBtn.backgroundImage = "/images/button/yes-Btn-select.png";
		$.submitBtn.enabled = true;
		$.submitBtn.backgroundColor = "#e67e22";
		$.submitBtn.color = "#fff";
	} else if (Alloy.Globals.litmustestFormData['data[LitmustestsUser][answer]'] == 0) {
		$.noBtn.backgroundImage = "/images/button/no-Btn-select.png";
		$.submitBtn.enabled = true;
		$.submitBtn.backgroundColor = "#e67e22";
		$.submitBtn.color = "#fff";
	}
};

function yesBtnTouchEnd(e) {
	Ti.API.info(e.source.value);
	Alloy.Globals.litmustestFormData['data[LitmustestsUser][answer]'] = e.source.value;
	$.yesBtn.backgroundImage = "/images/button/yes-Btn-select.png";
	$.noBtn.backgroundImage = "/images/button/no-Btn.png";
	$.submitBtn.enabled = true;
	$.submitBtn.backgroundColor = "#e67e22";
	$.submitBtn.color = "#fff";
};

function noBtnTouchEnd(e) {
	Ti.API.info(e.source.value);
	Alloy.Globals.litmustestFormData['data[LitmustestsUser][answer]'] = e.source.value;
	$.yesBtn.backgroundImage = "/images/button/yes-Btn.png";
	$.noBtn.backgroundImage = "/images/button/no-Btn-select.png";
	$.submitBtn.enabled = true;
	$.submitBtn.backgroundColor = "#e67e22";
	$.submitBtn.color = "#fff";
}

// back button function, back to prvious screen
function backBtnClick() {
	if (Alloy.Globals.OS == 'android') {
		$.litmusTest2Win.close();
	} else {
		Alloy.Globals.navWin.closeWindow($.litmusTest2Win);
	}
};

function submitBtnClick() {
	$.activityIndicator.show();
	Alloy.Globals.litmustestFormData['data[LitmustestsUser][litmustest_id]'] = litmustestId;
	Alloy.Globals.litmustestFormData['data[LitmustestsUser][company_id]'] = data.Company.id;
	Alloy.Globals.xhr.post(Alloy.Globals.litmustestSubmitURL, Alloy.Globals.litmustestFormData, function(litmustestResult) {
		Ti.API.info("litmustestResult    ===  " + JSON.stringify(litmustestResult));
		if (!!litmustestResult.data.success) {
			$.activityIndicator.hide();
			Alloy.Globals.alertDialog.show();
			Alloy.Globals.litmustestFormData = {};
		} else {
			$.activityIndicator.hide();
		}
	}, function(errResult) {
		Ti.API.info(errResult);
		$.activityIndicator.hide();
	}, {});
};
