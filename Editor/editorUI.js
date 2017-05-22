BALL.editorUI = {
    selected: null,
    editor: null,
    
    clickObject: function(index) {
        this.editor.objI = index;
        this.editor.curObj = this.editor.gObjs[index];
        for (var i in this.editor.gObjs) {
            $("#imgDiv-" + i).css("border-color", "#000");
        }
        
        $("#imgDiv-" + index).css("border-color", "#FFF");
        
    },
    
    updateSelected: function(sel) {
        this.selected = sel;
        $("#curSelectionImg").attr("src", "assets/plats/" + sel.key + ".png");
    },
}