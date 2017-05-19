//////////////////////////  SCROLLING EDITOR IMAGES \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

BALL.editor = {
    gObjs: [],
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
    
    createEditor: function() {
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
        console.log(this.gObjs[index]);
    }
}




