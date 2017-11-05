BALL.eventPropEditor = (function() {
    var ed = {};
    var sprite = "sprite not set yet";
    var curEvent = null;
    
    ed.init = function(editor) {
        ed.editor = editor;
        ed.panel = $("#eventEditor");
        
        ed.eventTypeSelect = $("#eventTypeSelect");
        ed.eParam1 = $("#eParam1");
        ed.eParam2 = $("#eParam2");
        
        ed.eventNameLbl = $("#eventNameLbl");
        ed.targetSelectBtn = $("#selectEventTargetBtn");
        ed.targetNameLbl = $("#eventTarNameLbl");
        
        
        ed.targetSelectBtn.click(ed.targetSelectClick);
        ed.eventTypeSelect.on("click change", ed.typeSelectClick);
        
    }
    
    ed.typeSelectClick = function(e) {
        
    }
    
    ed.setEvent = function(ev) {
        ed.eventNameLbl.text("Event Name: " + ev.name);
        curEvent = ev;
    }
    
    ed.targetSelectClick = function(e) {
        BALL.editor.setTargetSel(ed.setTarget);
        console.log("tarSelClick - set editor to targetSelect mode", BALL.editor);
        console.log("editor selMode = " + BALL.editor.selMode);
    }
    ed.setTarget = function(s) {
        console.log("ed.setTarget - setting target to sprite:", s);
        BALL.eventEditor.selectTarget(s);
        BALL.editor.setNormalSel(); //reset editor to 'normal' select instead of target select
        ed.targetNameLbl.text("Target:  " + "  " + BALL.eventEditor.curEvent.target.ID + "-" + BALL.eventEditor.curEvent.target.key);
        console.log("done. editor selmode is now: " + BALL.editor.selMode);
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
