BALL.gameState = {
    touchDown: false,
    jumpTime: 0,
    downX: 0,
    
    objects: [],
    updateObjs: [],
    
    movePaths: [],
    events: [],
    pointSprites: null,
    
    
    update: function() {
        for (var i in this.updateObjs) {
            for (var j in this.updateObjs[i].updateFuncs) {
                //this.updateObjs[i].updateFuncs[j]();
            }
        }  
    },
    
    
    createObj: function(x, y, key) {
        console.log("key:", key);
        BALL.editor.select(BALL.editor.sprites.create(x, y, key));
        BALL.editor.selected.anchor.setTo(0.5, 0.5);
        
        BALL.editor.selected.inputEnabled = true;
        BALL.editor.selected.input.useHandCursor = true;
        BALL.editor.selected.input.enableDrag(true);
        
            game.physics.p2.enable(BALL.editor.selected, false);
            BALL.editor.selected.body.clearShapes();
            BALL.editor.selected.body.loadPolygon("plat_bodies", key);
            BALL.editor.selected.body.static = true;
            BALL.editor.selected.input.pixelPerfectOver = true;
        
            if (key.substr(0, 3) == "nb-") {
                BALL.editor.selected.input.pixelPerfectOver = true;
               // BALL.editor.selected.body.data.shapes[0].sensor=true;
                
                BALL.editor.selected.body.createBodyCallback(BALL.play.ball, this.killCallback, this);
            }
        
        BALL.editor.selected.updateFuncs = [];
        this.updateObjs.push(BALL.editor.selected);
        
        BALL.editor.selected.events.onInputDown.add(BALL.editor.clickObj, this);
        BALL.editor.selected.events.onInputOver.add(BALL.editor.spriteHover, this);
        BALL.editor.selected.events.onInputOut.add(BALL.editor.spriteUnhover, this);
        console.log("ccreated object:");
        console.log(BALL.editor.selected);
        BALL.gameState.objects.push(BALL.editor.selected);
        return BALL.editor.selected;
    },
    
    killCallback: function(obj, ball) {
        console.log(obj.sprite.key);
        BALL.play.ball.kill();
        BALL.play.ball_back.kill();
        BALL.play.ball_face.kill();
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
    }
    
    
}

BALL.Obstacle = function(sprite) {}