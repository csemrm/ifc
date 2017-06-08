var resizePhoto = function(media, size) {
	var oW = media.width, oH = media.height, w = oW >= oH ? Math.round(Math.min(oW * (size / oH), oW)) : Math.round(Math.min(size, oW)), h = oW <= oH ? Math.round(Math.min(oH * (size / oW), oH)) : Math.round(Math.min(size, oH));
	//return media.imageAsResized(w, h);
	return {
		image : media.imageAsResized(w, h),
		w : w,
		h : h
	};
};




var wrapperView = Ti.UI.createView({
	width : '100%',
	height : '100%',
	zIndex : 10,
	backgroundColor : '#000',
	layout : 'vertical'
});
var textView = Ti.UI.createView({
	height : 0
});
var scroll = Ti.UI.createScrollView({
	width : 320,
	height : 320,
	top : 0,
	contentWidth : 'auto',
	contentHeight : 'auto',
	showVerticalScrollIndicator : false,
	showHorizontalScrollIndicator : false,
	backgroundColor : '#000',
	minZoomScale : 1,
	maxZoomScale : 2,
	zoomScale : 1,
	oldZoom : 1
});
var image = Ti.UI.createImageView({});
var label = Ti.UI.createLabel({
	top : 5,
	color : "#fff",
	height : Ti.UI.SIZE,
	text : 'Drag or pinch for your desired dimension.',
	font : {
		fontSize : 14
	}
});

var text = Ti.UI.createTextArea({
	top : 5,
	width : Ti.UI.FILL,
	hintText : "Add a caption",
	value : "Add a caption",
	backgroundColor : "white",
	left : 10,
	right : 10,
	paddingLeft : 5,
	font : {
		fontSize : 12
	},
	height : 50,
	borderRadius : 12,
	bottom : 5
});
text.addEventListener('focus', function(e) {
	scroll.height = 100;
	if (e.value == 'Add a caption') {
		e.source.value = '';
	}
});
text.addEventListener('blur', function(e) {
	scroll.height = 320;
	if (e.value == '') {
		e.source.value = 'Add a caption';
	}
});

var button = Ti.UI.createButton({
	top : 10,
	// backgroundLeftCap : 15,
	// backgroundImage : '/imgs/gal/btn.png',
	width : 60,
	height : 30,
	title : 'Done',
	color : '#fff',
	backgroundImage : 'none',
	font : {
		fontSize : 13,
		fontWeight : "bold"
	},
	borderRadius : 12,
	backgroundColor : "#f4814b",
});
var doneButton = Ti.UI.createButton({
	top : 10,
	// backgroundLeftCap : 15,
	// backgroundImage : '/imgs/gal/btn.png',
	width : 60,
	height : 30,
	title : 'Done',
	color : '#fff',
	backgroundImage : 'none',
	font : {
		fontSize : 13,
		fontWeight : "bold"
	},
	borderRadius : 12,
	backgroundColor : "#f4814b",
});
var newImegeField = null, callback = null;
scroll.add(image);
wrapperView.add(scroll);
wrapperView.add(label);
wrapperView.add(textView);
//wrapperView.add(text);
wrapperView.add(button);
var newWin = null;
function done() {
	text.blur();
	setTimeout(function(){
		if (!!newImegeField) {
			newImegeField.image = scroll.toImage();
		}
		if (!!callback) {
			callback({
				image : scroll.toImage(),
				description : text.value == 'Add a caption' ? '' : text.value
			});
			text.value = 'Add a caption';
		}
		newWin.rightNavButton = Ti.UI.createView({});
		Alloy.Globals.currentWins[Alloy.Globals.currentWins.length - 1].remove(wrapperView);
	},300);
	
};
button.addEventListener('click', function() {
	done();
});
doneButton.addEventListener('click', function() {
	done();
});
var createImageView = function(mediA, hasImgField) {
	scroll.zoomScale = 1;
	image.image = mediA.image;

	if (hasImgField === false) {
		// show description text field
		textView.add(text);
		if (Ti.Platform.displayCaps.platformHeight == 480) {
			textView.height = 60;
		} else {
			textView.height = 60;
		}
	} else {
		textView.remove(text);
		textView.height = 0;
	}
	Alloy.Globals.currentWins[Alloy.Globals.currentWins.length - 1].add(wrapperView);
};

/* fields
 * @imageField = ref to an imageview
 * callbackFunction = fn for callback
 */
if (Ti.Platform.displayCaps.platformHeight == 480) {
	doneButton.show();
	button.hide();
} else {
	button.show();
	doneButton.hide();
}
exports.showCamera = function(imageField, callbackFunction, win) {
	if (Titanium.Platform.model == 'Simulator') {
		var alrt = Titanium.UI.createAlertDialog({
			title : 'Camera',
			message : 'Device does not have capturing capabilities'
		});
		alrt.show();
		return false;
	}
	Titanium.Media.showCamera({
		success : function(event) {
			var mediA = resizePhoto(event.media, 320);
			//imageField.image = mediA.image;
			//imageField.width = mediA.w;
			//imageField.height = mediA.h;
			callback = callbackFunction;
			newImegeField = imageField;
			createImageView(mediA, imageField);
			//if (Ti.Platform.displayCaps.platformHeight == 480) {
			win.rightNavButton = doneButton;
			newWin = win;
			//button.hide();

			// }else{
			// button.show();
			// doneButton.hide();
			// }

		},
		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
		saveToPhotoGallery : Ti.App.Properties.getObject('user').save_original_photo,
		cancel : function() {
		},
		error : function(error) {
			var a = Titanium.UI.createAlertDialog({
				title : 'Camera'
			});
			if (error.code == Titanium.Media.NO_CAMERA) {
				a.setMessage('Device does not have capturing capabilities');
			} else {
				a.setMessage('Unexpected error: ' + error.code);
			}
			a.show();
		},
		saveToPhotoGallery : true,
		allowImageEditing : false
	});
};
exports.openGallery = function(imageField, callbackFunction, win) {
	Titanium.Media.openPhotoGallery({
		success : function(event) {
			var mediA = resizePhoto(event.media, 320);
			//imageField.image = mediA.image;
			//imageField.width = mediA.w;
			//imageField.height = mediA.h;
			callback = callbackFunction;
			newImegeField = imageField;
			createImageView(mediA, imageField);
			win.rightNavButton = doneButton;
			newWin = win;
		},
		cancel : function() {
			// Ti.API.info(' Cancelled ');
		},
		error : function(error) {
			// Ti.API.info(' An error occurred!! ');
		},
		allowEditing : false,
		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
	});
};
