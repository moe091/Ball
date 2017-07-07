
BALL.T_CONTACT = 1;
BALL.T_PATH_COMPLETE = 2;
BALL.T_CREATE = 3;
BALL.T_DESTROY = 4;

BALL.Trigger = function(parent, name) {
    this.parent = parent;
    this.name = name;
    this.type = null;
    this.params = [];
    this.params[0] = -999;
    this.params[1] = -999;
    if (parent.triggers == null) {
        parent.triggers = [];
    }
    parent.triggers.push(this);
    
    this.target = null;
    
    
    this.events = [];
    
    this.event = null;
    this.eventFunc = null;
    
    

}

BALL.Trigger.prototype.setType = function(t) {
    this.type = t;
    if (this.type == BALL.T_CONTACT) {
        console.log("Adding contact callback");
        this.parent.body.createBodyCallback(BALL.play.ball, this.callEvent, this);
    } else if (this.type == BALL.T_CREATE) {
        this.parent.createTrigger = this;
    }
}
BALL.Trigger.prototype.setTarget = function(t) {
    this.target = t;
    if (this.type == BALL.T_CONTACT) {
        this.parent.body.createBodyCallback(this.target, this.callEvent, this);
    }
}

BALL.Trigger.prototype.addEvent = function(event) {
    this.event = event;
    this.events.push(event);
}

BALL.Trigger.prototype.callEvent = function() {
    console.log("trigger trig, ", this);
    for (var i in this.events) {
        this.events[i].execute(this);
    }
}