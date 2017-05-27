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
    
    setEditor: function(editor) {
        this.curEditor = editor;
    },
    
    select: function(sprite) {
        this.selected = sprite;
        BALL.editorUI.select(sprite);
        if (this.curEditor != null) 
            this.curEditor.select(sprite);
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
                    BALL.gameState.createObj();
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
    
    flipObject: function() {
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
    //::::::::::::::::::::::::::::::.............::::::::::::::::::::::::::::\\
    //:::::::::::::::::::::::::::: END CAM FUNCS ::::::::::::::::::::::::::::\\
    //::::::::::::::::::::::::::::::.............::::::::::::::::::::::::::::\\
    
    

    selectedUp: function() { 
        if (BALL.editor.pathSpriteSelected == false) {
            if (BALL.editor.selected.body != null) {
                BALL.editor.selected.body.y -= BALL.editor.spriteSpeed;
            } else {
                BALL.editor.selected.y -= BALL.editor.spriteSpeed;
            }
        } else {
            
        }
    },
    selectedLeft: function() {
        if (BALL.editor.pathSpriteSelected == false) {
            if (BALL.editor.selected.body != null) {
                BALL.editor.selected.body.x -= BALL.editor.spriteSpeed;
            } else {
                BALL.editor.selected.x -= BALL.editor.spriteSpeed;
            }
        } else {
            
        }
    },
    selectedDown: function() {
        if (BALL.editor.pathSpriteSelected == false) {
            if (BALL.editor.selected.body != null) {
                BALL.editor.selected.body.y += BALL.editor.spriteSpeed;
            } else {
                BALL.editor.selected.y += BALL.editor.spriteSpeed;
            }
        } else {
            
        }
    },
    selectedRight: function() {
        if (BALL.editor.pathSpriteSelected == false) {
            if (BALL.editor.selected.body != null) {
                BALL.editor.selected.body.x += BALL.editor.spriteSpeed;
            } else {
                BALL.editor.selected.x += BALL.editor.spriteSpeed;
            }
        } else {
            
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
        BALL.play.ball.reset(100, 100);
        game.camera.follow(BALL.play.ball);
        game.camera.scale.setTo(0.75);
        
    },
    
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
        BALL.editorUI.editor = this;
        this.sprites = this.game.add.group();
        this.sprites.inputEnableChildren = true;
        this.populategObjs();
        for (var i in this.gObjs) {
            $("#imgsDiv1").append("<div id='imgDiv-" + i + "' class='editorImg'><img src='assets/plats/" + this.gObjs[i] + ".png' id='edImg-" + i + "'></div>");
            $("#imgDiv-" + i).click({index: Number(i)}, function(event) {
                BALL.editorUI.clickObject(event.data.index);
            });
        }
        BALL.editorUI.setupUI();
    },
    

}







