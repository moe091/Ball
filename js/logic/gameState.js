BALL.gameState = {
    touchDown: false,
    jumpTime: 0,
    downX: 0,
    
    objects: [],
    updateObjs: [],
    deadObjs: [],
    
    movePaths: [],
    events: [],
    pointSprites: null,
    
    curID: 0,
    
    
    update: function() {
        for (var i in this.updateObjs) {
            for (var j in this.updateObjs[i].updateFuncs) {
                //this.updateObjs[i].updateFuncs[j]();
            }
        }  
    },
    
    nextID: function() {
        while (this.getSpriteById(this.curID) != null) {
            this.curID++;
        }
        return this.curID;
    },
    
    
    createObj: function(x, y, key, id) {
        if (key == "double-laser") {
            key = "k01-dublaser";
        }
        BALL.editor.select(BALL.editor.sprites.create(x, y, key));
        BALL.editor.selected.anchor.setTo(0.5, 0.5);
        if (id == undefined) {
            BALL.editor.selected.ID = this.nextID();
            console.log("no id provided, setting id to: " + BALL.editor.selected.ID);
        } else {
            BALL.editor.selected.ID = id;
        }
        
        
        BALL.editor.selected.inputEnabled = true;
        BALL.editor.selected.input.useHandCursor = true;
        BALL.editor.selected.input.enableDrag(true);
        
            game.physics.p2.enable(BALL.editor.selected, false);
            BALL.editor.selected.body.clearShapes();
            BALL.editor.selected.body.loadPolygon("plat_bodies", key);
            BALL.editor.selected.body.static = true;
            BALL.editor.selected.input.pixelPerfectOver = true;
        
            if (key.substr(0, 4) == "k01-") {
                //BALL.editor.selected.input.pixelPerfectOver = true;
               // BALL.editor.selected.body.data.shapes[0].sensor=true;
                
                BALL.editor.selected.body.createBodyCallback(BALL.play.ball, this.killCallback, this);
            }
        
            if (key == "k01-electricity") {
                BALL.editor.selected.animations.add("play");
                BALL.editor.selected.animations.play("play", 20, true);
            }
        
        BALL.editor.selected.updateFuncs = [];
        this.updateObjs.push(BALL.editor.selected);
        
        BALL.editor.selected.events.onInputDown.add(BALL.editor.clickObj, this);
        BALL.editor.selected.events.onInputOver.add(BALL.editor.spriteHover, this);
        BALL.editor.selected.events.onInputOut.add(BALL.editor.spriteUnhover, this);
        BALL.gameState.objects.push(BALL.editor.selected);
        return BALL.editor.selected;
    },
    
    initObject: function(sprite) {
        if (sprite.createTrigger != null) {
            sprite.startX = sprite.x;
            sprite.startY = sprite.y;
            for (var i in sprite.createTrigger.events) {
                sprite.createTrigger.events[i].execute();
            }
        }  
    },
    
    destroyObject: function(sprite) {
        for (var i in this.objects) {
            if (this.objects[i].ID == sprite.ID) {
                this.objects.splice(i, 1);
            }
        }
        sprite.destroy();
    },
    
    killCallback: function(obj, ball) {
        console.log(obj.sprite.key);
        BALL.play.ball.kill();
        BALL.play.ball_back.kill();
        BALL.play.ball_face.kill();
        
        BALL.editor.exitEditMode();
    },
    
    moveObject: function(sprite, x, y) {
        if (sprite.body != null) {
            //sprite.body.static = false;
            sprite.body.x = Math.round(game.input.worldX * (1 / game.camera.scale.x));
            sprite.body.y = Math.round(game.input.worldY * (1 / game.camera.scale.y));
            //sprite.body.static = true;
        } else {
            if (BALL.editor.pathSpriteSelected) {
                var pos = sprite.game.input.getLocalPosition(sprite.parent, game.input.activePointer);
                
                sprite.x = Math.round(pos.x);
                sprite.y = Math.round(pos.y);
            } else {
                sprite.x = Math.round(game.input.worldX * (1 / game.camera.scale.x));
                sprite.y = Math.round(game.input.worldY * (1 / game.camera.scale.y));
            }
        }
    },
    

    
    
    hidePathSprites: function() {
        
        console.warn("hidePathSprites - DEPCREATED");
    },
    
    getSpriteById: function(id) {
        console.log("getSpriteByID() context: ", this);
        for (var i in this.objects) {
            if (this.objects[i].ID == id) {
                return this.objects[i];
            }
        }
        console.warn("NO OBJECT FOUND WITH ID " + id + ", RETURNING NULL!");
        return null;
    },
    
    restoreObject: function(sprite) {
        sprite.reset(sprite.startX, sprite.startY);
    },
    
    buryObject: function(sprite) {
        this.deadObjs.push(sprite);
    },
    
    resurrectObjs: function() {
        for (var i in this.deadObjs) {
            this.restoreObject(this.deadObjs[i]);
        }
    }
    
    
}

BALL.Obstacle = function(sprite) {}