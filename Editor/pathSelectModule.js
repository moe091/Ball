//____________________________________________Path Selection Module____________________________________________\\
BALL.pathSelectEditor = (function() {
    var ed = {};
    var sprite = "sprite not set yet";
    
    ed.init = function(editor) { //different editor modules communicate only through editor, calling functions on it.
        ed.editor = editor;
        ed.panel = $("#pathSelectEditor");
        
        ed.mPathSelect = $("#mPathSelect");
        ed.triggerDetailBtn = $("#triggerDetailBtnMp");
        ed.newPathBtn = $("#newPathBtn");
        
        ed.triggerDetailBtn.click(ed.triggerDetailClick);
        ed.mPathSelect.on("click", ed.mPathSelectClick);
        ed.newPathBtn.click(ed.newPathClick);
        
        editor.showPanel(ed, 2);
    }
    
    
    //_______________________________________UI CALLBACKS_______________________________\\
    ed.newPathClick = function(e) {
        BALL.pathEditor.createPath(BALL.editor.getSelectedObj(), prompt("Enter MovePath name: "));
    }
    
    ed.mPathSelectClick = function(e) {
        BALL.editUI.showPanel(BALL.movePathEditor, 3);
        console.log("movepath panel = ", BALL.movePathEditor, BALL.movePathEditor.getPanel());
        BALL.movePathEditor.setPath(sprite.movePaths[ed.mPathSelect.val()]);
    }
    
    ed.triggerDetailClick = function(e) {
        BALL.editUI.showPanel(BALL.triggerSelectEditor, 2);
    }
    
    
    //________________________________________GENERIC FUNCS________________________________\\
    ed.hide = function() {
        ed.panel.hide();
    }
    ed.show = function() {
        ed.panel.show();
    }
    ed.getPanel = function() {
        return ed.panel;
    }
    
    ed.setSprite = function(s) {
        sprite = s;
        ed.updateMovePathList(sprite);
    }
    
    //_______________________________________Funcs called externall________________________\\
    
    ed.updateMovePathList = function(s, selID) {
        ed.mPathSelect.empty();
        console.log("updateMovePathlist");
        if (s.movePaths != null) {
            for (var i in s.movePaths) {
                ed.mPathSelect.append("<option value=" + i + ">" + i + ".................." + s.movePaths[i].name + "</option>");
            }   
            
            if (selID != null) { //select selID in pathSelect list. e.g when creating a new path, update movepath list then select new path
                ed.mPathSelect.val(selID);
                console.log(selID, s.movePaths, s.movePaths[selID]);
                BALL.pathEditor.selectMovePath(s, s.movePaths[selID]);
            }
        } else {
            $("#mPathSelect").append("<option value=-1>.........NO MOVEPATHS.........</option>");
        }
        
    }

    
    return ed;
}());