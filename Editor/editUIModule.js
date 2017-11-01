

//_________________________________editUI (editor)_______________________________\\
BALL.editUI = {
    panels: [],
    sprite: null,
    init: function() { //called after document.ready, init all modules and all UI elements/callbacks belonging to them. 
        this.panels[1] = null;
        this.panels[2] = null;
        this.panels[3] = null;
        BALL.spriteEditor.init(this);
        BALL.pathSelectEditor.init(this);
        BALL.eventPropEditor.init(this);
        BALL.triggerSelectEditor.init(this);
        BALL.movePathEditor.init(this);
    },
    
    showPanel: function(panel, num) { //displays a module(panel) in one of the editModule slots(num) in the editor UI
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
        if (BALL.trigEditor.curTrigger != null) {
            if (BALL.trigEditor.curTrigger.parent.ID != sprite.ID) {
                BALL.eventPropEditor.getPanel().css("background-color", "#cc5852");
            } else {
                BALL.eventPropEditor.getPanel().css("background-color", "#333");
            }
        }
        BALL.editUI.sprite = sprite;
        console.log("setting sprite for each panel: ", sprite);
        BALL.editUI.panels.forEach(function(p) {
            console.log("panel = ", p);
            if (p != null)
                p.setSprite(sprite);
        })
    }
}
