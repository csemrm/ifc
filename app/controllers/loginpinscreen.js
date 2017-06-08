if (Ti.Platform.displayCaps.platformHeight > 480) {
    $.TextFieldView.top = 160;
} else {
    $.TextFieldView.top = 105;
}

$.client_logo.image = Ti.App.Properties.getObject("IFCData", {}).Company.logo;

function lockButtonClickFunction(e) {
    $.loginPinTextField.value = $.loginPinTextField.value.substr(0, $.loginPinTextField.value.length - 1);

};

//$.loginPinTextField.rightButton = lockButton;
for (var i = 1; i < 13; i++) {
    $.keypadView.add(Alloy.createController('singleKey', {
        text : i,
        value : i,
        field : $.loginPinTextField,
        actInd : $.activityIndicator
    }).getView());
}

