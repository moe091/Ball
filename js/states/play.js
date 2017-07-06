BALL.play = {
    left: null, 
    
    preload: function() {
        
    },
    
    create: function() {
        
            
        game.world.setBounds(0, 0, 8000, 4300);
        game.time.advancedTiming = true;
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = 900;
        game.physics.p2.friction = 42;
        game.physics.p2.restitution = 0.25;
        game.physics.p2.setImpactEvents(true);
        
        game.camera.scale.setTo(0.75);
        
        this.bg = game.add.tileSprite(0, 0, 8000, 4300, "graybg")
        //this.bg.fixedToCamera = true;
        this.bg.scale.setTo(1);
        
        //this.bg2 = game.add.tileSprite(0, 0, 256, 256, "bg2");
        //this.bg2.fixedToCamera = true;
        //this.bg2.scale.setTo(1);
        
        
        
        
        //BALL.timer.pushEvent("destroyParent", this.bg, 1600, false);
        
        
        this.ball_face = game.add.sprite(0, 0, "ball_face");
        this.ball_face.anchor.setTo(0.5, 0.5);
        
        this.ball_back = game.add.sprite(0, 0, "ball");
        this.ball_back.anchor.setTo(0.5, 0.5);
        
        this.ball = game.add.sprite(1750, 2000, "");
        this.ball.anchor.setTo(0.5, 0.5);
        
        this.ball.addChild(this.ball_face);
        this.ball.addChild(this.ball_back);
        
        var spriteMaterial = game.physics.p2.createMaterial('spriteMaterial');
        
        
        
        game.physics.p2.enable(this.ball, false);
        this.ball.body.setCircle(32);
        this.ball.body.gravity.y = 500;
        
        
        this.ball_face.body.destroy();
        this.ball_back.body.destroy();
        
        BALL.editor.createEditor(game);
        
        
        BALL.input.createRegions();
        
        game.input.onDown.add(BALL.input.inputDown, this);
        game.input.onUp.add(BALL.input.inputUp, this);
        
        game.input.onDown.add(BALL.editor.inputDown, this);
        game.input.onUp.add(BALL.editor.inputUp, this);
        //game.camera.follow(this.ball);
        
        
        this.follow();
        game.camera.scale.setTo(0.6);
        
        
        
    },
    
    follow: function() {
        game.camera.follow(this.ball);
    },
    
    update: function() {
        //console.log("main update - fps: " + game.time.fps);
        //console.log(game.time.fps);
        BALL.timer.update();
        //update BG POSITION:::
        //this.bg.cameraOffset.x = this.ball.x * -0.10;
        //this.bg.cameraOffset.y = this.ball.y * -0.15 + 45;
        
       // this.bg2.cameraOffset.x = this.ball.x * -0.16;
        //this.bg2.cameraOffset.y = this.ball.y * -0.15 + 188;
        
        //this.ball_face.x = this.ball.x + this.ball.body.velocity.destination[0];
        //this.ball_face.y = this.ball.y - this.ball.body.velocity.destination[1];
        this.ball_face.angle = (this.ball.body.angle * -1) - this.ball.body.angularVelocity;
        if (this.ball.body.angularVelocity > 35) {
            this.ball_face.angle+= 35;
        } else if (this.ball.body.angularVelocity < -35) {
            this.ball_face.angle -= 35;
        } else {
            this.ball_face.angle = (this.ball.body.angle * -1) - this.ball.body.angularVelocity;
            this.ball_face.angle+= this.ball.body.angularVelocity;
        }
        
        if (BALL.editor.editMode) {
            BALL.editor.update();
        }
        BALL.gameState.update();
    },
    
    
    render: function() {
        //game.debug.cameraInfo(game.camera, 52, 132);
        //game.debug.text("device: " + window.innerWidth + ", " + window.innerHeight, 420, 32);
        //game.debug.text("ratio: " + window.devicePixelRatio, 420, 100);
        
        //game.debug.spriteCoords(this.ball, 50, 50);
        
        //game.debug.text("downX: " + BALL.gameState.downX, 200, 100);
        //var x = 32;
        //var y = 0;
        //var yi = 32;
        
        //game.debug.text('Ball X: ' + this.ball.x, x, y += yi);
    }
};






















