
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
    this.targetID = null;
    if (this.target != null) {
        if (!this.target.ID)
            console.warn("no or 0 id: ", this.target);
        this.targetID = this.target.ID;
    }
    this.name = name;
    this.type = type;
    this.args = [];
    
    
    this.delay = 0;
    
    this.func = null;
}

BALL.Event.prototype.execute = function(trigger) {
    console.log("executing:");
    console.log(this.func);
    this.func(this.target, this.args);
}

BALL.Event.prototype.setType = function(t) {
    this.type = t;
    if (t == BALL.E_KILL) {
        if (this.delay == 0) {
            this.func = BALL.EventFuncs.killTarget(this.target);
        } else {
            this.func = function() {
                BALL.timer.pushEvent(BALL.EventFuncs.killTarget(this.target), this, this.delay, false);
            }
        }
    } else if (t == BALL.E_START_MOVEPATH) {
        this.func = BALL.EventFuncs.startMovepath();
        this.execute();
    } else if (t == BALL.E_TOGGLE) {
        if (this.delay == 0)
            this.delay = 1000;
        this.func = BALL.EventFuncs.getToggle(this, this.target, this.delay);
    }
}

BALL.Event.prototype.setTarget = function(sprite) {
    this.target = sprite;
    this.targetID = sprite.ID;
    this.setType(this.type);
    
    console.log("setting target to sprite id#-" + this.targetID + ": ");
    console.log(this.target);
}

BALL.Event.prototype.setDelay = function(d) {
    this.delay = d;
    this.setType(this.type);
}


//NEXT UP - MAKE ADD EVENT BUTTON WORK
    //CREATE SYSTEM TO APPLY EVENT AND TRIGGER TYPES WITH CONSTANTS - MAKE CREATIO PROCESS AS SIMPLE AS POSSIBLE


BALL.EventFuncs = {
    
    getToggle: function(parent, target, delay) {
        console.log("GET TOGGLE CALLED");
        return function(target, args) {
            console.log("PUSHING EVENT TO TIMER");
            BALL.timer.pushEvent(BALL.EventFuncs.toggle(target), parent, delay, true);
        }  
    },
    toggle: function(sprite) {
        return function() {
            console.log("TOGGLING!", sprite);
            if (sprite.alive) {
                sprite.kill();
            } else {
                sprite.reset(sprite.startX, sprite.startY);
            }
        }
    },
    
    
    killTarget: function(target, trigger, args) {
        return function() {
            console.log(target);
            console.log("killtarget");
            console.log(this);
            if (target == -1) { //if event has no target, use the triggers target instead
                trigger.target.startX = trigger.target.x;
                trigger.target.startY = trigger.target.y;
                BALL.gameState.buryObject(trigger.target);
                trigger.target.kill();
            } else {
                target.startX = target.x;
                target.startY = target.y;
                BALL.gameState.buryObject(target);
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