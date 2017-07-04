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
    if (this.updateFuncs != null) {;
        for (var i in this.updateFuncs) {
            //console.log("sprite update context:");
            //console.log(this);
            //this.updateFuncs[i]();
            this.updateFuncs[i].call(this);
        }
    }
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