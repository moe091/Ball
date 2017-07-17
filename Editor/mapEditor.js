//////////////////////////  SCROLLING EDITOR IMAGES \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

BALL.editor = {
    editMode: false,
    game: null,
    gObjs: [],
    curObj: null,
    objI: -1,
    sprites: null,
    
    camScale: 1,
    camSpeed: 10,
    spriteSpeed: 10,
    
    selected: null,
    pathSpriteSelected: false,
    
    hovering: false,
    dragging: false,
    lastPX: 0,
    lastPY: 0,
    isDown: false,
    downX: 0,
    downY: 0,
    dragging: false,
    movingObj: false,
    
    curEditor: null,
    targetSelect: null,
    
    setEditor: function(editor) {
        this.curEditor = editor;
    },
    
    select: function(sprite) {
        if (this.targetSelect == null) {
            this.selected = sprite;
            BALL.editorUI.select(sprite);
            if (this.curEditor != null) {
                this.curEditor.select(sprite);
            }
        } else {
            this.targetSelect.selectTarget(sprite);
            this.targetSelect = null;
        }
    },
    
    getSelectedObj: function() {
        if (this.pathSpriteSelected) {
            return this.selected.parentObj;
        } else {
            return this.selected;
        }
    },
    
    //::::::::::::::::::::::::::::::'''''''''''''::::::::::::::::::::::::::::\\
    //:::::::::::::::::::::::::... INPUT CALLBACKS ...:::::::::::::::::::::::\\
    //::::::::::::::::::::::::::::::.............::::::::::::::::::::::::::::\\
    inputDown: function(pointer) {
        if (BALL.editor.editMode) {
                
            BALL.editor.downX = game.input.worldX;
            BALL.editor.downY = game.input.worldY;
            BALL.editor.isDown = true;


            BALL.editor.dragging = false;
            if (BALL.editor.hovering) { //hovering
                BALL.editor.dragObj = true;
                this.lastPX = Math.round(game.input.worldX);
                this.lastPY = Math.round(game.input.worldY);
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
    
    inputUp: function(pointer) {
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
    
    clickObj: function(s) {
        BALL.editor.select(s);
        BALL.editor.pathSpriteSelected = false;
    },
    

    
    //::::::::::::::::::::::::::::::::... UPDATE ...:::::::::::::::::::::::::\\
    
    update: function() {
        //EDITOR VARS
        this.setMovespeeds();
        
        //OBJECT
        this.dragObject();
        this.flipObject();
        
        //CAMERA
        this.dragCamera();
        this.scrollCamera();
        this.scaleCamera();
        
        //OBJECT PROPERTIES
        this.updateRotation();
        
        
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
    
    dragCamera: function() {
        if (this.dragging) {
            game.camera.x-= (game.input.activePointer.x - this.lastPX);
            game.camera.y-= (game.input.activePointer.y - this.lastPY);
            this.lastPX = game.input.activePointer.x;
            this.lastPY = game.input.activePointer.y;
        }
    },
    
        scrollCamera: function() {
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
    
    scaleCamera: function() {
        //CAMERA SCALING
        if (BALL.input.t.isDown) {
            console.log(game.camera.scale.x);
            this.camScale += 0.02;
        }
        if (BALL.input.g.isDown) {
            this.camScale -= 0.02;
        }
        if (this.camScale < 0.5)
            this.camScale = 0.5;
        game.camera.scale.setTo(this.camScale);
    },
    
    //_________________________________________________________________________\\
    //____________________________MODIFY OBJECTS_______________________________\\

    
    flipObject: function() {
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
    
    setMovespeeds: function() {
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
            
            if (BALL.editorUI.rotValue != null) {
                this.selected.rotSpeed = BALL.editorUI.rotValue;
                
                if (this.selected.rotateUpdate == null) {
                    this.selected.rotateUpdate = BALL.gObject.rotateUpdate(BALL.editorUI.rotValue, this.selected);
                    this.selected.updateFuncs.push(this.selected.rotateUpdate);
                }
            } else {
                console.log("NULL ROTVAL:", this.selected.key);
            }
            
        }
    },
    
    
    
    
    //______________________________________________SELECTION MOVEMENT__________________________________________\\

    selectedUp: function() {
        if (BALL.editor.editMode) {
            if (BALL.editor.pathSpriteSelected == false) {
                if (BALL.editor.selected.body != null) {
                    BALL.editor.selected.body.y -= BALL.editor.spriteSpeed;
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
                if (BALL.editor.selected.body != null) {
                    BALL.editor.selected.body.x -= BALL.editor.spriteSpeed;
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
                if (BALL.editor.selected.body != null) {
                    BALL.editor.selected.body.y += BALL.editor.spriteSpeed;
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
                if (BALL.editor.selected.body != null) {
                    BALL.editor.selected.body.x += BALL.editor.spriteSpeed;
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
    enterEditMode: function() {
        BALL.editor.editMode = true;
        console.log("entering edit mode - " + BALL.editor.editMode);
        //game.camera.follow = null;
        game.camera.target = null;
        //BALL.editor.camUp = BALL.editor.camUp;
    },
    
    exitEditMode: function() {
        BALL.editor.editMode = false;
        console.log("exiting edit mode - " + BALL.editor.editMode);
        //this.camUp = function() {};
        
        BALL.gameState.resetLevel();
        
        BALL.play.ball.reset(1750, 2000);
        BALL.play.ball_back.reset(0, 0);
        BALL.play.ball_face.reset(0, 0);
        game.camera.follow(BALL.play.ball);
        game.camera.scale.setTo(0.5);
        
    },
    
    populategObjs: function() {
        //plats
        this.gObjs.push("w1-plat1");
        this.gObjs.push("w1-platbreak");
        this.gObjs.push("w1-branch");
        this.gObjs.push("bigplat");
        this.gObjs.push("w1-tree-plat")

        //special
        this.gObjs.push("k01-dublaser");
        this.gObjs.push("k01-electricity");
        this.gObjs.push("k02-button");
    },
    
    createEditor: function(g) {
        this.game = g;
        BALL.editorUI.editor = this;
        this.sprites = this.game.add.group();
        this.sprites.inputEnableChildren = true;
        this.populategObjs();
        for (var i in this.gObjs) {
            console.log(this.gObjs[i]);
            
            $("#imgsDiv1").append("<div id='imgDiv-" + i + "' class='editorImg'><img src='assets/graphics/world1/" + this.gObjs[i] + ".png' id='edImg-" + i + "'></div>");
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
        BALL.editor.loadLevel(game.cache.getJSON('level'));
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
            if (level.objs[i].key == "w1-plat1") {
                level.objs[i].key = "w1-branch";
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







