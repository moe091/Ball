BALL.input = {
    downTime: 0,
    downX: 0,
    downY: 0,
    dX: 0,
    dY: 0,
    left: null,
    right: null,
    middle: null,
    
    
    inputDown: function(event) {
        if (BALL.gameState.touchDown == false) {
            BALL.gameState.downX = event.screenX;
            if (BALL.input.left.contains(event.x, event.y)) {
                this.ball.body.angularVelocity-= 20;
                console.log("SPIN");
            } else if (BALL.input.right.contains(event.x, event.y)) {
                console.log("RIGHT");
                this.ball.body.angularVelocity+= 20;
                
            } else if (BALL.input.middle.contains(event.x, event.y) && BALL.gameState.jumpTime < game.time.now - 1000) {
                //jump
                console.log("JUMP");
                this.ball.body.velocity.y-= 500;
                BALL.gameState.jumpTime = game.time.now;
            }
        }
        
        BALL.gameState.touchDown = true;
    },
    
    inputUp: function(pointer) {
        this.dX = pointer.screenX - this.downX;
        this.dY = pointer.screenY - this.downY;
        //console.log("UP: " + this.dX + ", " + this.dY);
        BALL.gameState.touchDown = false;
    },
    
    createRegions: function() {
        this.left = new Phaser.Rectangle(0, 0, game.width / 3, game.height);
        this.middle = new Phaser.Rectangle(game.width / 3, 0, game.width / 3, game.height);
        this.right = new Phaser.Rectangle((game.width / 3) * 2, 0, game.width / 3, game.height);
    }
}