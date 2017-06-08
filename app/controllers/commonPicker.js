var args = arguments[0] || {},
    selectedValue = null;
if (Alloy.Globals.OS != 'android') {
	$.commonLabel.text = args.title;
}

var column = Ti.UI.createPickerColumn();
_.each(args.departmentValue, function(dept) {
	var row = Ti.UI.createPickerRow({
		title : dept.name,
		id : dept.id
	});
	column.addRow(row);
});

var Picker = Ti.UI.createPicker({
	selectionIndicator : true,
	columns : [column],
	bottom : 0,
	width : Titanium.UI.FILL,
	nativeSpinner : true
});
$.pickerView.add(Picker);
Picker.setSelectedRow(0, 0, false);

var slide_out = Titanium.UI.createAnimation({
	bottom : -260
});

function cancelFunction() {
	args.callBack({
		pickerName : $.commonLabel.text,
		value : null
	});
};

function doneFunction() {
	args.callBack({
		pickerName : $.commonLabel.text,
		title : Picker.getSelectedRow(0).title,
		value : Picker.getSelectedRow(0).id
	});
};
