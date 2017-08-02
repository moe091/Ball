BALL.gObject = {
    
    rotateUpdate: function(speed, sprite) {
        sprite.rotSpeed = speed;
        return function() {
            if (sprite.body != null) {
                sprite.body.rotateRight(sprite.rotSpeed);
            } else {
                sprite.angle+= sprite.rotSpeed;
            }
                
        }
    }
}


Phaser.Sprite.prototype.addUpdateFunc = function(f) {
    if (this.updateFuncs == null) {
        console.log("Adding updateFuncs []");
        this.updateFuncs = [];
    }
    this.updateFuncs.push(f);
    console.log("Added func:", f);
    console.log(this);
}

Phaser.Sprite.prototype.update = function() {
    if (this.updateFuncs != null) {
        for (var i in this.updateFuncs) {
            //console.log("sprite update context:");
            //console.log(this);
            //this.updateFuncs[i]();
            this.updateFuncs[i].call(this);
        }
    }
}






BALL.objDefs = {
    init: function() {
        this["d01-boulder"] = {
            material: BALL.gameState.boulderMaterial,
            colGroup: BALL.gameState.dynamicGroup,
            collides: [
                BALL.gameState.wallrideGroup,
                BALL.gameState.ballGroup,
                BALL.gameState.dynamicGroup,
                BALL.gameState.killGroup
            ],
            init: function(obj) {
                console.log("init: ", this);
                console.log("obj = ", obj);
                obj.body.setCircle(51);
                obj.startX = obj.x;
                obj.startY = obj.y;
                BALL.gameState.buryObject(obj);
                
                obj.body.setMaterial(BALL.gameState.material);
                obj.body.setCollisionGroup(this.colGroup);
                
                for (var i in this.collides) {
                    obj.body.collides(this.collides[i]);
                }
                
            } //init boulder
        };// boulder
        
        this["d01-killboulder"] = {
            init: function(obj) {
                obj.body.setCircle(62);
                obj.body.setCollisionGroup(BALL.gameState.dynamicGroup);
                obj.body.collides(BALL.gameState.wallrideGroup);
                obj.body.collides(BALL.gameState.ballGroup, BALL.gameState.killCallback, this);
                obj.body.collides(BALL.gameState.dynamicGroup);
                obj.body.collides(BALL.gameState.killGroup);
                
                obj.startX = obj.x;
                obj.startY = obj.y;
                BALL.gameState.buryObject(obj);
            }
        }; //killboulder
        
        
        this["k01-redline"] = {
             init: function(obj) {
                obj.body.loadPolygon("newbods2", obj.key);
                obj.body.static = true;
                obj.body.setCollisionGroup(BALL.gameState.killGroup);
                 
                obj.body.collides(BALL.gameState.ballGroup, BALL.gameState.killCallback, this);
                obj.body.collides(BALL.gameState.dynamicGroup);
                obj.body.collides(BALL.gameState.killGroup);
             }
        };
        
        this["k03-trampoline"] = {
            init: function(obj) {
                obj.body.loadPolygon("newbods2", obj.key);
                obj.body.static = true;
                obj.body.setMaterial(BALL.gameState.bounceMaterial);
                obj.body.setCollisionGroup(BALL.gameState.dynamicGroup);
                obj.body.collides(BALL.gameState.ballGroup);
                obj.body.collides(BALL.gameState.dynamicGroup);
            }
        };
        
        this["hanging-plank"] = {
            init: function(obj) {
                obj.body.loadPolygon("newbods2", obj.key);
                obj.body.setCollisionGroup(BALL.gameState.dynamicGroup);
                obj.body.collides(BALL.gameState.wallrideGroup);
                obj.body.collides(BALL.gameState.ballGroup);
                obj.body.collides(BALL.gameState.dynamicGroup);
            }
        };
        
        this["rope"] = {
            init: function(obj) {
                obj.body.loadPolygon("newbods2", obj.key);
                obj.body.setCollisionGroup(BALL.gameState.dynamicGroup);
                obj.body.collides(BALL.gameState.wallrideGroup);
                obj.body.collides(BALL.gameState.ballGroup);
                obj.body.collides(BALL.gameState.dynamicGroup);
            }
        };
        
        this["chalk"] = {
            init: function(obj) {
                obj.body.loadPolygon("newbods2", obj.key);
                obj.body.static = true;
                obj.body.setMaterial(BALL.gameState.wallrideMaterial);
                obj.body.setCollisionGroup(BALL.gameState.wallrideGroup);
                obj.body.collides(BALL.gameState.ballGroup, BALL.gameState.wallrideCallback, this);
                obj.body.collides(BALL.gameState.dynamicGroup);
                obj.body.collides(BALL.gameState.killGroup);
            }
        };
        this["chalkbig"] = this["chalk"];
        this["chalkbreak"] = this["chalk"];
        this["chalksmall"] = this["chalk"];
        this["woodbig"] = this["chalk"];
        
        this["default"] = {
            init: function(obj) {
                console.log("DEFAULT: " + obj.key);
                obj.body.loadPolygon("newbods2", obj.key);
                obj.body.static = true;
                obj.body.setCollisionGroup(BALL.gameState.dynamicGroup);
                obj.body.collides(BALL.gameState.wallrideGroup);
                obj.body.collides(BALL.gameState.ballGroup);
                obj.body.collides(BALL.gameState.dynamicGroup);
            }
        }
        
    }//init objDefs
    
}




//:::::::::::::: MOVEPATH FUNCS :::::::::::::::::\\
Phaser.Sprite.prototype.setPath = function(path) {
    if (this.curPath != null) {
        this.curPath.stop();
    }
    this.curPath = path;
    if (path.points[0].pSprite != null) {
        if (this.body != null) {
            this.body.x = path.points[0].pSprite.x;
            this.body.y = path.points[0].pSprite.y;
        } else {
            this.x = path.points[0].pSprite.x;
            this.y = path.points[0].pSprite.y;
        }
    }
}