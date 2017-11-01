

BALL.movePathEditor = (function() {
    var ed = {};
    var sprite = "sprite not set yet";
    var path = "no path set yet";
    ed.init = function(editor) {
        ed.editor = editor;
        ed.panel = $("#pathPointEditor");
        
        ed.createPointBtn = $("#createPointBtn");
        ed.pathPointSelect = $("#pathPointSelect");
        ed.deletePointBtn = $("#deletePointBtn");
        ed.editPointBtn = $("#editPointBtn");
        ed.startPathBtn = $("#startPathBtn");
        ed.stopPathBtn = $("#stopPathBtn");
        
        
        ed.createPointBtn.click(ed.createPoint);
    }
    
    ed.setPath = function(p) {
        path = p;
        BALL.pathEditor.curPath = p;
        ed.updatePathPointList();
    }
    
    ed.updatePathPointList = function() {
        ed.pathPointSelect.empty();
        
        for(var i in BALL.pathEditor.curPath.points) {
            ed.pathPointSelect.append("<option value=" + i + ">" + i + ". x:" + BALL.pathEditor.curPath.points[i].pSprite.x + "   -   y:" + BALL.pathEditor.curPath.points[i].pSprite.y  + "</option>");
        }
    }
    
    ed.createPoint = function(e) {
        if (path != null) {
            if (path.parent != sprite) {
                alert("current path does not belong to selected sprite!");
                console.warn("path:", path);
                console.warn("sprite:", sprite);
            }
            BALL.pathEditor.createPoint();
        } else {
            alert("movePathModule - current path is null");
        }
    }
    
    ed.setSprite = function(s) {
        sprite = s;
    }
    ed.hide = function() {
        ed.panel.hide();
    }
    ed.show = function() {
        ed.panel.show();
    }
    ed.getPanel = function() {
        return ed.panel;
    }
    
    
    return ed;
}());
