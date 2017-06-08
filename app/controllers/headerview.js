var args = arguments[0] || {};
$.titleLabel.text = args.title;
$.titleLabel.color = args.titleColor;
$.LogoImage.image = args.logoImage;

var width = Ti.Platform.displayCaps.platformWidth;
var titleRight = (width * 90) / width;
var logoRight = (width * 15) / width;
switch(width) {
case 375:
	$.titleLabel.right = titleRight + 20;
	$.LogoImage.right = logoRight + 10;
	break;
case 414:
	$.titleLabel.right = titleRight + 20;
	$.LogoImage.right = logoRight + 10;
	break;
default:
	$.titleLabel.right = titleRight;
	$.LogoImage.right = logoRight;
}
