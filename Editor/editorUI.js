BALL.editorUI = {
    selected: null,
    pathSprite: null, //currently selected pathSprite
    editor: null,
    rotValue: 0,
    angleValue: 0,
    
    
    
    select: function(sprite) {
        this.selected = sprite;
    },
    
    update: function() {
        this.updateRotSpeedInput();
        
        if (this.selected != null) {
            this.selected.rotSpeed = this.rotValue;
            this.bodyUpdate();
        } else {
            console.log("NULL SELECTED");
        }
    },
    
    bodyUpdate: function() {
        if (parseFloat($("#rotSpeedVal").val()) != null) {
            this.rotValue = parseFloat($("#rotSpeedVal").val());
        } else {
            this.rotValue = 0;
            console.log("ROTVAL NULL, setting to 0");
        }
        

        if (parseFloat($("#angleVal").val()) != null) {
            this.angleValue = parseFloat($("#angleVal").val());
        }
        if (this.selected.rotSpeed == null || this.selected.rotSpeed == 0) {
            this.selected.bodyAngle = this.angleValue;
            if (this.selected.body != null) {
                this.selected.body.angle = this.angleValue;
            } else {
                this.selected.angle = this.angleValue;
            }
        }
    },
    
    
    
    
    
    
    
    
    clickObject: function(index) {
        this.editor.objI = index;
        this.editor.curObj = this.editor.gObjs[index];
        for (var i in this.editor.gObjs) {
            $("#imgDiv-" + i).css("border-color", "#000");
        }
        
        $("#imgDiv-" + index).css("border-color", "#FFF");
        
    },
    
    updateSelected: function(sel) {
        BALL.gameState.hidePathSprites();
        if (sel != null) {
            this.selected = sel;
            $("#curSelectionImg").attr("src", "assets/plats/" + sel.key + ".png");

            //if sprite has a rotSpeed, set rotSpeed input val to sprites rotSpeed
            //else set it to 0

            if (!isNaN(this.selected.rotSpeed) && this.selected.rotSpeed != null) {
                console.log(this.selected.rotSpeed);
                $("#rotSpeedVal").val(this.selected.rotSpeed);
            } else {
                $("#rotSpeedVal").val(0);
            }

            //Same as rotSpeed above but with angle
            if (this.selected.bodyAngle != null) {
                $("#angleVal").val(this.selected.bodyAngle);
            } else {
                $("#angleVal").val(0);
            }

            this.updateMovePaths();
            console.log(sel.movePaths);
        }
    },
    
    selectPathSprite: function(sprite) {
        console.log("SELECT PATH SPRITE");
        this.pathSprite = sprite;
    },
    
    
    updateRotSpeedInput: function() {
        if (isNaN($("#rotSpeedVal").val()) || $("#rotSpeedVal").val() == null || $("#rotSpeedVal").val() == "") {
            $("#rotSpeedVal").val(0);
            this.rotValue = 0;
        } else {
        }
    },
    
    updateMovePaths: function(selID) {
        console.warn("DEPRECATED");
    },
    
    updateTriggers: function() {
        $("#triggerSelect").empty();
        if (this.selected.triggers != null) {
            for (var i in this.selected.triggers) {
                $("#triggerSelect").append("<option value=" + i + ">" + i + ".................. " + this.selected.triggers[i].name + "</option>");
            }
        }
    },
    
    
    
    //:::::::::::::::::::::::::::::--- UI CALLBACKS ---::::::::::::::::::::::::::\\
    curPath: null,
    setupUI: function() {
        
        $("#mPathSelect").change(function(event) {
            BALL.editorUI.selectMovePath(BALL.editorUI.selected.movePaths[$("#mPathSelect").val()]);
            BALL.pathEditor.selectMovePath(BALL.editor.selected.movePaths[$("#mPathSelect").val()])
        });
        this.showObjEditor($(".nothing"));
        
        $("#createPointBtn").click(function() {
            console.log("SKLDJFSD");
            if (BALL.editorUI.selected != null) {
                BALL.pathEditor.createPoint();
            }
        });
    },

    selectMovePath: function(event) {
        console.log(event);
    },
    
    createMovePath: function(event) {
        BALL.editor.setEditor(BALL.pathEditor);
        BALL.pathEditor.createPath(this.selected, prompt("ENTER PATH NAME:"));
    },
    

    
    
    
    //::::::::::::::::::::::::---- SELECTION UPDATES ---:::::::::::::::::::::::\\
    showObjEditor: function(editor) {
        $(".propEditDiv").hide();
        //editor.show();
    },
    
    showPathObjEditor: function(path) {
        console.warn("SHOW OBJ EDITOR - DEPRECATED");
    },
    
    selectMovePath: function(path) {
        console.warn("DEPRECAED");
    },
    
    
    //------ list updates --------\\
    updatePathPointList: function(path) {
        console.warn("DEPRECATED");
    }
    
    
    
}

BALL.mpElement = 
    $("<div />", {
    "background-color": "#ff00a1",
    "width": "400px",
    "height": "400px",
    "border": "2px #fff solid"
});

















function newPathClick(event) {
    if (this.selected != null)
        pathEditor.createPath(this.selected, prompt("Path Name:"));
    else 
        console.log("Select an object before creating movepath");
}


function newTriggerClick(event) {
    console.log("clicked");
    if (BALL.editorUI.selected != null) {
        console.log("selected not null");
        if (BALL.editorUI.selected.triggers == null) {
            BALL.editorUI.selected.triggers = [];    
        }
        var trigger = {};
        //create trigger
        trigger.parent = BALL.editorUI.selected;
        trigger.name = prompt("Enter name for trigger:");
        BALL.editorUI.selected.triggers.push(trigger);
        console.log(BALL.editorUI.selected);

    } 
    BALL.editorUI.updateTriggers();
}


















