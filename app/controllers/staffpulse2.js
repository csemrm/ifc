$.staffpulseWin2.add(Alloy.createController("headerview", {
	title : "Staff Pulse",
	logoImage : "/images/button/staffPluse-Btn.png",
	titleColor : "#e74c3c"
}).getView());

var data = Ti.App.Properties.getObject("IFCData", {});
var pulseCategory = data.PulseCategory[0];
$.involvementLabel.text = pulseCategory.name;

_.each(_.where(data.Pulse, {
	pulse_category_id : pulseCategory.id
}), function(pulse) {
	$.questionView.add(Alloy.createController('singlePulseQuestion', pulse).getView());
});

function backBtnClick() {
	if (Alloy.Globals.OS == 'android') {
		$.staffpulseWin2.close();
	} else {
		Alloy.Globals.navWin.closeWindow($.staffpulseWin2);
	}
};

function nextBtnClick() {
	Alloy.Globals.winOpener("staffpulse3", false, {});
};

