BALL.editFuncs = {
    
    
    createPoint(path) {
        var point = new BALL.PathPoint(path.parent.x + 100, path.parent.y + 100, 2, path.parent.angle, path);
        console.log('created point:', point);
        console.log(path);
        path.addPoint(point);
        BALL.editorUI.updatePathPointList(path);
        
    },
    
    
    
    
    clickPathSprite: function(sprite) {
        BALL.editor.selected = sprite;
        BALL.editor.pathSpriteSelected = true;
        console.log(sprite);
        BALL.editorUI.selectPathSprite(sprite);
    }
}