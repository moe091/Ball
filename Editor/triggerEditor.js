BALL.trigEditor = {
    curTrigger: null,
    curEvent: null,
    
    
    select: function(sprite) {
        
    },
    
    createTrigger: function(sprite, name) {
        this.curTrigger = new BALL.Trigger(sprite, name);
        
    },
    
    
    
    selectTrigger: function(trig) {
        this.curTrigger = trig;
        this.showTrigEditor();
        $("#trigNameLbl").html(trig.name + ": ");
    },
    
    
    
    //____EVENTS____\\
    
    addEvent: function(sprite, type, p1, p2, name) {
        this.curEvent = new BALL.Event(null, name, type);
        this.curTrigger.events.push(event);
    },
    
    //___________UI CALLBACKS______________\\
    selectType: function(sprite, index) {
        console.log(index);
    },
    
    //::::::::::::::::::::::--- UI ELEMENT UPDATES ---::::::::::::::::::::::::::::::\\
    showTrigEditor: function() {
        $(".propEditDiv").hide();
        $("#trigEditDiv").show();
        BALL.editor.setEditor(this);
    },
    
}