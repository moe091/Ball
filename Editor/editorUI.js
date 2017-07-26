//update trigger listbox on selectSprite()
//update event delay every time value is changed(fix bug where it updates BEFORE chagne takes place isntead of after)


BALL.editorUI = {
    selected: null,
    pathSprite: null, //currently selected pathSprite
    editor: null,
    rotValue: 0,
    angleValue: 0,
    
    
    
    
    select: function(sprite) {
        if (this.selected != sprite) {
            BALL.eventEditor.hideEditor();
        }
            
        
        $("#angleVal").val(sprite.angle);
        this.selected = sprite;
        if (this.selected.triggers != null && this.selected.triggers.length > 0) {
            BALL.trigEditor.select(this.selected);
        }
    },
    
    update: function() {
        this.updateRotSpeedInput();
        
        if (BALL.editor.getSelectedObj() != null) {
            BALL.editor.getSelectedObj().rotSpeed = this.rotValue;
            //this.bodyUpdate();
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
        if (BALL.editor.getSelectedObj().rotSpeed == null || BALL.editor.getSelectedObj().rotSpeed == 0) {
            BALL.editor.getSelectedObj().bodyAngle = this.angleValue;
            if (BALL.editor.getSelectedObj().body != null) {
                BALL.editor.getSelectedObj().body.angle = this.angleValue;
            } else {
                BALL.editor.getSelectedObj().angle = this.angleValue;
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
        console.log("updating selected");
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

            this.updateTriggers();
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
    

    
    
    
    //:::::::::::::::::::::::::::::--- UI CALLBACKS ---::::::::::::::::::::::::::\\
    curPath: null,
    setupUI: function() {
        $("#delSelectedBtn").click(function(event) {
            console.log("delete selected:");
            console.log(BALL.editor.getSelectedObj());
            console.log(BALL.editor.selected);
            BALL.gameState.destroyObject(BALL.editor.getSelectedObj()); 
            BALL.editor.selected = null;
        });
        
        $("#angleVal").change(function() {
            console.log("angle");
            if (BALL.editor.selected.body != null) {
                console.log("body");
                BALL.editor.selected.body.angle = $("#angleVal").val();
            } else {
                console.log("null");
                BALL.editor.selected.angle = $("#angleVal").val();
            }
        });
        
        //--------------------- MovePaths -------------------\\
        $("#mPathSelect").change(function(event) {
            //BALL.editorUI.selectMovePath(BALL.editorUI.selected.movePaths[$("#mPathSelect").val()]);
            console.log("CHANGE HERE");
            
            console.log(BALL.editor.getSelectedObj().movePaths);
            console.log($("#mPathSelect").val());
            console.log(BALL.editor.getSelectedObj().movePaths[$("#mPathSelect").val()]);
            
            BALL.pathEditor.selectMovePath(BALL.editor.getSelectedObj().movePaths[$("#mPathSelect").val()]);
        });
        $("#mPathSelect").focus(function(event) {
            //BALL.editorUI.selectMovePath(BALL.editorUI.selected.movePaths[$("#mPathSelect").val()]);
            console.log("Focus");
            
            console.log(BALL.editor.getSelectedObj().movePaths);
            console.log($("#mPathSelect").val());
            console.log(BALL.editor.getSelectedObj().movePaths[$("#mPathSelect").val()]);
            if ($("#mPathSelect").val() != null) {
                BALL.pathEditor.selectMovePath(BALL.editor.getSelectedObj().movePaths[$("#mPathSelect").val()]);
            }
        });
        
        
        
        
        
        //-------------------- Triggers --------------------------\\
        $("#triggerSelect").change(function(event) {
            BALL.trigEditor.selectTrigger(BALL.editor.getSelectedObj().triggers[$("#triggerSelect").val()]);
        });
        
        $("#triggerSelect").focus(function(event) {
            if ($("#triggerSelect").val() != null) {
                BALL.trigEditor.selectTrigger(BALL.editor.getSelectedObj().triggers[$("#triggerSelect").val()]);
            }
        });
        
        $("#trigTypeSelect").change(function(event) {
            BALL.trigEditor.selectType(BALL.editor.getSelectedObj(), $("#trigTypeSelect").val()); 
        });
        
        $("#addEventBtn").click(function(event) {
            BALL.trigEditor.addEvent(BALL.editor.getSelectedObj(), $("#eventTypeSelect").val(), parseInt($("#evParam1").val()), parseInt($("#evParam2").val()), prompt("Enter Event Name:") );
        });
        
        $("#trigEventsSelect").change(function(event) {
            BALL.trigEditor.selectEvent(BALL.editor.getSelectedObj(), $("#trigEventsSelect").val());
        });

        
        //----------------------- Events -------------------------\\
        $("#eventTypeSelect").change(function(event) {
            console.log("UI - CHANGE", event);
            BALL.eventEditor.selectEventType(BALL.editor.getSelectedObj(), $("#eventTypeSelect").val(), true); 
        });
        $("#eventTypeSelect").focus(function(event) {
            console.log("UI - CHANGE", event);
            BALL.eventEditor.selectEventType(BALL.editor.getSelectedObj(), $("#eventTypeSelect").val(), true); 
        });
        
        $("#selectEventTargetBtn").click(function(event) {
            BALL.eventEditor.selectTargetClick();
        });
        
        
        $("#eParam2").keypress(function(event) {
            BALL.eventEditor.updateParam2(Number($("#eParam2").val()));
        });
        $("#eParam2").change(function(event) {
            BALL.eventEditor.updateParam2(Number($("#eParam2").val()));
        });
        
        $("#eParam1").keypress(function(event) {
            BALL.eventEditor.updateParam1(Number($("#eParam1").val()));
        });
        $("#eParam1").change(function(event) {
            BALL.eventEditor.updateParam1(Number($("#eParam1").val()));
        });
        
        
        //EFFECTS
        $("#launcherDelayVal").change(function(event) {
            console.log("changedelay");
            BALL.effectEditor.changeDelay(BALL.editor.getSelectedObj(), Number($("#launcherDelayVal").val()));
        });
        
        $("#launcherIntervalVal").change(function(event) {
            console.log("change INTERVAL");
            BALL.effectEditor.changeInterval(BALL.editor.getSelectedObj(), Number($("#launcherIntervalVal").val())); 
        });
        
        
        
        
        
        
        
        $("#createPointBtn").click(function() {
            console.log("SKLDJFSD");
            if (BALL.editor.getSelectedObj() != null) {
                BALL.pathEditor.createPoint();
            }
        });
        
        $("#startPathBtn").click(function() {
            BALL.pathEditor.startPath();
        });
        
        $("#stopPathBtn").click(function() {
            BALL.pathEditor.stopPath();                  
        });
        
        
        //___________Triggers_____________\\
        $("#newTriggerBtn").click(function() {
            if (BALL.editor.getSelectedObj() != null) {
                BALL.editor.setEditor(BALL.trigEditor);
                BALL.trigEditor.createTrigger(BALL.editor.getSelectedObj(), prompt("ENTER TRIGGER NAME"));
                BALL.trigEditor.updateTriggerList(BALL.editor.getSelectedObj());
            }
        });
        
        
        
        $("#saveLvlBtn").click( function() {
            
            var lvlStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(BALL.manager.saveLevel()));
            var dLink = document.getElementById('downloadLevel');
            dLink.setAttribute("href", lvlStr);
            dLink.setAttribute("download", "level.json");
            dLink.click();
        });
    },

    selectMovePath: function(event) {
        console.log(event);
    },
    
    createMovePath: function(event) {
        BALL.editor.setEditor(BALL.pathEditor);
        BALL.pathEditor.createPath(BALL.editor.getSelectedObj(), prompt("ENTER PATH NAME:"));
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
    if (BALL.editor.selected != null)
        pathEditor.createPath(BALL.editor.getSelectedObj(), prompt("Path Name:"));
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


















