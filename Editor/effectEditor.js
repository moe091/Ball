BALL.effectEditor = {
     
    changeDelay: function(sprite, val) {
        if (sprite.tEvent != null && val != null) {
            sprite.tEvent.delay = val;
        }
    },
    
    changeInterval: function(sprite, val) {
        if (sprite.tEvent != null && val != null) {
            sprite.tEvent.interval = val;
        }
    }
}