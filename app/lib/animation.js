exports.slideOut = function() {
	var i = 8;
	Alloy.Globals.ActiveTabGroup.left = 256;
	var timer = setInterval(function() {
		Alloy.Globals.ActiveTabGroup.left = Math.pow(2, i);
		if (i == 0) {
			clearInterval(timer);
			Alloy.Globals.ActiveTabGroup.left = 0;
		}
		i--;
	}, 15);
	Alloy.Globals.isClosed = true;
};

exports.slideIn = function() {
	var i = 0;
	Alloy.Globals.ActiveTabGroup.left = 0;
	var timer = setInterval(function() {
		Alloy.Globals.ActiveTabGroup.left = Math.pow(2, i);
		if (i == 8) {
			clearInterval(timer);
		}
		i++;
	}, 15);
	Alloy.Globals.isClosed = false;
};
