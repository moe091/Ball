BALL = {};
BALL.preload = {
    preload: function() {
        
        //:::::::::::::::::::::::::================--- CURRENT ASSETS ---===============::::::::::::::::::::::::::::::\\
        //background
        //game.load.image("graybg", "assets/graphics/world1/background.png");
        
        
        //game.load.image("chalkbg", "assets/graphics/world1/chalkbg.png");
        
        //ball
        //game.load.image("ball", "assets/graphics/char-wheel.png");
        //game.load.image("ball_face", "assets/graphics/char-face.png");
        //game.load.image("bg", "assets/graphics/world2/bg.png");
        game.load.image("gbrick", "assets/graphics/world2/greenbrick.png");
        game.load.image("bg2", "assets/graphics/world2/bg2.png");
        //game.load.image("sky", "assets/graphics/world2/sky.png");
        //game.load.image("shipBG", "assets/graphics/world2/shipBG.png");
        
        game.load.image("chalkball", "assets/graphics/crappyball.png");
        game.load.image("char-inner", "assets/graphics/char-inner.png");
        game.load.image("char-outer", "assets/graphics/char-outer.png");
        //game.load.image("purpChar", "assets/graphics/purpchar.png");
    
        //normal plats
        //game.load.image("w1-plat1", "assets/graphics/world1/w1-plat1.png");
        
        
        game.load.image("chalkbig", "assets/graphics/world2/chalkbig.png");
        game.load.image("woodbig", "assets/graphics/world2/woodbig.png");
        game.load.image("chalksmall", "assets/graphics/world2/chalksmall.png");
        game.load.image("chalkbreak", "assets/graphics/world2/chalkbreak.png");
        game.load.image("staticball", "assets/graphics/world2/staticball.png");
        
        
        game.load.image("hanging-plank", "assets/graphics/world2/hanging-plank.png");
        game.load.image("rope", "assets/graphics/world2/rope.png");
        
        
        //game.load.image("w1-iceplat", "assets/graphics/world2/w1-iceplat.png");
        //game.load.image("w1-platbreak", "assets/graphics/world1/w1-platbreak.png");
        game.load.image("bigplat", "assets/graphics/world2/bigplat.png");
        //game.load.image("w1-branch", "assets/graphics/world1/w1-branch.png");
        
        //sprites
        game.load.image("overBtn", "assets/graphics/world2/overBtn.png");
        //game.load.image("tree1", "assets/graphics/world1/tree5.png");
        //game.load.image("tree2", "assets/graphics/world1/tree-plat.png");
        //game.load.image("w1-tree-plat", "assets/graphics/world1/w1-tree-plat.png");
        //game.load.image("shroom1", "assets/graphics/world1/shroom1.png");
        //game.load.image("shroom2", "assets/graphics/world1/shroom2.png");
        
        game.load.image("d01-boulder", "assets/graphics/world2/d01-boulder.png");
        game.load.image("d01-killboulder", "assets/graphics/world2/d01-killboulder.png");
        //special/obstacles
        //game.load.image("k01-dublaser", "assets/graphics/world2/k01-dublaser.png");
        game.load.image("k01-redline", "assets/graphics/world2/k01-redline.png");
        game.load.image("k01-rocket", "assets/graphics/world2/k01-rocket.png");
        game.load.image("k02-button", "assets/graphics/world2/k02-button.png");
        game.load.image("k03-trampoline", "assets/graphics/world2/k03-trampoline.png");
        
        game.load.image("s01-launcher", "assets/graphics/world2/s01-launcher.png");
        game.load.image("launcher-stop", "assets/graphics/world2/launcher-stop.png");
        
        game.load.spritesheet("k01-electricity", "assets/graphics/world2/k01-electricity.png", 260, 39);
        
        /**
        //:::::::::::::::::::::::::================---################---===============::::::::::::::::::::::::::::::\\
        game.load.image("plat", "assets/plat.png");
        game.load.image("bg", "assets/graphics/world1/bg_texture.png");
        game.load.image("bg2", "assets/graphics/world1/bg_buildings.png");
        
        //world1
        game.load.image("double-laser", "assets/graphics/world1/double-laser.png");
        game.load.image("w1-plat", "assets/graphics/world1/w1-plat.png");
        game.load.image("w1-plat_break", "assets/graphics/world1/w1-plat_break.png");
        game.load.image("w1-big_plat", "assets/graphics/world1/w1-big_plat.png");
        
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
        
        
        game.load.spritesheet("electricity", "assets/graphics/world1/electricity.png", 260, 40);
        **/
        
        
        game.load.physics("newbods", "assets/physics/newbods.json");
        game.load.physics("newbods2", "assets/physics/newbods2.json");
        
        game.load.json("level", "assets/levels/level.json");
        game.load.json("level2", "assets/levels/level2.json");
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
        
        button = game.add.button(game.world.centerX - 30, game.world.centerY - 30, 'chalkball', this.goFullScreen, this, 2, 1, 0);
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
        //game.scale.maxWidth = 800; 
        //game.scale.maxHeight = 480;
        game.state.start('play');
        
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;  
        if (game.scale.isFullScreen) {    
            game.scale.stopFullScreen();  
        } else {  
            game.scale.startFullScreen();     
        }
        
    }

};

