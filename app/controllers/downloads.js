
var _tempFile = null;
$.downloadsWin.add(Alloy.createController("headerview", {
	title : "Responses",
	logoImage : "/images/button/downloads-Btn.png",
	titleColor : "#d93d7f"
}).getView());
function winFocusFunction() {
	$.activityIndicator.show();
	Alloy.Globals.dataSynchronize(function(success) {
		var data = Ti.App.Properties.getObject("IFCData", {});
		var tableData = [];
		for (var i = 0; i < data.Document.length; i++) {
			Ti.API.info(' title ' + data.Document[i].title);
			Ti.API.info(' Document ' + JSON.stringify(data.Document));
			var downloadTableViewRow = Ti.UI.createTableViewRow({
				height : 44,
				width : 300,
				xdata : data.Document[i],
				//selectionStyle : Titanium.UI.iOS.TableViewCellSelectionStyle.GRAY,
				hasChild : true
			});
			if (Alloy.Globals.OS != 'android') {
				downloadTableViewRow.selectionStyle = Titanium.UI.iOS.TableViewCellSelectionStyle.GRAY;
			}
			var titleLabel = Ti.UI.createLabel({
				text : data.Document[i].title,
				font : {
					fontSize : 15
				},
				left : 15,
				color : '#000'
			});
			downloadTableViewRow.addEventListener('click', function(e) {
				if (Alloy.Globals.OS != 'android') {
					Alloy.Globals.winOpener('downloadTableViewRow', false, e.rowData.xdata);

				} else {

					Alloy.Globals.getLocalFile(e.rowData.xdata.filename, function(fileResult) {
						if (fileResult.success) {
							Ti.API.info('FILE URL ' + fileResult.url);
							var _actFile = Ti.Filesystem.getFile(fileResult.url);

							var timeStampName = new Date().getTime();
							if (_tempFile != null) {
								_tempFile.deleteFile();
							}
							_tempFile = Ti.Filesystem.getFile(Ti.Filesystem.getTempDirectory(), timeStampName + '.pdf');
							_tempFile.write(_actFile.read());

							try {
								var intent = Ti.Android.createIntent({
									action : Ti.Android.ACTION_VIEW,
									type : "application/pdf",
									data : _tempFile.nativePath
								});
								Ti.Android.currentActivity.startActivity(intent);

							} catch(e) {
								Ti.API.info('error trying to launch activity, e = ' + e);
								alert('No PDF apps installed!');
							}
						} else {
							alert(fileResult.msg);
						}
					});
				}
			});
			downloadTableViewRow.add(titleLabel);
			tableData.push(downloadTableViewRow);
		}
		$.downloadTableView.setData(tableData);
		$.activityIndicator.hide();
	});
}

