
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
    
    this.done = false;
    
    

}

BALL.Trigger.prototype.setType = function(t) {
    this.type = t;
    console.warn("trigger setType, tracing");
    if (this.type == BALL.T_CONTACT) {
        console.log("Adding contact callback");
        if (this.target == null) {
            var cb = this.parent.body.createBodyCallback(BALL.play.ball, this.callEvent, this);
        } else {
            this.parent.body.createBodyCallback(this.target, this.callEvent, this);
        }
        console.log("cb = ", cb);
    } else if (this.type == BALL.T_CREATE) {
        console.log("Adding CREATE callback");
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
    console.log("call event. TRIGGER target = ", this.target);
    console.log("trigger trig, callEvent. this= ", this);
    console.log("done?" + this.done);
    if (!this.done) {
        this.done = true;
        console.log("CALLING EVENTS:", this.events);
        for (var i in this.events) {
            console.log("trig.event.execute. event=", this.events[i]);
            this.events[i].execute(this);
        }
    }
}