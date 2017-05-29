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
        if (this.curPath != null) {
            this.curPath.stop();
        }
        if (sprite.movePaths == null)
            sprite.movePaths = [];
        
        
        var mPath = new BALL.MovePath(sprite, name);
        sprite.movePaths.push(mPath);
        this.movePaths.push(mPath);
        
        this.updateMovePathList(sprite, sprite.movePaths.length -1);
    },
    
    
    createPoint: function() {
        //add to path.points
        //update points
        //select this point
        this.curPoint = new BALL.PathPoint(this.curPath.parent.x + 100, this.curPath.parent.y + 100, 2, this.curPath.parent.angle, this.curPath);
        this.curPath.addPoint(this.curPoint);
        this.updatePathPointList();
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
    
    
    

    
    
    
    selectMovePath: function(path) {
        BALL.editor.getSelectedObj().setPath(path);
        this.curPath = path;
        this.showPathSprites(); //CREATE THIS
        this.showPathEditor();
        this.updatePathPointList();
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
    updateMovePathList: function(sprite, selID) {
        $("#mPathSelect").empty();
        console.log(sprite);
        console.log("updateMovePathlist");
        if (sprite.movePaths != null) {
            for (var i in sprite.movePaths) {
                $("#mPathSelect").append("<option value=" + i + ">" + i + ".................." + sprite.movePaths[i].name + "</option>");
            }   
            
            if (selID != null) {
                $("#mPathSelect").val(selID);
                console.log(selID, sprite.movePaths, sprite.movePaths[selID]);
                this.selectMovePath(sprite.movePaths[selID]);
            }
        } else {
            $("#mPathSelect").append("<option value=1>.........NO MOVEPATHS.........</option>");
            
            $(".propEditDiv").hide();
        }
        
    },
    
    
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


















