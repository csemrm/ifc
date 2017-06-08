$.staffpulseWin3.add(Alloy.createController("headerview", {
	title : "Staff Pulse",
	logoImage : "/images/button/staffPluse-Btn.png",
	titleColor : "#e74c3c"
}).getView());

var data = Ti.App.Properties.getObject("IFCData", {});

var pulseCategory = data.PulseCategory[1];
$.advocacyLabel.text = pulseCategory.name;

_.each(_.where(data.Pulse, {
	pulse_category_id : pulseCategory.id
}), function(pulse) {
	$.questionView.add(Alloy.createController('singlePulseQuestion', pulse).getView());
});
function backBtnClick() {
	if (Alloy.Globals.OS == 'android') {
		$.staffpulseWin3.close();
	} else {
		Alloy.Globals.navWin.closeWindow($.staffpulseWin3);
	}
};

function nextBtnClick() {
	Alloy.Globals.winOpener("staffpulse4", false, {});
};

