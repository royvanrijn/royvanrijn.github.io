
function myGame() {

    var mesh = Paca.createNavigationMesh()
                .addPolygon({
                    mesh:  [{x: 10, y: 110}, {x: 10, y: 35}, {x: 310, y: 35}, {x: 310, y: 80}],
                    links: [0, 3]
                }).addPolygon({
                    mesh:  [{x: 10, y: 210},{x: 10, y: 235},{x: 310, y: 235},{x: 310, y: 180}],
                    links: [1, 2]
                }).addPolygon({
                    mesh:  [{x: 10, y: 90},{x: 10, y: 224},{x: 40, y: 224},{x: 40, y: 90}],
                    links: [0, 1]
                }).addPolygon({
                    mesh:  [{x: 210, y: 70},{x: 210, y: 200},{x: 240, y: 200},{x: 240, y: 70}],
                    links: [2, 3]
                }).setNavLinks([
                    {x: 25, y: 100, n:  [1, 3] },
                    {x: 25, y: 215, n:  [0, 2] },
                    {x: 225, y: 195, n: [1, 3] },
                    {x: 220, y: 75, n:  [0, 2] }
                ]);

    var playerSpriteUp = Paca.createSprite("images/main/walk_up.png", 10);
    var playerSpriteRight = Paca.createSprite("images/main/walk_right.png", 10);
    var playerSpriteDown = Paca.createSprite("images/main/walk_down.png", 10);
    var playerSpriteLeft = Paca.createSprite("images/main/walk_left.png", 10);
    var playerSpriteIdle = Paca.createSprite("images/main/idle.png", 1);
    var player = Paca.createActor([playerSpriteUp, playerSpriteRight, playerSpriteDown, playerSpriteLeft, playerSpriteIdle],{x: 220, y: 130});

    var houseScene = Paca.newScene(mesh, player);
    var yardScene = Paca.newScene(mesh, player);

    var navigationLayer = Paca.createLayer();
    var houseLayer = Paca.createLayer();
    var backLayer = Paca.createLayer();

    var npc = Paca.createActor([playerSpriteUp, playerSpriteRight, playerSpriteDown, playerSpriteLeft, playerSpriteIdle],{x: 320, y: 130});

    navigationLayer.addObject(player);
    navigationLayer.addObject(npc)
    houseLayer.addObject(Paca.createDrawable(Paca.createSprite("houselayer.png", 1), {x: 0, y: 0}));

    houseLayer.addObject(Paca.createCollectable(Paca.createSprite("images/shirt.png", 1), {x: 100, y: 110},  {x: 100, y: 98}, function() {
        backLayer.addObject(Paca.createCollectable(Paca.createSprite("images/shirt.png", 1), {x: 210, y: 110},  {x: 210, y: 128}, function() {
            //Nothing here yet
        }));
        player.setLocation({x:400,y:210});
        npc.walkTo({x:400,y:210}, function() {
            npc.walkTo({x:100,y:210});
        });
        Paca.changeScene(yardScene);
    }));

    backLayer.addObject(Paca.createDrawable(Paca.createSprite("backlayer.png", 1), {x: 0, y: 0}));

    houseScene.setLayers([navigationLayer, houseLayer, backLayer]);
    yardScene.setLayers([navigationLayer, backLayer]);

    return houseScene;
}

/**
 * -------------------------------------------------------------------------------------------------
 * -- Initial binding, onload and onerror
 * -------------------------------------------------------------------------------------------------
 */
window.onload = function () {

    var gameCanvas = document.getElementById('gameCanvas');
    var gameArea = document.getElementById('gameArea');

    window.addEventListener('resize', resizeGameArea, false);
    window.addEventListener('orientationchange', resizeGameArea, false);
    document.ontouchmove = function (e) {
        e.preventDefault()
    };

    Paca.create(
        {
            width:480, 
            height:320
        }, 
        gameCanvas, 
        gameArea,
        [
            "houselayer.png",
            "backlayer.png",
            "images/shirt.png",
            "images/main/walk_down.png",
            "images/main/walk_up.png",
            "images/main/walk_left.png",
            "images/main/walk_right.png",
            "images/main/idle.png"
        ],

        myGame()
    );
    Paca.DEBUG = true;
    // Scroll to hide iPhone/iPad browser addressbar:
    var goFull = function (){
        if (screenfull.enabled) {
            screenfull.request();
        }
    };

    //TODO: Make start screen with enable full screen option?
    //TODO: The function below only works properly in Chrome when called from a user action (lick clikc/touch)
    goFull();

};

window.onerror = function (message, fileURL, lineNumber) {
    alert('An error has occured:\n' + message + '\n' + fileURL + '\n' + lineNumber)
};

