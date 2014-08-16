/**
 * -------------------------------------------------------------------------------------------------
 * -- Preloading images
 * -------------------------------------------------------------------------------------------------
 */
Prefetch = new Object();

Prefetch.prefetchResources = function(imageSources, soundSources, callback, game) {

    game.setCursor("progress");

    var loadData = { loadedResources:0, numResources:imageSources.length + soundSources.length};

    for (var i = 0; i < imageSources.length; i++) {
        Prefetch.loadImage(imageSources[i], loadData, callback, game);
    }
    for (var i = 0; i < soundSources.length; i++) {
        Prefetch.loadSound(soundSources[i], loadData, callback, game);
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
    var doc = new XMLHttpRequest();
    doc.open("GET",source,true);
    doc.responseType = "arraybuffer";
    doc.overrideMimeType('text/plain; charset=x-user-defined');
    doc.onreadystatechange = function() {
    if (doc.readyState==4 && (!doc.status || doc.status==200))
        Paca.audio.decodeAudioData(doc.response, function(buffer) {
            game.addSound(source, buffer);
            if (++loadData.loadedResources >= loadData.numResources) {
                Prefetch.prefetchResourcesDone(callback, game);
            } else {
                Prefetch.prefetchResourcesUpdated((loadData.loadedResources / loadData.numResources) * 100, game);
            }
        });
    };
    doc.send();
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