
BALL.E_KILL = 1;
BALL.E_SPAWN = 2;
BALL.E_START_MOVEPATH = 3;
BALL.E_STOP_MOVEPATH = 4;
BALL.E_APPLY_FORCE = 5;
BALL.E_APPLY_TORQUE = 6;
BALL.E_TOGGLE = 7;

BALL.Event = function(target, name, type, id) {
    this.id = id;
    this.target = target;
    this.name = name;
    this.type = type;
    this.args = [];
    
    this.func = null;
}

BALL.Event.prototype.execute = function(trigger) {
    this.func(this.target, this.args);
}

BALL.Event.prototype.setType = function(t) {
    this.type = t;
    if (t == BALL.E_KILL) {
        this.func = BALL.EventFuncs.killTarget();
    } else if (t == BALL.E_START_MOVEPATH) {
        this.func = BALL.EventFuncs.startMovepath();
        this.execute();
    }
}


//NEXT UP - MAKE ADD EVENT BUTTON WORK
    //CREATE SYSTEM TO APPLY EVENT AND TRIGGER TYPES WITH CONSTANTS - MAKE CREATIO PROCESS AS SIMPLE AS POSSIBLE




BALL.EventFuncs = {
    killTarget: function() {
        return function(target, trigger, args) {
            if (target == -1) { //if event has no target, use the triggers target instead
                trigger.target.kill();
            } else {
                target.kill();
            }
        }
    },
    
    startMovepath: function() {
        return function(target, trigger, args) {
            if (target.movePaths[args[0]] != null) {
                console.log(target.movePaths[args[0]]);
                target.movePaths[args[0]].start();
            }
        }
    },
    
    
    
    //NEW FUNCTIONS
    destroyParent: function(obj) {
        obj.kill();
    }
}