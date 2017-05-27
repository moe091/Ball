BALL.MovePath = function(parent, name) {
    this.name = name;
    this.parent = parent;
    this.pointSprites = game.add.group();
    this.points = [];
    this.points.push(new BALL.PathPoint(Math.round(parent.x), Math.round(parent.y), 3.5, 0, this)); //START/ORIGIN POINT
    this.points[0].origin = true;
    
    this.startX = parent.x;
    this.startY = parent.y;
    
    this.curPoint = null; //most recently visited point
    this.nextPoint = null; //point that parent is moving towards
    this.curIndex = 0; //index of curPoint
    this.nextIndex = 0;
    
    this.dX = 0; //x movement speed, calculated each time a new point is reached
    this.dY = 0; // ^
    
    this.active = false;
    this.repeating = true;
    
    this.finishCallback = function() { console.log("FINISHED MOVEPATH"); console.log(this); };
    
    
    BALL.gameState.movePaths.push(this);
    
    console.log("created Path: ", this);
    parent.curPath = this;
    parent.addUpdateFunc(function() { console.log("wrong update dude"); if (this.curPath != null) this.curPath.update(); });
    console.log(parent.updateFuncs);
    this.start();
}

BALL.MovePath.prototype.start = function() {
    if (this.points.length >= 2) {
        for (var p in this.points) {
            this.points[p].update();
        }
        this.curPoint = this.points[0];
        this.nextPoint = this.points[1];
        this.curIndex = 0;
        this.nextIndex = 1;
        this.updateVelocity();
        this.active = true;
    } else {
        console.warn("TRYING TO START MOVEPATH WITH LESS THAN 2 POINTS");
    }
}

BALL.MovePath.prototype.update = function() {
    //parent.move(dx, dy);
    //parent.angle = this.getAngle();
    console.log("updating. active =", this.active);
    if (this.active) {
        //console.log("body: ", this.parent.body.x, this.parent.body.y);
        //console.log("sprite: ", this.parent.x, this.parent.y);
        this.parent.body.x+= this.dX;
        this.parent.body.y+= this.dY;
        //check if parent has reached next point. if so call endPoint
        if (Math.abs(this.nextPoint.x - this.curPoint.x) > Math.abs(this.nextPoint.y - this.curPoint.y)) {
            if ((this.dX > 0 && this.parent.x > this.nextPoint.x) || (this.dX < 0 && this.parent.x < this.nextPoint.x)) {
                this.endPoint();
            } 
        } else {
            if ((this.dY > 0 && this.parent.y > this.nextPoint.y) || (this.dY < 0 && this.parent.y < this.nextPoint.y)) {
                this.endPoint();
            }
        }
    }
    
    //check if parent has reached/passed nextPoint
        //if so this.endPoint
            //> nextPoint checks if finished
                //if finished call finishPath()
                    //finishPath checks if repeating, if not it sets active to false. also calls finish CB's
                //if still active, updates cur/nextPoint
                //then calls updateVelocities

}

BALL.MovePath.prototype.finishPath = function() {
    if (!this.repeating) {
        this.active = false;
    }
     this.finishCallback();
}

BALL.MovePath.prototype.endPoint = function() {
    if (this.nextPoint == 0) { //check if path has finished
        this.finishPath(); //sets active to false if repeat is not true
    }
    
    if (this.active) {
        this.curPoint = this.nextPoint;
        this.curIndex = this.nextIndex;
        
        this.nextIndex++;
        if (this.nextIndex >= this.points.length) {
            this.nextIndex = 0;
        }
        this.nextPoint = this.points[this.nextIndex];
        //aTan(y/x) = angle
        //cos(aTan) = x/speed
        //cos(atan) * speed = x
        this.updateVelocity();
    }
}
BALL.MovePath.prototype.updateVelocity = function() {
    this.dX = Math.cos(Math.atan2(this.nextPoint.y - this.curPoint.y, this.nextPoint.x - this.curPoint.x)) * this.curPoint.speed;
    this.dY = Math.sin(Math.atan2(this.nextPoint.y - this.curPoint.y, this.nextPoint.x - this.curPoint.x)) * this.curPoint.speed;
    console.log("DX:", this.dX, "    DY:", this.dY);
}

BALL.MovePath.prototype.getAngle = function() {
    if (Math.abs(this.nextPoint.x - this.curPoint.x) > Math.abs(this.nextPoint.y - this.curPoint.y)) {
        this.curPoint.angle + (this.nextPoint.angle - this.curPoint.angle) * ((this.parent.x - this.curPoint.x) / (this.nextPoint.x - this.curPoint.x));
    } else {
        this.curPoint.angle + (this.nextPoint.angle - this.curPoint.angle) * ((this.parent.y - this.curPoint.y) / (this.nextPoint.y - this.curPoint.y));
    }
    
}




//::::::::::::::::::::::::::::::--- PATH CREATION/CONFIGURATION --:::::::::::::::::::::::::::::::::\\
BALL.MovePath.prototype.addPoint = function(point) {
    this.points.push(point);
}




BALL.MovePath.prototype.showSprites = function() {
    for (var p in this.points) {
        if (this.points[p].origin == false) {
            this.points[p].pSprite.visible = true;
        }
    }
}
BALL.MovePath.prototype.hideSprites = function() {
    for (var p in this.points) {
        this.points[p].pSprite.visible = false;
    }
}



BALL.PathPoint = function(x, y, speed, angle, path) {
    if (BALL.gameState.pointSprites == null) {
        BALL.gameState.pointSprites = game.add.group();
    }
    this.path = path;
    this.origin = false;
    this.pSprite = BALL.gameState.pointSprites.create(x, y, path.parent.key);
    this.pSprite.anchor.setTo(0.5);
    this.pSprite.alpha = 0.5;
    
    this.pSprite.inputEnabled = true;
    this.pSprite.input.useHandCursor = true;
    this.pSprite.input.enableDrag(true);
    this.pSprite.events.onInputDown.add(BALL.editFuncs.clickPathSprite, this);
    this.pSprite.events.onInputOver.add(BALL.editor.spriteHover, this);
    this.pSprite.events.onInputOut.add(BALL.editor.spriteUnhover, this);
    

    
    this.x = Math.round(x);
    this.y = Math.round(y);
    this.angle = angle;
    this.speed = speed; 
    console.log("added point: ", this);
    
    this.update = function() {
        if (this.origin) {
            this.x = Math.round(this.path.startX);
            this.y = Math.round(this.path.startY);
        } else {
            this.x = this.pSprite.x;
            this.y = this.pSprite.y;
        }
        console.log("update point:", this.x, this.y);
    }
}