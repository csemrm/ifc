var windows = ['homescreen','aboutus', 'feedback1', 'downloads', 'litmustest1', 'staffpulse1', 'termsofuse', 'notificatios', 'infoscreen'];
function menu(e) {
    Ti.API.info('index => ' + e.index);
    if (e.index == 8) {
        Ti.App.Properties.removeProperty("loggedin");
    }
    Alloy.Globals.winOpener(windows[e.index], true);
    Alloy.Globals.isClosed = true;
};
$.indicatorTableViewRowView.add(Alloy.Globals.indicatorLabelSidePanel);
