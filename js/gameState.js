BALL.gameState = {
    touchDown: false,
    jumpTime: 0,
    downX: 0,
    
    objects: [],
    updateObjs: [],
    
    
    update: function() {
        for (var i in this.updateObjs) {
            for (var j in this.updateObjs[i].updateFuncs) {
                this.updateObjs[i].updateFuncs[j]();
            }
        }  
    },
    
    
    createObj: function() {
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
        BALL.editor.selected.updateFuncs = [];
        BALL.editor.selected.updateFuncs.push(this.createTestFunc(BALL.editor.selected.key));
        this.updateObjs.push(BALL.editor.selected);
        
        BALL.editor.selected.inputEnabled = true;
        BALL.editor.selected.input.pixelPerfectOver = true;
        BALL.editor.selected.input.useHandCursor = true;
        BALL.editor.selected.input.enableDrag(true);
        BALL.editor.selected.events.onInputDown.add(BALL.editor.clickObj, this);
        BALL.editor.selected.events.onInputOver.add(BALL.editor.spriteHover, this);
        BALL.editor.selected.events.onInputOut.add(BALL.editor.spriteUnhover, this);

        BALL.gameState.objects.push(BALL.editor.selected);
        BALL.editorUI.updateSelected(BALL.editor.selected);
    },
    
    createTestFunc: function(name) {
        return function() {
            console.log(name);
        }
    }
    
    
}

BALL.Obstacle = function(sprite) {}