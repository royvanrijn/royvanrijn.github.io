/**
 * -------------------------------------------------------------------------------------------------
 * -- Preloading images
 * -------------------------------------------------------------------------------------------------
 */
Prefetch = new Object();

Prefetch.prefetchResources = function(sources, callback, game) {

    game.setCursor("progress");

    var loadedImages = 0;
    var numImages = sources.length;
    for (var i = 0; i < numImages; i++) {
        var source = sources[i];
        var image = new Image();
        image.onload = function () {

            if (++loadedImages >= numImages) {
                Prefetch.prefetchResourcesDone(callback, game);
            } else {
                Prefetch.prefetchResourcesUpdated((loadedImages / numImages) * 100, game);
            }
        };
        image.src = source; //bind onload before setting src bug in some chrome versions
        game.addImage(source, image);
    }
};


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