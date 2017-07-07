BALL.timer = {
    tEvents: [],
    started: false,
    
    start: function() {
        this.started = true;
    },
    
    pushEvent: function(func, parent, interval, repeat, args) {
        if (typeof func == "string") {
            func = BALL.EventFuncs[func];
            console.log("STRING EVENT FUNC: ", func);
        }
        this.tEvents.push(new BALL.TimerEvent(func, parent, interval, repeat, args));
        console.log(parent.key + " args: ");
        console.log(args);
        console.log(this.tEvents[this.tEvents.length - 1]);
    },
    
    removeEvent: function(ev) {
        this.tEvents.splice(this.tEvents.indexOf(ev), 1);
    },
    
    update: function() {
        for (var i in this.tEvents) {
            this.tEvents[i].update(game.time.elapsed);
        }
    }
}








BALL.TimerEvent = function(func, parent, interval, repeat, args) {
    this.func = func;
    this.parent = parent;
    this.interval = interval;
    this.repeat = repeat;
    this.args = args;
    
    this.done = false;
    if (this.args != null && this.args[0] != null) {
        this.offset = this.args[0];
    } else {
        this.offset = 0;
    }
    this.countDown = interval;
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
    
    
    if (this.countDown <= 0) { //reset countdown every time timer reaches 0 or less. If offset = 0 call func.
        if (this.offset == 0) {
            this.func(this.parent, this.args);
        } else {
            BALL.timer.pushEvent(this.func, this.parent, this.offset, false, null);
        }
        
        if (this.repeat) {
            this.countDown = this.interval + this.countDown;
            this.done = false;
        } else {
            BALL.timer.removeEvent(this);
        }
        
    }
    
}






