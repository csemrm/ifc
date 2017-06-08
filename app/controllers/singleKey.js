var args = arguments[0] || {};
if (args.value == 1) {
	$.keyLabel.text = 1;
	$.characterLabel.text = '';
	$.keyView.value = 1;
} else if (args.value == 2) {
	$.characterLabel.text = 'ABC';
	$.keyLabel.text = args.text;
	$.keyView.value = args.value;

} else if (args.value == 3) {
	$.characterLabel.text = 'DEF';
	$.keyLabel.text = args.text;
	$.keyView.value = args.value;

} else if (args.value == 4) {
	$.characterLabel.text = 'GHI';
	$.keyLabel.text = args.text;
	$.keyView.value = args.value;

} else if (args.value == 5) {
	$.characterLabel.text = 'JKL';
	$.keyLabel.text = args.text;
	$.keyView.value = args.value;

} else if (args.value == 6) {
	$.characterLabel.text = 'MNO';
	$.keyLabel.text = args.text;
	$.keyView.value = args.value;

} else if (args.value == 7) {
	$.characterLabel.text = 'PQRS';
	$.keyLabel.text = args.text;
	$.keyView.value = args.value;

} else if (args.value == 8) {
	$.characterLabel.text = 'TUV';
	$.keyLabel.text = args.text;
	$.keyView.value = args.value;

} else if (args.value == 9) {
	$.characterLabel.text = 'WXYZ';
	$.keyLabel.text = args.text;
	$.keyView.value = args.value;

} else if (args.value == 10) {
	$.keyLabel.font = {
		fontSize : 13
	};
	$.characterLabel.text = '';
	$.characterLabel.height = 0;
	$.keyLabel.top = 15;
	$.keyLabel.color = '#83b5c2';
	$.keyLabel.text = 'Forgotten your PIN Code?';
	$.keyView.value = 'lostPassword';
} else if (args.value == 11) {
	$.keyLabel.text = 0;
	$.characterLabel.text = '';
	$.keyView.value = 0;
} else if (args.value == 12) {
	//$.keyView.backgroundImage = "/images/button/back-Btn.png";
	$.keyLabel.text = 'OK';
	$.keyView.value = 'next';
	$.characterLabel.text = '';
	$.characterLabel.height = 0;
	$.keyLabel.top = 15;
	$.keyLabel.font = {
		fontSize : 30
	};
	$.keyLabel.verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER;

}
// else {
// $.keyLabel.text = args.text;
// $.keyView.value = args.value;
// }
soundPlayer = Ti.Media.createSound({
	url : "/sound/keyPress.wav",
	buffering : true,
	allowBackground : true	// Changed by Sanat (Add this propertiy)
});
var dialog = Ti.UI.createAlertDialog({
	title : 'Enter email',
	style : (Alloy.Globals.OS == 'android') ? null : Ti.UI.iOS.AlertDialogStyle.PLAIN_TEXT_INPUT,
	buttonNames : ['OK', 'cancel'],
	cancel : 1
});
dialog.addEventListener('click', function(e) {
	Ti.API.info('e.text: ' + JSON.stringify(e));
	if (e.index == 0) {
		if (e.text == '') {
			alert("Please enter your email address.");
		} else if (!Alloy.Globals.validateEmail(e.text)) {
			alert("Please enter a valid email address.");
		} else {
			if (Alloy.Globals.xhr.isOnline()) {
				var data = {
					"data[User][email]" : e.text,
					"data[Company][id]" : Ti.App.Properties.getObject("IFCData", {}).Company.id
				};
				args.actInd.show();
				Alloy.Globals.xhr.post(Alloy.Globals.PasswordRetrieveURL, data, function(result) {
					Ti.API.info('result ' + JSON.stringify(result));
					args.actInd.hide();
					if (result.data.success) {
						alert("Thank you, a PIN Code reminder email has been sent to this email address.");
					} else {
						alert("Something goes wrong, please try again");
					}
				}, function(errResult) {
					Ti.API.info(errResult);
					args.actInd.hide();
					alert("Network request problem. Please try again later");
				}, {});
			} else {
				alert("No Network Connection!");
			}
		}
	}
});
function viewClickFunction(e) {

	if (e.source.value == 'lostPassword') {
		dialog.show();
	} else if (e.source.value == 'next') {
		if (Alloy.Globals.xhr.isOnline()) {
			var data = {
				"data[Company][id]" : Ti.App.Properties.getObject("IFCData", {}).Company.id,
				"data[Company][password]" : args.field.value
			};
			args.actInd.show();
			Alloy.Globals.xhr.post(Alloy.Globals.loginURL, data, function(result) {
				Ti.API.info('result ' + JSON.stringify(result));
				if (result.data.success) {
					Alloy.Globals.dataSynchronize(function(success) {
						args.actInd.hide();
						Ti.App.Properties.setBool("loggedin", true);
						Alloy.Globals.winOpener("homescreen", false, {});
						var deviceData = {
							"data[User][company_id]" : Ti.App.Properties.getObject("IFCData", {}).Company.id,
							"data[DeviceToken][device_token]" : !!Alloy.Globals.deviceToken ? Alloy.Globals.deviceToken : "",
							'data[DeviceToken][device_type]' : 'ios',
							'data[Application][stage]' : 'development'
						};
						Alloy.Globals.xhr.post(Alloy.Globals.deviceTokenURL, deviceData, function(deviceTokenResult) {
							Ti.API.info(JSON.stringify(deviceTokenResult));
							if (!!deviceTokenResult.data.success) {
								Ti.App.Properties.setString("UserID", deviceTokenResult.data.user_id);
							} else {
							}
						}, function(errResult) {
							Ti.API.info(errResult);
						}, {});
					});

				} else {
					args.actInd.hide();
					alert("Incorrect Pin Code, please try again.");
					args.field.value = '';
				}
			}, function(errResult) {
				Ti.API.info(errResult);
				args.actInd.hide();
				alert("Network request problem. Please try again later");
			}, {});
		} else {
			var data = Ti.App.Properties.getObject("IFCData", {});
			if (data.Company.password == args.field.value) {
				Ti.App.Properties.setBool("loggedin", true);
				Alloy.Globals.winOpener("homescreen", false, {});
			} else {
				alert("Incorrect PIN number, please try again.");
				args.field.value = '';
			}
		}
	} else {
		if (args.field.value.length <= 5) {
			soundPlayer.play();
			args.field.value = args.field.value + e.source.value;
		}
	}
}

