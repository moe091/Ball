//////////////////////////  SCROLLING EDITOR IMAGES \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

BALL.editor = {
    editMode: false,
    game: null,
    gObjs: [],
    curObj: null,
    objI: -1,
    sprites: null,
    
    camScale: 1,
    
    selected: null,
    
    hovering: false,
    dragging: false,
    dragObj: false,
    lastPX: 0,
    lastPY: 0,
        //gObjs
    
    populategObjs: function() {
        this.gObjs.push("p1_angle");
        this.gObjs.push("p1_angle-f");
        this.gObjs.push("p1_corner");
        this.gObjs.push("p1_edge");
        this.gObjs.push("p1_flat");
        this.gObjs.push("p1_ramp");
        this.gObjs.push("p1_ramp-f");
        this.gObjs.push("wall_hor");
        this.gObjs.push("wall_vert");
        this.gObjs.push("electricity");
    },
    
    createEditor: function(g) {
        this.game = g;
        this.sprites = this.game.add.group();
        this.sprites.inputEnableChildren = true;
        this.populategObjs();
        for (var i in this.gObjs) {
            console.log(this.gObjs[i]);
            $("#imgsDiv1").append("<div id='imgDiv-" + i + "' class='editorImg'><img src='assets/plats/" + this.gObjs[i] + ".png' id='edImg-" + i + "'></div>");
            $("#imgDiv-" + i).click({index: Number(i)}, function(event) {
                BALL.editor.clickObject(event.data.index);
            });
        }
    },
    
    clickObject: function(index) {
        this.objI = index;
        this.curObj = this.gObjs[index];
        console.log(this.curObj);
        for (var i in this.gObjs) {
            $("#imgDiv-" + i).css("border-color", "#000");
        }
        
        $("#imgDiv-" + index).css("border-color", "#FFF");
        
    },
    
    
    
    isDown: false,
    downX: 0,
    downY: 0,
    dragging: false,
    inputDown: function(pointer) {
        if (BALL.editor.editMode) {
                
            BALL.editor.downX = game.input.worldX;
            BALL.editor.downY = game.input.worldY;
            BALL.editor.isDown = true;



            BALL.editor.dragging = false;
            if (BALL.editor.hovering) {
                BALL.editor.dragObj = true;
                console.log("_______________DRAG____________");
                this.lastPX = Math.round(game.input.worldX);
                this.lastPY = Math.round(game.input.worldY);
            } else {
                if (BALL.input.tab.isDown) {
                    BALL.editor.dragging = true;
                    BALL.editor.lastPX = game.input.activePointer.x;
                    BALL.editor.lastPY = game.input.activePointer.y;
                } else if (BALL.editor.curObj != null) {
                    BALL.editor.selected = BALL.editor.sprites.create(Math.round(game.input.worldX * (1 / game.camera.scale.x)), Math.round(game.input.worldY * (1 / game.camera.scale.y)), BALL.editor.curObj);
                    BALL.editor.selected.anchor.setTo(0.5, 0.5);
                    if (BALL.editor.curObj === "electricity") {
                        console.log("ELECTRICITY _ MATCHES");
                        BALL.editor.selected.animations.add('electrify');
                        BALL.editor.selected.animations.play("electrify", 20, true);
                    } else {
                        game.physics.p2.enable(BALL.editor.selected, true);
                        BALL.editor.selected.body.clearShapes();
                        BALL.editor.selected.body.loadPolygon("plat_bodies", BALL.editor.curObj);
                        BALL.editor.selected.body.static = true;
                    }
                    
                    BALL.editor.selected.inputEnabled = true;
                    BALL.editor.selected.input.pixelPerfectOver = true;
                    BALL.editor.selected.input.useHandCursor = true;
                    BALL.editor.selected.input.enableDrag(true);
                    BALL.editor.selected.events.onInputDown.add(BALL.editor.clickObj, this);
                    BALL.editor.selected.events.onInputOver.add(BALL.editor.spriteHover, this);
                    BALL.editor.selected.events.onInputOut.add(BALL.editor.spriteUnhover, this);
                    
                    console.log("WORLD: ", game.input.worldX, ", ", game.input.worldY);
                    console.log("POINTER: ", pointer.x, ", ", pointer.y);
                    console.log(game.camera);
                    BALL.gameState.objects.push(BALL.editor.selected);
                } else {
                    console.log("EDITOR - NO OBJECT SELECTED");
                }
            }
            
            
        } //END EDITMODE
            
            
    },
    
    clickObj: function(s) {
        console.log(this);
        BALL.editor.selected = s;
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
        BALL.play.ball.reset(400, 400);
        game.camera.follow(BALL.play.ball);
        game.camera.scale.setTo(0.75);
        
    },
    
    update: function() {
        if (this.dragging) {
                console.log("HOVERING");
                console.log(game.input.activePointer);
                console.log(game.origDragPoint);
                game.camera.x-= (game.input.activePointer.x - this.lastPX);
                game.camera.y-= (game.input.activePointer.y - this.lastPY);
                this.lastPX = game.input.activePointer.x;
                this.lastPY = game.input.activePointer.y;
        }
        if (this.dragObj) {
            console.log(game.input.activePointer.movementX);
            if (game.input.activePointer.positionDown.x - game.input.activePointer.position.x > 10 || game.input.activePointer.positionDown.y - game.input.activePointer.position.y > 10) {
                console.log(game.input.activePointer.positionDown.x + " - " + game.input.activePointer.position.x);
                this.selected.reset(Math.round(game.input.worldX), Math.round(game.input.worldY));
                this.lastPX = Math.round(game.input.worldX);
                this.lastPY = Math.round(game.input.worldY);
            } else {
                this.lastPX = Math.round(game.input.worldX);
                this.lastPY = Math.round(game.input.worldY);
            }
        }
        
        
        
        //:::::::::::::--SPRITE CONTROLS--::::::::::::::::\\
        if (BALL.input.shift.isDown) {
            this.camSpeed = 100;
            this.spriteSpeed = 1;
        } else {
            this.camSpeed = 10;
            this.spriteSpeed = 10;
        }
        
        if (BALL.input.f.isDown) {
            if (!BALL.input.f_down) {
                BALL.input.f_down = true;
                if (this.selected != null) {
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
    
    
    camSpeed: 10,
    camUp: function() {
        //game.camera.y-= BALL.editor.camSpeed;
    },
    camLeft: function() {
        //game.camera.x-= BALL.editor.camSpeed;
    },
    camDown: function() {
        //game.camera.y+= BALL.editor.camSpeed;
    },
    camRight: function() {
        //game.camera.x+= BALL.editor.camSpeed;
    },
    
    spriteSpeed: 10,
    selectedUp: function() { 
        if (BALL.editor.selected.body != null) {
            BALL.editor.selected.body.y -= BALL.editor.spriteSpeed;
        } else {
            BALL.editor.selected.y -= BALL.editor.spriteSpeed;
        }
    },
    selectedLeft: function() {
        if (BALL.editor.selected.body != null) {
            BALL.editor.selected.body.x -= BALL.editor.spriteSpeed;
        } else {
            BALL.editor.selected.x -= BALL.editor.spriteSpeed;
        }
    },
    selectedDown: function() {
        if (BALL.editor.selected.body != null) {
            BALL.editor.selected.body.y += BALL.editor.spriteSpeed;
        } else {
            BALL.editor.selected.y += BALL.editor.spriteSpeed;
        }
    },
    selectedRight: function() {
        if (BALL.editor.selected.body != null) {
            BALL.editor.selected.body.x += BALL.editor.spriteSpeed;
        } else {
            BALL.editor.selected.x += BALL.editor.spriteSpeed;
        }
    },
    
    
    
    spriteHover: function() {
        BALL.editor.hovering = true;
        console.log("hovinger");
    },
    spriteUnhover: function() {
        BALL.editor.hovering = false;
        console.log("Unhover");
    }
    

}







