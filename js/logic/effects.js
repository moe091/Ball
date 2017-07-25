BALL.effects = {
    cur: null,


    launcherShot: function(parent, args) {
        console.log("CREATING LAUNCHERSHOT FUNC");
        return function() {
            console.log(this);
            console.log("LAUNCHER: ", parent, args);

            BALL.effects.cur = BALL.gameState.special.create(parent.x + 150, parent.y, "k01-rocket");
            BALL.effects.cur.anchor.setTo(0.5);

            game.physics.p2.enable(BALL.effects.cur, false);
            BALL.effects.cur.body.clearShapes();
            BALL.effects.cur.body.loadPolygon("newbods", "k01-rocket");

            BALL.effects.cur.body.createBodyCallback(BALL.play.ball, BALL.gameState.killCallback, this);
            
            BALL.effects.cur.body.kinematic = true;
            BALL.effects.cur.body.velocity.x = 400;
        }
    }
}