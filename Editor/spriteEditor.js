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





//____________________________________________Path Selection Module____________________________________________\\
BALL.pathSelectEditor = (function() {
    var ed = {};
    var sprite = "sprite not set yet";
    
    ed.init = function(editor) { //different editor modules communicate only through editor, calling functions on it.
        ed.editor = editor;
        ed.panel = $("#pathSelectEditor");
        
        ed.mPathSelect = $("#mPathSelect");
        ed.mPathSelect.on("click", ed.mPathSelectClick);
        
        ed.triggerDetailBtn = $("#triggerDetailBtnMp");
        ed.eventDetailBtn = $("#eventDetailBtnMp");
        
        ed.eventDetailBtn.click(ed.eventDetailClick);
        ed.triggerDetailBtn.click(ed.triggerDetailClick);
        
        editor.showPanel(ed, 2);
    }
    
    ed.mPathSelectClick = function(e) {
        console.log("mPathSelect clicked. item = " + ed.mPathSelect.val());
        BALL.editUI.showPointEditor(3);
        BALL.editUI.selectPathPoint(ed.mPathSelect.val());
    }
    
    ed.triggerDetailClick = function(e) {
        BALL.editUI.showPanel(BALL.triggerSelectEditor, 2);
    }
    ed.eventDetailClick = function(e) {
        BALL.editUI.showPanel(BALL.eventPropEditor, 2);
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


BALL.eventPropEditor = (function() {
    var ed = {};
    var sprite = "sprite not set yet";
    
    ed.init = function(editor) {
        ed.editor = editor;
        ed.panel = $("#eventEditor");
        
        ed.movePathDetailBtn = $("#movePathDetailBtnE");
        ed.triggerDetailBtn = $("#triggerDetailBtnE");
        
        ed.movePathDetailBtn.click(ed.movePathDetailClick);
        ed.triggerDetailBtn.click(ed.triggerDetailClick);
        
    }
    
    ed.movePathDetailClick = function(e) {
        BALL.editUI.showPanel(BALL.pathSelectEditor, 2);
    }
    ed.triggerDetailClick = function(e) {
        BALL.editUI.showPanel(BALL.triggerSelectEditor, 2);
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


BALL.triggerSelectEditor = (function() {
    var ed = {};
    var sprite = "sprite string private";
    ed.init = function(editor) {
        ed.editor = editor;
        ed.panel = $("#triggerSelectEditor");
        
        console.log(sprite);
        
        ed.movePathDetailBtn = $("#movePathDetailBtnT");
        ed.eventDetailBtn = $("#eventDetailBtnT");
        
        ed.triggerList = $("#triggerSelect");
        ed.newTriggerBtn = $("#newTriggerBtn");
        ed.delTriggerBtn = $("#delTriggerBtn");
        //delete edit trigger button - not needed
        
        ed.trigEventList = $("#trigEventSelect");
        
        ed.movePathDetailBtn.click(ed.movePathDetailClick);
        ed.eventDetailBtn.click(ed.eventDetailClick);
        
        ed.newTriggerBtn.click(ed.newTriggerClick);
        ed.delTriggerBtn.click(ed.delTriggerClick);
        
        ed.triggerList.on("change", ed.triggerListInput);
        
    }
    
    /**
               BALL.trigEditor.addEvent(BALL.editor.getSelectedObj(), $("#eventTypeSelect").val(), parseInt($("#evParam1").val()), parseInt($("#evParam2").val()), prompt("Enter Event Name:") );
               **/
    
    ed.updateTrigEventList = function(trig) {
        console.log("show trig events:", trig);
        ed.trigEventList.empty();
        if (trig != null && trig.events.length > 0) {
            for (var i = 0; i < trig.events.length; i++) {
                ed.trigEventList.append("<option val=" + i + ">" + i + "........... " + trig.events[i].name + "</option>");
            }
        } else {
            if (trig == null) {
                console.warn("trig is null");
                ed.trigEventList.append("<option val=-2>No Trigger Selected</option>");
            } else {
                console.log("trig has no events yet");
                ed.trigEventList.append("<option val=-1>Selected Trigger has no Events</option>");
                
            }
        }
    }
    
    ed.updateTriggerList = function(s) {
        ed.triggerList.empty();
        if (s.triggers != null && s.triggers.length > 0) {
            for (var i = 0; i < s.triggers.length; i++) {
                ed.triggerList.append("<option value='" + i + "'>" + i + "............ " + s.triggers[i].name + "</option>");
            }
        } else {
            ed.triggerList.append("<option value='-1'>NO TRIGGERS ON THIS SPRITE</option>");
        }
    }
    
    ed.triggerListInput = function(e) {
        if (sprite != null && ed.triggerList.val() >= 0) {
            ed.updateTrigEventList(sprite.triggers[ed.triggerList.val()]);
        } else {
            console.log("sprite is null");
        }
    }
    
    ed.setSprite = function(s) {
        sprite = s;
        ed.updateTriggerList(s);
        ed.updateTrigEventList(null);
    }
    
    
    ed.movePathDetailClick = function(e) {
        BALL.editUI.showPanel(BALL.pathSelectEditor, 2);
    }
    ed.eventDetailClick = function(e) {
        BALL.editUI.showPanel(BALL.eventPropEditor, 2);
    }
    
    ed.newTriggerClick = function(e) {
        console.log("new trig click. sprite:", sprite);
        if (sprite != null) {
            BALL.trigEditor.createTrigger(sprite, prompt("Enter Trigger Name:"));
            ed.updateTriggerList(sprite);
        } else {
            alert("No Sprite selected");
        }
    }
    ed.delTriggerClick = function(e) {
        console.log("new trig click. sprite:", sprite);
        if (sprite != null && ed.triggerList.val() >= 0) {
            sprite.triggers.splice(ed.triggerList.val(), 1);
            ed.updateTriggerList(sprite);
        } else {
            if (sprite == null) {
                prompt("sprite is null somehow. not good. trigListEditor Module");
            } else {
                console.log("no trigger selected to delete. triggerList.val < 0");
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
    
    
    return ed;
}());






//_________________________________editUI (editor)_______________________________\\
BALL.editUI = {
    panels: [],
    sprite: null,
    init: function() {
        this.panels[1] = null;
        this.panels[2] = null;
        this.panels[3] = null;
        BALL.spriteEditor.init(this);
        BALL.pathSelectEditor.init(this);
        BALL.eventPropEditor.init(this);
        BALL.triggerSelectEditor.init(this);
    },
    
    showPanel: function(panel, num) {
        if (this.panels[num] != null) {
            this.panels[num].hide();
        }
        console.log("panel = ", panel);
        this.panels[num] = panel;
        $("#editorPanel" + num).append(panel.getPanel());
        panel.show();
        
        if (panel.setSprite != null) {
            console.log("call setSprite.", BALL.editor.getSelectedObj());
            panel.setSprite(BALL.editor.getSelectedObj());
        } else {
            console.log("set panel, setSprite method is null:", panel.setSprite);
            console.log(panel);
        }
    },
    showPointEditor: function(panelNum) {
        $("#editorPanel" + panelNum).append(BALL.pointEditor.getPanel);
    },
    
    setSprite: function(sprite) {
        BALL.editUI.sprite = sprite;
        console.log("setting sprite for each panel: ", sprite);
        BALL.editUI.panels.forEach(function(p) {
            console.log("panel = ", p);
            if (p != null)
                p.setSprite(sprite);
        })
    }
}
