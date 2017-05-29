BALL.play = {
    left: null, 
    
    preload: function() {
        
    },
    
    create: function() {
        
            
        game.world.setBounds(0, 0, 3200, 2200);
        game.time.advancedTiming = true;
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = 900;
        game.physics.p2.friction = 12;
        game.physics.p2.restitution = 0.5;
        game.physics.p2.setImpactEvents(true);
        
        game.camera.scale.setTo(0.75);
        
        game.add.sprite(0, 0, "bg").scale.setTo(4);
        
        BALL.editor.createEditor(game);
        
        this.ball = game.add.sprite(100, 100, "ball");
        this.ball.anchor.setTo(0.5, 0.5);
        
        var spriteMaterial = game.physics.p2.createMaterial('spriteMaterial');
        
        
        this.plats = game.add.group();
        //this.plats.create(150, 400, "plat");
        //this.plats.create(268, 449, "plat");
        //this.plats.create(1210, 300, "plat");
        //this.plats.create(0, 700, "plat");
        this.plats.create(128, 2200, "plat");
        this.plats.create(512, 2200, "plat");
        this.plats.create(640, 2200, "plat");
        this.plats.create(768, 2200, "plat");
        this.plats.create(896, 2200, "plat");
        this.plats.create(1024, 2200, "plat");
        this.plats.create(1152, 2200, "plat");
        this.plats.create(1280, 2200, "plat");
        this.plats.create(1408, 2200, "plat");
        this.plats.create(1536, 2200, "plat");
        this.plats.create(1664, 2200, "plat");
        this.plats.create(1792, 2200, "plat");
        this.plats.create(1920, 2200, "plat");
        
        for (var i in this.plats.children) {
            game.physics.p2.enable(this.plats.children[i], false);
            
            this.plats.children[i].anchor.setTo(0.5);
            this.plats.children[i].body.setRectangle(128, 12, 0, -2);
            this.plats.children[i].body.static = true;
        }
        game.physics.p2.enable(this.ball, false);
        this.ball.body.setCircle(29);
        this.ball.body.gravity.y = 500;
        
        
        
        BALL.input.createRegions();
        
        game.input.onDown.add(BALL.input.inputDown, this);
        game.input.onUp.add(BALL.input.inputUp, this);
        
        game.input.onDown.add(BALL.editor.inputDown, this);
        game.input.onUp.add(BALL.editor.inputUp, this);
        //game.camera.follow(this.ball);
        
        
        this.follow();
    },
    
    follow: function() {
        game.camera.follow(this.ball);
    },
    
    update: function() {
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






















