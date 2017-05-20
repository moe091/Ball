//////////////////////////  SCROLLING EDITOR IMAGES \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

BALL.editor = {
    editMode: false,
    game: null,
    gObjs: [],
    curObj: null,
    objI: -1,
    sprites: null,
    
    selected: null,
        //gObjs
    
    populategObjs: function() {
        this.gObjs.push("p1_angle");
        this.gObjs.push("p1_corner");
        this.gObjs.push("p1_edge");
        this.gObjs.push("p1_flat");
        this.gObjs.push("p1_ramp");
        this.gObjs.push("wall_hor");
        this.gObjs.push("wall_vert");
    },
    
    createEditor: function(g) {
        this.game = g;
        this.sprites = this.game.add.group();
        
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

            var sel = false;
            for (i in BALL.gameState.objects) {
                if (BALL.gameState.objects[i].contains(pointer.screenX, pointer.screenY)) {
                    BALL.editor.selected = BALL.gameState.objects[i];
                    console.log("CLICKED SPRITE: ");
                    console.log("CLICKED SPRITE: ");
                    console.log("CLICKED SPRITE: ");
                    console.log(BALL.editor.selected);
                    sel = true;
                    BALL.editor.dragging = true;
                }
            }

            if (!sel) {
                BALL.editor.dragging = false;
                if (BALL.editor.curObj != null) {
                    BALL.editor.selected = BALL.editor.sprites.create(game.input.worldX, game.input.worldY, BALL.editor.curObj);
                    BALL.editor.selected.anchor.setTo(0.5, 0.5);
                    game.physics.p2.enable(BALL.editor.selected, true);
                    BALL.editor.selected.body.clearShapes();
                    BALL.editor.selected.body.loadPolygon("plat_bodies", BALL.editor.curObj);
                    BALL.editor.selected.body.static = true;
                    
                    BALL.editor.selected.inputEnabled = true;
                    BALL.editor.selected.input.pixelPerfectOver = true;
                    BALL.editor.selected.input.useHandCursor = true;
                    BALL.editor.selected.input.enableDrag(true);
                    console.log(pointer);

                    BALL.gameState.objects.push(BALL.editor.selected);
                } else {
                    console.log("EDITOR - NO OBJECT SELECTED");
                }
            } else { //SEL = true(clicked an obj)
                console.log("you clicked:");
                console.log(BALL.editor.selected);
            } 
            
            
        } //END EDITMODE
            
            
    },
    
    inputUp: function(pointer) {
        BALL.editor.isDown = false;
        if (BALL.editor.selected != null) {
            if (BALL.editor.selected.getBounds().contains(new Phaser.Point(pointer.x, pointer.y))) {
                console.log("U CLICKED A SPRITE");
            } else {
                console.log("MISSED UPCLICK");
                console.log("input: " + pointer.screenX + ", " + pointer.screenY);
                console.log(BALL.editor.selected.getBounds());
                //BALL.editor.selected = null;
            }
        }
    },
    
    enterEditMode: function() {
        BALL.editor.editMode = true;
        console.log("entering edit mode - " + BALL.editor.editMode);
        game.camera.follow = null;
        game.camera.target = null;
        //BALL.editor.camUp = BALL.editor.camUp;
    },
    
    exitEditMode: function() {
        BALL.editor.editMode = false;
        console.log("exiting edit mode - " + BALL.editor.editMode);
        //this.camUp = function() {};
    },
    
    update: function() {
        if (BALL.input.shift.isDown) {
            this.camSpeed = 100;
            this.spriteSpeed = 1;
        } else {
            this.camSpeed = 10;
            this.spriteSpeed = 10;
        }
        
        
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
    
    
    camSpeed: 10,
    camUp: function() {
        game.camera.y-= BALL.editor.camSpeed;
    },
    camLeft: function() {
        game.camera.x-= BALL.editor.camSpeed;
    },
    camDown: function() {
        game.camera.y+= BALL.editor.camSpeed;
    },
    camRight: function() {
        game.camera.x+= BALL.editor.camSpeed;
    },
    
    spriteSpeed: 10,
    selectedUp: function() { 
        BALL.editor.selected.body.y -= BALL.editor.spriteSpeed;
    },
    selectedLeft: function() {
        BALL.editor.selected.body.x -= BALL.editor.spriteSpeed;
    },
    selectedDown: function() {
        BALL.editor.selected.body.y += BALL.editor.spriteSpeed;
    },
    selectedRight: function() {
        BALL.editor.selected.body.x += BALL.editor.spriteSpeed;
    },
    
    

}







