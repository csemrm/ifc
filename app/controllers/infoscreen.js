function loginClick() {
    Alloy.Globals.winOpener('loginpinscreen', false, {});
}

var data = Ti.App.Properties.getObject("IFCData", {});

$.infoscreenWin.add(require("ImageSlideView").slideView(data.Slide, 4000, "left", Ti.Platform.osname == "android" ? 60 : 60));

