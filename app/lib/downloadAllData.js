function extend_(destination, source) {
	_.each(source, function(d) {
		var index = destination.indexOf(_.findWhere(destination, {
			id : d.id
		}));
		if (index === -1)
			destination.unshift(d);
		else
			destination[index] = d;
	});
	return destination;
};
function downLoadResources(dataArray, callback) {
	var i = 0;
	function recursiveFunction(i) {
		if (i >= dataArray.length) {
		} else {
			var isOnline = Alloy.Globals.xhr.isOnline();
			var fileUrl = dataArray[i];
			if (fileUrl == null) {return;};
			var stringParts = fileUrl.split('/'), f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, stringParts.pop());
			if (f.exists()) {
				f.remoteBackup = false;
				i++;
				isOnline = fileUrl = stringParts = f = null;
				recursiveFunction(i);
			} else {
				if (isOnline) {
					Alloy.Globals.xhr.getFile(fileUrl, function(fileResult) {
						f.write(fileResult.data);
						if (f.exists())
							f.remoteBackup = false;
						i++;
						recursiveFunction(i);
						isOnline = fileUrl = stringParts = f = null;
					}, function() {
						i++;
						recursiveFunction(i);
						isOnline = fileUrl = stringParts = f = null;
					}, {}, function(progress) {
						Ti.API.info('progress ' + progress);
					});
				} else {
					isOnline = fileUrl = stringParts = f = null;
				}
			}
		}
	};
	recursiveFunction(i);
};
exports.downloadData = function(callback) {
	var files = [];
	var url = Ti.App.Properties.getBool('firstRun', true) ? Alloy.Globals.allDataURL : (Alloy.Globals.allDataURL + '/' + Ti.App.Properties.getString("downloadTime"));
	//Ti.API.info(url);
	if (Alloy.Globals.xhr.isOnline()) {
		Alloy.Globals.xhr.get(url, function(IFCAllData) {
			//Ti.API.info("IFCAllData == " + JSON.stringify(IFCAllData));
			if (!!IFCAllData.data.success) {
				if (Ti.App.Properties.getObject("IFCData", null)) {
					var IFCData = Ti.App.Properties.getObject("IFCData", {});
					//Ti.API.info('old data === ' + JSON.stringify(IFCData));
					_.each(IFCData, function(element, model) {
						if (model != 'Company') {
							IFCData[model] = _.where(extend_(IFCData[model], IFCAllData.data.all_info[model]), {
								is_deleted : false
							});
							if (model == 'Document') {
								_.each(IFCData[model], function(doc) {
									files.push(doc.filename);
								});
							} else if (model == 'Information') {
								_.each(IFCData[model], function(doc) {
									files.push(doc.multimedia);
								});
							}

						} else {
							IFCData[model] = _.extend(IFCData[model], IFCAllData.data.all_info[model]);
							//files.push(IFCData[model].demo);
						}

					});
					Ti.API.info('files ' + JSON.stringify(files));
					Ti.App.Properties.setObject("IFCData", IFCData);
					Ti.API.info('new data === ' + JSON.stringify(IFCData));
					Ti.App.Properties.setString("downloadTime", IFCAllData.data.download_time);
					callback({
						success : true
					});
				} else {
					var IFCData = IFCAllData.data.all_info;
					_.each(IFCData, function(element, model) {
						if (model == 'Document') {
							_.each(IFCData[model], function(doc) {
								files.push(doc.filename);
							});
						} else if (model == 'Information') {
							_.each(IFCData[model], function(doc) {
								files.push(doc.multimedia);
							});
						} else if (model == 'Company') {
							//files.push(IFCData[model].demo);
						}
					});
					Ti.API.info('files ' + JSON.stringify(files));
					Ti.App.Properties.setBool('firstRun', false);
					Ti.App.Properties.setObject("IFCData", IFCAllData.data.all_info);
					Ti.App.Properties.setString("downloadTime", IFCAllData.data.download_time);
					callback({
						success : true
					});
				}
				downLoadResources(files);
			} else {
				callback({
					success : false,
					msg : "Data is not available. Please try again later"
				});
			}
		}, function(errResult) {
			Ti.API.info(errResult);
			callback({
				success : false,
				msg : "Network request problem. Please try again later"
			});
		}, {});
	} else {
		callback({
			success : false,
			msg : "No Network Connection!"
		});
	}
};
exports.getLocalFile = function(url, callback) {
	Ti.API.info(url);
	var isOnline = Alloy.Globals.xhr.isOnline();
	var stringParts = url.split('/'), f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, stringParts.pop());
	if (f.exists()) {
		callback({
			success : true,
			url : f.nativePath
		});
	} else {
		if (isOnline) {
			Alloy.Globals.xhr.getFile(url, function(fileResult) {

				f.write(fileResult.data);
				if (f.exists())
					f.remoteBackup = false;
				callback({
					success : true,
					url : f.nativrPath
				});

			}, function() {
				callback({
					success : false,
					msg : "Network request problem. Please try again later"
				});
			}, {}, function(progress) {
				Ti.API.info('progress ' + progress);
			});
		} else {
			callback({
				success : false,
				msg : "No Network Connection!"
			});
		}
	}
};
