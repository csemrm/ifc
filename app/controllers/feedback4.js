$.feedback4Win.add(Alloy.createController("headerview", {
	title : "Your Ideas",
	logoImage : "/images/button/feedback-Logo.png",
	titleColor : "#e67e22"
}).getView());

function feedback4WinFocus() {
	if (!!Alloy.Globals.feedbackFormData['data[Feedback][feedback_category_id]']) {
		$.submitBtn.enabled = true;
		$.submitBtn.backgroundColor = "#e67e22";
		$.submitBtn.color = "#fff";
	}
};

var data = Ti.App.Properties.getObject("IFCData", {});
(function categoryList() {
	var selectedImage = null;
	for (var i = 0; i < data.FeedbackCategory.length; i++) {
		var cat = data.FeedbackCategory[i];
		//_.each(data.FeedbackCategory, function(cat) {
		var categoryView = Ti.UI.createView({
			top : 10,
			height : 35,
			width : Ti.UI.FILL,
			selected : Alloy.Globals.feedbackFormData['data[Feedback][feedback_category_id]'] == cat.id ? true : false,
			categoryID : cat.id,
			categoryName : cat.name,
			type : 'view',
			layout : "horizontal"
		});
		var categoryLabel = Ti.UI.createLabel({
			text : cat.name,
			//width : cat.name.length*9,
			//backgroundColor : 'red',
			font : {
				fontSize : 15,
				fontWeight : 'bold'
			},
			color : "#fff",
			left : 10,
			touchEnabled : false

		});
		var thikImageView = Ti.UI.createImageView({
			image : Alloy.Globals.feedbackFormData['data[Feedback][feedback_category_id]'] == cat.id ? '/images/icon/category-Select.png' : '/images/icon/category-DisSelect.png',
			height : 35,
			width : 35,
			left : 0,
			touchEnabled : false
		});
		var infoButton = Ti.UI.createButton({
			width : 32,
			height : 32,
			topValue : i * 45 + 157,
			backgroundImage : '/images/icon/info-Btn.png',
			type : 'button',
			left : 5,
			catDescription : cat.description,
			categoryName : cat.name
		});

		if (Alloy.Globals.feedbackFormData['data[Feedback][feedback_category_id]'] && Alloy.Globals.feedbackFormData['data[Feedback][feedback_category_id]'] == cat.id) {
			selectedImage = categoryView;
		}

		categoryView.addEventListener('click', function(e) {
			if (e.source.type == 'button') {
				$.arrow.left = e.source.getParent().getChildren()[1].getSize().width + 64;
				$.toolTipView.top = e.source.topValue;
				$.toolTipView.show();
				$.tipLabel.text = e.source.categoryName + " - " + e.source.catDescription;
			} else {
				if (!!e.source.selected) {
					e.source.selected = false;
					e.source.getChildren()[0].image = '/images/icon/category-DisSelect.png';
					selectedImage = null;
				} else {
					if (selectedImage) {
						selectedImage.selected = false;
						selectedImage.getChildren()[0].image = '/images/icon/category-DisSelect.png';
					}
					e.source.selected = true;
					e.source.getChildren()[0].image = '/images/icon/category-Select.png';
					selectedImage = e.source;
					$.submitBtn.enabled = true;
					$.submitBtn.backgroundColor = "#e67e22";
					$.submitBtn.color = "#fff";
					Alloy.Globals.feedbackFormData['data[Feedback][feedback_category_id]'] = e.source.categoryID;
				}
			}

		});
		categoryView.add(thikImageView);
		categoryView.add(categoryLabel);
		categoryView.add(infoButton);
		$.categoryMainView.add(categoryView);
		//$.categoryMainView.add(infoView);
	}//);
})();

function cancelBtnClick() {
	$.toolTipView.hide();
};

function backBtnClick() {
	if (Alloy.Globals.OS == 'android') {
		$.feedback4Win.close();
	} else {
		Alloy.Globals.navWin.closeWindow($.feedback4Win);
	}
};

function submitBtnClick() {
	$.activityIndicator.show();
	Alloy.Globals.feedbackFormData['data[Feedback][company_id]'] = data.Company.id;
	Alloy.Globals.xhr.post(Alloy.Globals.feedbackSubmitURL, Alloy.Globals.feedbackFormData, function(feedbackSubmitResult) {
		Ti.API.info(JSON.stringify(feedbackSubmitResult));
		if (!!feedbackSubmitResult.data.success) {
			$.activityIndicator.hide();
			Alloy.Globals.alertDialog.show();
			Alloy.Globals.feedbackFormData = {};
		} else {
			$.activityIndicator.hide();
		}
	}, function(errResult) {
		Ti.API.info(errResult);
		$.activityIndicator.hide();
	}, {});
};
