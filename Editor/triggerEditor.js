

BALL.trigEditor = {
    curTrigger: null,
    curEvent: null,
    
    
    select: function(sprite) {
        if (this.curTrigger == null || this.curTrigger.parent != sprite) {
            $(".propEditDiv").hide();
        }
        this.updateTriggerList(sprite);
        this.updateTrigEventList();
    },
    
    createTrigger: function(sprite, name) {
        this.curTrigger = new BALL.Trigger(sprite, name);
        $("#trigTypeSelect").val(1);
        this.selectType(BALL.editor.getSelectedObj(), $("#trigTypeSelect").val());
    },
    
    
    
    selectTrigger: function(trig) {
        this.curTrigger = trig;
        this.updateTrigEventList();
        this.showTrigEditor();
        $("#trigNameLbl").html(trig.name + ": ");
    },
    
    
    
    
    
    //____EVENTS____\\
    addEvent: function(sprite, type, p1, p2, name) {
        this.curEvent = new BALL.Event(BALL.play.ball, name, type, BALL.gameState.events.length);
        BALL.gameState.events.push(this.curEvent);
        this.curTrigger.events.push(this.curEvent);
        this.updateTrigEventList();
        $("#trigEventsSelect").val(this.curTrigger.events.length - 1);
        BALL.eventEditor.selectEvent(this.curEvent);
    },
    

    
    
    
    selectEvent: function(sprite, index) {
        this.curEvent = this.curTrigger.events[index];
        BALL.eventEditor.selectEvent(this.curEvent);
        console.log(this.curEvent);
    },
    
    
    
    
    //___________UI CALLBACKS______________\\
    selectType: function(sprite, index) {
        this.curTrigger.setType(Number(index));
        if (index == BALL.T_CONTACT) {
            $("#tParamLbl1").hide();
            $("#tParamLbl2").hide();
            $("#tParam2").hide();
            $("#tParam1").hide();
        } else if (index == BALL.T_PATH_COMPLETE) {
            $("#tParamLbl1").show();
            $("#tParam1").show();
            $("#tParamLbl1").html("Path #:");
            $("#tParamLbl2").hide();
            $("#tParam2").hide();
        } else if (index == BALL.T_CREATE) {
            $("#tParamLbl1").hide();
            $("#tParamLbl2").hide();
            $("#tParam2").hide();
            $("#tParam1").hide();
        } else if (index == BALL.T_DESTROY) {
            $("#tParamLbl1").hide();
            $("#tParamLbl2").hide();
            $("#tParam2").hide();
            $("#tParam1").hide();
        } 
    },
    
    //::::::::::::::::::::::--- UI ELEMENT UPDATES ---::::::::::::::::::::::::::::::\\
    showTrigEditor: function() {
        $(".propEditDiv").hide();
        $("#trigEditDiv").show();
        BALL.editor.setEditor(this);
    },
    
    updateTriggerList: function(sprite) {
        $("#triggerSelect").empty();
        if (sprite.triggers != null) {
            for (var i in sprite.triggers) {
                $("#triggerSelect").append("<option value=" + i + ">" + i + ".................. " + sprite.triggers[i].name + "</option>");
            }
        } else {
            $("#triggerSelect").append("<option>........NO TRIGGERS.......</option>");
        }
    },
    
    updateTrigEventList: function() {
        $("#trigEventsSelect").empty();
        if (this.curTrigger != null) {
            for (var i in this.curTrigger.events) {
                $("#trigEventsSelect").append("<option value=" + i + ">" + this.curTrigger.events[i].id + "..........." + this.curTrigger.events[i].name + "</option>");
            }
        } else {
            console.warn("trigEditor.curTrigger is null!");
        }
    }
    
}



BALL.eventEditor = {
    curEvent: null,
    
    selectEvent: function(event) {
        this.curEvent = event;
        this.showEditor();
        $("#eventNameLbl").html(event.name);
    },
    
    showEditor: function() {
        $("#eventEditorSection").css("display", "inline-block");
        if (this.curEvent.type != null) {
            $("#eventTypeSelect").val(this.curEvent.type);
            this.selectEventType(BALL.editor.getSelectedObj, this.curEvent.type, false);
        }
        
        if (this.curEvent.args[1] != null) {
            $("#eParam2").val(this.curEvent.args[1]);   
        } else {
            $("#eParam2").val(this.curEvent.delay);
        }
        
        if (this.curEvent.args[0] != null) {
            $("#eParam1").val(this.curEvent.args[0]);
        }
    },
    
    hideEditor: function() {
        $("#eventEditorSection").hide();
    },
    
    
    selectTargetClick: function() {
        console.log(this);
        BALL.editor.targetSelect = this;
    },
    
    selectTarget: function(sprite) {
        this.curEvent.setTarget(sprite);
    },
    
    updateParam1: function(val) {
        console.log($("#eParamLbl1").text());
        console.log("param1 val:");
        console.log(val);
        
        this.curEvent.setParam1(val);
        
    },
    
    updateParam2: function(val) {
        console.log($("#eParamLbl2").text());
        console.log("val:");
        console.log(val);
        
        if ($("#eParamLbl2").text() == "Delay") {
            this.curEvent.setDelay(val);
        }
    },
    
    
    
    selectEventType: function(sprite, index, update) {
        console.log("selectEventType - " + index);
        
        if (update)
            this.curEvent.setType(Number(index));
        
        if (index == BALL.E_KILL) {
            this.eventParamSetup(null, "Delay", true);
        } else if (index == BALL.E_SPAWN) {
            this.eventParamSetup(null, "Delay", true);
        } else if (index == BALL.E_START_MOVEPATH) {
            this.eventParamSetup("Path #", "Delay", true);
        } else if (index == BALL.E_STOP_MOVEPATH) {
            this.eventParamSetup("path #", "Delay", true);
        } else if (index == BALL.E_APPLY_FORCE) {
            console.log("FORCE");
            this.eventParamSetup("X-force", "Y-force", true);
        } else if (index == BALL.E_APPLY_TORQUE) {
            console.log("torque");
            this.eventParamSetup("Value", null, true);
        } else if (index == BALL.E_TOGGLE) {
            this.eventParamSetup("Offset", "Delay", true);
        }
    },
    eventParamSetup: function(p1, p2, sel) {
        console.log(p2, p1, sel);
        if (p1 == null) {
            $("#eParamLbl1").hide();
            $("#eParam1").hide();
        } else {
            $("#eParamLbl1").show();
            $("#eParamLbl1").html(p1);
            $("#eParam1").show();
        }
        
        if (p2 == null) {
            $("#eParamLbl2").hide();
            $("#eParam2").hide();
        } else {
            $("#eParamLbl2").show();
            $("#eParamLbl2").html(p2);
            $("#eParam2").show();
        }
        
        if (!sel) {
            $("#selectEventTargetBtn").prop('disabled', true);
        } else {
            $("#selectEventTargetBtn").prop('disabled', false);
        }
    },
    
}













