BALL.effectEditor = {
     
    selectEffect: function(sprite) {
        if (sprite.tEvent != null) {
            if (sprite.tEvent.offset == null || isNaN(sprite.tEvent.offset)) {
                sprite.tEvent.offset = 0;
            }
            if (sprite.tEvent.interval == null || isNaN(sprite.tEvent.interval)) {
                sprite.tEvent.interval = 0;
            }
        }
        $("#launcherDelayVal").val(sprite.tEvent.offset);
        $("#launcherIntervalVal").val(sprite.tEvent.interval);
    },
    
    changeDelay: function(sprite, val) {
        if (sprite.tEvent != null && val != null) {
            sprite.tEvent.offset = val;
            console.log("new offset: " + sprite.tEvent.offset);
        }
    },
    
    changeInterval: function(sprite, val) {
        if (sprite.tEvent != null && val != null) {
            sprite.tEvent.interval = val;
            console.log("new interval: " + sprite.tEvent.interval);
        }
    }
}