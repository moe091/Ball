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
    
    hovering: false,
    dragging: false,
    dragObj: false,
    lastPX: 0,
    lastPY: 0,
        //gObjs
    
    
    

    
    
    
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
                    BALL.gameState.createObj();
                } else {
                    console.log("EDITOR - NO OBJECT SELECTED");
                }
            }
            
            
        } //END EDITMODE
            
            
    },
    
    clickObj: function(s) {
        BALL.editor.selected = s;
        BALL.editorUI.updateSelected(BALL.editor.selected);
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
    

    
    movingObj: false,
    update: function() {
        this.dragCamera();
        
            this.dragObject();
        
        
        
        
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
    
    dragObject: function(){
        if (this.dragObj) {
            if (Math.abs(game.input.activePointer.positionDown.x - game.input.activePointer.position.x) > 5 || Math.abs(game.input.activePointer.positionDown.y - game.input.activePointer.position.y) > 5 || this.movingObj) {
                this.movingObj = true; console.log(game.input.activePointer.positionDown.x + " - " + game.input.activePointer.position.x);
                this.selected.body.static = false;
                this.selected.body.x = Math.round(game.input.worldX * (1 / game.camera.scale.x));
                this.selected.body.y = Math.round(game.input.worldY * (1 / game.camera.scale.y));
                this.selected.body.static = true;
                this.lastPX = Math.round(game.input.worldX);
                this.lastPY = Math.round(game.input.worldY);
            } else {
                this.lastPX = Math.round(game.input.worldX);
                this.lastPY = Math.round(game.input.worldY);
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
    
    
    spriteHover: function() {
        BALL.editor.hovering = true;
        console.log("hovinger");
    },
    spriteUnhover: function() {
        BALL.editor.hovering = false;
        console.log("Unhover");
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
            console.log(this.gObjs[i]);
            $("#imgsDiv1").append("<div id='imgDiv-" + i + "' class='editorImg'><img src='assets/plats/" + this.gObjs[i] + ".png' id='edImg-" + i + "'></div>");
            $("#imgDiv-" + i).click({index: Number(i)}, function(event) {
                BALL.editorUI.clickObject(event.data.index);
            });
        }
    },
    

}







