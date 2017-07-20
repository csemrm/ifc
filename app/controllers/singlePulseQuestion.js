var args = arguments[0] || {};
$.suggestionLabel.text = args.question;
$.sliderSuggestion.xData = args;
if (!!Alloy.Globals.PulseFormData['data[PulsesUser][pulse_id][' + args.id + ']'] && Alloy.Globals.PulseFormData['data[PulsesUser][pulse_id][' + args.id + ']'] == args.id) {
    $.sliderSuggestion.value = Alloy.Globals.PulseFormData['data[PulsesUser][answer][' + args.id + ']'];
    if (Alloy.Globals.OS == 'android') {
        $.sliderSuggestion.leftTrackImage = "/images/bg/leftTrackImage-" + $.sliderSuggestion.value + "-android.png";
        $.sliderSuggestion.thumbImage = "/images/bg/thumbImage-" + $.sliderSuggestion.value + "-android.png";
    } else {
        $.sliderSuggestion.leftTrackImage = "images/bg/leftTrackImage-" + $.sliderSuggestion.value + ".png";
        $.sliderSuggestion.thumbImage = "images/bg/thumbImage-" + $.sliderSuggestion.value + ".png";
    }

} else {
    Alloy.Globals.PulseFormData['data[PulsesUser][pulse_id][' + args.id + ']'] = args.id;
    Alloy.Globals.PulseFormData['data[PulsesUser][answer][' + args.id + ']'] = 1;
}

function sliderTouchEnd(e) {
    e.source.value = Math.round(e.source.value);
    Alloy.Globals.PulseFormData['data[PulsesUser][pulse_id][' + e.source.xData.id + ']'] = e.source.xData.id;
    Alloy.Globals.PulseFormData['data[PulsesUser][answer][' + e.source.xData.id + ']'] = e.source.value;
};
var sliderValue = 1;
function sliderChangeFunction(e) {
    sliderValue = Math.round(e.source.value);
    if (Alloy.Globals.OS == 'android') {

    } else {
        e.source.leftTrackImage = "images/bg/leftTrackImage-" + sliderValue + ".png";
        e.source.thumbImage = "images/bg/thumbImage-" + sliderValue + ".png";
    }
};
