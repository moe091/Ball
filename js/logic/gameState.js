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
    
    selected: null,
    
    ballSpeed: 1,
    boopSpeed: 12,
    ballJump: 850,
    jumpInterval: 900,
    sideJumpInterval: 500,
    sideJumpTime: 0,
    
    bounceMaterial: null,
    ballMaterial: null,
    wallrideMaterial: null,
    
    
    special: null,
    
    jump: function() {
        if (BALL.gameState.jumpTime < game.time.now - BALL.gameState.jumpInterval) {
            BALL.play.ball.body.velocity.y-= BALL.gameState.ballJump;
            BALL.gameState.jumpTime = game.time.now;
        }
    },
    
    moveLeft: function() {
        BALL.play.ball.body.angularVelocity-= BALL.gameState.ballSpeed;
    },
    
    moveRight: function() {
        BALL.play.ball.body.angularVelocity+= BALL.gameState.ballSpeed;
    },
    
    boopLeft: function() {
        console.log('boopleft');
        BALL.play.ball.body.angularVelocity-= BALL.gameState.boopSpeed;
    },
    
    boopRight: function() {
        console.log('boopright');
        BALL.play.ball.body.angularVelocity+= BALL.gameState.boopSpeed;
    },
    
    jumpLeft: function() {
        if (game.time.now < BALL.gameState.jumpTime + BALL.gameState.sideJumpInterval && game.time.now > BALL.gameState.sideJumpTime + BALL.gameState.sideJumpInterval) {
            BALL.play.ball.body.velocity.x-= BALL.gameState.ballJump;
            BALL.play.ball.body.velocity.y-= BALL.gameState.ballJump * 0.2;
            BALL.gameState.sideJumpTime = game.time.now;
        }
    },
    
    jumpRight: function() {
        if (game.time.now < BALL.gameState.jumpTime + BALL.gameState.sideJumpInterval && game.time.now > BALL.gameState.sideJumpTime + BALL.gameState.sideJumpInterval) {
            BALL.play.ball.body.velocity.x+= BALL.gameState.ballJump;
            BALL.play.ball.body.velocity.y-= BALL.gameState.ballJump * 0.2;
            BALL.gameState.sideJumpTime = game.time.now;
        }
    },
    
    initGame: function() {
        this.special = game.add.group();
        
        this.sprites = game.add.group();
        this.sprites.inputEnableChildren = true;
        
        
        this.bounceMaterial = game.physics.p2.createMaterial();
        this.wallrideMaterial = game.physics.p2.createMaterial();
            
        BALL.manager.loadLevel(game.cache.getJSON('level'));
        
        game.physics.p2.createContactMaterial(this.ballMaterial, this.bounceMaterial, { friction: 99 , restitution: 1.25 }); 
        game.physics.p2.createContactMaterial(this.ballMaterial, this.wallrideMaterial, { friction: 999 , restitution: 0 }); 
        
        
        //this.boulder = game.add.sprite(3000, 1660, "");
        //game.physics.p2.enable(this.boulder, true);
        //this.boulder.body.setCircle(120);
        
        BALL.editor.createEditor();
    },
    
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
        BALL.gameState.selected = BALL.gameState.sprites.create(x, y, key);
        BALL.gameState.selected.anchor.setTo(0.5, 0.5);
        if (id == undefined) {
            BALL.gameState.selected.ID = this.nextID();
            console.log("no id provided, setting id to: " + BALL.gameState.selected.ID);
        } else {
            BALL.gameState.selected.ID = id;
        }
        
        
        BALL.gameState.selected.inputEnabled = true;
        BALL.gameState.selected.input.useHandCursor = true;
        BALL.gameState.selected.input.enableDrag(true);
        
            game.physics.p2.enable(BALL.gameState.selected, false);
            BALL.gameState.selected.body.clearShapes();
            BALL.gameState.selected.body.loadPolygon("newbods", key);
            BALL.gameState.selected.body.static = true;
            BALL.gameState.selected.input.pixelPerfectOver = true;
        
            if (key.substr(0, 4) == "k01-") {
                //BALL.gameState.selected.input.pixelPerfectOver = true;
                //BALL.gameState.selected.body.data.shapes[0].sensor=true;
                
                BALL.gameState.selected.body.createBodyCallback(BALL.play.ball, this.killCallback, this);
            } else if (key.substr(0, 4) == "k03-") { 
                BALL.gameState.selected.body.setMaterial(this.bounceMaterial)
            } else {
                BALL.gameState.selected.body.setMaterial(this.wallrideMaterial);
            }
        
            if (key == "k01-electricity") {
                BALL.gameState.selected.animations.add("play");
                BALL.gameState.selected.animations.play("play", 20, true);
            } else if (key == "s01-launcher") {
                console.log("creating launcher");
        
                BALL.gameState.selected.tEvent = BALL.timer.pushEvent(BALL.effects.launcherShot(BALL.gameState.selected), null, 3000, true, null);
            }
        
        BALL.gameState.selected.events.onInputDown.add(BALL.editor.clickObj, this);
        BALL.gameState.selected.events.onInputOver.add(BALL.editor.spriteHover, this);
        BALL.gameState.selected.events.onInputOut.add(BALL.editor.spriteUnhover, this);
        
        BALL.gameState.selected.updateFuncs = [];
        this.updateObjs.push(BALL.gameState.selected);
        
        BALL.gameState.objects.push(BALL.gameState.selected);
        return BALL.gameState.selected;
    },
    
    initObject: function(sprite) {
        sprite.startX = sprite.x;
        sprite.startY = sprite.y;
        if (sprite.createTrigger != null) {
            for (var i in sprite.createTrigger.events) {
                sprite.createTrigger.events[i].execute();
                
            }
        }  
        if (sprite.movePaths != null && sprite.movePaths[0] != null) {
            console.log("Starting movepath ", sprite + ", path: ", sprite.movePaths[0]);
            sprite.movePaths[0].start();
        }
    },
    
    resetLevel: function() {
        BALL.timer.reset();
        this.resurrectObjs();
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
        if (obj != null)
            console.log(obj.sprite.key);
        BALL.play.ball.kill();
        BALL.play.ball_back.kill();
        BALL.play.ball_face.kill();
        
        BALL.manager.resetLevel();
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
        for (var i in this.objects) {
            for (var j in this.objects[i].triggers) {
                this.objects[i].triggers[j].done = false;
            }
            if (this.objects[i].alive == false & this.objects[i].startsDead != true) {
                console.log("rezzing object #" + this.objects[i].ID + ", " + this.objects[i].key);
                this.restoreObject(this.objects[i]);
            }
        }
    }
    
    
}

BALL.Obstacle = function(sprite) {}