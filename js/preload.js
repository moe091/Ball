BALL = {};
BALL.preload = {
    preload: function() {
        game.load.image("ball", "assets/ball.png");
        game.load.image("plat", "assets/plat.png");
        game.load.image("bg", "assets/bg.png");
    },
        
    create: function() {
    /**
        this.goFullScreen();
    
        game.scaleMode = Phaser.ScaleManager.SHOW_ALL; //Align the center of the game with the center of the screen 
        game.scale.pageAlignHorizontally = true; 
        game.scale.pageAlignVertically = true; //Force landscape (optional of course) 
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
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;  
        if (game.scale.isFullScreen) {    
            game.scale.stopFullScreen();  
        } else {  
            game.scale.startFullScreen();     
        }
    }

};

