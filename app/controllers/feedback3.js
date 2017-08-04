var header = Alloy.createController("headerview", {
	title : "Feedback",
	logoImage : "/images/button/feedback-Logo.png",
	titleColor : "#e67e22"
}).getView();
$.feedback3Win.add(header);

function feedback3WinFocus() {
	if (!!Alloy.Globals.feedbackFormData['data[Feedback][contact]']) {
		$.emailText.value = Alloy.Globals.feedbackFormData['data[Feedback][contact]'];
		$.nextBtn.enabled = true;
		$.nextBtn.backgroundColor = "#e67e22";
		$.nextBtn.color = "#fff";
		$.checkBoxImage.image = "/images/icon/category-Select.png";
	} else {
		$.nextBtn.enabled = true;
		$.nextBtn.backgroundColor = "#e67e22";
		$.nextBtn.color = "#fff";
	}
};

var selectedImage = null;
function checkBoxImageClick(e) {
	if (!!e.source.selected) {
		e.source.selected = false;
		e.source.image = '/images/icon/category-DisSelect.png';
		selectedImage = null;
		$.emailText.enabled = false;
	} else {
		if (selectedImage) {
			selectedImage.selected = false;
			selectedImage.image = '/images/icon/category-DisSelect.png';
		}
		e.source.selected = true;
		e.source.image = '/images/icon/category-Select.png';
		selectedImage = e.source;
		$.emailText.enabled = true;
	}
};
//$.nextBtn.enabled = true;
//$.nextBtn.backgroundColor = "#e67e22";
//$.nextBtn.color = "#fff";
//$.nextBtn.enabled = false;
//$.nextBtn.backgroundColor = "#67cee3";
//$.nextBtn.color = "#3dbfd9";

function backBtnClick() {
	if (Alloy.Globals.OS == 'android') {
		$.feedback3Win.close();
	} else {
		Alloy.Globals.navWin.closeWindow($.feedback3Win);
	}
};

function emailReturnFunction() {
	Alloy.Globals.feedbackFormData['data[Feedback][contact]'] = $.emailText.value;
	if (!!$.emailText.value) {
		if (!Alloy.Globals.validateEmail(Alloy.Globals.feedbackFormData['data[Feedback][contact]']))
			alert("Please enter a valid email.");
	return;
	}
	
};

function nextBtnClick() {
    emailReturnFunction();
	Alloy.Globals.winOpener("feedback4", false, {});

};
