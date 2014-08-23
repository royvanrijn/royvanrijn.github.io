/**
 * -------------------------------------------------------------------------------------------------
 * -- Preloading images
 * -------------------------------------------------------------------------------------------------
 */
Prefetch = new Object();

Prefetch.prefetchResources = function(imageSources, soundSources, callback, game) {

    game.setCursor("progress");

    var soundPostfix;
    if(game.audio) {
        var canPlayOgg = !!game.audio.canPlayType && "" != game.audio.canPlayType('audio/ogg; codecs="vorbis"');
        var canPlayMp3 = !!game.audio.canPlayType && "" != game.audio.canPlayType('audio/mpeg');
        if(canPlayOgg) {
            soundPostfix += '.ogg';
        } else if(canPlayMp3) {
            soundPostfix += '.mp3';
        } else {
            soundSources = [];
        }
    } else {
        soundSources = [];
    }

    var loadData = { loadedResources:0, numResources:imageSources.length + soundSources.length};

    for (var i = 0; i < imageSources.length; i++) {
        Prefetch.loadImage(imageSources[i], loadData, callback, game);
    }
    for (var i = 0; i < soundSources.length; i++) {
        Prefetch.loadSound(soundSources[i] + soundPostfix, loadData, callback, game);
    }
};

Prefetch.loadImage = function(source, loadData, callback, game) {
        var image = new Image();
        image.onload = function() {
           if (++loadData.loadedResources >= loadData.numResources) {
                Prefetch.prefetchResourcesDone(callback, game);
            } else {
                Prefetch.prefetchResourcesUpdated((loadData.loadedResources / loadData.numResources) * 100, game);
            }
        };
        image.src = source; //bind onload before setting src bug in some chrome versions
        game.addImage(source, image);
}

Prefetch.loadSound = function(source, loadData, callback, game) {

    var request = new XMLHttpRequest();
    request.open("GET", source, true);
    request.overrideMimeType('text/plain; charset=x-user-defined');
    request.responseType = "arraybuffer";

    request.onload = function() {

        game.audio.decodeAudioData(request.response, function(buffer) {
            game.addSound(source, buffer);
            if (++loadData.loadedResources >= loadData.numResources) {
                Prefetch.prefetchResourcesDone(callback, game);
            } else {
                Prefetch.prefetchResourcesUpdated((loadData.loadedResources / loadData.numResources) * 100, game);
            }
        });
    };
    request.send();
}


/**
 * -------------------------------------------------------------------------------------------------
 * -- Resource loading animation
 * -------------------------------------------------------------------------------------------------
 */
Prefetch.prefetchResourcesUpdated = function(percentage, game) {
    var ctx = game.gameCanvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = 15;
    ctx.strokeStyle = "#B2B2B2";
    ctx.arc((game.gameCanvas.width / 2),
        (game.gameCanvas.height / 2),
        40,
        Math.PI * 1.5,
        Math.PI * 1.5 + (((2 * Math.PI) / 100) * percentage)
    );
    ctx.stroke();
}

Prefetch.prefetchResourcesDone = function(callback, game) {
    game.setCursor("auto");
    callback();
}