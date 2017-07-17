//NOTE / TODO: Cursor keys for gameplay(spin left/right, jump) call an event in BALL.editor. Obviously this is dumb, #REMEMBER to fix this before amputating the editor and making real game.

BALL.input = {
    downTime: 0,
    downX: 0,
    downY: 0,
    dX: 0,
    dY: 0,
    left: null,
    right: null,
    middle: null,
    
    
    inputDown: function(event) {
        if (!BALL.editor.editMode) {
            if (BALL.gameState.touchDown == false) {
                BALL.gameState.downX = event.screenX;
                if (BALL.input.left.contains(event.x + game.camera.x, event.y + game.camera.y)) {
                    this.ball.body.angularVelocity-= 12;
                } else if (BALL.input.right.contains(event.x + game.camera.x, event.y + game.camera.y)) {
                    this.ball.body.angularVelocity+= 12;

                } else if (BALL.input.middle.contains(event.x, event.y) && BALL.gameState.jumpTime < game.time.now - 1000) {
                    //jump
                    //NOTE / TODO: just make a jump function already. also spinLeft/spinRight functions. In fact just make a characterController type object.
                    this.ball.body.velocity.y-= 850;
                    BALL.gameState.jumpTime = game.time.now;
                }
            }
        }
        
        BALL.gameState.touchDown = true;
    },
    
    inputUp: function(pointer) {
        this.dX = pointer.screenX - this.downX;
        this.dY = pointer.screenY - this.downY;
        BALL.gameState.touchDown = false;
    },
    
    createRegions: function() {
        this.left = new Phaser.Rectangle(0, 0, game.width / 4, game.height);
        this.middle = new Phaser.Rectangle(game.width / 4, 0, game.width / 2, game.height);
        this.right = new Phaser.Rectangle((game.width / 4) * 3, 0, game.width / 4, game.height);
        
        this.m = game.input.keyboard.addKey(Phaser.Keyboard.M);
        this.n = game.input.keyboard.addKey(Phaser.Keyboard.N);
        
        this.t = game.input.keyboard.addKey(Phaser.Keyboard.T);
        this.g = game.input.keyboard.addKey(Phaser.Keyboard.G);
        
        this.shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        this.W = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.A = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.S = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.D = game.input.keyboard.addKey(Phaser.Keyboard.D);
        
        this.UP = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.LEFT = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.RIGHT = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.DOWN = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        
        this.tab = game.input.keyboard.addKey(Phaser.Keyboard.TAB); //click/drag to scroll
        
        this.f = game.input.keyboard.addKey(Phaser.Keyboard.F); //flip object horizontally
        this.f_down = false; //keepy track of if f was pressed down already
        
        this.createBindings();
    },
    
    createBindings: function() {
        //editMode on/off
        this.m.onDown.add(BALL.editor.enterEditMode, this);
        this.n.onDown.add(BALL.editor.exitEditMode, this);
        
        //NOTE: these functions(BALL.editor.selectedUp/Left/Right) also control ball character when BALL.editor.editMode == false. Obviously have to fix this before release/when separating editor from actual game.
        //FIX::::::::::::::::::::::::::::::
        this.UP.onDown.add(BALL.editor.selectedUp, this);
        this.LEFT.onDown.add(BALL.editor.selectedLeft, this);
        this.DOWN.onDown.add(BALL.editor.selectedDown, this);
        this.RIGHT.onDown.add(BALL.editor.selectedRight, this);
    }
}


















