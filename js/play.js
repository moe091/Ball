BALL.play = {
    left: null, 
    
    preload: function() {
        
    },
    
    create: function() {
        game.world.setBounds(0, 0, 1200, 800);
        game.time.advancedTiming = true;
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = 900;
        game.physics.p2.friction = 12;
        game.physics.p2.restitution = 0.5;
        
        game.add.sprite(-400, -300, "bg");
        this.ball = game.add.sprite(200, 1, "ball");
        this.ball.anchor.setTo(0.5, 0.5);
        
        var spriteMaterial = game.physics.p2.createMaterial('spriteMaterial');
        
        
        this.plats = game.add.group();
        this.plats.create(150, 400, "plat");
        this.plats.create(268, 449, "plat");
        this.plats.create(1210, 300, "plat");
        this.plats.create(0, 700, "plat");
        this.plats.create(128, 600, "plat");
        this.plats.create(512, 600, "plat");
        this.plats.create(640, 600, "plat");
        this.plats.create(768, 600, "plat");
        this.plats.create(896, 600, "plat");
        this.plats.create(1024, 600, "plat");
        this.plats.create(1152, 600, "plat");
        this.plats.create(1280, 600, "plat");
        this.plats.create(1408, 600, "plat");
        
        for (var i in this.plats.children) {
            game.physics.p2.enable(this.plats.children[i], false);
            
            this.plats.children[i].anchor.setTo(0.5);
            this.plats.children[i].body.setRectangle(128, 12, 0, -2);
            this.plats.children[i].body.static = true;
        }
        game.physics.p2.enable(this.ball, false);
        this.ball.body.setCircle(29);
        this.ball.body.gravity.y = 500;
        
        this.plats.children[1].body.rotation = Math.PI / 8;
        this.plats.children[0].body.rotation = Math.PI / 8;
        
        
        BALL.input.createRegions();
        
        game.input.onDown.add(BALL.input.inputDown, this);
        game.input.onUp.add(BALL.input.inputUp, this);
        
        //game.camera.follow(this.ball);
    },
    
    update: function() {
        game.camera.focusOnXY(this.ball.x, this.ball.y);
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






















