
//Puzzle state:
var siloBlownUp = false;
var hasRocket = false;
var askedForFuel = false;
var knowsSalami = false;
var hasBlood = false;
var lionRoared = false;
var hasHat = false;
var hasFins = false;
var hasSalami = false;
var talkedAboutLions = false;
var leftAfterLion = false;

var showingPlans = false;

function createEndingScene(player) {

    var mesh = Paca.createNavigationMesh()
                .addPolygon({
                    mesh:  [{x: 0, y: 480}, {x: 640, y: 480}, {x: 640, y: 0}, {x: 0, y: 0}],
                    links: []
                }).setNavLinks([]);

    var scene = Paca.createScene(mesh, player);

    var backgroundLayer = Paca.createLayer();
    var rocketLayer = Paca.createLayer();

    var rocketSprite = Paca.createSprite("images/rocket.png", 4);

    var rocket = Paca.createActor([
            rocketSprite, 
            rocketSprite, 
            rocketSprite, 
            rocketSprite, 
            rocketSprite
        ],
        {x: 62, y: 450}
    );
    rocketLayer.addObject(rocket);

    var planLayer1 = Paca.createLayer();
    planLayer1.addObject(Paca.createDrawable(Paca.createSprite("images/item_rocket_design.png",1), {x:0, y:0}));

    var planLayer2 = Paca.createLayer();
    planLayer2.addObject(Paca.createDrawable(Paca.createSprite("images/item_rocket_design_silo.png",1), {x:73, y:72}));
    planLayer2.addObject(Paca.createDrawable(Paca.createSprite("images/item_rocket_design_hat.png",1), {x:73, y:72}));
    planLayer2.addObject(Paca.createDrawable(Paca.createSprite("images/item_rocket_design_fins.png",1), {x:73, y:72}));
    planLayer2.addObject(Paca.createDrawable(Paca.createSprite("images/item_rocket_design_salami.png",1), {x:73, y:72}));

    backgroundLayer.addObject(Paca.createDrawable(Paca.createSprite("images/scene_ending.png", 1), {x: 0, y: 0}));

    scene.setLayers([planLayer2, planLayer1, rocketLayer, backgroundLayer]);

    scene.activate = function() {

        Paca.stopBackground();
        Paca.addText({name:"Scientist", text:"I've got everything I need!", color:"rgb(255,255,255)"}, true);

        Paca.addText({name:"Scientist", text:"5... 4... 3... 2... 1...", color:"rgb(255,255,255)", callback: function() {
            planLayer1.clear();
            planLayer2.clear();
            Paca.playSound("sounds/explode");
            rocket.walkTo({x:405, y:69}, function() {
                Paca.addText({name:"Scientist", text:"Oh crap... EPIC!", color:"rgb(255,255,255)", callback: function () {
                    rocketLayer.addObject(Paca.createDrawable(Paca.createSprite("images/theend.png", 1), {x:0, y:0}));
                    Paca.playBackground("music/song1");
                }});
                rocket.walkTo({x:708, y:-110});
            });
        }});
    };

    return scene;
}

function createStartScene() {
    /** Start screen **/
    var startScene = Paca.createScene();
    var welcomeLayer = Paca.createLayer();
    var splashScreen = Paca.createClickable(Paca.createSprite("images/splash_screen.png", 1), {x: 320, y: 240}, function() {
        //Should go on first click:
        goFull();
        Paca.changeScene("houseScene");
        Paca.playBackground("music/song1", 0.5);
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
    bustersLayer.addObject(Paca.createDrawable(Paca.createSprite("images/item_salami.png", 1), {x:270, y:190}));

    scene.activate = function() {
        Paca.playSound("sounds/explode");
        Paca.addText({name:"Mythbusters", text:"Next up, the SALAMI ROCKET myth...", color:"rgb(255,255,255)", callback: function() {
            Paca.changeScene("electronicsStoreScene");
            Paca.addText({name:"Scientist", text:"OF COURSE! Salami is the perfect rocket fuel!", color:"rgb(255,255,255)"});
            Paca.addText({name:"Scientist", text:"I must get salami!", color:"rgb(255,255,255)"});
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

    menuLayer.addObject(Paca.createClickable(Paca.createSprite("images/item_plan.png", 1), {x: 610, y: 380}, function() {
        showPlans(menuLayer, planLayer);
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

function showPlans(menuLayer, planLayer) {
        if(!showingPlans) {

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
                showingPlans = false;
            }));
            showingPlans = true;
        }   
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
            Paca.addText({name:"Scientist", text:"Please help me build a rocket...", color:"rgb(255,255,255)"});
            rocketIdea = true;
        }
    };

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_hearts.png", 3), {x: 480, y: 142}, {x:273, y:344}, function() {
        Paca.addText({name:"Scientist", text:"My love...", color:"rgb(255,255,255)"});
    }));

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_door.png", 1), {x: 300, y: 180}, {x:207, y:332}, function() {
        player.setLocation({x: 450, y: 390});
        Paca.changeScene("houseScene");
    }));
   
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
                showPlans(menuLayer, planLayer);
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
            Paca.addText({name:"Lion tamer", text:"Oh please be carefull!", color:"rgb(255,255,255)"}, true);
            Paca.addText({name:"Lion tamer", text:"This is a bloodthirsty lion\nIf he smells blood he goes crazy!", color:"rgb(255,255,255)"});
        } else if(!lionRoared) {
            Paca.currentScene.freeze();
            roarLayer.addObject(Paca.createDrawable(Paca.createSprite("images/item_lion_roar.png", 1), {x:380  ,y:190}));
            roarLayer.addObject(Paca.createDrawable(Paca.createSprite("images/item_roar.png", 2), {x:0,y:0}));
            Paca.playSound("sounds/roar");
            Paca.playSound("sounds/aahh");
            Paca.addText({name:"Wizard", text:"AAAAHHHHHH!!", color:"rgb(255,255,255)", callback: function() {
                Paca.currentScene.unfreeze();
                roarLayer.clear();
                wizardLayer.clear();
                wizardLayer.addObject(Paca.createCollectable(Paca.createSprite("images/wizard_scared.png", 1), {x: 545, y: 400}, {x:440, y:400}, function() {
                    Paca.currentScene.freeze();
                    Paca.addText({name:"Wizard", text:"I'm afraid!", color:"rgb(255,255,255)", callback:function() {
                        wizardLayer.clear();
                        wizardLayer.addObject(Paca.createDrawable(Paca.createSprite("images/wizard_scared_hatless.png", 1), {x: 465, y: 351}));
                        Paca.addText({name:"Scientist", text:"This hat makes a perfect nose cone!", color:"rgb(255,255,255)"});
                        hasHat = true;
                        Paca.playSound("sounds/itemfound");
                        Paca.currentScene.unfreeze();
                        showPlans(menuLayer, planLayer);
                    }}, true);
                }));
            }});
            lionRoared = true;
        } else {
            Paca.addText({name:"Lion tamer", text:"STAY AWAY!", color:"rgb(255,255,255)"}, true);
        }
    }));

    wizardLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_door.png", 1), {x: 127, y: 260}, {x:137, y:374}, function() {
        Paca.addText({name:"Scientist", text:"I don't want to go to the circus...", color:"rgb(255,255,255)"}, true);
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

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_static_tv.png", 3), {x: 387, y: 116}, {x:387, y:225}, function() {
        Paca.addText({name:"Scientist", text:"No signal on this TV", color:"rgb(255,255,255)"}, true);
    }));

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_neonbooksign.png", 8), {x: 578, y: 130}, {x:399, y:252}, function() {
        Paca.addText({name:"Scientist", text:"A broken neon book sign", color:"rgb(255,255,255)"}, true);
    }));

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_door.png", 1), {x: 453, y: 260}, {x:399, y:309}, function() {
        Paca.addText({name:"Scientist", text:"Nobody is here...", color:"rgb(255,255,255)"}, true);
    }));

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_door.png", 1), {x: 50, y: 209}, {x:133, y:343}, function() {
        Paca.addText({name:"Scientist", text:"50% off? Great deal!", color:"rgb(255,255,255)"}, true);
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

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_door.png", 1), {x:50, y:180}, {x:164, y:255}, function() {
            Paca.addText({name:"Butcher", text:"That fly is driving me crazy...", color:"rgb(255,255,255)"}, true);
    }));

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_fly.png", 14), {x:113, y:400}, {x:227, y:333}, function() {
            Paca.addText({name:"Scientist", text:"A fly... this place is disgusting", color:"rgb(255,255,255)"}, true);
    }));

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_blooddrip.png", 5), {x:173, y:150}, {x:200, y:200}, function() {
        if(!hasBlood) {
            hasBlood = true;
            Paca.addText({name:"Scientist", text:"GROSS! Blood has dripped on my shoes", color:"rgb(255,255,255)"}, true);
        } else {
            Paca.addText({name:"Scientist", text:"Gross, I'm not coming near that thing", color:"rgb(255,255,255)"}, true);
        }
    }));

    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/butcher.png", 1), {x:430, y:120}, {x:430, y:230}, function() {
        if(!knowsSalami) {
            Paca.addText({name:"Butcher", text:"Nice to meat you! Do you want meat?", color:"rgb(255,255,255)"}, true);
            Paca.addText({name:"Scientist", text:"No sorry, I'm building a rocket", color:"rgb(255,255,255)"});
        } else {
            Paca.addText({name:"Butcher", text:"What do you meat?", color:"rgb(255,255,255)"}, true);
            Paca.addText({name:"Scientist", text:"I'd like some salami please!", color:"rgb(255,255,255)", callback: function() {
                Paca.playSound("sounds/itemfound");
                hasSalami = true;
                Paca.changeScene("endingScene");
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
                    showPlans(menuLayer, planLayer);
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

    var hintLayer = Paca.createLayer();

    var backgroundLayer = Paca.createLayer();
    backgroundLayer.addObject(Paca.createDrawable(Paca.createSprite("images/scene_house.png", 1), {x: 0, y: 0}));
    backgroundLayer.addObject(Paca.createCollectable(Paca.createSprite("images/item_telescope.png", 5), {x: 300, y: 215}, {x:313, y:250}, function() {
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
        if(hasRocket) {
            if(!hasHat) {
                if(hasBlood) {
                    Paca.addText({name:'Scientist', text:'Maybe the lion knows what to do?', color:'rgb(255,255,255)'}, true);
                } else {
                    Paca.addText({name:'Scientist', text:'The butcher might have a clue?', color:'rgb(255,255,255)'}, true);
                }
            } else if(!hasFins) {
                if(!talkedAboutLions) {
                    Paca.addText({name:'Scientist', text:'The rocket needs fins, where are those?', color:'rgb(255,255,255)'}, true);
                } else {
                    Paca.addText({name:'Scientist', text:'I should lie to the cadillac driver', color:'rgb(255,255,255)'}, true);
                }
            } else if(!askedForFuel) {
                Paca.addText({name:'Scientist', text:'The mythbusters always know what to do...', color:'rgb(255,255,255)'}, true);
            }

        } else {
            if(canGoOutside) {
                Paca.addText({name:'Scientist', text:'The Mythbusters would know how to make a rocket...', color:'rgb(255,255,255)'}, true);
            } else {
                Paca.addText({name:'Scientist', text:'This is my plan to build a rocket...', color:'rgb(255,255,255)'}, true);
                showPlans(menuLayer, planLayer);
            }

        }
    }));
    var spaceLayer = Paca.createLayer();
    spaceLayer.addObject(Paca.createDrawable(Paca.createSprite("images/scene_space.png", 1), {x: 0, y: 0}));

    scene.setLayers([planLayer, menuLayer, hintLayer, navigationLayer, backgroundLayer, spaceLayer]);

    var firstTime = true;
    scene.activate = function() {
        if(firstTime) {
            firstTime = false;
            hintLayer.addObject(Paca.createClickable(Paca.createSprite("images/getting_started.png", 1), {x: 440, y: 380}, function() {
                Paca.addText({name:'Scientist', text:'If you get stuck, look at my desk', color:'rgb(255,255,255)'}, true);
                hintLayer.clear();
            }));
        }
    }
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
    gameScenes['endingScene'] = createEndingScene(player);

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
            "images/item_salami.png",
            "images/scene_ending.png",
            "images/rocket.png",
            "images/theend.png",
            "images/getting_started.png",
            "images/item_neonbooksign.png",
            "images/item_static_tv.png",
            "images/item_hearts.png",
        ],
        [
            "sounds/aahh",
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

