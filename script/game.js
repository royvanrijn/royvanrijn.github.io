
//Puzzle state:
var siloBlownUp = false;
var hasRocket = false;
var askedForFuel = false;
var knowsSalami = false;
var hasBlood = false;
var lionRoared = false;
var hasHat = false;
var hasFins = false;

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

function createMythbustersScene3(menuLayer) {
    var scene = Paca.createScene();
    var tvLayer = Paca.createLayer();
    tvLayer.addObject(Paca.createDrawable(Paca.createSprite("images/scene_television.png", 1), {x: 0, y: 0}));

    var bustersLayer = Paca.createLayer();
    bustersLayer.addObject(Paca.createDrawable(Paca.createSprite("images/adam_jamie.png", 1), {x:60, y:40}));

    scene.activate = function() {
        Paca.addText({name:"Mythbusters", text:"...next up, the salami rocket myth...", color:"rgb(255,255,255)", callback: function() {
            Paca.changeScene("electronicsStoreScene");
            Paca.addText({name:"Scientist", text:"OF COURSE! Salami is the perfect rocket fuel!", color:"rgb(255,255,255)"});
            knowsSalami = true;
        }}, true);
    };

    scene.setLayers([menuLayer, tvLayer, bustersLayer]);
    return scene;
}


function createMythbustersScene2(menuLayer) {
    var scene = Paca.createScene();
    var tvLayer = Paca.createLayer();
    tvLayer.addObject(Paca.createDrawable(Paca.createSprite("images/scene_television.png", 1), {x: 0, y: 0}));

    var bustersLayer = Paca.createLayer();
    bustersLayer.addObject(Paca.createDrawable(Paca.createSprite("images/adam_jamie.png", 1), {x:60, y:40}));

    scene.activate = function() {
        Paca.addText({name:"Mythbusters", text:"No myths being busted now, come back later.", color:"rgb(255,255,255)", callback: function() {
            Paca.changeScene("electronicsStoreScene");
        }}, true);
    };

    scene.setLayers([menuLayer, tvLayer, bustersLayer]);
    return scene;
}

function createMythbustersScene1(menuLayer, player) {
    var scene = Paca.createScene();
    var tvLayer = Paca.createLayer();
    tvLayer.addObject(Paca.createDrawable(Paca.createSprite("images/scene_television.png", 1), {x: 0, y: 0}));

    var siloLayer = Paca.createLayer();
    siloLayer.addObject(Paca.createDrawable(Paca.createSprite("images/item_silo.png", 1), {x:130, y:20}));

    var bustersLayer = Paca.createLayer();
    bustersLayer.addObject(Paca.createClickable(Paca.createSprite("images/adam_jamie.png", 1), {x:350, y:230}, function() {
        //Remove Adam and Jamie:
        bustersLayer.clear();

        Paca.addText({name:"Mythbusters", text:"5... 4... 3... 2... 1... ", color:"rgb(255,255,255)", callback: function() {
            Paca.playSound("sounds/explode");
            siloBlownUp = true;
            Paca.changeScene("electronicsStoreScene");
        }}, true);
    }));

    scene.activate = function() {
        Paca.playBackground("music/song3", 0.5);
        Paca.addText({name:"Mythbusters", text:"Today on Mythbusters, we're going to blow up a grain silo!", color:"rgb(255,255,255)"}, true);
        Paca.addText({name:"Jamie", text:"What myth is that?", color:"rgb(255,255,255)"});
        Paca.addText({name:"Adam", text:"The myth grain silo's can't be blown up!", color:"rgb(255,255,255)"});
    };

    scene.setLayers([menuLayer, tvLayer, bustersLayer, siloLayer]);
    return scene;
}

function createMenuLayer(planLayer) {
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

    var showing = false;
    menuLayer.addObject(Paca.createClickable(Paca.createSprite("images/item_plan.png", 1), {x: 610, y: 380}, function() {
        if(!showing) {

            if(hasRocket) {
                planLayer.addObject(Paca.createDrawable(Paca.createSprite("images/item_rocket_design_silo.png",1), {x:73, y:72}));
            }
            if(hasHat) {
                planLayer.addObject(Paca.createDrawable(Paca.createSprite("images/item_rocket_design_hat.png",1), {x:73, y:72}));
            }
            if(hasFins) {
                planLayer.addObject(Paca.createDrawable(Paca.createSprite("images/item_rocket_design_fins.png",1), {x:73, y:72}));
            }

            if(hasRocket && hasHat && hasFins) {
                Paca.addText({name:"Scientist", text:"The only thing I still need is fuel...", color:"rgb(255,255,255)"});
                askedForFuel = true;
            }
            menuLayer.addObject(Paca.createClickable(Paca.createSprite("images/item_rocket_design.png", 1), {x: 320, y: 240}, function() {
                //And remove popup again
                planLayer.clear();
                menuLayer.popObject();
                showing = false;
            }));
            showing = true;
        }   
    }));
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

function createOutsideScene(planLayer, menuLayer, player) {

    var mesh = Paca.createNavigationMesh()
                .addPolygon({
                    mesh:  [{x: 130, y: 330}, {x: 11, y: 470}, {x: 356, y: 477}, {x: 296, y: 330}],
                    links: []
                }).setNavLinks([]);

    var scene = Paca.createScene(mesh, player);

    var navigationLayer = Paca.createLayer();
    navigationLayer.addObject(player);

    var backgroundLayer = Paca.createLayer();
    backgroundLayer.addObject(Paca.createDrawable(Paca.createSprite("images/scene_outside.png", 1), {x: 0, y: 0}));

    scene.setLayers([planLayer, menuLayer, navigationLayer, backgroundLayer]);
    var rocketIdea = false;
    scene.activate = function() {
        if(!rocketIdea) {
            Paca.addText({name:"Scientist", text:"I should just build that d*mn rocket!", color:"rgb(255,255,255)"});
            rocketIdea = true;
        }
    };
   
    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_townsign_west.png", 1), {x: 80, y: 340}, {x:129, y:475}, function() {
        player.setLocation({x: 550, y: 350});
        Paca.changeScene("townScene");
    }));
   
    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_circussign.png", 1), {x: 370, y: 400}, {x:300, y:470}, function() {
        player.setLocation({x: 110, y: 460});
        Paca.changeScene("circusScene");
    }));

    return scene;
}


function createRocketScene(planLayer, menuLayer, player) {
    var mesh = Paca.createNavigationMesh()
                .addPolygon({
                    mesh:  [{x: 500, y: 340}, {x: 420, y: 430}, {x: 625, y: 470}, {x: 625, y: 350}],
                    links: []
                }).setNavLinks([]);

    var scene = Paca.createScene(mesh, player);

    var navigationLayer = Paca.createLayer();
    navigationLayer.addObject(player);

    var backgroundLayer = Paca.createLayer();
    backgroundLayer.addObject(Paca.createDrawable(Paca.createSprite("images/scene_rocket.png", 1), {x: 0, y: 0}));

    scene.setLayers([planLayer, menuLayer, navigationLayer, backgroundLayer]);

    scene.activate = function() {
        Paca.playBackground("music/song3");
        if(!hasRocket) {
            /** First time rocket is seen: **/
            Paca.addText({name:"Scientist", text:"Wow, this must be the silo the mythbusters blew up", color:"rgb(255,255,255)"}, true);
            Paca.addText({name:"Scientist", text:"This is the perfect body for my rocket!", color:"rgb(255,255,255)", callback: function() {
                Paca.playSound("sounds/itemfound");
                hasRocket = true;
            }});
        }
    };

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_townsign_east.png", 1), {x: 550, y: 300}, {x:610, y:410}, function() {
        player.setLocation({x: 100, y: 450});
        Paca.changeScene("townScene");
    }));
   return scene;
}

function createCircusScene(planLayer, menuLayer, player) {
    var mesh = Paca.createNavigationMesh()
                .addPolygon({
                    mesh:  [{x: 10, y: 360}, {x: 10, y: 470}, {x: 475, y: 470}, {x: 440, y: 360}],
                    links: []
                }).setNavLinks([]);

    var scene = Paca.createScene(mesh, player);

    var wizardLayer = Paca.createLayer();

    var roarLayer = Paca.createLayer();

    var navigationLayer = Paca.createLayer();
    navigationLayer.addObject(player);

    var backgroundLayer = Paca.createLayer();
    backgroundLayer.addObject(Paca.createDrawable(Paca.createSprite("images/scene_circus.png", 1), {x: 0, y: 0}));

    scene.setLayers([planLayer, menuLayer, roarLayer, navigationLayer, wizardLayer, backgroundLayer]);
    scene.activate = function() {
        Paca.playBackground("music/song1");
    };
   
    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_lion_calm.png", 1), {x: 496, y: 241}, {x:400, y:375}, function() {
        if(!hasBlood) {
            Paca.addText({name:"Lion tamer", text:"Oh please be carefull, don't bring food here", color:"rgb(255,255,255)"}, true);
            Paca.addText({name:"Lion tamer", text:"The lion goes crazy when he's hungry", color:"rgb(255,255,255)"});
            Paca.addText({name:"Lion tamer", text:"He smells fair and blood...", color:"rgb(255,255,255)"});
        } else if(!lionRoared) {
            Paca.currentScene.freeze();
            roarLayer.addObject(Paca.createDrawable(Paca.createSprite("images/item_lion_roar.png", 1), {x:380  ,y:190}));
            roarLayer.addObject(Paca.createDrawable(Paca.createSprite("images/item_roar.png", 2), {x:0,y:0}));
            Paca.playSound("sounds/roar");
            Paca.addText({name:"Wizard", text:"AAAAHHHHHH!!", color:"rgb(255,255,255)", callback: function() {
               Paca.currentScene.unfreeze();
                roarLayer.clear();
                wizardLayer.clear();
                wizardLayer.addObject(Paca.createCollectable(Paca.createSprite("images/wizard_scared.png", 1), {x: 545, y: 400}, {x:440, y:400}, function() {
                    Paca.addText({name:"Wizard", text:"I'm afraid!", color:"rgb(255,255,255)", callback:function() {
                        wizardLayer.clear();
                        wizardLayer.addObject(Paca.createDrawable(Paca.createSprite("images/wizard_scared_hatless.png", 1), {x: 465, y: 351}));
                        Paca.addText({name:"Scientist", text:"This hat makes a perfect nose cone!", color:"rgb(255,255,255)"});
                        hasHat = true;
                        Paca.playSound("sounds/itemfound");
                    }}, true);
                }));
            }});
            lionRoared = true;
        } else {
            Paca.addText({name:"Lion tamer", text:"STAY AWAY!", color:"rgb(255,255,255)"}, true);
        }
    }));
   
    wizardLayer.addObject(Paca.createCollectable(Paca.createSprite("images/wizard_standing.png", 1), {x: 520, y: 370}, {x:470, y:460}, function() {
        Paca.addText({name:"Wizard", text:"YOU SHALL NOT PASS!", color:"rgb(182,97,210)"}, true);
    }));

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_arrow_w.png", 1), {x: 50, y: 400}, {x:10, y:420}, function() {
        player.setLocation({x: 220, y: 450});
        Paca.changeScene("outsideScene");
    }));

    return scene;
}

function createElectronicsStoreScene(planLayer, menuLayer, player) {
    var mesh = Paca.createNavigationMesh()
                .addPolygon({
                    mesh:  [{x: 282, y: 203}, {x: 6, y: 456}, {x: 447, y: 466}, {x: 394, y: 203}],
                    links: [0]
                })
                .setNavLinks([]);  
    var scene = Paca.createScene(mesh, player);

    var navigationLayer = Paca.createLayer();
    navigationLayer.addObject(player);

    var backgroundLayer = Paca.createLayer();
    backgroundLayer.addObject(Paca.createDrawable(Paca.createSprite("images/scene_electronics.png", 1), {x: 0, y: 0}));

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_arrow_s.png", 1), {x: 240, y: 430}, {x:240, y:450}, function() {
        player.setLocation({x: 417, y: 340});
        Paca.changeScene("townScene");
    }));

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_door.png", 1), {x: 333, y: 180}, {x:333, y:210}, function() {
        Paca.addText({name:"Scientist", text:"Cool, the Mythbusters are on", color:"rgb(255,255,255)"}, true);
        if(!siloBlownUp) {
            Paca.changeScene("mythbustersScene1");
            siloBlownUp = true;
        } else if(!askedForFuel) {
            Paca.changeScene("mythbustersScene2");
        } else {
            Paca.changeScene("mythbustersScene3");
        }
    }));


    scene.setLayers([planLayer, menuLayer, navigationLayer, backgroundLayer]);
    scene.activate = function() {
    };

    return scene;

}

function createButcherScene(planLayer, menuLayer, player) {

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

    backgroundLayer.addObject(Paca.createDrawable(Paca.createSprite("images/item_fly.png", 14), {x:113, y:400}));

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_blooddrip.png", 5), {x:173, y:150}, {x:200, y:200}, function() {
        if(!hasBlood) {
            hasBlood = true;
            Paca.addText({name:"Scientist", text:"Yuk, blood dripped on my shoes", color:"rgb(255,255,255)"}, true);
        } else {
            Paca.addText({name:"Scientist", text:"Grose, I'm not coming near that thing", color:"rgb(255,255,255)"}, true);
        }
    }));

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/butcher.png", 1), {x:430, y:120}, {x:430, y:230}, function() {
        if(!askedForFuel) {
            Paca.addText({name:"Butcher", text:"Nice to meat you! Do you want meat?", color:"rgb(255,255,255)"}, true);
            Paca.addText({name:"Scientist", text:"No sorry, I'm building a rocket", color:"rgb(255,255,255)"});
        } else {
            Paca.addText({name:"Butcher", text:"What do you meat?", color:"rgb(255,255,255)"}, true);
            Paca.addText({name:"Scientist", text:"I'd like some salami please!", color:"rgb(255,255,255)", callback: function() {
                Paca.playSound("sounds/itemfound");
                console.log("play ending scene?");
            }});
        }
    }));

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_arrow_ne.png", 1), {x: 590, y: 222}, {x:620, y:195}, function() {
        player.setLocation({x: 219, y: 350});
        Paca.changeScene("townScene");
    }));

    scene.setLayers([planLayer, menuLayer, navigationLayer, backgroundLayer]);
    scene.activate = function() {
    };
    return scene;
} 

function createTownScene(planLayer, menuLayer, player) {

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

    var dudeLayer = Paca.createLayer();
    var cadillacLayer = Paca.createLayer();

    var backgroundLayer = Paca.createLayer();
    backgroundLayer.addObject(Paca.createDrawable(Paca.createSprite("images/scene_town.png", 1), {x: 0, y: 0}));

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_door.png", 1), {x: 183, y: 316}, {x:213, y:354}, function() {
        player.setLocation({x: 567, y: 322});
        Paca.changeScene("butcherScene");
    }));

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_door.png", 1), {x: 421, y: 288}, {x:420, y:338}, function() {
        player.setLocation({x: 205, y: 450});
        Paca.changeScene("electronicsStoreScene");
    }));

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_arrow_ne.png", 1), {x: 593, y: 270}, {x:553, y:344}, function() {
        player.setLocation({x: 207, y: 482});
        Paca.changeScene("outsideScene");
    }));

    var talkedAboutLions = false;
    var leftAfterLion = false;
    dudeLayer.addObject(Paca.createCollectable(Paca.createSprite("images/cadillac_dude.png", 1), {x:530, y:411}, {x:456, y:471}, function() {
        if(!lionRoared) {
            Paca.addText({name:'Owner', text:"I've got nothing for ya", color:'rgb(255,255,255)'}, true);
        } else if(!talkedAboutLions) {
            Paca.currentScene.freeze();
            Paca.addText({name:'Owner', text:"Man, I heard a fierce lion roar, did he escape?", color:'rgb(255,255,255)'}, true);
            Paca.addText({name:'Scientist', text:"No, you're safe!", color:'rgb(255,255,255)', callback: function() {
                player.walkTo({x:310, y:471}, function() {
                    Paca.currentScene.unfreeze();
                    Paca.addText({name:'Scientist', text:"Crap, maybe I can scare him away?", color:'rgb(255,255,255)'});
                    talkedAboutLions = true;
                });
            }});
        } else if(!leftAfterLion) {
            Paca.addText({name:'Owner', text:"I'm so glad the lion didn't escape...", color:'rgb(255,255,255)'}, true);
        } else if(!hasFins) {
            Paca.currentScene.freeze();
            Paca.addText({name:'Scientist', text:"Did you hear that? The lion escaped!", color:'rgb(255,255,255)'}, true);
            Paca.addText({name:'Owner', text:"NOOOO!!!", color:'rgb(255,255,255)', callback: function() {
                dudeLayer.clear();
                player.walkTo({x:310, y:471}, function() {
                    Paca.addText({name:'Scientist', text:"Time to get those fins!", color:'rgb(255,255,255)'});
                    hasFins = true;
                    Paca.playSound("sounds/itemfound");
                    cadillacLayer.clear();
                    cadillacLayer.addObject(Paca.createDrawable(Paca.createSprite("images/item_cadillac_finless.png", 1), {x:260, y:365 }));
                    Paca.currentScene.unfreeze();
                });
            }});
        }
    }));

    cadillacLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_cadillac.png", 1), {x:410, y:410}, {x:386, y:471}, function() {
        if(hasRocket) {
            Paca.addText({name:'Scientist', text:'Hmm, those fins would look great on my rocket!', color:'rgb(255,255,255)'}, true);
        } else {
            Paca.addText({name:'Scientist', text:'Nice car...', color:'rgb(255,255,255)'}, true);
            Paca.addText({name:'Owner', text:'Get lost punk...', color:'rgb(255,255,255)'});
        }
    }))

    var hasRocketSceneSign = false;
    scene.activate = function() {
        Paca.playBackground("music/song2");
        if(siloBlownUp && !hasRocketSceneSign) {
            hasRocketSceneSign = true;
            backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_arrow_w.png", 1), {x: 50, y: 400}, {x: 100, y: 450}, function() {
                player.setLocation({x: 560, y: 400});
                Paca.changeScene("rocketScene");
            }));
        }
        if(talkedAboutLions && !leftAfterLion) {
            leftAfterLion = true;
        }
    };

    scene.setLayers([planLayer, menuLayer, navigationLayer, dudeLayer, cadillacLayer, backgroundLayer]);
    return scene;
} 

function createHouseScene(planLayer, menuLayer, player) {

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
            backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_arrow_se.png", 1), {x: 537, y: 430}, {x:537, y:430}, function() {
                player.setLocation({x: 205, y: 330});
                Paca.changeScene("outsideScene");
            }));
        }
    }));
    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_globe.png", 6), {x: 160, y: 181}, {x:203, y:281}, function() {
        Paca.addText({name:'Scientist', text:'My plans to build a rocket...', color:'rgb(255,255,255)'}, true);
    }));
    var spaceLayer = Paca.createLayer();
    spaceLayer.addObject(Paca.createDrawable(Paca.createSprite("images/scene_space.png", 1), {x: 0, y: 0}));

    scene.setLayers([planLayer, menuLayer, navigationLayer, backgroundLayer, spaceLayer]);
    return scene;
} 


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

    var planLayer = Paca.createLayer();
    var menuLayer = createMenuLayer(planLayer);

    var gameScenes = new Object();
    gameScenes['startScene'] = createStartScene();
    gameScenes['houseScene'] = createHouseScene(planLayer, menuLayer, player);
    gameScenes['telescopeScene'] = createTelescopeScene(menuLayer);
    gameScenes['outsideScene'] = createOutsideScene(planLayer, menuLayer, player);
    gameScenes['townScene'] = createTownScene(planLayer, menuLayer, player);
    gameScenes['butcherScene'] = createButcherScene(planLayer, menuLayer, player);
    gameScenes['electronicsStoreScene'] = createElectronicsStoreScene(planLayer, menuLayer, player);
    gameScenes['mythbustersScene1'] = createMythbustersScene1(menuLayer, player);
    gameScenes['mythbustersScene2'] = createMythbustersScene2(menuLayer);
    gameScenes['mythbustersScene3'] = createMythbustersScene3(menuLayer);
    gameScenes['circusScene'] = createCircusScene(planLayer, menuLayer, player);
    gameScenes['rocketScene'] = createRocketScene(planLayer, menuLayer, player);

    //Override for debug:
    /*Paca.DEBUG = true;
    siloBlownUp = true;
    hasRocket = true;
    hasHat = true;
    hasFins = true;

    gameScenes['startScene'] = gameScenes['townScene'];*/

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
            "images/item_arrow_w.png",
            "images/item_arrow_s.png",
            "images/item_arrow_se.png",
            "images/item_arrow_ne.png",
            "images/item_globe.png",
            "images/item_townsign_west.png",
            "images/item_townsign_east.png",
            "images/scene_town.png",
            "images/scene_butcher.png",
            "images/item_door.png",
            "images/scene_electronics.png",
            "images/item_globe.png",
            "images/item_cadillac.png",
            "images/scene_television.png",
            "images/adam_jamie.png",
            "images/item_silo.png",
            "images/scene_circus.png",
            "images/wizard_standing.png",
            "images/item_lion_calm.png",
            "images/item_lion_roar.png",
            "images/item_roar.png",
            "images/item_circussign.png",
            "images/scene_rocket.png",
            "images/butcher.png",
            "images/item_blooddrip.png",
            "images/item_fly.png",
            "images/wizard_scared.png",
            "images/wizard_scared_hatless.png",
            "images/item_plan.png",
            "images/item_rocket_design.png",
            "images/item_rocket_design_silo.png",
            "images/item_rocket_design_salami.png",
            "images/item_rocket_design_fins.png",
            "images/item_rocket_design_hat.png",
            "images/cadillac_dude.png",
            "images/item_cadillac_finless.png",
        ],
        [
            "sounds/void",
            "sounds/typewriter",
            "sounds/explode",
            "sounds/roar",
            "sounds/itemfound",
            "music/song1",
            "music/song2",
            "music/song3",
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

