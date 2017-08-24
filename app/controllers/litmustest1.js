$.litmustest1Win.add(Alloy.createController("headerview", {
	title : "FFT",
	logoImage : "/images/button/litmusTest-Btn.png",
	titleColor : "#3cb878"
}).getView());

var data = Ti.App.Properties.getObject("IFCData", {});

//slider for picker
var slide_in = Titanium.UI.createAnimation({
	bottom : 0
});
var slide_out = Titanium.UI.createAnimation({
	bottom : -260
});

var deptId = null,
    posId = null;
function doneCallBackFunction(pickerResult) {
	if (pickerResult.pickerName == 'Department') {
		if (!!pickerResult.value) {
			$.departmentLabel.text = pickerResult.title;
			deptId = pickerResult.value;
		}
		if (Alloy.Globals.OS != 'android') {
			departmentPickerView.animate(slide_out);
		}
	} else {
		if (!!pickerResult.value) {
			$.positionLabel.text = pickerResult.title;
			posId = pickerResult.value;
		}
		if (Alloy.Globals.OS != 'android') {
			positionPickerView.animate(slide_out);
		}
	}
	if (deptId && posId) {
		$.nextButton.enabled = true;
		$.nextButton.backgroundColor = "#e67e22";
		$.nextButton.color = "#fff";
	}
};

if (Alloy.Globals.OS == 'android') {
	var columnD = Ti.UI.createPickerColumn();
	var row = Ti.UI.createPickerRow({
		title : 'Select Department',
		id : ''
	});
	columnD.addRow(row);

	_.each(data.Department, function(dept) {
		var row = Ti.UI.createPickerRow({
			title : dept.name,
			id : dept.id
		});
		columnD.addRow(row);
	});
	$.departmentLabel.columns = [columnD];

	$.departmentLabel.addEventListener('change', function(e) {
		if (e.source.getSelectedRow(0).id != '') {
			doneCallBackFunction({
				pickerName : 'Department',
				title : e.source.getSelectedRow(0).title,
				value : e.source.getSelectedRow(0).id
			});
		}
	});

	var columnP = Ti.UI.createPickerColumn();
	var row = Ti.UI.createPickerRow({
		title : 'Select Position',
		id : ''
	});
	columnP.addRow(row);
	_.each(data.Position, function(dept) {
		var row = Ti.UI.createPickerRow({
			title : dept.name,
			id : dept.id
		});
		columnP.addRow(row);
	});
	$.positionLabel.columns = [columnP];

	$.positionLabel.addEventListener('change', function(e) {
		if (e.source.getSelectedRow(0).id != '') {
			doneCallBackFunction({
				pickerName : 'Position',
				title : e.source.getSelectedRow(0).title,
				value : e.source.getSelectedRow(0).id
			});
		}
	});

} else {

	var departmentPickerView = Alloy.createController("commonPicker", {
		title : "Department",
		departmentValue : data.Department,
		callBack : doneCallBackFunction
	}).getView();
	var positionPickerView = Alloy.createController("commonPicker", {
		title : "Position",
		departmentValue : data.Position,
		callBack : doneCallBackFunction
	}).getView();

	$.litmustest1Win.add(departmentPickerView);
	$.litmustest1Win.add(positionPickerView);
}

function departmentClickFunction() {
	if (Alloy.Globals.OS == 'android') {
		return;
	}
	positionPickerView.animate(slide_out);
	departmentPickerView.animate(slide_out);
	departmentPickerView.animate(slide_in);
};

function positionClickFunction() {
	if (Alloy.Globals.OS == 'android') {
		return;
	}
	positionPickerView.animate(slide_out);
	departmentPickerView.animate(slide_out);
	positionPickerView.animate(slide_in);
};

function nextButtonClick() {
	Alloy.Globals.litmustestFormData['data[LitmustestsUser][position_id]'] = posId;
	Alloy.Globals.litmustestFormData['data[LitmustestsUser][department_id]'] = deptId;
	Alloy.Globals.winOpener("litmustest2", false, {});
};
