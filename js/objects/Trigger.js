BALL.T_CONTACT = 1;

BALL.Trigger = function(parent, name) {
    this.parent = parent;
    this.name = name;
    this.type = BALL.T_CONTACT;
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
BALL.Trigger.prototype.setTarget = function(t) {
    this.target = t;
    if (this.type == BALL.T_CONTACT) {
        ship.body.createBodyCallback(panda, hitPanda, this);
        this.parent.body.createBodyCallback(this.target, this.callEvent, this);
    }
}

BALL.Trigger.prototype.addEvent = function(event) {
    this.event = event;
    this.events.push(event);
}

BALL.Trigger.prototype.callEvent = function() {
    console.log("trigger trig, ", this);
    this.event.execute(this);
    for (var i in this.events) {
        this.events[i].execute(this);
    }
}