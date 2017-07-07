BALL.timer = {
    tEvents: [],
    started: false,
    
    start: function() {
        this.started = true;
    },
    
    pushEvent: function(func, parent, interval, repeat, args) {
        if (typeof func == "string") {
            func = BALL.EventFuncs[func];
            console.log(func);
        }
        this.tEvents.push(new BALL.TimerEvent(func, parent, interval, repeat, args));
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
    
    this.countDown = interval;
}

BALL.TimerEvent.prototype.update = function(elapsed) {
    this.countDown-= elapsed;
    if (this.countDown <= 0) {
        console.log(this.func);
        this.func(this.parent, this.args);
        if (this.repeat) {
            this.countDown = this.interval + this.countDown;
        } else {
            BALL.timer.removeEvent(this);
        }
    }
}