
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
    
    this.func = BALL.EventFuncs.killTarget();
}

BALL.Event.prototype.execute = function(trigger) {
    this.func(this.target, trigger);
}


//NEXT UP - MAKE ADD EVENT BUTTON WORK
    //CREATE SYSTEM TO APPLY EVENT AND TRIGGER TYPES WITH CONSTANTS - MAKE CREATIO PROCESS AS SIMPLE AS POSSIBLE




BALL.EventFuncs = {
    killTarget: function() {
        return function(target, trigger) {
            if (target == -1) {
                trigger.target.kill();
            } else {
                target.kill();
            }
        }
    }
}