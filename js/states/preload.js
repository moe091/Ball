BALL = {};
BALL.preload = {
    preload: function() {
        game.load.image("ball", "assets/graphics/char-wheel.png");
        game.load.image("ball_face", "assets/graphics/char-face.png");
        game.load.image("plat", "assets/plat.png");
        game.load.image("bg", "assets/graphics/world1/world1_bg.png");
        
        //world1
        game.load.image("nb-dub_laser", "assets/graphics/world1/double-laser.png");
        game.load.image("w1-plat", "assets/graphics/world1/w1-plat.png");
        
        //real assets
        game.load.image("alien", "assets/balls/alien_ball.png");
        game.load.image("alien_shading", "assets/balls/alien_shading.png");
        
        //plats
        game.load.image("p1_angle", "assets/plats/p1_angle.png");
        game.load.image("p1_angle-f", "assets/plats/p1_angle-f.png");
        game.load.image("p1_corner", "assets/plats/p1_corner.png");
        game.load.image("p1_edge", "assets/plats/p1_edge.png");
        game.load.image("p1_flat", "assets/plats/p1_flat.png");
        game.load.image("p1_ramp", "assets/plats/p1_ramp.png");
        game.load.image("p1_ramp-f", "assets/plats/p1_ramp-f.png");
        game.load.image("wall_hor", "assets/plats/wall_hor.png");
        game.load.image("wall_vert", "assets/plats/wall_vert.png");
        
        game.load.spritesheet("electricity", "assets/plats/electricity.png", 130, 20);
        
        game.load.physics("plat_bodies", "assets/physics/plat_bodies.json");
    },
        
    create: function() {
    /**
        this.goFullScreen();
    
        game.scaleMode = Phaser.ScaleManager.SHOW_ALL; //Align the center of the game with the center of the screen 
        game.scale.pageAlignHorizontally = true; 
        game.scale.pageAlignVertically = true; //Force landscape 
        game.scale.forceLandscape = true; //Make the game scale! 
        game.scale.setShowAll(); 
        game.scale.refresh(); //In case you want limitations to your scaling! 
        game.scale.minWidth = 400; 
        game.scale.minHeight = 220; 
        game.scale.maxWidth = 2200; 
        game.scale.maxHeight = 1500;
        game.state.start('play');
        **/
        
        button = game.add.button(game.world.centerX - 30, game.world.centerY - 30, 'ball', this.goFullScreen, this, 2, 1, 0);
    },
    
    goFullScreen: function() {  
        game.scaleMode = Phaser.ScaleManager.SHOW_ALL; //Align the center of the game with the center of the screen 
        game.scale.pageAlignHorizontally = false; 
        game.scale.pageAlignVertically = true; //Force landscape (optional of course) 
        game.scale.forceLandscape = true; //Make the game scale! 
        game.scale.setShowAll(); 
        game.scale.refresh(); //In case you want limitations to your scaling! 
        game.scale.minWidth = 400; 
        game.scale.minHeight = 220; 
        game.scale.maxWidth = 800; 
        game.scale.maxHeight = 480;
        game.state.start('play');
        /**
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;  
        if (game.scale.isFullScreen) {    
            game.scale.stopFullScreen();  
        } else {  
            game.scale.startFullScreen();     
        }
        **/
    }

};

