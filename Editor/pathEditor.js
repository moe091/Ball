BALL.pathEditor = {
    movePaths: [],
    curPath: null,
    curPoint: null,
    
    select: function(sprite) {
        //update everything when new sprite is selected  
        this.updateMovePathList(sprite);
        this.hidePathSprites();
    },
    
    //::::::::::::::::::::-- CREATE/DELETE OBJECTS --::::::::::::::::::::\\
    createPath: function(sprite, name) {
        //add to s.movePaths
        //update mPathSelect list
        //select this path in list
            //update path editor/points
        if (sprite != null) {
            if (!sprite.isPathSprite) {
                
                //CREATE new movepath
                if (this.curPath != null) { //if another path is selected, stop it before creating this one
                    this.curPath.stop();
                }
                if (sprite.movePaths == null) //if selected sprite doesn't have movePaths, add movePath array property to sprite
                    sprite.movePaths = [];

                //create movepath, add it to sprites movePath array and the pathEditors path list
                var mPath = new BALL.MovePath(sprite, name); 
                sprite.movePaths.push(mPath);
                this.movePaths.push(mPath);
                
                BALL.pathSelectEditor.updateMovePathList(sprite, sprite.movePaths.length -1);

            } else {
                alert("cannot add movepath to path sprite");
            }
        } else {
            alert("no sprite selected, cannot create path");
        }
        
    },
    
    updatePointPositions: function() {
        console.log("path = ", this.curPath);
        console.log("sprite = " + this.curPath.parent.x + "/" + this.curPath.parent.y);
        for (var i = 0; i < this.curPath.points.length; i++) {
            console.log(this.curPath.points[i]);
        }
    },
    
    createPoint: function() {
        //add to path.points
        //update points
        //select this point
        this.curPoint = new BALL.PathPoint(this.curPath.parent.x + 100, this.curPath.parent.y + 100, 2, this.curPath.parent.angle, this.curPath);
        this.curPath.addPoint(this.curPoint);
        BALL.movePathEditor.updatePathPointList();
    },
    
    
    deletePoint: function(point) {
        //remove from point.path
        //update pointList ui
    },
    
    selectPath: function(path) {
        //select path in mPathSelect
        //hide all pSprites
        //show path.pSprites
    },
    
    startPath: function() {
        this.curPath.stop();
        this.curPath.start();
    },
    
    stopPath: function() {
        this.curPath.stop();
    },
    
    
    

    
    
    //called by path edit module
    selectMovePath: function(sprite, path) {
        if (BALL.editor.getSelectedObj() != sprite) {
            console.warn("sprite doesn't = selected. sprite:", sprite);
            console.log("selected:", BALL.editor.getSelectedObj());
        }
        sprite.setPath(path);
        this.curPath = path;
        this.showPathSprites(); //CREATE THIS
        //this.showPathEditor(); TODO: BALL.editUI.show(BALL.movePathEditor, 3) - create movePathEditor first.
        BALL.editUI.showPanel(BALL.movePathEditor, 3);
        BALL.movePathEditor.setPath(this.curPath); //sets path and calls updatePathPointList
    },
 
    //::::::::::::::::::::--CHANGE DISPLAY--:::::::::::::::::::\\    
    showPathSprites: function() {
        this.hidePathSprites();
        this.curPath.showSprites();
    },
    
    hidePathSprites: function() {
        for (var i in this.movePaths) {
            this.movePaths[i].hideSprites();
        }
    },
    
    
    
    
    
    //::::::::::::::::::::--UPDATE UI ELEMENTS--:::::::::::::::::::\\
    //UPDATES-------
  
    
    //TODO - REMOVE - added to pathPointEditor module
    updatePathPointList: function() {
        $("#pathPointSelect").empty();
    
        for (var i in this.curPath.points) {
            $("#pathPointSelect").append("<option value=" + i + ">" + i + ". x:" + this.curPath.points[i].pSprite.x + "   -   y:" + this.curPath.points[i].pSprite.y  + "</option>");
        }
        
    },
    
    
    
    //SHOW-------
    showPathEditor: function() {
        $(".propEditDiv").hide();
        $("#pathEditDiv").show();
        BALL.editor.setEditor(this);
    },
    
    
}


















