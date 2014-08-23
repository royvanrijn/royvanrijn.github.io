function createStartScene() {
    /** Start screen **/
    var startScene = Paca.createScene();
    var welcomeLayer = Paca.createLayer();
    var splashScreen = Paca.createClickable(Paca.createSprite("images/splash_screen.png", 1), {x: 320, y: 240}, function() {
        //Should go on first click:
        //goFull();
        Paca.changeScene("houseScene");
        Paca.playBackground("music/song1", 0.5);
        Paca.addText({name:"Scientist", text:"Sigh...", color:"rgb(255,255,255)"});
        Paca.addText({name:"Scientist", text:"My love... what is your name?", color:"rgb(255,255,255)"});
        Paca.addText({name:"Scientist", text:"How can I reach you?", color:"rgb(255,255,255)"});
    });
    welcomeLayer.addObject(splashScreen);
    startScene.setLayers([welcomeLayer]);
    return startScene;
}

function createMenuLayer() {
    var menuLayer = Paca.createLayer();
    var soundEnabled = Paca.createSprite("images/sound_enabled.png", 1);
    var soundDisabled = Paca.createSprite("images/sound_disabled.png", 1);
    var muteButton = Paca.createClickable(soundEnabled, {x: 610, y: 420}, 
        function(point) {
            Paca.toggleMute();
            if(Paca.muted) {
                muteButton.changeSprite(soundDisabled);
            } else {
                muteButton.changeSprite(soundEnabled);
            }
        }
    );
    menuLayer.addObject(muteButton);
    return menuLayer;
}

function createTelescopeScene(menuLayer) {
    var telescopeScene = Paca.createScene();
    var layer = Paca.createLayer();
    layer.addObject(Paca.createClickable(Paca.createSprite("images/scene_telescope.png", 1), {x: 320, y: 240}, function() {
        Paca.changeScene("houseScene");
    }));
    telescopeScene.setLayers([menuLayer, layer]);
    telescopeScene.activate = function() {
        Paca.addText({name:"Scientist", text:"There she is, on another planet...", color:"rgb(255,255,255)"});
        Paca.addText({name:"Scientist", text:"Just a thousand miles apart, but no way to reach her", color:"rgb(255,255,255)"});
    };
    return telescopeScene;
} 

function createOutsideScene(menuLayer, player) {

    var mesh = Paca.createNavigationMesh()
                .addPolygon({
                    mesh:  [{x: 130, y: 330}, {x: 11, y: 470}, {x: 386, y: 477}, {x: 296, y: 330}],
                    links: []
                }).setNavLinks([]);

    var scene = Paca.createScene(mesh, player);

    var navigationLayer = Paca.createLayer();
    navigationLayer.addObject(player);

    var backgroundLayer = Paca.createLayer();
    backgroundLayer.addObject(Paca.createDrawable(Paca.createSprite("images/scene_outside.png", 1), {x: 0, y: 0}));

    scene.setLayers([menuLayer, navigationLayer, backgroundLayer]);
    scene.activate = function() {
        player.setLocation({x: 205, y: 330});
        Paca.addText({name:"Scientist", text:"I should just build that d*mn rocket!", color:"rgb(255,255,255)"});
        Paca.playBackground("music/song2");
    };
   
    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_townsign.png", 1), {x: 80, y: 340}, {x:129, y:475}, function() {
        Paca.changeScene("townScene");
    }));

    return scene;
} 

function createButcherScene(menuLayer, player) {

    var mesh = Paca.createNavigationMesh()
                .addPolygon({
                    mesh:  [{x: 197, y: 191}, {x: 130, y: 297}, {x: 501, y: 474}, {x: 633, y: 189}],
                    links: [0]
                })
                .setNavLinks([]);

    var scene = Paca.createScene(mesh, player);

    var navigationLayer = Paca.createLayer();
    navigationLayer.addObject(player);

    var backgroundLayer = Paca.createLayer();
    backgroundLayer.addObject(Paca.createDrawable(Paca.createSprite("images/scene_butcher.png", 1), {x: 0, y: 0}));

    scene.setLayers([menuLayer, navigationLayer, backgroundLayer]);
    scene.activate = function() {
        player.setLocation({x: 407, y: 222});
    };
    return scene;
} 

function createTownScene(menuLayer, player) {

    var mesh = Paca.createNavigationMesh()
                .addPolygon({
                    mesh:  [{x: 220, y: 342}, {x: 600, y: 325}, {x: 575, y: 370}, {x: 186, y: 380}],
                    links: [0]
                })
                .addPolygon({
                    mesh:  [{x: 180, y: 376}, {x: 37, y: 475}, {x: 266, y: 477}, {x: 312, y: 375}],
                    links: [0,1]
                })
                .addPolygon({
                    mesh:  [{x: 255, y: 445}, {x: 254, y: 475}, {x: 593, y: 477}, {x: 593, y: 445}],
                    links: [1]
                })
                .setNavLinks([
                    {x: 271, y: 373, n:  [1] },
                    {x: 256, y: 457, n:  [0] }
                ]);

    var scene = Paca.createScene(mesh, player);

    var navigationLayer = Paca.createLayer();
    navigationLayer.addObject(player);

    var backgroundLayer = Paca.createLayer();
    backgroundLayer.addObject(Paca.createDrawable(Paca.createSprite("images/scene_town.png", 1), {x: 0, y: 0}));

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_door.png", 1), {x: 183, y: 316}, {x:213, y:354}, function() {
        Paca.changeScene("butcherScene");
    }));

    scene.setLayers([menuLayer, navigationLayer, backgroundLayer]);
    scene.activate = function() {
        player.setLocation({x: 550, y: 350});
    };
    return scene;
} 

function createHouseScene(menuLayer, player) {

    var mesh = Paca.createNavigationMesh()
                .addPolygon({
                    mesh:  [{x: 1, y: 335}, {x: 313, y: 244}, {x: 632, y: 477}, {x: 8, y: 477}],
                    links: []
                }).setNavLinks([]);

    var scene = Paca.createScene(mesh, player);

    var navigationLayer = Paca.createLayer();
    navigationLayer.addObject(player);

    var canGoOutside = false;

    var backgroundLayer = Paca.createLayer();
    backgroundLayer.addObject(Paca.createDrawable(Paca.createSprite("images/scene_house.png", 1), {x: 0, y: 0}));
    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_telescope.png", 1), {x: 300, y: 215}, {x:313, y:250}, function() {
        Paca.changeScene("telescopeScene");
        if(!canGoOutside) {
            canGoOutside = true;
            backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_arrow.png", 1), {x: 537, y: 430}, {x:537, y:430}, function() {
                Paca.changeScene("outsideScene");
            }));
        }
    }));
    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_globe.png", 6), {x: 160, y: 181}, {x:203, y:281}, function() {
        Paca.addText({name:'Scientist', text:'My plans... I need to get on that rocket!', color:'rgb(255,255,255)'}, true);
    }));
    var spaceLayer = Paca.createLayer();
    spaceLayer.addObject(Paca.createDrawable(Paca.createSprite("images/scene_space.png", 1), {x: 0, y: 0}));

    scene.setLayers([menuLayer, navigationLayer, backgroundLayer, spaceLayer]);
    return scene;
} 

    /** House scene 1 **/
    /*
    var houseMesh = Paca.createNavigationMesh()
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
                ]);*/

function createGame() {

    var playerSpriteUp = Paca.createSprite("images/nerd/walk_up.png", 10);
    var playerSpriteRight = Paca.createSprite("images/nerd/walk_right.png", 10);
    var playerSpriteDown = Paca.createSprite("images/nerd/walk_down.png", 10);
    var playerSpriteLeft = Paca.createSprite("images/nerd/walk_left.png", 10);
    var playerSpriteIdle = Paca.createSprite("images/nerd/walk_down.png", 10);
    var playerSpriteIdle = Paca.createSprite("images/nerd/idle.png", 9);

    var player = Paca.createActor([
            playerSpriteUp, 
            playerSpriteRight, 
            playerSpriteDown, 
            playerSpriteLeft, 
            playerSpriteIdle
        ],
        {x: 270, y: 330}
    );

    var menuLayer = createMenuLayer();

    var gameScenes = new Object();
    gameScenes['startScene'] = createStartScene();
    gameScenes['houseScene'] = createHouseScene(menuLayer, player);
    gameScenes['telescopeScene'] = createTelescopeScene(menuLayer);
    gameScenes['outsideScene'] = createOutsideScene(menuLayer, player);
    gameScenes['townScene'] = createTownScene(menuLayer, player);
    gameScenes['butcherScene'] = createButcherScene(menuLayer, player);

    //Override for debug:
    //Paca.DEBUG = true;//false;
    //gameScenes['startScene'] = gameScenes['butcherScene'];

    return gameScenes;
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

    Paca.create({width:640,  height:480}, gameCanvas, gameArea);

    Paca.initialize(
        [
            "images/splash_screen.png",
            "images/sound_enabled.png",
            "images/sound_disabled.png",
            "images/nerd/walk_down.png",
            "images/nerd/walk_up.png",
            "images/nerd/walk_left.png",
            "images/nerd/walk_right.png",
            "images/nerd/idle.png",
            "images/scene_house.png",
            "images/scene_space.png",
            "images/item_telescope.png",
            "images/scene_telescope.png",
            "images/scene_outside.png",
            "images/item_arrow.png",
            "images/item_globe.png",
            "images/item_townsign.png",
            "images/scene_town.png",
            "images/scene_butcher.png",
            "images/item_door.png",
        ],
        [
            "sounds/void",
            "sounds/typewriter",
            "music/song1",
            "music/song2",
        ],
        createGame()
    );
};

// Scroll to hide iPhone/iPad browser addressbar:
var goFull = function (){
    if (screenfull.enabled) {
        screenfull.request();
    }
};

window.onerror = function (message, fileURL, lineNumber) {
    alert('An error has occured:\n' + message + '\n' + fileURL + '\n' + lineNumber)
};

