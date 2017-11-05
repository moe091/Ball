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
    },
    
    crunch: function(machine, bar, speed, int, hold) {
        bar.crunchSpeed = speed;
        bar.crunchInt = int;
        bar.crunchHold = hold;
        bar.crunchStep = 0;
        bar.crunchTime = game.time.now;
        return function() { //NOTE: Set step to 4 for editing purposes. pauses crunching and allows crunchTop/bottom to be reset on movement
            if (bar.ID != 34) {
            if (bar.crunchStep == 0) { //bar up, waiting crunchInt MS until it crunches down
                bar.crunchBottom = bar.crunchTop + bar.crunchDist;
                if (game.time.now - bar.crunchTime >= bar.crunchInt) {
                    //start crunch
                    bar.crunchStep = 1;
                }   
            } else if (bar.crunchStep == 1) { //bar crunching down, stopping when it reaches crunchBottom
                bar.body.y+= bar.crunchSpeed * game.time.elapsed; 
                BALL.gObject.crunchMachinePos(bar, machine);
                if (bar.body.y >= bar.crunchBottom) {
                    bar.body.y = bar.crunchBottom;
                    BALL.gObject.crunchMachinePos(bar, machine);
                    bar.crunchStep = 2;
                    bar.crunchTime = game.time.now;
                }
            } else if (bar.crunchStep == 2) { //bar in down position, holding still for crunchHold MS
                //wait
                if (game.time.now - bar.crunchTime >= bar.crunchHold) { //done holding in down position.
                    bar.crunchStep = 3;
                }
            } else if (bar.crunchStep == 3) { //bar moving back up, stopping when it reaches crunchTop
                bar.body.y-= bar.crunchSpeed * game.time.elapsed;
                BALL.gObject.crunchMachinePos(bar, machine);
                if (bar.body.y <= bar.crunchTop) {
                    bar.body.y = bar.crunchTop;
                    BALL.gObject.crunchMachinePos(bar, machine);
                    bar.crunchStep = 0;
                    bar.crunchTime = game.time.now;
                }
            } else if(bar.crunchStep == 4) {
                if (BALL.editor.getSelectedObj() != bar) {
                    bar.crunchStep = 0;
                    bar.crunchTime = game.time.now;
                }
            }//if crunchStep
            }
            
        } //return func
        
        
    }, //crunch
    
    crunchMachinePos: function(bar, machine) {
        //machine.y = bar.machineOffset - (bar.body.y - bar.crunchTop);
        //machine.body.y = machine.y + bar.y;
        //machine.body.x = machine.x + bar.x;
        machine.body.y = bar.crunchTop + bar.machineOffset;
        machine.body.x = bar.x;
        machine.body.offset.x = -machine.body.x;
        machine.body.offset.y = -(machine.body.y + (bar.body.y - bar.crunchTop) - bar.machineOffset);
        console.log("machine body: x=" + machine.body.x + ", y=" + machine.body.y);
        console.log("machine sprite: x=" + machine.x + ", y=" + machine.y);
        console.log("bar body: x=" + bar.body.x + ", y=" + bar.body.y);
    }
    
}//gObj


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
                BALL.gameState.dynamicGroup
            ],
            init: function(obj) {
                console.log("init: ", this);
                console.log("obj = ", obj);
                obj.body.isFloor = true;
                obj.body.setCircle(51);
                obj.body.mass = 12;
                obj.body.data.mass = 12;
                obj.mass = 12;
                
                obj.startX = obj.x;
                obj.startY = obj.y;
                
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
        
        this["g1-saw"] = {
            init: function(obj) {
                obj.body.setCircle(86);
                obj.body.static = true;
                obj.body.setCollisionGroup(BALL.gameState.killGroup);
                 
                obj.body.collides(BALL.gameState.ballGroup, BALL.gameState.killCallback, this);
                obj.body.collides(BALL.gameState.dynamicGroup);
            }
        };
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
                obj.body.isFloor = true;
                obj.body.setMaterial(BALL.gameState.bounceMaterial);
                obj.body.setCollisionGroup(BALL.gameState.dynamicGroup);
                obj.body.collides(BALL.gameState.ballGroup);
                obj.body.collides(BALL.gameState.dynamicGroup);
            }
        };
        
        this["hanging-plank"] = {
            init: function(obj) {
                obj.body.loadPolygon("newbods2", obj.key);
                obj.body.isFloor = true;
                obj.body.setCollisionGroup(BALL.gameState.dynamicGroup);
                obj.body.collides(BALL.gameState.wallrideGroup);
                obj.body.collides(BALL.gameState.ballGroup);
                obj.body.collides(BALL.gameState.dynamicGroup);
            }
        };
        
        this["rope"] = {
            init: function(obj) {
                obj.body.loadPolygon("newbods2", obj.key);
                obj.body.isFloor = true;
                obj.body.setCollisionGroup(BALL.gameState.dynamicGroup);
                obj.body.collides(BALL.gameState.wallrideGroup);
                obj.body.collides(BALL.gameState.ballGroup);
                obj.body.collides(BALL.gameState.dynamicGroup);
            }
        };
        
        this["woodbig"] = {
            init: function(obj) {
                obj.body.loadPolygon("newbods2", obj.key);
                obj.body.isFloor = true;
                obj.body.setMaterial(BALL.gameState.wallrideMaterial);
                obj.body.setCollisionGroup(BALL.gameState.dynamicGroup);
                obj.body.collides(BALL.gameState.ballGroup, BALL.gameState.wallrideCallback, this);
                obj.body.collides(BALL.gameState.dynamicGroup);
                obj.body.collides(BALL.gameState.killGroup);
                obj.body.collides(BALL.gameState.wallrideGroup);
            }
        };
        
        this["staticball"] = {
            init: function(obj) {
                obj.body.setCircle(9);
                obj.body.static = true;
                obj.body.isFloor = true;
                obj.body.setCollisionGroup(BALL.gameState.wallrideGroup);
                obj.body.collides(BALL.gameState.ballGroup, BALL.gameState.wallrideCallback, this);
                obj.body.collides(BALL.gameState.dynamicGroup);
                obj.body.collides(BALL.gameState.killGroup);
                
            }
        };
        
        this["g1-crunchbar"] = {
            init: function(obj) { //TODO: kill callback on collide
                obj.body.loadPolygon("newbods2", obj.key);
                obj.body.static = true;
                obj.body.isFloor = true;
                obj.body.setMaterial(BALL.gameState.noBounceMaterial);
                obj.body.setCollisionGroup(BALL.gameState.dynamicGroup);
                obj.body.collides(BALL.gameState.wallrideGroup);
                obj.body.collides(BALL.gameState.ballGroup);
                obj.body.collides(BALL.gameState.dynamicGroup);
                console.log("crunchvar - ", obj);
                obj.machineOffset = -60;
                obj.addChild(BALL.gameState.createObj(0, obj.machineOffset, "g1-crunchmachine"), Phaser.CENTER);
                console.log("crunch Machine - ", obj.children[0]);
                obj.children[0].owner = obj;
                
                obj.crunchDist = 90;
                obj.crunchTop = obj.y;
                obj.crunchBottom = obj.y + obj.crunchDist;
                obj.crunchUpdate = BALL.gObject.crunch(obj.children[0], obj, 0.5, 1000, 400);
                obj.addUpdateFunc(obj.crunchUpdate);
                BALL.gObject.crunchMachinePos(obj, obj.children[0]);
            }    
        };
        this["g1-crunchmachine"] = {
            init: function(obj) {
                obj.body.loadPolygon("newbods2", obj.key);
                obj.body.static = true;
                obj.body.isFloor = true;
                obj.body.setMaterial(BALL.gameState.noBounceMaterial);
                obj.body.setCollisionGroup(BALL.gameState.dynamicGroup);
                obj.body.collides(BALL.gameState.wallrideGroup);
                obj.body.collides(BALL.gameState.ballGroup);
                obj.body.collides(BALL.gameState.dynamicGroup);
                console.log("\n\nOwner = ", obj.owner);
                console.log("CRUNCH MACHINE. x=" + obj.body.x + ", y=" + obj.body.y);
            }
        };
        
        this["chalk"] = {
            init: function(obj) {
                obj.body.loadPolygon("newbods2", obj.key);
                obj.body.static = true;
                obj.body.isFloor = true;
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
        //grassy mountains
        this["g1-brickwall"] = this["chalk"];
        this["g1-windmill"] = this["chalk"];
        this["g1-fan"] = {
            init: function(obj) {
                obj.body.loadPolygon("newbods2", obj.key);
                obj.body.static = true;
                obj.body.isFloor = true;
                obj.body.isAlwaysFloor = true;
                obj.body.setMaterial(BALL.gameState.noBounceMaterial);
                obj.body.setCollisionGroup(BALL.gameState.dynamicGroup);
                obj.body.collides(BALL.gameState.ballGroup, BALL.gameState.wallrideCallback, this);
                obj.body.collides(BALL.gameState.dynamicGroup);
                obj.body.collides(BALL.gameState.killGroup);
            }
        };
        
        this["default"] = {
            init: function(obj) {
                console.log("DEFAULT: " + obj.key);
                obj.body.loadPolygon("newbods2", obj.key);
                obj.body.static = true;
                obj.body.isFloor = true;
                obj.body.setMaterial(BALL.gameState.noBounceMaterial);
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