/**
 * -------------------------------------------------------------------------------------------------
 * -- Global params
 * -------------------------------------------------------------------------------------------------
 */

var Paca = function() {}

/**
 * -------------------------------------------------------------------------------------------------
 * -- Initialize
 * -------------------------------------------------------------------------------------------------
 */

Paca.create = function(gameDimensions, gameCanvas, gameArea) {
    this.DEBUG = false;
    this.GAME_WIDTH = gameDimensions.width;
    this.GAME_HEIGHT = gameDimensions.height;

    this.screenDirty = true;
    this.images = new Object();
    this.soundBuffers = new Object();
    this.gameCanvas = gameCanvas;
    this.gameArea = gameArea;
    this.dialog = new Paca.Dialog();

    this.audio = (function() {
        return new (window.AudioContext || window.webkitAudioContext)();
    })();

    gameCanvas.addEventListener("touchstart", Paca.touchStart);
    gameCanvas.addEventListener("mousedown", Paca.mouseClick);
    gameCanvas.addEventListener("mousemove", Paca.mouseMove);

    this.drawCanvas = document.createElement('canvas');

    this.drawCanvas.width = Paca.GAME_WIDTH;
    this.drawCanvas.height = Paca.GAME_HEIGHT;

    this.drawContext = this.drawCanvas.getContext("2d");

    //Do an initial resize:
    resizeGameArea();
}

Paca.initialize = function(imageResources, soundResources, startingScene) {

    //Start loading all the resources (images):
    //NICETOHAVE: Later on, also load sounds here!
    Prefetch.prefetchResources(
        imageResources,
        soundResources,
        //Callback after loading:
        function () {


            Paca.changeScene(startingScene);
            //Start the loops, render game and logic:
            Paca.startRendering();
            Paca.startLogic();
        },
        this
    );
}

Paca.addImage = function(uri, image) {
    this.images[uri] = image;
}

Paca.addSound = function(uri, buffer) {
    this.soundBuffers[uri] = buffer;
}


Paca.setCursor = function(name) {
    this.gameArea.style.cursor = name;
}


/**
 * -------------------------------------------------------------------------------------------------
 * -- Logic loop
 * -------------------------------------------------------------------------------------------------
 */

Paca.startLogic = function() {

    (function logicLoop(){
        Paca.screenDirty = true;
        Paca.currentScene.step();

        setTimeout(logicLoop, 1000 / 10);

    })();
}


/**
 * -------------------------------------------------------------------------------------------------
 * -- Rendering loop
 * -------------------------------------------------------------------------------------------------
 */

Paca.startRendering = function() {
    (function renderLoop() {
        requestAnimFrame(renderLoop);
        Paca.draw();
    })();
}

Paca.draw = function() {
    if (Paca.screenDirty) {
        Paca.screenDirty = false;

        Paca.drawContext.clearRect(0, 0, Paca.GAME_WIDTH, Paca.GAME_HEIGHT);

        //Draw the current scene and everything in it:
        Paca.currentScene.draw();

        //Instant drawing (no partial updates)
        var gCtx = Paca.gameCanvas.getContext("2d");
        gCtx.clearRect(0, 0, Paca.gameCanvas.width, Paca.gameCanvas.height);
        gCtx.drawImage(Paca.drawCanvas, 0, 0, Paca.GAME_WIDTH, Paca.GAME_HEIGHT, 0, 0, Paca.gameCanvas.width, Paca.gameCanvas.height);

        Paca.dialog.draw(gCtx);
    }
}

/**

 Objects (extends Drawable) are things that are drawn and clicked

 NICETOHAVE: Add cursor support for Objects/Actors
 NICETOHAVE: Add sound (eventually)

 */

Paca.changeScene = function(scene) {
    Paca.currentScene = scene;
}

/**
 * -------------------------------------------------------------------------------------------------
 * -- A scene contains layers which in turn contain objects/actors/navmeshes/navlinks etc
 * -------------------------------------------------------------------------------------------------
 */

 Paca.newScene = function(mesh, player) {
    return new Paca.Scene(mesh, player);
}

 Paca.Scene = function(meshIn, playerIn) {

    this.player = playerIn;
    this.mesh = meshIn;

    var layers = [];

    this.setLayers = function (newLayers) {
        layers = newLayers;
    };

    this.hover = function (point) {
        for (var x = layers.length; x-- > 0;) {
            if (layers[x].hover(point)) {
                return true;
            }
        }
        if (this.mesh.hover(point)) {
            return true;
        }
    };

    this.click = function (point) {
        for (var x = layers.length; x-- > 0;) {
            if (layers[x].click(point)) {
                return true;
            }
        }
        if (this.mesh.click(point)) {
            return true;
        }
    };

    this.step = function () {
        for (var x = layers.length; x-- > 0;) {
            layers[x].step();
        }
    };

    this.draw = function () {
        for (var x = layers.length; x-- > 0;) {
            layers[x].draw();
        }
        if(Paca.DEBUG) {
            this.mesh.draw();
        }
    };

    return this;
}


/**
 * -------------------------------------------------------------------------------------------------
 * -- Every scene consists of layers
 * -------------------------------------------------------------------------------------------------
 */

Paca.createLayer = function() {
    return new Paca.Layer();
}

Paca.Layer = function() {

    var objects = [];

    this.addObject = function (newObject) {
        objects[objects.length] = newObject;
    };

    this.hover = function (point) {
        for (var x = 0; x < objects.length; x++) {
            if(objects[x].hover) {
                if(objects[x].hover(point)) {
                    return true;
                }
            }
        }
    };

    this.click = function (point) {
        for (var x = 0; x < objects.length; x++) {
            if(objects[x].click && objects[x].click(point)) {
                return true;
            }
        }
    };

    this.step = function () {
        for (var x = 0; x < objects.length; x++) {
            if(objects[x].step) {
                objects[x].step();
            }
        }

        //Keep items sorted to draw correctly
        objects.sort((function(a, b) {
            if(a.getLocation().y < b.getLocation().y) {
                return -1;
            } else if(a.getLocation().y > b.getLocation().y) {
                return 1;
            }
            return 0;
        }));
    };

    this.draw = function () {
        for (var x = 0; x < objects.length; x++) {
            if(objects[x].draw) {
                objects[x].draw();
            }
        }
    };
}

/**
 * -------------------------------------------------------------------------------------------------
 * -- A Drawable has a position (x, y) and one or more images which are automatically used/stepped through (sprites)
 * -------------------------------------------------------------------------------------------------
 */

Paca.createDrawable = function(sprite, drawPoint) {
    return new Paca.Drawable(sprite, drawPoint);
}

Paca.Drawable = function(sprite, drawPoint) {

    this.getLocation = function() {
        return drawPoint;
    };

    this.step = function () {
        sprite.step();
    };

    this.draw = function () {
        Paca.drawContext.drawImage(sprite.currentImage(), drawPoint.x|0, drawPoint.y|0);
    };
}

/**
 * -------------------------------------------------------------------------------------------------
 * -- A Collectable has a position (x, y) and one or more images which are automatically used/stepped through (sprites)
 * -- But the Collectable has text/goal/target, can be clicked
 * -------------------------------------------------------------------------------------------------
 */

Paca.createCollectable = function(sprite, drawPoint, walkPoint, callback) {
    return new Paca.Collectable(sprite, drawPoint, walkPoint, callback);
}

Paca.Collectable = function(sprite, drawPoint, walkPoint, callback) {

    this.getLocation = function() {
        return drawPoint;
    };

    function onCollectable(point) {
        var toDraw = sprite.currentImage();
        var clickPolygon = [
            {x: (drawPoint.x-(toDraw.width/2))|0, y: (drawPoint.y-(toDraw.height/2))|0},
            {x: (drawPoint.x+(toDraw.width/2))|0, y: (drawPoint.y-(toDraw.height/2))|0},
            {x: (drawPoint.x+(toDraw.width/2))|0, y: (drawPoint.y+(toDraw.height/2))|0},
            {x: (drawPoint.x-(toDraw.width/2))|0, y: (drawPoint.y+(toDraw.height/2))|0}
        ];
        if (isPointInPolyon(clickPolygon, point)) {
            return true;
        }
        return false;
    }

    this.hover = function (point) {
        return onCollectable(point);
    };

    this.click = function (point) {
        if (onCollectable(point)) {
            Paca.currentScene.player.walkTo(walkPoint, callback);
            return true;
        }
    };

    this.step = function () {
        sprite.step();
    };

    this.draw = function () {
        var toDraw = sprite.currentImage();
        Paca.drawContext.drawImage(toDraw, (drawPoint.x-(toDraw.width/2))|0, (drawPoint.y-(toDraw.height/2))|0);
        if(Paca.DEBUG) {
                Paca.drawContext.beginPath();
                Paca.drawContext.lineWidth = 5;
                Paca.drawContext.strokeStyle = '#FF0000';
                if(walkPoint) {
                    Paca.drawContext.arc(walkPoint.x, walkPoint.y, 2, 0, 2 * Math.PI);
                }
                Paca.drawContext.stroke();
        }
    };
}

/**
 * -------------------------------------------------------------------------------------------------
 * -- Actor has 4 moving and one idle sprite and a position
 * -------------------------------------------------------------------------------------------------
 */

Paca.createActor = function(sprites, startLocation) {
    return new Paca.Actor(sprites, startLocation);
}

Paca.Actor = function(sprites, startLocation) {

    var path = [];
    var callback;
    var actorLocation = startLocation;

    var speed = 5;

    var currentSprite = sprites[4];

    this.setLocation = function(locationIn) {
        actorLocation = locationIn;
        path = [];
        callback = null;
    }

    this.getLocation = function() {
        return actorLocation;
    };

    this.walkTo = function (target, callbackIn) {
        //Generate path now, next go from point to point
        //The direction of the line determines the images displayed
        path = shortestPath(actorLocation, target, Paca.currentScene.mesh);
        callback = callbackIn;
    };

    this.step = function () {
        if(path.length > 0) {
            //Follow the path:
            var currentGoal = path[0];

            //Remove point if we are 'on' it!
            while (path.length > 0 && lineDistance(currentGoal, actorLocation) < speed) {
                path.shift();
                currentGoal = path[0];
            }

            if(path.length > 0) {
                currentGoal = path[0];

                var direction = getDirection(actorLocation, currentGoal);
                currentSprite = sprites[direction];

                direction = norm(subtract(currentGoal, actorLocation));
                actorLocation = add(actorLocation, multiply(direction, speed));
            } else {
                targetReached();
            }
        }

        //Update sprite:
        currentSprite.step();
    };

    function targetReached() {
        currentSprite = sprites[DIRECTION_IDLE];
        if(callback) {
            callback();
            callback = null;
        }
    }

    this.draw = function () {
        var toDraw = currentSprite.currentImage();
        Paca.drawContext.drawImage(toDraw, (actorLocation.x-(toDraw.width/2))|0, (actorLocation.y-toDraw.height)|0);

        if(Paca.DEBUG && path.length > 0) {
            Paca.drawContext.fillStyle = '#FF00FF';
            Paca.drawContext.globalAlpha = 0.2;
            Paca.drawContext.beginPath();
            Paca.drawContext.moveTo(actorLocation.x, actorLocation.y);
            for (var y = 0; y < path.length; y++) {
                Paca.drawContext.lineTo(path[y].x, path[y].y);
            }
            Paca.drawContext.stroke();
            Paca.drawContext.globalAlpha = 1.0;
        }
    };
}

/**
 * -------------------------------------------------------------------------------------------------
 * -- Sprite has an image and splits it into segments each step takes the next segment
 * -------------------------------------------------------------------------------------------------
 */

Paca.createSprite = function(imageIn, segments) {
    return new Paca.Sprite(imageIn, segments);
}

Paca.Sprite = function(imageIn, segments) {

    var images;

    function parseSprite() {
        var image = Paca.images[imageIn];
        var images = [];
        var tempCanvas = document.createElement('canvas');
        tempCanvas.width = image.width/segments;
        tempCanvas.height = image.height;
        var tempContext = tempCanvas.getContext("2d");
        for(segment = 0; segment < segments;segment++) {
            tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempContext.drawImage(image, tempCanvas.width*segment, 0, tempCanvas.width, tempCanvas.height, 0, 0, tempCanvas.width, tempCanvas.height);
            var img = new Image();
            img.src = tempCanvas.toDataURL("image/png");
            images[segment] = img;
        }
        return images;
    }

    var ptr = 0;

    this.step = function () {
        ptr = (ptr + 1) % segments;
    };

    this.currentImage = function () {
        if(!images) {
            images = parseSprite();
        }
        return images[ptr];
    };
}

/**
 * -------------------------------------------------------------------------------------------------
 * -- Sound functions:
 * -------------------------------------------------------------------------------------------------
 */

Paca.playingBackgroundSound = null;

Paca.playBackground = function(source, volume) {
    if(Paca.playingBackgroundSound) {
        Paca.playingBackgroundSound[Paca.playingBackgroundSound.stop ? 'stop' : 'noteOff'](0);
    }
    var soundBuffer = this.soundBuffers[source];
    if(!soundBuffer) return;
    var source = this.audio.createBufferSource();
    source.buffer = soundBuffer;
    if(volume) {
        var gainNode = this.audio.createGain();
        source.connect(gainNode);
        gainNode.connect(this.audio.destination);
        gainNode.gain.value = volume;
    } else {
        source.connect(this.audio.destination);
    }
    source.loop = true;
    source[source.start ? 'start' : 'noteOn'](0);

    Paca.playingBackgroundSound = source;
}


Paca.playSound = function(source, volume) {
    var soundBuffer = this.soundBuffers[source];
    if(!soundBuffer) return;
    var source = this.audio.createBufferSource();
    source.buffer = soundBuffer;
    if(volume) {
        var gainNode = this.audio.createGain();
        source.connect(gainNode);
        gainNode.connect(this.audio.destination);
        gainNode.gain.value = volume;
    } else {
        source.connect(this.audio.destination);
    }
    source[source.start ? 'start' : 'noteOn'](0);
}

/**
 * -------------------------------------------------------------------------------------------------
 * -- Navigation object contains meshes (polygons) and links (points)
 * -- Meshes have connections (links)
 * -- Links connect to other links
 * -------------------------------------------------------------------------------------------------
 */

Paca.createNavigationMesh = function() {
    return new Paca.NavMesh();
}

Paca.NavMesh = function() {

    //Polygons where the user is free to move:
    var polygons = [];
    //Set of link-points that connect the polygons:
    var navLinks;

    this.addPolygon = function(polygonIn) {
        polygons.push(polygonIn);
        return this;
    }

    this.getPolygons = function() {
        return polygons;
    }

    this.setNavLinks = function(navLinksIn) {
        navLinks = navLinksIn;
        return this;
    }

    this.getNavLinks = function() {
        return navLinks;
    }

    this.hover = function (point) {
        for(x = 0; x < polygons.length; x++) {
            var polygon = polygons[x].mesh;
            if (isPointInPolyon(polygon, point)) {
                return true;
            }
        }
        return false;
    };

    this.click = function (point) {
        for(x = 0; x < polygons.length; x++) {
            var polygon = polygons[x].mesh;
            if (isPointInPolyon(polygon, point)) {
                Paca.currentScene.player.walkTo(point);
                return true;
            }
        }
        return false;
    };

    this.draw = function () {
            //Visualize the mesh and links
            for(x = 0; x < polygons.length; x++) {
                var polygon = polygons[x].mesh;

                Paca.drawContext.fillStyle = '#0000FF';
                Paca.drawContext.globalAlpha = 0.2;
                Paca.drawContext.beginPath();
                Paca.drawContext.moveTo(polygon[polygon.length - 1].x, polygon[polygon.length - 1].y);
                for (var y = 0; y < polygon.length; y++) {
                    Paca.drawContext.lineTo(polygon[y].x, polygon[y].y);
                }
                Paca.drawContext.closePath();
                Paca.drawContext.fill();
                Paca.drawContext.globalAlpha = 1.0;
            }
            if(!navLinks) {
                return;
            }
            for(x = 0; x < navLinks.length; x++) {
                var navlink = navLinks[x];
                Paca.drawContext.beginPath();
                Paca.drawContext.lineWidth = 5;
                Paca.drawContext.strokeStyle = '#00FFFF';
                Paca.drawContext.arc(navlink.x, navlink.y, 2, 0, 2 * Math.PI);
                Paca.drawContext.stroke();
                Paca.drawContext.globalAlpha = 0.2;
                for(y=0;y<navlink.n.length;y++) {
                    Paca.drawContext.beginPath();
                    Paca.drawContext.moveTo(navlink.x, navlink.y);
                    Paca.drawContext.lineTo(navLinks[navlink.n[y]].x+5, navLinks[navlink.n[y]].y+5);
                    Paca.drawContext.lineWidth = 1;
                    Paca.drawContext.strokeStyle = '#00FFF0';
                    Paca.drawContext.stroke();
                }
                Paca.drawContext.lineWidth = 1;
                Paca.drawContext.globalAlpha = 1.0;
           }
    };
}

/**
 * -------------------------------------------------------------------------------------------------
 * -- Mouse/touch code
 * -------------------------------------------------------------------------------------------------
 */
Paca.mouseMove = function(e) {
    point = Paca.translatePointToGameWorld(Paca.extractPoint(e));
    if (Paca.currentScene && Paca.currentScene.hover(point)) {
        Paca.setCursor("pointer");
    } else {
        Paca.setCursor("default");
    }
}

Paca.init = false;
Paca.touchStart = function(e) {
    point = Paca.translatePointToGameWorld(Paca.extractPoint(e));
    Paca.currentScene.click(point);
    //On first touch, unmute the audio:
    if(!this.init) {
        this.init = true;
        Paca.playSound("sounds/void.wav", 0);
    }
}

Paca.mouseClick = function(e) {
    point = Paca.translatePointToGameWorld(Paca.extractPoint(e));
    Paca.currentScene.click(point);
    e.preventDefault();
    e.stopPropagation();
    return false;
}

Paca.translatePointToGameWorld = function(point) {
    return {
        x: (Paca.GAME_WIDTH / gameCanvas.width) * point.x,
        y: (Paca.GAME_HEIGHT / gameCanvas.height) * point.y
    }
}

Paca.extractPoint = function(e) {
    return {
        x: e.pageX - gameArea.offsetLeft,
        y: e.pageY - gameArea.offsetTop
    };
}

/**
 * -------------------------------------------------------------------------------------------------
 * -- Dialog system
 * -------------------------------------------------------------------------------------------------
 */

Paca.addText = function(dialogLine, clear) {
    if(clear) {
        Paca.dialog.dialogTimeout = null;
        while (Paca.dialog.dialogQueue.length > 0) {
            Paca.dialog.dialogQueue.pop();
        }
    }
    Paca.dialog.addText(dialogLine);
}

Paca.Dialog = function() {

    this.dialogQueue = [];
    this.dialogTimeout = null;

    this.addText = function(dialogLine) {
        this.dialogQueue.push(dialogLine);
    }

    this.draw = function(ctx) {
        if(this.dialogTimeout && this.dialogTimeout < new Date().getTime()) {
            this.dialogQueue.shift();
            this.dialogTimeout = null;
        }
        if(this.dialogQueue.length == 0) {
            return;
        }

        if(!this.dialogTimeout) {
            Paca.playSound("sounds/typewriter.mp3");
            this.dialogTimeout = (new Date().getTime() + 6000);
        }
        var dialogLine = this.dialogQueue[0];
        if(dialogLine) {

            var backgroundColor = "rgba(11,11,11,0.4)";

            //Background box:
            ctx.lineWidth = 1;

            ctx.fillStyle = backgroundColor;
            var fontHeight = Paca.gameCanvas.height/30;
            ctx.font= fontHeight + "px NameFont, Helvetica, sans serif";
            if(dialogLine.name) {
                var name = dialogLine.name;
                roundRect(ctx, 2*fontHeight, Paca.gameCanvas.height - (6.8*fontHeight), ctx.measureText(name).width + (2*fontHeight), (2 * fontHeight), 8, true)
                if(dialogLine.color) {
                    ctx.fillStyle = dialogLine.color;
                }
                ctx.fillText(name, 3*fontHeight, Paca.gameCanvas.height - (5.5*fontHeight));
                ctx.fillStyle = backgroundColor;
            }

            var textFontHeight = Paca.gameCanvas.height/35;

            ctx.font=textFontHeight + "px TextFont, Helvetica, sans serif";

            roundRect(ctx, 2*fontHeight, Paca.gameCanvas.height - (4.5*fontHeight), Paca.gameCanvas.width - (4*fontHeight), (4 * fontHeight), 8, true)
            if(dialogLine.color) {
                ctx.fillStyle = dialogLine.color;
            }
            wrapText(ctx, dialogLine.text, 3*fontHeight, Paca.gameCanvas.height - (3*fontHeight), Paca.gameCanvas.width - (4*fontHeight), fontHeight*1.2);
        }
    }
}

      function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
      }

/**
 * Draws a rounded rectangle using the current state of the canvas. 
 * If you omit the last three params, it will draw a rectangle 
 * outline with a 5 pixel border radius 
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate 
 * @param {Number} width The width of the rectangle 
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof fill == "undefined" ) {
        fill = true;
    }
    if (typeof stroke == "undefined" ) {
        stroke = false;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fill();
    }        
}


/**
 * -------------------------------------------------------------------------------------------------
 * -- Geometry and path finding functions
 * -------------------------------------------------------------------------------------------------
 */

function isPointInPolyon(poly, pt) {
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
            && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
}

function multiply(point,b) {
    return {x: point.x * b, y: point.y * b};
}

function add(a, b) {
    return {x: a.x + b.x, y: a.y + b.y};
}

function subtract(a,b) {
    return {x: a.x - b.x, y: a.y - b.y};
}

function dotproduct(a,b) {
    return a.x * b.x + a.y * b.y;
}

function norm(a) {
    var length = Math.sqrt(a.x * a.x + a.y * a.y);
    return {x: a.x/length, y: a.y/length};
}

var DIRECTION_UP = 0;
var DIRECTION_RIGHT = 1;
var DIRECTION_DOWN = 2;
var DIRECTION_LEFT = 3;
var DIRECTION_IDLE = 4;

var vectorDirectionLeft = norm({x:-1,y:0});
var vectorDirectionRight = norm({x:1,y:0});
var vectorDirectionUp = norm({x:0,y:-1});
var vectorDirectionDown = norm({x:0,y:1});

function getDirection(origin, target) {
    var o = norm(subtract(origin, target));
    var u = dotproduct(vectorDirectionUp, o);
    var r = dotproduct(vectorDirectionRight, o);
    var d = dotproduct(vectorDirectionDown, o);
    var l = dotproduct(vectorDirectionLeft, o);
    var m = Math.min(Math.min(u,d), Math.min(l,r))
    if(u==m) {
        return DIRECTION_UP;
    } else if(r==m) {
        return DIRECTION_RIGHT;
    } else if(d==m) {
        return DIRECTION_DOWN;
    } else if(l==m) {
        return DIRECTION_LEFT;
    }
    return DIRECTION_DOWN;
}

function shortestPath(initialPoint, targetPoint, mesh) {

    var openNodes = new PriorityQueue( {low : true} );
    var closedPoints = [];
    var targetLinks = [];
    var links = mesh.getNavLinks();

    //First calculate which links we need to navigate from and to
    var polygons = mesh.getPolygons();
    for(x = 0; x < polygons.length; x++) {
        var polygon = polygons[x].mesh;
        if(isPointInPolyon(polygon, initialPoint)) {
            if(isPointInPolyon(polygon, targetPoint)) {
                //Special case, both are in the same polygon, escape early:
                return [initialPoint, targetPoint];
            }
            for(y = 0; y < polygons[x].links.length; y++) {
                var n = node(polygons[x].links[y], null, lineDistance(links[polygons[x].links[y]], initialPoint), lineDistance(links[polygons[x].links[y]], targetPoint));
                openNodes.push(n, n.f());
            }
        }
    }
    for(x = 0; x < polygons.length; x++) {
        var polygon = polygons[x].mesh;
        if(isPointInPolyon(polygon, targetPoint)) {
            for(y = 0; y < polygons[x].links.length; y++) {
                targetLinks.push(polygons[x].links[y]);
            }
        }
    }

    //Repeat until target isn't found or open points is empty
    var foundTarget = null;
    while(foundTarget == null && openNodes.size() > 0) {

        var currentNode = openNodes.pop();
        closedPoints.push(currentNode);
        //Check if the target has been found:
        for(x = 0; x < targetLinks.length; x++) {
            if(currentNode.point() == targetLinks[x]) {
                foundTarget = currentNode;
                //Target found, break!
                break;
            }
        }

        //This is the A* loop:
        var neighbourPoints = links[currentNode.point()].n;
        for(x = 0; x < neighbourPoints.length; x++) {

            var nPoint = node(neighbourPoints[x], currentNode.point(), currentNode.g() + lineDistance(links[neighbourPoints[x]], links[currentNode.point()]), lineDistance(links[neighbourPoints[x]], targetPoint));
            var alreadyClosed = false;

            //If the neighbour node is already closed, ignore this neighbour:
            for(y = 0; y < closedPoints.length; y++) {
                if(closedPoints[y].point() == neighbourPoints[x]) {
                    alreadyClosed = true;
                    break;
                }
            }
            if(!alreadyClosed) {
                var alreadyOpen = false;
                //If the neighbour node is already in the open points, check if our result is better:
                var openNodesList = openNodes.list();
                for(y = 0; y < openNodesList.length; y++) {
                    var nodeFromOpen = openNodesList[y].object;
                    if(nodeFromOpen.point() == nPoint.point()) {
                        alreadyOpen = true;
                        //If we have a lower G, update the open points with our parent and g score.
                        if(nPoint.g() < nodeFromOpen.g()) {
                            nodeFromOpen.update(nPoint.parent(), nPoint.g());
                            break;
                        }
                    }
                }
                if(!alreadyOpen) {
                    //If the node wasn't open and wasn't closed, add it to the open points:
                    openNodes.push(nPoint, nPoint.f());
                }
            }
        }
    }

    //Rebuild the path tracing back the nodes parents:
    var path = [];
    path.push(targetPoint);
    if(foundTarget != null) {
        while(foundTarget.parent() != null) {
            path.push(links[foundTarget.point()]);
            for(y = 0; y < closedPoints.length; y++) {
                if(closedPoints[y].point() == foundTarget.parent()) {
                    foundTarget = closedPoints[y];
                }
            }
        }
        path.push(links[foundTarget.point()]);
    }
    path.push(initialPoint);
    path.reverse();

    return path;
}

function lineDistance(p1, p2) {
    var xs = 0;
    var ys = 0;
    xs = p2.x - p1.x;
    xs = xs * xs;
    ys = p2.y - p1.y;
    ys = ys * ys;
    return Math.sqrt(xs + ys);
}

function node(point, parentIn, gIn, hIn) {
    var h = hIn;
    var g = gIn;
    var parent = parentIn;
    return {
        point: function () {
            return point;
        },
        parent: function () {
            return parent;
        },
        g: function () {
            return g;
        },
        f: function () {
            return h+g;
        },
        update: function(parentIn, gIn) {
            g = gIn;
            parent = parentIn;
        }
    };
}


