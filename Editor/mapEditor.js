//////////////////////////  SCROLLING EDITOR IMAGES \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

BALL.Oldeditor = {
    editMode: false,
    game: null,
    gObjs: [],    //objTypes - types of objects that can be created
    curObj: null, 
    objI: -1,
    sprites: null,  //BALL.gameState.sprites - use sprite group in gameState universally
    
    camScale: 1,  //CamController - create class to control cam. Editor takes input and tells camController what to do to the camera
    camSpeed: 10,
    spriteSpeed: 10,
    
    scaleFactor: 25,
    
    selected: null,  //selected will stay the same. pathSprites will have isPathSprite = true
    pathSpriteSelected: false,  //use selected.isPathSprite
    
    hovering: false,  //keep same dragging functionality, just clean it up a bit
    dragging: false,
    lastPX: 0,
    lastPY: 0,
    isDown: false,
    downX: 0,
    downY: 0,
    dragging: false,
    movingObj: false,
    
    curEditor: null,  //cur editor/targetSelect will be replaced by callback functions + selMode. e.g if selMode == 1 targetCallback(sprite).
    targetSelect: null,
    
    setEditor: function(editor) { //no need for set Editor. setTargetSel(callback), setWLoc(callback), setSLoc(callback), setNormalSel()
        this.curEditor = editor;
    },
    
    select: function(sprite) {  //clickObj checks for selMode, this is only called for normal selections(selMode = 0). clean up accordingly
        if (this.targetSelect == null) {
            BALL.editorUI.select(sprite);
            if (this.curEditor != null) {
                this.curEditor.select(sprite);
            }
            this.selected = sprite;
            console.log(sprite);
            console.log(game.input);
            console.log("sprite - " + sprite.x + ", " + sprite.y);
            console.log("input - " + (game.input.worldX / game.camera.scale.x) + ", " + (game.input.worldY / game.camera.scale.y));
            console.log(game.camera);
        } else {
            console.log(game.input.activePointer);
            var sel = this.targetSelect;
            //this.targetSelect = null;
            sel.selectTarget(sprite, game.input.activePointer.worldX, game.input.activePointer.worldY);
        }
    },
    
    
    setTargetSelect: function(tEditor) {  //this and endTargetSelect will be deleted, replaced by editMode and select callbacks
        this.targetSelect = tEditor;
    },
    endTargetSelect: function(tEditor) {
        if (tEditor != this.targetSelect) {
            console.warn("end tar select, tEditors not equal", tEditor, this.targetSelect);
        }
        this.targetSelect = null;
    },
    
    
    getSelectedObj: function() { //returns the main selected object. returns parent of selected if selected is a path sprite or something.
        if (this.pathSpriteSelected) {
            return this.selected.parentObj;
        } else {
            return this.selected;
        }
    },
    
    //::::::::::::::::::::::::::::::'''''''''''''::::::::::::::::::::::::::::\\
    //:::::::::::::::::::::::::... INPUT CALLBACKS ...:::::::::::::::::::::::\\
    //::::::::::::::::::::::::::::::.............::::::::::::::::::::::::::::\\
    inputDown: function(pointer) {  //this looks good. maybe cleanup a little though
        if (BALL.editor.editMode) {
            console.log("editor inputdown");
            BALL.editor.downX = game.input.worldX;
            BALL.editor.downY = game.input.worldY;
            BALL.editor.isDown = true;


            BALL.editor.dragging = false;
            if (BALL.editor.hovering) { //hovering
                console.log("editor hovering");
                
            } else {                    //not hovering
                if (BALL.input.tab.isDown) {
                    BALL.editor.dragging = true;
                    BALL.editor.lastPX = game.input.activePointer.x;
                    BALL.editor.lastPY = game.input.activePointer.y;
                } else if (BALL.editor.curObj != null) {
                    BALL.gameState.createObj(Math.round(game.input.worldX * (1 / game.camera.scale.x)), Math.round(game.input.worldY * (1 / game.camera.scale.y)), BALL.editor.curObj);
                } else {
                    console.log("EDITOR - NO OBJECT SELECTED");
                }
            } //end if hovering
            
        }//end if editMode 
    },
    
    inputUp: function(pointer) { // also a keeper. just cleanup and maybe a few changes
        BALL.editor.isDown = false;
        BALL.editor.dragging = false;
        BALL.editor.dragObj = false;
        this.lastPX = 0;
        this.lastPY = 0;
        if (BALL.editor.selected != null) {
            if (BALL.editor.selected.getBounds().contains(new Phaser.Point(pointer.x, pointer.y))) {
                
            } else {
                //BALL.editor.selected = null;
            }
        }
    },
    
    clickObj: function(s) { //called when a sprite is clicked. probably check selMode here and pass sprite to appropriate callback. editor.select can just handle normal selections(selMode = 0)
        console.log("clicked this obj:");
        console.log(s);
        BALL.editor.select(s);
        BALL.editor.pathSpriteSelected = false;
        BALL.editor.dragObj = true;
        this.lastPX = Math.round(game.input.worldX);
        this.lastPY = Math.round(game.input.worldY);
    },
    

    
    //::::::::::::::::::::::::::::::::... UPDATE ...:::::::::::::::::::::::::\\
    
    update: function() { //most of the functions called here need to be changed/deleted.
        //EDITOR VARS
        
        this.setMovespeeds(); //replace: if (shift) CamController.speed = 100, this.sprSpeed = 100, else Cam = 10 and spr = 10
        
        //OBJECT
        this.dragObject(); //remove this call. add input onHold callback. In there check if dragging and if so dragObject.
        this.flipObject(); //remove this for now, physics broke it and will need to be reimplemented later anyway
        
        //CAMERA
        this.dragCamera(); //if w CamController.moveUp, if a CamController.moveLeft, etc
        this.scrollCamera(); //same as above
        BALL.camController.scaleCamera();
        
        //OBJECT PROPERTIES
        this.updateRotation(); //this should be called when rotSpeed changes, not on every update
        
        
        //UPDATE UI
        BALL.editorUI.update();
        
    },
    
    
    
    
    //::::::::::::::::::::::::::::::'''''''''''''::::::::::::::::::::::::::::\\
    //::::::::::::::::::::::::::... UPDATE FUNCS ...:::::::::::::::::::::::::\\
    //::::::::::::::::::::::::::::::.............::::::::::::::::::::::::::::\\
    dragObject: function(){
        if (this.dragObj) {
            if (!this.pathSpriteSelected) {//NOT PATH SPRITE
                
                //IF MOVED MORE THAN 5PX(so that i don't accidently drag sprites when trying to select them by clicking)
                if (Math.abs(game.input.activePointer.positionDown.x - game.input.activePointer.position.x) > 5 || Math.abs(game.input.activePointer.positionDown.y - game.input.activePointer.position.y) > 5 || this.movingObj) {
                    this.movingObj = true; 

                    BALL.gameState.moveObject(this.selected, Math.round(game.input.worldX * (1 / game.camera.scale.x)), Math.round(game.input.worldY * (1 / game.camera.scale.y)));

                    this.lastPX = Math.round(game.input.worldX);
                    this.lastPY = Math.round(game.input.worldY);
                } else {
                    this.lastPX = Math.round(game.input.worldX);
                    this.lastPY = Math.round(game.input.worldY);
                }
                
            } else { //PATHSPRITE
                
                //IF MOVED MORE THAN 5PX(so that i don't accidently drag sprites when trying to select them by clicking)
                if (Math.abs(game.input.activePointer.positionDown.x - game.input.activePointer.position.x) > 5 || Math.abs(game.input.activePointer.positionDown.y - game.input.activePointer.position.y) > 5 || this.movingObj) {
                    BALL.gameState.moveObject(this.selected, Math.round(game.input.worldX * (1 / game.camera.scale.x)), Math.round(game.input.worldY * (1 / game.camera.scale.y)));

                    this.lastPX = Math.round(game.input.worldX);
                    this.lastPY = Math.round(game.input.worldY);
                } else {
                    this.lastPX = Math.round(game.input.worldX);
                    this.lastPY = Math.round(game.input.worldY);
                }
                
            }
        } else {
            this.movingObj = false;
        }
    },
    
    dragCamera: function() { //move to camcontroller
        if (this.dragging) {
            BALL.camController.moveCamera(this.lastPX - game.input.activePointer.x, this.lastPY - game.input.activePointer.y);
            this.lastPX = game.input.activePointer.x;
            this.lastPY = game.input.activePointer.y;
        }
    },
    
    scrollCamera: function() {//move to camcontroller
        //CAMERA MOVEMENT
        if (BALL.input.W.isDown) {
            game.camera.y-= 5;
        }
        if (BALL.input.A.isDown) {
            game.camera.x-= 5;
        }
        if (BALL.input.S.isDown) {
            game.camera.y+= 5;
        }
        if (BALL.input.D.isDown) {
            game.camera.x+= 5;
        }
    },
    
    scaleCamera: function() { //move to camcontroller
        //CAMERA SCALING
        BALL.camController.scaleCamera();
        /**
        var lastX = game.camera.x;
        var lastY = game.camera.y;
        if (BALL.input.t.isDown) {
            this.camScale += 0.01;
            console.log(game.camera.scale.x);
        }
        if (BALL.input.g.isDown && this.camScale > 0.25) {
            this.camScale -= 0.01;
            console.log(game.camera.scale.x);
        }
        if (this.camScale < 0.25)
            this.camScale = 0.25;
        
        game.camera.scale.setTo(this.camScale);
        
        this.scaleFactor = this.camScale * 100;
        
        if (BALL.input.t.isDown) {
            game.camera.x = lastX + ((1 / this.scaleFactor) * game.camera.x + game.camera.view.width / 100);
            game.camera.y = lastY + ((1 / this.scaleFactor) * game.camera.y + game.camera.view.height / 100);
        }
        if (BALL.input.g.isDown && this.camScale > 0.25) {
            game.camera.x = lastX - ((1 / (this.scaleFactor)) * game.camera.x + game.camera.view.width / 100);
            game.camera.y = lastY - ((1 / this.scaleFactor) * game.camera.y + game.camera.view.height / 100);
        }
        **/
    },
    
    //_________________________________________________________________________\\
    //____________________________MODIFY OBJECTS_______________________________\\

    
    flipObject: function() { //get rid of for now, needs to be reimplemented later anyway
        if (BALL.input.f.isDown) {
            if (!BALL.input.f_down) {
                BALL.input.f_down = true;
                if (this.selected != null && !this.pathSpriteSelected) {
                    this.selected.scale.x*= -1;
                } else {
                    console.log("null: no object is selected to flip");
                }
            }
        } else {
            if (BALL.input.f_down) {
                BALL.input.f_down = false;
            }
        }
    },
    
    setMovespeeds: function() { //put this functionality in update. camSpeed var will be in camController
        //MOVESPEED VARS
        if (BALL.input.shift.isDown) {
            this.camSpeed = 100;
            this.spriteSpeed = 1;
        } else {
            this.camSpeed = 10;
            this.spriteSpeed = 10;
        }
    },
    

    
    updateRotation: function() {
        if (this.selected != null && !this.pathSpriteSelected) {
            
            if (BALL.editor.selected.rotSpeed != null && BALL.editor.selected.rotSpeed != 0) {
                
                
                if (this.selected.rotateUpdate == null) {
                    console.log("adding rotateUpdate function");
                    console.log(this.selected);
                    this.selected.rotateUpdate = BALL.gObject.rotateUpdate(BALL.editorUI.rotValue, this.selected);
                    this.selected.updateFuncs.push(this.selected.rotateUpdate);
                }
            } else {
                console.log("NULL ROTVAL:", this.selected.key);
            }
            
        }
    },
    
    
    
    
    //______________________________________________SELECTION MOVEMENT__________________________________________\\

    //all movement funcs, get rid of gameplay functionality, put in gameController object.
    selectedUp: function() {
        if (BALL.editor.editMode) {
            if (BALL.editor.pathSpriteSelected == false && BALL.editor.selected != null) {
                if (BALL.editor.selected != null && BALL.editor.selected.body != null) {
                    BALL.editor.selected.body.y -= BALL.editor.spriteSpeed;
                    BALL.editor.selected.startY = BALL.editor.selected.body.y;
                } else {
                    BALL.editor.selected.y -= BALL.editor.spriteSpeed;
                }
            } else {
            
            }
        } else {
            if (BALL.gameState.jumpTime < game.time.now - 1000) {
                //jump
                //NOTE / TODO: just make a jump function already. also spinLeft/spinRight functions. In fact just make a characterController type object.
                BALL.play.ball.body.velocity.y-= 850;
                BALL.gameState.jumpTime = game.time.now;
            }
        }
    },
    selectedLeft: function() {
        if (BALL.editor.editMode) {
            if (BALL.editor.pathSpriteSelected == false) {
                if (BALL.editor.selected != null && BALL.editor.selected.body != null) {
                    BALL.editor.selected.body.x -= BALL.editor.spriteSpeed;
                    BALL.editor.selected.startX = BALL.editor.selected.body.x;
                } else {
                    BALL.editor.selected.x -= BALL.editor.spriteSpeed;
                }
            } else {
            
            }
        } else {
            BALL.play.ball.body.angularVelocity-= 12;
        }
    },
    selectedDown: function() {
        if (BALL.editor.editMode) {
            if (BALL.editor.pathSpriteSelected == false) {
                if (BALL.editor.selected != null && BALL.editor.selected.body != null) {
                    BALL.editor.selected.body.y += BALL.editor.spriteSpeed;
                    BALL.editor.selected.startY = BALL.editor.selected.body.y;
                } else {
                    BALL.editor.selected.y += BALL.editor.spriteSpeed;
                }
            } else {
            
            }
        } else {
            
        }
    },
    selectedRight: function() {
        if (BALL.editor.editMode) {
            if (BALL.editor.pathSpriteSelected == false) {
                if (BALL.editor.selected != null && BALL.editor.selected.body != null) {
                    BALL.editor.selected.body.x += BALL.editor.spriteSpeed;
                    BALL.editor.selected.startX = BALL.editor.selected.body.x;
                } else {
                    BALL.editor.selected.x += BALL.editor.spriteSpeed;
                }
            } else {
                
            }
        } else {
            BALL.play.ball.body.angularVelocity+= 12;
        }
    },

    
    spriteHover: function() {
        BALL.editor.hovering = true;
    },
    spriteUnhover: function() {
        BALL.editor.hovering = false;
    },

    
    
    
    //::::::::::::::::::::::::::::::'''''''''''''::::::::::::::::::::::::::::\\
    //::::::::::::::::::::::::::... EDITOR SETUP ...:::::::::::::::::::::::::\\
    //::::::::::::::::::::::::::::::.............::::::::::::::::::::::::::::\\

    
    populategObjs: function() { //replace gObjs with objTypes. 
        
        this.gObjs.push("g1-island-plat");
        this.gObjs.push("g1-long-plat");
        this.gObjs.push("g1-breakplat");
        this.gObjs.push("g1-brickwall");
        this.gObjs.push("g1-fan");
        this.gObjs.push("g1-short-breakplat");
        this.gObjs.push("g1-short-plat");
        this.gObjs.push("g1-windmill");
        /**
        this.gObjs.push("bigplat");
        //this.gObjs.push("w1-tree-plat")
        this.gObjs.push("chalkbig");
        this.gObjs.push("woodbig");
        this.gObjs.push("chalksmall");
        this.gObjs.push("staticball");
        this.gObjs.push("chalkbreak");
        **/
        //special
        this.gObjs.push("launcher-stop");
        this.gObjs.push("d01-boulder");
        this.gObjs.push("d01-killboulder");
        this.gObjs.push("hanging-plank");
        this.gObjs.push("rope");
        
        this.gObjs.push("k01-redline");
        this.gObjs.push("k01-electricity");
        this.gObjs.push("k02-button");
        this.gObjs.push("k03-trampoline");
        
        this.gObjs.push("s01-launcher");
        
    },
    
    createEditor: function(g) { //don't create this.sprites, use BALL.gameState.sprites.
        this.game = g;
        BALL.editorUI.editor = this;
        this.sprites = game.add.group();
        this.sprites.inputEnableChildren = true;//
        this.populategObjs();
        console.log("\n\n\n\n\nimages:");
        for (var i in this.gObjs) {
            console.log(this.gObjs[i]);
            
            $("#imgsDiv1").append("<div id='imgDiv-" + i + "' class='editorImg'><img src='assets/graphics/world2/" + this.gObjs[i] + ".png' id='edImg-" + i + "'></div>");
            $("#imgDiv-" + i).click({index: Number(i)}, function(event) {
                BALL.editorUI.clickObject(event.data.index);
            });
            
            /**  OLD CODE, REMOVE IF THINGS AREN'T BROKEN
            if (this.gObjs[i].substr(0, 2) == "w1" || true) {
                console.log("w1");
                $("#imgsDiv1").append("<div id='imgDiv-" + i + "' class='editorImg'><img src='assets/graphics/world1/" + this.gObjs[i] + ".png' id='edImg-" + i + "'></div>");
                $("#imgDiv-" + i).click({index: Number(i)}, function(event) {
                    BALL.editorUI.clickObject(event.data.index);
                });
            } else {
                $("#imgsDiv1").append("<div id='imgDiv-" + i + "' class='editorImg'><img src='assets/plats/" + this.gObjs[i] + ".png' id='edImg-" + i + "'></div>");
                $("#imgDiv-" + i).click({index: Number(i)}, function(event) {
                    BALL.editorUI.clickObject(event.data.index);
                });
            }
            **/
        }
        BALL.editorUI.setupUI();
    },
    
    saveLevel: function() {
        var level = {};
        level.objs = [];
        console.log(level);
        for (var i in BALL.gameState.objects) {
            var o = {};
            o.key = BALL.gameState.objects[i].key;
            o.x = BALL.gameState.objects[i].x;
            o.y = BALL.gameState.objects[i].y;
            o.rotSpeed = BALL.gameState.objects[i].rotSpeed;
            o.angle = BALL.gameState.objects[i].angle;
            o.ID = BALL.gameState.objects[i].ID;
            
            if (BALL.gameState.objects[i].movePaths != null) {
                o.movePaths = [];
                
                for (var p in BALL.gameState.objects[i].movePaths) {
                    var path = {};
                    path.startX = BALL.gameState.objects[i].movePaths[p].startX;
                    path.startY = BALL.gameState.objects[i].movePaths[p].startY;
                    
                    path.points = [];
                    for (var pt in BALL.gameState.objects[i].movePaths[p].points) {
                        var point = {};
                        point.x = BALL.gameState.objects[i].movePaths[p].points[pt].pSprite.x;
                        point.y = BALL.gameState.objects[i].movePaths[p].points[pt].pSprite.y;
                        point.speed = BALL.gameState.objects[i].movePaths[p].points[pt].speed;
                        path.points.push(point);
                    }//point loop
                    
                    o.movePaths.push(path);
                }//path loop
                
            }//path IF
            
            if (BALL.gameState.objects[i].triggers != null && BALL.gameState.objects[i].triggers.length > 0) {
                o.triggers = [];
                for (var j in BALL.gameState.objects[i].triggers) {
                    var trig = {};
                    trig.type = BALL.gameState.objects[i].triggers[j].type;
                    trig.name = BALL.gameState.objects[i].triggers[j].name;
                    trig.params = BALL.gameState.objects[i].triggers[j].params;
                    trig.parentID = BALL.gameState.objects[i].triggers[j].parent.ID;
                    trig.events = [];
                    if (BALL.gameState.objects[i].triggers[j].events != null && BALL.gameState.objects[i].triggers[j].events.length > 0) {
                        for (var k in BALL.gameState.objects[i].triggers[j].events) {
                            var event = {};
                            event.delay = BALL.gameState.objects[i].triggers[j].events[k].delay;
                            event.id = BALL.gameState.objects[i].triggers[j].events[k].id;
                            event.name = BALL.gameState.objects[i].triggers[j].events[k].name;
                            event.type = BALL.gameState.objects[i].triggers[j].events[k].type;
                            event.targetID = BALL.gameState.objects[i].triggers[j].events[k].targetID;
                            event.args = BALL.gameState.objects[i].triggers[j].events[k].args;
                            if (event.targetID == 0 || event.targetID == null) {
                                console.warn("TARGET IS NULL OR 0", event, "id = ", event.targetID);
                            }
                            trig.events.push(event);
                        }
                    }
                    o.triggers.push(trig);
                }
            }
            
            level.objs.push(o);
        }//object loop
        
        return level;
    },
    
    loadLevel: function(level) {
        console.log(level);
        console.log("\n\n\n\n\n\n\n\n------\n" + level.objs.length + "\n----------\n\n\n");
        for (var i in level.objs) {
            if (level.objs[i].key == "w1-iceplat") {
                level.objs[i].key = "chalkplat";
                console.log("ICEPLAT\nICEPLAT\nICEPLAT!");
            } else if (level.objs[i].key == "w1-platbreak") {
                level.objs[i].key = "chalkbreak";
            }
            console.log(level.objs[i].key);
            var j = BALL.gameState.createObj(level.objs[i].x, level.objs[i].y, level.objs[i].key, level.objs[i].ID);
            j.rotSpeed = level.objs[i].rotSpeed;
            if (j.rotSpeed != 0) {
                j.rotateUpdate = BALL.gObject.rotateUpdate(j.rotSpeed, j);
                j.updateFuncs.push(j.rotateUpdate);
                level.objs[i].angle = 0;
            }
            
            
            //MOVEPATHS
            if (level.objs[i].movePaths != null) {
                j.movePaths = [];
                
                for (var p in level.objs[i].movePaths) {
                    j.movePaths[p] = new BALL.MovePath(j, p);
                    j.movePaths[p].startX = level.objs[i].movePaths[p].startX;
                    j.movePaths[p].startY = level.objs[i].movePaths[p].startY;
                    
                    j.movePaths[p].points = [];
                    for (var pt in level.objs[i].movePaths[p].points) {
                        j.movePaths[p].addPoint(new BALL.PathPoint(level.objs[i].movePaths[p].points[pt].x, level.objs[i].movePaths[p].points[pt].y, level.objs[i].movePaths[p].points[pt].speed, 0, j.movePaths[p]));
                    }
                }
            } //movePath?
            
            
            
            
            //TRIGGERS/EVENTS
            if (level.objs[i].triggers != null) {
                j.triggers = [];
                for (var a in level.objs[i].triggers) {
                    j.triggers[a] = new BALL.Trigger(BALL.gameState.getSpriteById(level.objs[i].triggers[a].parentID), level.objs[i].triggers[a].name);
                    j.triggers[a].setType(level.objs[i].triggers[a].type);
                    j.triggers[a].params = level.objs[i].triggers[a].params;
                    j.triggers[a].events = [];
                    for (var b in level.objs[i].triggers[a].events) {
                        j.triggers[a].events[b] = new BALL.Event(null, level.objs[i].triggers[a].events[b].name, null, 0);
                        j.triggers[a].events[b].setTarget(BALL.gameState.getSpriteById(level.objs[i].triggers[a].events[b].targetID));
                        j.triggers[a].events[b].setDelay(level.objs[i].triggers[a].events[b].delay);
                        if (level.objs[i].triggers[a].events[b].args != null && level.objs[i].triggers[a].events[b].args[0] != null) {
                            j.triggers[a].events[b].setParam1(level.objs[i].triggers[a].events[b].args[0]);
                        }
                        //SET TYPE LAST, SET TYPE CREATES/UPDATES EVENT FUNC
                        j.triggers[a].events[b].setType(level.objs[i].triggers[a].events[b].type);
                        
                    }//events
                }//triggers
            }//trigger?
            
            j.angle = level.objs[i].angle;
            j.rotation = level.objs[i].angle * (Math.PI / 180);
            
            if (j.body != null) {
                j.body.angle = level.objs[i].angle;
            }

            
            BALL.gameState.initObject(j);
        }
        BALL.timer.init();
    }
    

}

BALL.editor = {
    editing: false,
    gObjs: [],
    curObj: null,
    moveSpeed: 10,
    selected: null,
    
    hovering: false,
    dragging: false,
    panning: false,
    
    lastPX: 0,
    lastPY: 0,
    
    isDown: false,
    downX: 0,
    downY: 0,
    movingObj: false,
    spriteGrabbed: false,
    
    selMode: 0, //0=normal, 1=target, 2=wLoc, 3=sLoc
    SEL_NORMAL: 0, SEL_TARGET: 1, SEL_WLOC: 2, SEL_SLOC: 3,
    targetCB: null,
    wLocCB: null,
    sLocCB: null,
    
    
    //__________Selection Methods___________\\
    select: function(sprite) { //select a new sprite. assumes selMode = 0
        BALL.editorUI.updateSelected(sprite);
        this.selected = sprite;
    }, //TODO: setup updateSelected in editorUI(and eventually design some kind of state machine to handle UI state in editorUI)
    
    getSelectedObj: function() { //return current object. if a pathsprite is selected, return the parent. if null, log a warning
        if (this.selected != null) {
            if (this.selected.isPathSprite) {
                return this.selected.parent;
            } else {
                return this.selected;
            }
        } else {
            console.warn("getSelectedObj() - no object, editor.selected is null");
            return null;
        }
    },
    
    
    //set select mode and callback for that mode. when sprite is selected, it will be passed to the callback to handle it.
    setTargetSel: function(cb) {
        this.selMode = this.SEL_TARGET;
        this.targetCB = cb;
    },
    setWLocSel: function(cb) {
        this.selMode = this.SEL_WLOC;
        this.wLocCB = cb;
    },
    setSLocSel: function(cb) {
        this.selMode = this.SEL_SLOC;
        this.sLocCB = cb;
    },
    setNormalSel: function(cb) {
        this.selMODE = this.SEL_NORMAL;
        this.sLocCB = null;
        this.wLocCB = null;
        this.targetCB = null;
    }, //TODO: setup other editors to use these callbacks, specifically target. joint will eventually use SLoc/WLoc as well.
    //------end selection methods-------\\
    
    
    
    //__________________Input Callbacks___________________\\
    inputDown: function(pointer) {  //editor inputDown method. should only be called when in editMode(TODO: setup input callback switching for editmode/playmode in manager)
        BALL.editor.downX = game.input.worldX;
        BALL.editor.downY = game.input.worldY;
        BALL.editor.isDown = true;
        BALL.editor.panning = false; //if input was just clicked, then use can't be panning camera.
        
        if (!BALL.editor.hovering) { //not hovering, therefore didn't click on a sprite/object
            if (BALL.input.tab.isDown) { //TODO: may get rid of all of this, and on inputHold function, do if(tab) cameraController.pan(curPos - lastPos)
                BALL.editor.panning = true;
                BALL.editor.lastPX = game.input.activePointer.x;
                BALL.editor.lastPY = game.input.activePointer.y;
            } else if (BALL.editor.curObj != null) {//no tab, curObj isn't null. create new object of curObj
                BALL.gameState.createObj(Math.round(game.input.worldX * (1 / game.camera.scale.x)), Math.round(game.input.worldY * (1 / game.camera.scale.y)), BALL.editor.curObj);
            } else { //no tab. curObj is null. log that user is trying to create an object but hasn't selected a type
                console.log("EDITOR - NO OBJECT SELECTED (inputDown - tried to create new object, but no objType was selected in UI)");
            }
        }//end if hovering
            
    },
    
    inputUp: function(pointer) {
        BALL.editor.isDown = false;
        BALL.editor.panning = false; //NOTE: might need to get rid of this after I implement inputHold and handle panning in there. same with this line in inputDown()
        BALL.editor.spriteGrabbed = false;
        this.lastPX = 0; //NOTE: try removing these, I don't think they do anything
        this.lastPY = 0;
    },
    
    clickObj: function(s) { //called when a sprite is clicked. probably check selMode here and pass sprite to appropriate callback. editor.select can just handle normal selections(selMode = 0)
        if (this.selMode == this.SEL_NORMAL) {
            BALL.editor.select(s);
            BALL.editor.pathSpriteSelected = false;
            BALL.editor.spriteGrabbed = true;
            BALL.editor.movingObj = false;
        } else if (this.selMode == this.SEL_TARGET) {
            this.targetCB(s);
        } else if (this.selMode == this.SEL_WLOC) {
            this.wLocCB(s);
        } else if (this.selMode == this.SEL_SLOC) {
            this.sLocCB(s);
        } else {
            console.warn("clickObj() - somehow selMode isn't valid. selmode=" + this.selMode);
        }
        this.lastPX = Math.round(game.input.worldX); //NOTE: try removing these, I don't think they do anything
        this.lastPY = Math.round(game.input.worldY);
    },
    
    spriteHover: function() {
        BALL.editor.hovering = true;
    },
    spriteUnhover: function() {
        BALL.editor.hovering = false;
    },
    //--------end input callbacks---------\\
    
    
    
    //________________UPDATE_______________\\
    update: function() { 
        if (BALL.input.shift.isDown) {
            this.moveSpeed = 10;
        } else {
            this.moveSpeed = 1;
        }
        
        //OBJECT
        if (game.input.activePointer.isDown) {
            if (this.spriteGrabbed) {
                this.dragObject();
            }
        }
        
        BALL.camController.scaleCamera();
        
        //CAMERA
        this.dragCamera(); 
        this.scrollCamera(); 
        BALL.camController.scaleCamera();
        
        //OBJECT PROPERTIES
        
        
        
        //UPDATE UI
        BALL.editorUI.update();
        
    },
    
    
    
    //_____________CAMERA FUNCTIONS____________\\
    dragCamera: function() { //move to camcontroller
        if (this.panning) {
            BALL.camController.moveCamera(this.lastPX - game.input.activePointer.x, this.lastPY - game.input.activePointer.y);
            this.lastPX = game.input.activePointer.x;
            this.lastPY = game.input.activePointer.y;
        }
    },
    
    scrollCamera: function() {//move to camcontroller
        //CAMERA MOVEMENT
        if (BALL.input.W.isDown) {
            BALL.camController.moveCamera(0, -this.moveSpeed * 5);
        }
        if (BALL.input.A.isDown) {
            BALL.camController.moveCamera(-this.moveSpeed * 5, 0);
        }
        if (BALL.input.S.isDown) {
            BALL.camController.moveCamera(0, this.moveSpeed * 5);
        }
        if (BALL.input.D.isDown) {
            BALL.camController.moveCamera(this.moveSpeed * 5, 0);
        }
    },
    
    
    
    //______________Object Movement________________\\    
    dragObject: function(){
        //NOTE: may have issues with pathSprites, lookout for that.
        
        //IF MOVED MORE THAN 5PX(so that i don't accidently drag sprites when trying to select them by clicking)
        if (Math.abs(game.input.activePointer.positionDown.x - game.input.activePointer.position.x) > 5 
        || Math.abs(game.input.activePointer.positionDown.y - game.input.activePointer.position.y) > 5 
        || this.movingObj) {
            
            this.movingObj = true; 
            BALL.gameState.moveObject(this.selected, Math.round(game.input.worldX * (1 / game.camera.scale.x)), Math.round(game.input.worldY * (1 / game.camera.scale.y)));
            
        }
        
        this.lastPX = Math.round(game.input.worldX);
        this.lastPY = Math.round(game.input.worldY);
    },
    
    selectedUp: function() {
        if (BALL.editor.selected != null) { //NOTE: watch out for pathsprites here too
            if (BALL.editor.selected != null && BALL.editor.selected.body != null) {
                BALL.editor.selected.body.y -= BALL.editor.moveSpeed;
                BALL.editor.selected.startY = BALL.editor.selected.body.y;
            } else {
                BALL.editor.selected.y -= BALL.editor.moveSpeed;
            }
        }
    },
    selectedLeft: function() {
        if (BALL.editor.selected != null) {
            if (BALL.editor.selected != null && BALL.editor.selected.body != null) {
                BALL.editor.selected.body.x -= BALL.editor.moveSpeed;
                BALL.editor.selected.startX = BALL.editor.selected.body.x;
                console.log("moved left");
            } else {
                BALL.editor.selected.x -= BALL.editor.moveSpeed;
            }
        }
    },
    selectedDown: function() {
        if (BALL.editor.selected != null) {
            if (BALL.editor.selected != null && BALL.editor.selected.body != null) {
                BALL.editor.selected.body.y += BALL.editor.moveSpeed;
                BALL.editor.selected.startY = BALL.editor.selected.body.y;
            } else {
                BALL.editor.selected.y += BALL.editor.moveSpeed;
            }
        } 
    },
    selectedRight: function() {
        if (BALL.editor.selected != null) {
            if (BALL.editor.selected != null && BALL.editor.selected.body != null) {
                BALL.editor.selected.body.x += BALL.editor.moveSpeed;
                BALL.editor.selected.startX = BALL.editor.selected.body.x;
            } else {
                BALL.editor.selected.x += BALL.editor.moveSpeed;
            }
        } 
    },
    
    
    
    //_________________EDITOR SETUP__________________\\
    populategObjs: function() { //replace gObjs with objTypes. 
        this.gObjs.push("g1-island-plat");
        this.gObjs.push("g1-long-plat");
        this.gObjs.push("g1-breakplat");
        this.gObjs.push("g1-brickwall");
        this.gObjs.push("g1-fan");
        this.gObjs.push("g1-short-breakplat");
        this.gObjs.push("g1-short-plat");
        this.gObjs.push("g1-windmill");
        /**
        this.gObjs.push("bigplat");
        //this.gObjs.push("w1-tree-plat")
        this.gObjs.push("chalkbig");
        this.gObjs.push("woodbig");
        this.gObjs.push("chalksmall");
        this.gObjs.push("staticball");
        this.gObjs.push("chalkbreak");
        **/
        //special
        this.gObjs.push("launcher-stop");
        this.gObjs.push("d01-boulder");
        this.gObjs.push("d01-killboulder");
        this.gObjs.push("hanging-plank");
        this.gObjs.push("rope");
        
        this.gObjs.push("k01-redline");
        this.gObjs.push("k01-electricity");
        this.gObjs.push("k02-button");
        this.gObjs.push("k03-trampoline");
        
        this.gObjs.push("s01-launcher");
        
    },
    
    createEditor: function(g) { //don't create this.sprites, use BALL.gameState.sprites.
        this.game = g;
        BALL.editorUI.editor = this;
        this.populategObjs();
        
        for (var i in this.gObjs) {
            $("#imgsDiv1").append("<div id='imgDiv-" + i + "' class='editorImg'><img src='assets/graphics/world2/" + this.gObjs[i] + ".png' id='edImg-" + i + "'></div>");
            $("#imgDiv-" + i).click({index: Number(i)}, function(event) {
                BALL.editorUI.clickObject(event.data.index);
            });
        }
        
        BALL.editorUI.setupUI();
    },
    
    
    
    
}









