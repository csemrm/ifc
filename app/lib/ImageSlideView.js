var width = Ti.Platform.displayCaps.platformWidth,
    height = Ti.Platform.displayCaps.platformHeight;
if (Ti.Platform.osname === 'android') {
    width = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
    height = Ti.Platform.displayCaps.platformHeight / Ti.Platform.displayCaps.logicalDensityFactor;
}
function resize(image) {
    var pH = Ti.Platform.displayCaps.platformHeight,
        pW = Ti.Platform.displayCaps.platformWidth;
    var wR = pW / image.w,
        hR = pH / image.h,
        r = Math.max(wR, hR);
    Ti.API.info('image ' + JSON.stringify(image));
    if (Ti.Platform.osname === 'android') {
        return {
            width : Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor,
            height : Ti.Platform.displayCaps.platformHeight / Ti.Platform.displayCaps.logicalDensityFactor
        };
    } else
        return {
            height : Math.max(pH, image.h * r),
            width : Math.max(pW, image.w * r)
        };
};
function wordwrap(str, width, brk, cut) {
    brk = brk || '\n';
    width = width || 75;
    cut = cut || false;
    if (!str) {
        return str;
    }
    Ti.API.info('str' + str);
    var regex = '.{1,' + width + '}(\\s|$)' + ( cut ? '|.{' + width + '}|.+$' : '|\\S+?(\\s|$)');
    return str.match(RegExp(regex, 'g')).join(brk);
}

function createImageView(image) {
    var size = resize(image);
    var view1 = Ti.UI.createScrollView({
        width : Ti.UI.FILL,
        height : Ti.UI.FILL,
        scrollType : "vertical",
        contentWidth : 'auto',
        contentHeight : 'auto',
        scrollingEnabled : false,
        showVerticalScrollIndicator : false,
        showHorizontalScrollIndicator : false,
    });

    view1.add(Ti.UI.createImageView({
        width : width,
        height : height,
        image : Alloy.Globals.imageURL + image.image,
        left : -1 * (width - width) / 2,
        top : -1 * (height - height) / 2,
    }));
    var view2 = Ti.UI.createView({
        width : Ti.UI.SIZE,
        height : Ti.UI.SIZE,
        left : 13,
        top : Alloy.Globals.OS == 'android' ? height - 170 : height - 170,
        layout : 'vertical'

    });
    view2.add(Ti.UI.createLabel({
        left : 0,
        height : 30,
        font : {
            fontSize : 22,
            fontWeight : 'normal'
        },

        text : ' ' + image.title + ' ',
        backgroundColor : '#e38837',
        color : '#fff',
        opacity : 0.8
    }));
    var view3 = Ti.UI.createView({
        top : 1,
        backgroundColor : '#fff',
        height : Ti.UI.SIZE,
        width : Ti.UI.SIZE,
        opacity : 0.8,
        left : 0
    });
    view2.add(view3);
    view3.add(Ti.UI.createLabel({
        width : Ti.UI.SIZE,
        height : Ti.UI.SIZE,
        left : 6,
        top : 3,
        right : 5,
        bottom : 3,
        font : {
            fontSize : 12,
            fontWeight : 'normal'
        },
        text : wordwrap(image.subtitle.toUpperCase(), 35),
        color : '#000',
    }));
    view1.add(view2);
    return view1;
};
function creteScrollableView(left, name) {
    return Ti.UI.createScrollableView({
        width : width,
        height : height,
        left : left,
        name : name
    });
};
var pages = [];
function pagingControl(numberOfPages, pagingControlBottom) {
    var container = Titanium.UI.createView({
        width : Ti.UI.SIZE,
        height : 20,
        bottom : pagingControlBottom + (Alloy.Globals.is_iOS7 ? 0 : 20)
    });
    pages = [];
    for (var i = 0; i < numberOfPages; i++) {
        var page = Titanium.UI.createView({
            borderRadius : 4,
            width : 8,
            height : 8,
            left : 12 * i,
            //borderColor : "#000",
            //borderWidth : 1,
            backgroundColor : "#fff"
        });
        pages.push(page);
        container.add(page);
    }
    //pages[0].backgroundColor = "#808285";
    if (pages.length)
        pages[0].opacity = 0.3;

    return container;
};
exports.slideView = function(images, time, direction, pagingControlBottom) {
    Ti.API.info('image  =>' + JSON.stringify(images));
    var viewS1 = [],
        viewS2 = [],
        viewS3 = [],
        currentSV = null,
        nextSV = null,
        tempSV = null,
        prevSV = null, //
        mainView = Ti.UI.createView({
        zIndex : -1,
        width : width,
        height : height,
        backgroundColor : '#fff'
    }),
        scView1 = creteScrollableView(-1 * width, 'scView1'),
        scView2 = creteScrollableView(0, 'scView2'),
        scView3 = creteScrollableView(width, 'scView3');
    for (var i = 0; i < images.length; i++) {
        viewS1.push(createImageView(images[i]));
        viewS2.push(createImageView(images[i]));
        viewS3.push(createImageView(images[i]));
    }
    scView1.views = viewS1;
    scView2.views = viewS2;
    scView3.views = viewS3;
    mainView.add(scView1);
    mainView.add(scView2);
    mainView.add(scView3);
    prevSV = scView1;
    currentSV = scView2;
    nextSV = scView3;
    //prevSV.scrollToView(images.length - 1);
    //setTimeout(function(){
    currentSV.scrollToView(0);
    //},100);

    mainView.add(pagingControl(images.length, pagingControlBottom));
    if (time) {
        setInterval(function() {
            if (currentSV.currentPage == (images.length - 1) && direction == 'left') {
                currentSV.animate({
                    left : -1 * width,
                    duration : 300
                }, function() {
                    tempSV = currentSV;
                    currentSV = nextSV;
                    nextSV = prevSV;
                    prevSV = tempSV;
                    nextSV.left = width;
                    currentSV.left = 0;
                    prevSV.left = -1 * width;
                    prevSV.scrollToView(images.length - 1);
                    nextSV.scrollToView(0);
                });
                nextSV.animate({
                    left : 0,
                    duration : 290
                });
            } else if (currentSV.currentPage == 0 && direction == 'right') {
                currentSV.animate({
                    left : width,
                    duration : 300
                }, function() {
                    tempSV = currentSV;
                    currentSV = prevSV;
                    prevSV = nextSV;
                    nextSV = tempSV;
                    nextSV.left = width;
                    currentSV.left = 0;
                    prevSV.left = -1 * width;
                    nextSV.scrollToView(0);
                    prevSV.scrollToView(images.length - 1);
                });
                prevSV.animate({
                    left : 0,
                    duration : 290
                });
            } else if (direction == 'right') {
                currentSV.scrollToView(currentSV.currentPage - 1);
            } else if (direction == 'left') {
                currentSV.scrollToView(currentSV.currentPage + 1);
            }
        }, time);
    }
    var onScrollEnd = function(event) {
        for (var i = 0; i < images.length; i++) {
            //pages[i].backgroundColor = "#808285";
            pages[i].opacity = 0.3;
        }
        //pages[event.currentPage].backgroundColor = "414042";
        pages[event.currentPage].opacity = 1;
    };
    scView1.addEventListener('scrollend', onScrollEnd);
    scView2.addEventListener('scrollend', onScrollEnd);
    scView3.addEventListener('scrollend', onScrollEnd);
    return mainView;
};
