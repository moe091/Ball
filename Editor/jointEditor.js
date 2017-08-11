BALL.jointEditor = {
    selecting: false,
    s1: null,
    s2: null,
    step: 0,
    x1: null,
    y1: null,
    x2: null,
    y2: null,
    click1: [],
    click2: [],
    revJoints: [],
    
    newJoint: function(sprite) {
        if (sprite != null) {
            this.s1 = sprite;
            this.selecting = true;
            BALL.editor.targetSelect = this;
            this.step = 1;
            $("#dConstraintBtn").html("SELECT Sprite #2");
            $("#dConstraintBtn").css("background-color", "#828282");
            $("#dConstraintBtn").css("color", "#FFFFFF");
        } else {
            console.log("SELECT SPRITE BEFORE ADDING CONSTRAINT");
        }
        
    },
    
    
    selectTarget: function(sprite, x, y) {
        if (this.step == 1) {
            this.s2 = sprite;
            $("#dConstraintBtn").html("Select sprite#1 Anchor Point");
            BALL.editor.targetSelect = this;
            this.step = 2;
        } else if (this.step == 2) {
            if (this.s1 != null) {
                console.log("x:" + (this.s1.x - (game.input.worldX / game.camera.scale.x)) + ", y:" + (this.s1.y - (game.input.worldY / game.camera.scale.y)));
                this.x1 = (game.input.worldX / game.camera.scale.x) - this.s1.x;
                this.y1 = (game.input.worldY / game.camera.scale.y) - this.s1.y;
                this.click1[0] = (game.input.worldX / game.camera.scale.x);
                this.click1[1] = (game.input.worldY / game.camera.scale.y);
                
                console.log(BALL.play.ball.body.x + ", " + BALL.play.ball.body.y);
                console.log("sprite: " + this.s1.x + ", " + this.s1.y);
                console.log("offset: " + this.x1 + ", " + this.y1);
                //game.physics.p2.createDistanceConstraint(this.s1, sprite, 2, [this.s1.x - (game.input.worldX / game.camera.scale.x), this.s1.y - (game.input.worldY / game.input.scale.y)], [sprite.x - (game.input.worldX / game.camera.scale.x), sprite.y - (game.input.worldY / game.input.scale.y)]);
                this.step = 3;
                BALL.editor.targetSelect = this;
                $("#dConstraintBtn").html("Select sprite#2 Anchor Point");
            }
        } else if (this.step == 3) {
            this.x2 = (game.input.worldX / game.camera.scale.x) - this.s2.x;
            this.y2 = (game.input.worldY / game.camera.scale.y) - this.s2.y;
            
            this.click2[0] = (game.input.worldX / game.camera.scale.x);
            this.click2[1] = (game.input.worldY / game.camera.scale.y);
            
            var dist = Math.sqrt((this.click2[0] - this.click1[0]) * (this.click2[0] - this.click1[0]) + (this.click2[1] - this.click1[1]) * (this.click2[1] - this.click1[1]));
            //game.physics.p2.createDistanceConstraint(this.s1, this.s2, dist, [this.x1, this.y1], [this.x2, this.y2]);
            var power = Number(prompt("Enter Constraint Strength:"));
            game.physics.p2.createRevoluteConstraint(this.s1, [0, 0], this.s2, [0, 0], power);
            BALL.jointEditor.revJoints.push({
                type: 1,
                id1: this.s1.ID, 
                id2: this.s2.ID, 
                pos1: [0, 0],
                pos2: [0, 0],
                pow: power,
            });
            this.selecting = false;
            console.log("DIST: " + dist);
            console.log("DIST: " + dist);
            console.log("DIST: " + dist);
            console.log("DIST: " + dist);
            console.log("DIST: " + dist);
            console.log("DIST: " + dist);
            
            $("#dConstraintBtn").html("add Constraint");
            this.selecting = false;
            BALL.editor.targetSelect = null;
            this.step = 0;
        }
    }
}