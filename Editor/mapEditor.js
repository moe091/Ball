//////////////////////////  SCROLLING EDITOR IMAGES \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

BALL.editor = {
    game: null,
    gObjs: [],
    curObj: null,
    objI: -1,
    sprites: null,
        //gObjs
    
    populategObjs: function() {
        this.gObjs.push("p1_angle");
        this.gObjs.push("p1_corner");
        this.gObjs.push("p1_edge");
        this.gObjs.push("p1_flat");
        this.gObjs.push("p1_ramp");
        this.gObjs.push("wall_hor");
        this.gObjs.push("wall_vert");
    },
    
    createEditor: function(g) {
        this.game = g;
        this.sprites = this.game.add.group();
        
        this.populategObjs();
        for (var i in this.gObjs) {
            console.log(this.gObjs[i]);
            $("#imgsDiv1").append("<div id='imgDiv-" + i + "' class='editorImg'><img src='assets/plats/" + this.gObjs[i] + ".png' id='edImg-" + i + "'></div>");
            $("#imgDiv-" + i).click({index: Number(i)}, function(event) {
                BALL.editor.clickObject(event.data.index);
            });
        }
    },
    
    clickObject: function(index) {
        this.objI = index;
        this.curObj = this.gObjs[index];
        console.log(this.curObj);
        for (var i in this.gObjs) {
            $("#imgDiv-" + i).css("border-color", "#000");
        }
        
        $("#imgDiv-" + index).css("border-color", "#FFF");
        
    },
    
    inputDown: function(pointer) {
        console.log("DOWN");
        console.log(pointer);
        if (this.isDown) {
            this.isDown = true;
            console.log("already down");
        } else {
            if (BALL.editor.curObj != null) {
                console.log(BALL.editor.sprites);
                BALL.editor.sprites.create(pointer.x, pointer.y, BALL.editor.curObj);
                console.log("made a sprite");
            } else {
                console.log("EDITOR - NO OBJECT SELECTED");
                console.log(this.curObj);
            }
        }  
    },
    
    inputUp: function(pointer) {
        
    }
}




