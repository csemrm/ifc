$.termsofuseWin.add(Alloy.createController("headerview", {
	title : "Terms of Use",
	logoImage : "/images/button/termsOfUse-Btn.png",
	titleColor : "#b3b3b3"
}).getView());

var data = Ti.App.Properties.getObject("IFCData", {});
$.termsOfUseWebView.url = Alloy.Globals.termsOfUseURL + data.Company.id;

if (Alloy.Globals.OS == 'android') {
	var count = 0;
	$.termsOfUseWebView.addEventListener('swipe', function(e) {
		if(e.direction == 'left' || e.direction == 'right'){
			return;	
		}
	});
	$.termsOfUseWebView.addEventListener('load', function(e) {
		// var cssFileName = 'styles.css';
		// var cssFromFile = Ti.Filesystem.getFile(cssFileName);
		// var contents = String(cssFromFile.read()).split('\r').join('').split('\n').join(' ').split('"').join('\\"');
		// $.termsOfUseWebView.url = 'javascript:(function evilGenius(){' + 'var s=document.createElement("style");' + 's.setAttribute("type","text/css");' + 's.innerHTML="' + contents + '";' + 'document.getElementsByTagName("head")[0].appendChild(s);' + '})();';
		//Ti.API.info('kkkk '+JSON.stringify(e));
		//$.termsOfUseWebView.html = e.source.html;
		if (count == 0) {
			var localHtml = e.source.html.replace('auto', (e.source.rect.width - 20));
			$.termsOfUseWebView.html = localHtml;
		}
		count = count + 1;
	});
}
