$.termsofuseWin.add(Alloy.createController("headerview", {
    title : "Terms of Use",
    logoImage : "/images/button/termsOfUse-Btn.png",
    titleColor : "#b3b3b3"
}).getView());

var data = Ti.App.Properties.getObject("IFCData", {});
$.termsOfUseWebView.url = Alloy.Globals.termsOfUseURL + data.Company.id;
