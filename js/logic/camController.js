BALL.camController = {
    
    camScale: 0.5,
    scaleFactor: 25,

    
    
    moveCamera: function(x, y) {
        game.camera.x+= x;
        game.camera.y+= y;
    },
    
    scaleCamera: function() { //move to camcontroller
        //CAMERA SCALING
        var lastX = game.camera.x;
        var lastY = game.camera.y;
        if (BALL.input.t.isDown) {
            this.camScale += 0.01;
            console.log(game.camera.scale.x);
        }
        if (BALL.input.g.isDown && this.camScale > 0.25) {
            this.camScale -= 0.01;
            console.log(game.camera.scale.x);
        }
        if (this.camScale < 0.25)
            this.camScale = 0.25;
        
        game.camera.scale.setTo(this.camScale);
        
        this.scaleFactor = this.camScale * 100;
        
        if (BALL.input.t.isDown) {
            game.camera.x = lastX + ((1 / this.scaleFactor) * game.camera.x + game.camera.view.width / 100);
            game.camera.y = lastY + ((1 / this.scaleFactor) * game.camera.y + game.camera.view.height / 100);
        }
        if (BALL.input.g.isDown && this.camScale > 0.25) {
            game.camera.x = lastX - ((1 / (this.scaleFactor)) * game.camera.x + game.camera.view.width / 100);
            game.camera.y = lastY - ((1 / this.scaleFactor) * game.camera.y + game.camera.view.height / 100);
        }
    },
    
    
}