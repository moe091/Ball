BALL.timer = {
    tEvents: [],
    startEvents: [],
    started: false,
    
    start: function() {
        this.started = true;
    },
    
    pushEvent: function(func, parent, interval, repeat, args) {
        if (typeof func == "string") {
            func = BALL.EventFuncs[func];
        }
        var e = new BALL.TimerEvent(func, parent, interval, repeat, args);
        this.tEvents.push(e);
        return e;
    },
    
    removeEvent: function(ev) {
        this.tEvents.splice(this.tEvents.indexOf(ev), 1);
    },
    
    update: function() {
        for (var i in this.tEvents) {
            this.tEvents[i].update(game.time.elapsed);
        }
    },
    
    init: function() {
        //copy all timer events into startEvents var when initialized.
        //when level is restarted, tEvents can be set to startEvents to remove timer events triggered midlevel.
        //Need to find simple way to track default object state, so e.g a toggling sprite won't be toggled off when lvl resets.
        this.startEvents = this.tEvents.slice(); //copy all timer events into startEvents var when initialized.
        
    },
    
    reset: function() {
        this.tEvents = this.startEvents.slice();
        for (var i in this.tEvents) {
            this.tEvents[i].reset();
        }
    }
}








BALL.TimerEvent = function(func, parent, interval, repeat, args) {
    this.func = func;
    this.parent = parent;
    this.interval = interval;
    this.repeat = repeat;
    this.args = args;
    this.offset = 0;
    
    this.done = false;
    if (this.args != null && this.args[0] != null) {
        this.offset = this.args[0];
        this.doneOffset = false;
    } else {
        this.offset = 0;
        this.doneOffset = true;
    }
    this.countDown = interval;
    
    if (parent != null) {
        if (parent.tEvents == null) {
            parent.tEvents = [];
        }
        parent.tEvents.push(this);
    }
}

//interval = 600, offset = 200
BALL.TimerEvent.prototype.update = function(elapsed) {
    this.countDown-= elapsed;
    
    /**
    if (!this.done && this.offset != 0) { //if offset != 0 and func not called yet, check if countdown is less than interval - offset. if so call func
        if (this.countDown < this.interval - this.offset) {    
            this.done = true;
            console.log("offset = " + this.offset + ", calling func. countDown = " + this.countDown);
            this.func(this.parent, this.args);
        }
    }
    **/
    
    
    if (this.countDown <= 0) {
        if (this.doneOffset) {
            this.func(this.parent, this.args);


            if (this.repeat) {
                this.countDown = this.interval + this.countDown;
                this.done = false;
            } else {
                BALL.timer.removeEvent(this);
            }
        } else {
            this.countDown+= this.offset;
            this.doneOffset = true;
            console.log("ENDING OFFSET - ", this.parent);
            console.log("NEW COUNTDOWN: " + this.countDown);
        }
        
    }
    
}

BALL.TimerEvent.prototype.reset = function() {
    
    this.done = false;
    this.countDown = this.interval;
    if (this.offset == 0) {
        this.doneOffset = true;
    } else {
        this.doneOffset = false;
    }
}





