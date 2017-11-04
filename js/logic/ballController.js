BALL.bController = {
    NO_REPEAT: 0,
    REPEAT: -1,
    ball: null,
    funcs: [],
    jumpStart: 0,
    leftDown: false,
    rightDown: false,
    upHeld: false,
    
    addUpdateFunc: function(name, func, duration, args, finish) {
        console.log("ADD\nADD\nADD\nADD\nADD\nADD");
        if (this.ball.updateFuncs == null) {
            this.ball.updateFuncs = [];
        }
        var f = {};
        f.func = func;
        if (duration == null) {
            f.end = null;
        } else {
            f.end = game.time.now + duration;
        }
        f.args = args;
        f.finish = finish;
        f.name = name;
        
        this.funcs.push(f);
    },
    
    removeFunc: function(name) {
        for (var i in this.funcs) {
            if (this.funcs[i].name == name) {
                this.funcs[i].finish(this.ball, game.time.elapsed, this.funcs[i].args);
                this.funcs.splice(i, 1);
            } else {
            }
        }
    },
    
    update: function(elapsed) {
        if (BALL.input.LEFT.isDown) {
            BALL.bController.ball.body.angularVelocity-= BALL.gameState.ballSpeed * elapsed;
            BALL.bController.leftDown = true;
        } else {
            BALL.bController.leftDown = false;
        }
        if (BALL.input.RIGHT.isDown) {
            BALL.bController.ball.body.angularVelocity+= BALL.gameState.ballSpeed * elapsed;
            BALL.bController.rightDown = true;
        } else {
            BALL.bController.rightDown = false;
        }
        
        if (BALL.input.UP.isDown) {
            if (game.time.now - BALL.gameState.jumpTime < 400) {
                //BALL.bController.ball.body.velocity.y-= BALL.gameState.ballJump * (1400 / (game.time.now - BALL.gameState.jumpTime + 40)) * elapsed / 2500;
            }
        } else {
            if (BALL.bController.upHeld) {
                BALL.bController.upHeld = false;
            }
        }
        
        for (var i in this.funcs) {
            if (this.funcs[i].end < game.time.now) {
                this.funcs[i].remove = true;
            } else {
                this.funcs[i].func(this.ball, elapsed, this.funcs[i].args);
            }
        }
        
        for (var i in this.funcs) {
            if (this.funcs[i].remove) {
                if (this.funcs[i].finish != null) {
                    this.funcs[i].finish(this.ball, elapsed, this.funcs[i].args);
                }
                this.funcs.splice(i, 1);
            }
        }
        
    },
    
    
    
    
    jump: function() {
        if (BALL.gameState.jumpTime < game.time.now - BALL.gameState.jumpInterval && BALL.bController.ball.body.wallride == null && BALL.gameState.canJump) {
            console.log("normal jump");
            BALL.bController.ball.body.velocity.y-= BALL.gameState.ballJump;
            BALL.gameState.jumpTime = game.time.now;
            BALL.gameState.dubJump = true;
            BALL.gameState.canJump = false;
            BALL.bController.upHeld = true;
        } else if (BALL.bController.ball.body.wallride == null) {
            if (BALL.gameState.dubJump && BALL.gameState.jumpTime > game.time.now - BALL.gameState.dubJumpInt && BALL.gameState.jumpTime < game.time.now - 225) { //add var to bController to replace 225. lazy smh..
                BALL.bController.ball.body.velocity.y-= BALL.gameState.ballJump * 0.8;
                BALL.gameState.dubJump = false;
                BALL.bController.upHeld = true;
                BALL.gameState.jumpTime = game.time.now;
            }
        }
        if (BALL.bController.ball.body.wallride < 0 || BALL.bController.ball.body.wallride > 0) { //WALLJUMP
            console.log("wallride jump", BALL.bController);
            BALL.bController.ball.body.velocity.y-= BALL.gameState.ballJump;
            console.log(BALL.bController.ball.body.wallride);
            BALL.bController.upHeld = true;
            BALL.gameState.dubJump = true;
            /** why the hell did I put this here? Afraid to delete in case I'm being an idiot now, not then, and this actually does anything..
            if wallride < || > 0, and right or left is down, then it will walljump instantly and wallride will end. This will never be true when
            this jump() function is called. 
            if (BALL.bController.ball.body.wallride < 0) { //left wall, jump right
                if (BALL.input.RIGHT.isDown) {
                    BALL.bController.ball.body.velocity.x-= BALL.gameState.ballJump * BALL.bController.ball.body.wallride * 0.7;
                } else {
                    BALL.bController.ball.body.velocity.x-= BALL.gameState.ballJump * BALL.bController.ball.body.wallride * 0.2;
                }
            } else {
                if (BALL.input.LEFT.isDown) {
                    BALL.bController.ball.body.velocity.x-= BALL.gameState.ballJump * BALL.bController.ball.body.wallride * 0.7;
                } else {
                    BALL.bController.ball.body.velocity.x-= BALL.gameState.ballJump * BALL.bController.ball.body.wallride * 0.2;
                }
            }
            **/
            
            BALL.bController.ball.body.wallride = null;
            BALL.gameState.jumpTime = game.time.now;
            
            BALL.bController.removeFunc("wallride");
            BALL.bController.addUpdateFunc("wallJump", BALL.ballFuncs.wallJump, 200, BALL.bController.ball.body.angularVelocity * -0.75, null);
        }
    },
    
    moveLeft: function() {
        BALL.bController.ball.body.angularVelocity-= BALL.gameState.ballSpeed;
    },
    
    moveRight: function() {
        BALL.bController.ball.body.angularVelocity+= BALL.gameState.ballSpeed;
    },
    
    boopLeft: function() {
        if (BALL.bController.ball.body.wallride > 0) { //right wall, jump left
            BALL.bController.ball.body.velocity.x-= BALL.gameState.ballJump * BALL.bController.ball.body.wallride * 0.7;
            console.log("walljump-left");
            BALL.bController.ball.body.velocity.y-= BALL.gameState.ballJump * 0.5;
            BALL.bController.ball.body.wallride = null;

            BALL.bController.removeFunc("wallride");
            BALL.bController.addUpdateFunc("wallJump", BALL.ballFuncs.wallJump, 200, BALL.bController.ball.body.angularVelocity * -1, null);
        } else if (BALL.bController.ball.body.wallride < 0 && false) {
            BALL.bController.ball.body.angularVelocity-= BALL.gameState.boopSpeed * 1.5;
        } else {
            //BALL.bController.ball.body.angularVelocity-= BALL.gameState.boopSpeed;
            if (BALL.bController.upHeld && game.time.now - BALL.gameState.jumpTime < 500) {
                BALL.bController.ball.body.velocity.x-= BALL.gameState.ballJump;
                BALL.bController.ball.body.velocity.y-= BALL.gameState.ballJump * 0.2;
                BALL.bController.upHeld = false;
            }
        }
        
    },
    
    boopRight: function() {
    
        if (BALL.bController.ball.body.wallride < 0) { //left wall, jump right
            BALL.bController.ball.body.velocity.x-= BALL.gameState.ballJump * BALL.bController.ball.body.wallride * 0.7;
            console.log("walljump-right");
            BALL.bController.ball.body.velocity.y-= BALL.gameState.ballJump * 0.5;
            BALL.bController.ball.body.wallride = null;

            BALL.bController.removeFunc("wallride");
            BALL.bController.addUpdateFunc("wallJump", BALL.ballFuncs.wallJump, 200, BALL.bController.ball.body.angularVelocity * -1, null);
        } else if (BALL.bController.ball.body.wallride > 0 && false) {
            BALL.bController.ball.body.angularVelocity+= BALL.gameState.boopSpeed * 1.5;
        } else {
            //BALL.bController.ball.body.angularVelocity+= BALL.gameState.boopSpeed;
            if (BALL.bController.upHeld && game.time.now - BALL.gameState.jumpTime < 500) {
                BALL.bController.ball.body.velocity.x+= BALL.gameState.ballJump;
                BALL.bController.ball.body.velocity.y-= BALL.gameState.ballJump * 0.2;
                BALL.bController.upHeld = false;
            }
        }
    
    },
    
    jumpLeft: function() {
        if (game.time.now < BALL.gameState.jumpTime + BALL.gameState.sideJumpInterval && game.time.now > BALL.gameState.sideJumpTime + BALL.gameState.sideJumpInterval) {
            BALL.bController.ball.body.velocity.x-= BALL.gameState.ballJump;
            BALL.bController.ball.body.velocity.y-= BALL.gameState.ballJump * 0.2;
            BALL.gameState.sideJumpTime = game.time.now;
        }
    },
    
    jumpRight: function() {
        if (game.time.now < BALL.gameState.jumpTime + BALL.gameState.sideJumpInterval && game.time.now > BALL.gameState.sideJumpTime + BALL.gameState.sideJumpInterval) {
            BALL.bController.ball.body.velocity.x+= BALL.gameState.ballJump;
            BALL.bController.ball.body.velocity.y-= BALL.gameState.ballJump * 0.2;
            BALL.gameState.sideJumpTime = game.time.now;
        }
    },
    
    endContact: function(b1, b2) {
        if (BALL.play.ball.body.curWall != null) {
            console.log("WR-end contact, curWall not null");
        }
        if (b1 == BALL.play.ball.body.curWall || b2 == BALL.play.ball.body.curWall) {
            if (BALL.play.ball.y < BALL.play.ball.body.curWall.sprite.y - BALL.play.ball.body.curWall.sprite.width / 2 || BALL.play.ball.y > BALL.play.ball.body.curWall.sprite.y + BALL.play.ball.body.curWall.sprite.width / 2) {
                BALL.play.ball.body.curWall = null;
                BALL.play.ball.body.wallride = null;
                BALL.play.ball.body.wallrideTime = game.time.now + 150;
                BALL.bController.removeFunc("wallride");
            }
        }
    }
    
    
}

  //sadfwadfawd
BALL.ballFuncs = {
    wallride: function(ball, elapsed, args) {
        if (BALL.bController.ball.body.curWall != null && BALL.bController.ball.body.curWall.sprite.alive) {
            if (!(Math.abs(Math.abs(BALL.bController.ball.body.curWall.angle) - 90) < 8 || Math.abs(Math.abs(BALL.bController.ball.body.curWall.angle) - 270) < 8 || Math.abs(BALL.bController.ball.body.curWall.angle) < 8)) {
                BALL.play.ball.body.curWall = null;
                BALL.play.ball.body.wallride = null;
                BALL.play.ball.body.wallrideTime = game.time.now + 150;
                BALL.bController.removeFunc("wallride");
            } else {
                ball.body.velocity.x+= (elapsed * 1.5) * args;
                ball.body.wallride = args;
            }
        }
    },
    
    wallrideFinish: function(ball, elapsed, args) {
        if (BALL.bController.ball.body.curWall != null && BALL.bController.ball.body.curWall.sprite.alive) {
            console.log("wallride finish: ", BALL.bController);
            ball.body.velocity.x-= 150 * args;
            ball.body.wallride = null;
            ball.body.wallrideTime = game.time.now + 150;
            ball.body.curWall = null;
        }
    },
    
    wallJump: function(ball, elapsed, args) {
        ball.body.angularVelocity = args;
    }
}