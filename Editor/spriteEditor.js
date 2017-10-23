BALL.spriteEditor = (function() {
    var ed = {}; //ed(editor) is the returned module(BALL.spriteEditor)
    
    ed.init = function(editor) {
        
        console.log("init sprite editor. editor=", editor);
        ed.editor = editor;
        ed.objImages = []; //make array to reference each object type img div, used for selecting sprite types to create in editor.
        for (var i = 0; i < BALL.editor.gObjs.length; i++) {
            ed.objImages.push($("#imgDiv-" + i));
        }
        
        ed.panel = $("#selectionDiv");
        editor.showPanel(ed.panel, 1);
        
        //inputs/buttons
        ed.rotSpeedInput = $("#rotSpeedVal");
        ed.angleInput = $("#angleVal");
        ed.deleteBtn = $("#delSelectedBtn");
        ed.saveLvlBtn = $("#saveLvlBtn");
        
        //setup input callbacks
        ed.rotSpeedInput.on("change paste keyup click", rotSpeedInputChange);
        ed.angleInput.on("change paste keyup click", angleInputChange);
        ed.deleteBtn.click(deleteBtnClick);
        ed.saveLvlBtn.click(saveLvlBtnClick);
    }
    
    //_________________________private funcs_______________________\\
    
    //UI update bindings
    var rotSpeedInputChange = function(e) {
        console.log("rot speed input change. val:", ed.rotSpeedInput.val());
        updateRotSpeed(BALL.editor.getSelectedObj(), ed.rotSpeedInput.val());
    }
    
    var angleInputChange = function(e) {
        console.log("angle updated: " + ed.angleInput.val());
        updateAngle(BALL.editor.getSelectedObj(), ed.angleInput.val());
    }
    
    var deleteBtnClick = function(e) {
        console.log("delete button clicked.", e);
    }
    
    var saveLvlBtnClick = function(e) {
        console.log("save level button clicked.", e);
    }
    
    
    //Edit functions
    var updateAngle = function(s, angle) {
        if (s != null && angle != null) {
            s.startAngle = angle; //startAngle, stores default angle incase sprite has rotSpeed or something. if startAngle isn't set, angle will reset to 0 on level restart
            s.angle = angle;
            if (s.body != null) {
                s.body.angle = angle;
            }
        } else {
            console.warn("cannot update angle, no sprite selected");
        }
    }   
        
    var updateRotSpeed = function(s, speed) {
        if (s != null && s.pathSprite != true) { //don't allow rot speed to be set on path sprites
            if (speed != null && speed != 0) {
                
                if (s.rotateUpdate == null) { //if sprite doesn't have an update func for rotating, create one and add to sprite.updateFuncs
                    s.rotateUpdate = BALL.gObject.rotateUpdate(speed, s); //create update func that rotates s at speed
                    s.updateFuncs.push(s.rotateUpdate); //add rotateUpdate func to s's updateFuncs - will be called when update(s) is called every frame.
                }
                
            }
        }
    }
    
    
    return ed;
}());





//____________________________________________Path Selection Module____________________________________________\\
BALL.pathSelectEditor = (function() {
    var ed = {};
    
    ed.init = function(editor) { //different editor modules communicate only through editor, calling functions on it.
        ed.editor = editor;
        ed.panel = $("#pathSelectEditor");
        
        ed.mPathSelect = $("#mPathSelect");
        ed.mPathSelect.on("click", mPathSelectClick);
        
        editor.showPanel(ed.panel, 2);
    }
    
    mPathSelectClick = function(e) {
        console.log("mPathSelect clicked. item = " + ed.mPathSelect.val());
        editor.showPointEditor(3);
        editor.selectPathPoint(ed.mPathSelect.val());
    }
    
    return ed;
}());






//_________________________________editUI (editor)_______________________________\\
BALL.editUI = {
    panels: [],
    
    init: function() {
        this.panels[1] = null;
        this.panels[2] = null;
        this.panels[3] = null;
        BALL.spriteEditor.init(this);
        BALL.pathSelectEditor.init(this);
    },
    
    showPanel: function(panel, num) {
        console.log("show panel #" + num);
        console.log("panel: ", panel);
        this.panels[num] = panel;
        $("#editorPanel" + num).append(panel);
        panel.show();
    },
    showPointEditor: function(panelNum) {
        $("#editorPanel" + panelNum).append(BALL.pointEditor.getPanel);
    }
}
