BALL.effects = {
    cur: null,
    recycleRocket: null,

    launcherShot: function(parent, args) {
        console.log("CREATING LAUNCHERSHOT FUNC", parent);
        return function() {
            BALL.effects.recycleRocket = null;
            for (var i in parent.rockets) {
                if (parent.rockets[i].dead) {
                    BALL.effects.recycleRocket = parent.rockets[i];
                    break;
                }
            }
            
            if (BALL.effects.recycleRocket == null) {
                console.log(this);
                console.log("\n\n\n\n\nMAKING NEW LAUNCHER SHOT---------------------------------", parent.position, args);
                
                //multiply starting x-position by scale.x of launcher, takes care of spawning rockets from flipped launchers automatically.
                
                //hypotenuse = 120. cos(parent.rotation) = dY/120. cos(rot) * 120
                //sin(rot) = dX/120. sin(rot) * 120 = dX
                console.log("rotation: " + parent.rotation);
                BALL.effects.cur = BALL.gameState.special.create(parent.x + ((Math.cos(parent.rotation) * 54)), parent.y + ((Math.sin(parent.rotation) * 54)), "k01-rocket");
                BALL.effects.cur.anchor.setTo(0.5);

                game.physics.p2.enable(BALL.effects.cur, false);
                BALL.effects.cur.body.clearShapes();
                BALL.effects.cur.body.loadPolygon("newbods2", "k01-rocket");
                
                BALL.effects.cur.body.rotation = parent.rotation;
                if (parent.scale.x < 0) { 
                    //since rocket has vertical symetry, I can rotate it 180 degrees instead of flipping the sprite and needing to use a different physics body
                    BALL.effects.cur.body.angle = 180;
                }

                BALL.effects.cur.body.setCollisionGroup(BALL.gameState.killGroup);
                BALL.effects.cur.body.collides(BALL.gameState.ballGroup, BALL.gameState.killCallback, this);
                BALL.effects.cur.body.collides(BALL.gameState.wallrideGroup, BALL.effects.killRocket, this);
                BALL.effects.cur.body.collides(BALL.gameState.dynamicGroup, BALL.effects.killRocket, this);

                BALL.effects.cur.body.data.gravityScale = 0;
                BALL.effects.cur.body.mass = 0.02;
                BALL.effects.cur.body.data.damping = 0;
                //multiply by parent scale.x, automatically takes care of velocity for rockets shot from flipped launchers
                BALL.effects.cur.body.velocity.x = 220 * Math.cos(parent.rotation);
                BALL.effects.cur.body.velocity.y = 220 * Math.sin(parent.rotation);
                BALL.effects.cur.body.parent = parent;
                BALL.effects.cur.body.dead = false;

                if (parent.rockets == null)
                    parent.rockets = [];

                parent.rockets.push(BALL.effects.cur.body);
                console.log(BALL.effects.cur.body);
            } else {
                console.log("\n\n\n\n\nRECYCLE ROCKET: ", BALL.effects.recycleRocket);
                BALL.effects.recycleRocket.dead = false;
                BALL.effects.recycleRocket.x = parent.x + ((Math.cos(parent.rotation) * 54))
                BALL.effects.recycleRocket.y = parent.y + ((Math.sin(parent.rotation) * 54));
                BALL.effects.recycleRocket.velocity.x = 220 * Math.cos(parent.rotation);
                BALL.effects.recycleRocket.velocity.y = 220 * Math.sin(parent.rotation);
                BALL.effects.recycleRocket.angularVelocity = 0;
                BALL.effects.recycleRocket.rotation = parent.rotation;
            }
        }
    },
    
    killRocket: function(rocket, wall) {
        rocket.dead = true;
        rocket.velocity.x = 0;
        rocket.x = -1000;
    }
}