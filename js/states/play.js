BALL.play = {
    left: null, 
    
    preload: function() {
        
    },
    
    create: function() {
        
        
        game.world.setBounds(0, 0, 7860, 2500);
        game.time.advancedTiming = true;
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = 1650;
        game.physics.p2.friction = 42;
        game.physics.p2.restitution = 0.25;
        game.physics.p2.setImpactEvents(true);
        
        game.camera.scale.setTo(1);
        
        //this.bg = game.add.sprite(0, 0, "graybg")
        //this.bg.fixedToCamera = true;
        //this.bg.scale.x = 1.5;
        //this.bg.scale.y = 1.2;
        
        /**
        this.shroom1 = game.add.sprite(1600, 2500, "shroom1");
        this.shroom1.anchor.setTo(0.5, 1);
        this.shroom1.scale.setTo(2);
        
        this.shroom2 = game.add.sprite(3100, 2480, "shroom2");
        this.shroom2.anchor.setTo(0.5, 1);
        this.shroom2.scale.setTo(2);
        **/
        
        
        //this.bg2 = game.add.tileSprite(0, 0, 7860, 2500, "chalkbg");
        
        
        
        
        this.ball_face = game.add.sprite(0, 0, "ball_face");
        this.ball_face.anchor.setTo(0.5, 0.5);
        
        this.ball_back = game.add.sprite(0, 0, "ball");
        this.ball_back.anchor.setTo(0.5, 0.5);
        
        this.ball = game.add.sprite(1750, 1700, "");
        this.ball.anchor.setTo(0.5, 0.5);
        
        this.ball.addChild(this.ball_face);
        this.ball.addChild(this.ball_back);
        
        BALL.bController.ball = this.ball;
        
        
        
        game.physics.p2.enable(this.ball, false);
        this.ball.body.setCircle(32);
        //this.ball.body.gravity.y = 1000;
        
        
        this.ball_face.body.destroy();
        this.ball_back.body.destroy();
        
        BALL.gameState.ballMaterial = game.physics.p2.createMaterial('ballMat', this.ball.body);
        
        
        BALL.gameState.initGame();
        //BALL.editor.createEditor(game);
        /**
        this.tree1 = game.add.sprite(1600, 2105, "tree2");
        this.tree1.scale.setTo(1);
        this.tree1.anchor.y = 1;
        
        this.tree2 = game.add.sprite(4720, 1610, "tree1");
        this.tree2.scale.setTo(1);
        this.tree2.anchor.y = 1;
        **/
        
        BALL.input.createRegions();
        game.input.onDown.add(BALL.input.inputDown, this);
        game.input.onUp.add(BALL.input.inputUp, this);
        //game.camera.follow(this.ball);
        
        

        
        
        
        this.follow();
        game.camera.scale.setTo(0.5);
        
        
        //this.endGame();
    },
    
    follow: function() {
        game.camera.follow(this.ball);
    },
    
    endGame: function() {
        this.overBtn = game.add.button(290, 190, "overBtn", BALL.play.restartGame, this);    
        this.overBtn.fixedToCamera = true;
        this.overBtn.anchor.setTo(0.5);
    },
    
    restartGame: function() {
        console.log("CLICKED");
        BALL.gameState.killCallback(null, BALL.play.ball);
        this.overBtn.destroy();
    },
    
    update: function() {
        if (this.ball.y > 2450) {
            BALL.gameState.killCallback();
        }
        
        BALL.bController.update(game.time.elapsed);
        
        if (BALL.manager.editMode) {
            BALL.editor.update();
        } else {
            BALL.input.update(game.input.activePointer);
        }
        BALL.timer.update();
        
            
        
        //update BG POSITION:::
        //this.bg.cameraOffset.x = this.ball.x * -0.05;
        //this.bg.cameraOffset.y = this.ball.y * -0.05 - 20;
        
       // this.bg2.cameraOffset.x = this.ball.x * -0.16;
        //this.bg2.cameraOffset.y = this.ball.y * -0.15 + 188;
        
        //this.ball_face.x = this.ball.x + this.ball.body.velocity.destination[0];
        //this.ball_face.y = this.ball.y - this.ball.body.velocity.destination[1];
        /**
        this.shroom1.x = 1260 + (this.ball.x - 1750) * -0.075;
        this.shroom2.x = 4200 + (this.ball.x - 1750) * -0.075;
        this.shroom1.y = 2500 + (this.ball.y - 2072) * 0.2;
        this.shroom2.y = 2480 + (this.ball.y - 2072) * 0.2;
        **/
        
        
        this.ball_face.angle = (this.ball.body.angle * -1) - this.ball.body.angularVelocity;
        if (this.ball.body.angularVelocity > 35) {
            this.ball_face.angle+= 35;
        } else if (this.ball.body.angularVelocity < -35) {
            this.ball_face.angle -= 35;
        } else {
            this.ball_face.angle = (this.ball.body.angle * -1) - this.ball.body.angularVelocity;
            this.ball_face.angle+= this.ball.body.angularVelocity;
        }
        
        if (BALL.editor != null && BALL.editor.editMode) {
            //BALL.editor.update();
        }
        BALL.gameState.update();
        //game.debug.renderRectangle(floor,'#0fffff');
    },
    
    
    render: function() {
        BALL.input.left.x = game.camera.x;
        BALL.input.left.y = game.camera.y;
        BALL.input.right.x = game.camera.x + game.camera.width * 0.75;
        BALL.input.right.y = game.camera.y;
        
        this.game.debug.text(game.time.fps || '--', 20, 20);   
        //game.debug.geom(BALL.input.left, 'rgba(0, 0, 0, 0.05)');
        //game.debug.geom(BALL.input.right, 'rgba(0, 0, 0, 0.05)');
        
        //game.debug.cameraInfo(game.camera, 52, 132);
        //game.debug.text("device: " + window.innerWidth + ", " + window.innerHeight, 420, 32);
        //game.debug.text("ratio: " + window.devicePixelRatio, 420, 100);
        
        //game.debug.spriteCoords(this.ball, 50, 50);
        
    }
};






















