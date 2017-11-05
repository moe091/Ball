BALL.triggerSelectEditor = (function() {
    var ed = {};
    var sprite = "sprite string private";
    var curTrigger;
    ed.init = function(editor) {
        ed.editor = editor;
        ed.panel = $("#triggerSelectEditor");
        
        console.log(sprite);
        
        ed.movePathDetailBtn = $("#movePathDetailBtnT");
        
        ed.triggerList = $("#triggerSelect");
        ed.trigTypeSelect = $("#trigTypeSelect");
        ed.newTriggerBtn = $("#newTriggerBtn");
        ed.delTriggerBtn = $("#delTriggerBtn");
        ed.trigTargetBtn = $("#triggerTargetBtn");
        //delete edit trigger button - not needed
        
        ed.trigTarLbl = $("#trigTarLbl");
        ed.trigNameLabel = $("#triggerNameLabel");
        ed.trigEventList = $("#trigEventSelect");
        ed.newEventBtn = $("#newEventBtnTrig");
        ed.delEventBtn = $("#delEventBtnTrig");
        //delete edit event button - not needed. just click event in trigEventList
        
        ed.movePathDetailBtn.click(ed.movePathDetailClick);
        
        ed.newTriggerBtn.click(ed.newTriggerClick);
        ed.delTriggerBtn.click(ed.delTriggerClick);
        ed.trigTargetBtn.click(ed.selTrigTargetClick);
        
        ed.newEventBtn.click(ed.newEventClick);
        ed.delEventBtn.click(ed.delEventClick);
        
        ed.triggerList.on("change", ed.triggerListInput);
        ed.trigTypeSelect.on("change, click", ed.trigTypeClick);
        ed.trigEventList.on("change click", ed.trigEventListInput);
        
        ed.trigTypeSelect.hide();
        
    }
    
    ed.setCurTrigger = function(trig) {
        curTrigger = trig;
        BALL.trigEditor.setCurTrigger(trig);
        ed.trigNameLabel.text("trigger: " + trig.name);
        ed.updateTrigEventList(trig);
        ed.showTrigTypeSelect();
        if (curTrigger.target != null) {
            ed.trigTarLbl.text("Tar: " + curTrigger.target.ID + ". " + curTrigger.target.key);
        }
    }
    
    ed.showTrigTypeSelect = function() {
        if (curTrigger != null) {
            ed.trigTypeSelect.show();
            if (curTrigger.type != null && curTrigger.type != -1) {
                ed.trigTypeSelect.val(curTrigger.type);
            }
        }
    }
    
    ed.getCurTrigger = function() {
        return curTrigger;
    }
    
    ed.trigTypeClick = function(e) {
        console.log("trig type click. curTrig = ", curTrigger);
        curTrigger.setType(Number(ed.trigTypeSelect.val()));
    }
    
    ed.updateTrigEventList = function(trig) {
        ed.trigEventList.empty();
        if (trig != null) {
            var enabled = "DISABLED";
            
            if (trig != null && trig.events.length > 0) {
                for (var i = 0; i < trig.events.length; i++) {
                    if (trig.events[i].enabled) enabled = " - Enabled"; else enabled = ". XX DISABLED XX";
                    ed.trigEventList.append("<option value=" + i + ">" + i + ": " + trig.events[i].name + enabled + "</option>");
                }
            } else {
                console.log("trig has no events yet");
                ed.trigEventList.append("<option value=-1>Selected Trigger has no Events</option>");
            }
            
        } else {
            
            console.warn("trig is null");
            ed.trigEventList.append("<option value=-2>No Trigger Selected</option>");
        
        }
    }
    
    ed.updateTriggerList = function(s) {
        ed.triggerList.empty();
        console.log("update trigger list: ", s.triggers);
        if (s.triggers != null && s.triggers.length > 0) {
            for (var i = 0; i < s.triggers.length; i++) {
                ed.triggerList.append("<option value='" + i + "'>" + i + ":  " + s.triggers[i].name + "</option>");
            }
        } else {
            ed.triggerList.append("<option value='-1'>No Triggers</option>");
        }
    }
    
    ed.triggerListInput = function(e) {
        if (sprite != null && ed.triggerList.val() >= 0) {
            ed.setCurTrigger(sprite.triggers[ed.triggerList.val()]);
        } else {
            console.log("sprite is null");
        }
    }
    
    
    ed.movePathDetailClick = function(e) {
        BALL.editUI.showPanel(BALL.pathSelectEditor, 2);
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
    

    
    ed.trigEventListInput = function(e) {
        console.log("trigEvent Select: " + ed.trigEventList.val());
        console.log("selected event: ", BALL.trigEditor.curTrigger.events[ed.trigEventList.val()]);
        BALL.eventEditor.setCurEvent(BALL.trigEditor.curTrigger.events[ed.trigEventList.val()]);
        BALL.editUI.showPanel(BALL.eventPropEditor, 3);
        BALL.eventPropEditor.setEvent(BALL.eventEditor.curEvent);
    }
    
    ed.newEventClick = function(e) {
        if (sprite != null) {
            BALL.trigEditor.addEvent(sprite, -1, -1, -1, prompt("Enter Event Name:"));
            ed.updateTrigEventList(BALL.trigEditor.curTrigger);
            ed.trigEventList.val(BALL.trigEditor.curTrigger.events.length - 1);
        }
    }
    ed.delEventClick = function(e) {
        
    }
    
    ed.selTrigTargetClick = function(e) {
        BALL.editor.setTargetSel(ed.setTrigTarget);
    }
    
    ed.setTrigTarget = function(s) {
        if (curTrigger != null) {
            curTrigger.setTarget(s);
            BALL.editor.setNormalSel();
            
            if (curTrigger.target != null) {
                ed.trigTarLbl.text("Tar: " + curTrigger.target.ID + ". " + curTrigger.target.key);
            }
        }
    } 
    ed.setTarget = function(s) {
        console.log("ed.setTarget - setting target to sprite:", s);
        BALL.eventEditor.selectTarget(s);
        BALL.editor.setNormalSel(); //reset editor to 'normal' select instead of target select
        ed.targetNameLbl.text("Target:  " + "  " + BALL.eventEditor.curEvent.target.ID + "-" + BALL.eventEditor.curEvent.target.key);
        console.log("done. editor selmode is now: " + BALL.editor.selMode);
    }
    
    
    ed.setSprite = function(s) {
        console.log("Trigger 'set sprite' called. sprite:", s);
        sprite = s;
        ed.updateTriggerList(s);
        ed.updateTrigEventList(null);
        ed.trigTypeSelect.hide();
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