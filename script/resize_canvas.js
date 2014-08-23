/**
 * Function that resizes the canvas accordingly, but keeps aspect ratio
 */
function resizeGameArea() {
    var gameArea = document.getElementById('gameArea');
    var widthToHeight = 4 / 3;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;

    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
    } else {
        newHeight = newWidth / widthToHeight;
    }

    gameArea.style.width = newWidth + 'px';
    gameArea.style.height = newHeight + 'px';

    gameArea.style.marginLeft = (-newWidth / 2) + 'px';
    gameArea.style.marginTop = (-newHeight / 2) + 'px';

    gameCanvas.width = newWidth;
    gameCanvas.height = newHeight;

    screenDirty = true;
}