BALL.spriteEditor = (function() {
    var ed = {}; //ed(editor) is the returned module(BALL.spriteEditor)
    var sprite = "sprite not set yet";
    ed.init = function(editor) {
        
        console.log("init sprite editor. editor=", editor);
        ed.editor = editor;
        ed.objImages = []; //make array to reference each object type img div, used for selecting sprite types to create in editor.
        for (var i = 0; i < BALL.editor.gObjs.length; i++) {
            ed.objImages.push($("#imgDiv-" + i));
        }
        
        ed.panel = $("#selectionDiv");
        editor.showPanel(ed, 1);
        
        //inputs/buttons
        ed.rotSpeedInput = $("#rotSpeedVal");
        ed.angleInput = $("#angleVal");
        ed.deleteBtn = $("#delSelectedBtn");
        ed.saveLvlBtn = $("#saveLvlBtn");
        
        //setup input callbacks
        ed.rotSpeedInput.on("change paste keyup click", ed.rotSpeedInputChange);
        ed.angleInput.on("change paste keyup click", ed.angleInputChange);
        ed.deleteBtn.click(ed.deleteBtnClick);
        ed.saveLvlBtn.click(ed.saveLvlBtnClick);
    }
    
    //_________________________private funcs_______________________\\
    
    //UI update bindings
    ed.rotSpeedInputChange = function(e) {
        console.log("rot speed input change. val:", ed.rotSpeedInput.val());
        updateRotSpeed(BALL.editor.getSelectedObj(), ed.rotSpeedInput.val());
    }
    
    ed.angleInputChange = function(e) {
        console.log("angle updated: " + ed.angleInput.val());
        updateAngle(BALL.editor.getSelectedObj(), ed.angleInput.val());
    }
    
    ed.deleteBtnClick = function(e) {
        console.log("delete button clicked.", e);
    }
    
    ed.saveLvlBtnClick = function(e) {
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
    }
    
    return ed;
}());







