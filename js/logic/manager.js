BALL.manager = {
    editor: null,
    editMode: false,
    nonstaticObjs: [],
    
    enterEditMode: function() {
        console.log("EDITMODE");
        BALL.manager.editor = BALL.editor;
        BALL.manager.editMode = true;
        BALL.editor.editMode = true;
        
        BALL.editor.camScale = game.camera.scale.x;
        
        console.log(BALL.manager.nonstaticObjs);
        for (var i in BALL.manager.nonstaticObjs) {
            if (BALL.manager.nonstaticObjs[i] != null && BALL.manager.nonstaticObjs[i].body != null) {
                BALL.manager.nonstaticObjs[i].reset(BALL.manager.nonstaticObjs[i].startX, BALL.manager.nonstaticObjs[i].startY);
                BALL.manager.nonstaticObjs[i].body.static = true;
            }
        }
        
        
        BALL.input.UP.onDown.removeAll();
        BALL.input.LEFT.onDown.removeAll();
        BALL.input.RIGHT.onDown.removeAll();
        BALL.input.DOWN.onDown.removeAll();
        
        
        BALL.input.UP.onDown.add(BALL.editor.selectedUp, this);
        BALL.input.LEFT.onDown.add(BALL.editor.selectedLeft, this);
        BALL.input.DOWN.onDown.add(BALL.editor.selectedDown, this);
        BALL.input.RIGHT.onDown.add(BALL.editor.selectedRight, this);
        
        game.input.onDown.removeAll();
        game.input.onUp.removeAll();
        
        game.input.onDown.add(BALL.editor.inputDown, this);
        game.input.onUp.add(BALL.editor.inputUp, this);
        
        for (var i in BALL.gameState.objects) {
            BALL.gameState.objects[i].events.onInputDown.add(BALL.editor.clickObj, this);
            BALL.gameState.objects[i].events.onInputOver.add(BALL.editor.spriteHover, this);
            BALL.gameState.objects[i].events.onInputOut.add(BALL.editor.spriteUnhover, this);
        }
        game.camera.target = BALL.play.ball;
        game.camera.target = null;
        
    },
    
    exitEditMode: function() {
        console.log("EXIT EDITOR");
        BALL.manager.editor = null;
        BALL.manager.editMode = false;
        BALL.manager.resetLevel();
        game.camera.target = BALL.play.ball;
        
        console.log(BALL.manager.nonstaticObjs);
        for (var i in BALL.manager.nonstaticObjs) {
            if (BALL.manager.nonstaticObjs[i] != null && BALL.manager.nonstaticObjs[i].body != null) {
                console.log(BALL.manager.nonstaticObjs[i]);
                BALL.manager.nonstaticObjs[i].reset(BALL.manager.nonstaticObjs[i].startX, BALL.manager.nonstaticObjs[i].startY);
                BALL.manager.nonstaticObjs[i].body.static = false;
                BALL.manager.nonstaticObjs[i].body.dynamic = true;
                console.log(BALL.manager.nonstaticObjs[i]);
            }
        }
        //INPUT
        BALL.input.UP.onDown.removeAll();
        BALL.input.LEFT.onDown.removeAll();
        BALL.input.RIGHT.onDown.removeAll();
        BALL.input.DOWN.onDown.removeAll();
        
        game.input.onDown.removeAll();
        game.input.onUp.removeAll();
        
        game.input.onDown.add(BALL.input.inputDown, this);
        game.input.onUp.add(BALL.input.inputUp, this);
        
      
        for (var i in BALL.gameState.objects) {
            BALL.gameState.objects[i].events.onInputOver.removeAll();
            BALL.gameState.objects[i].events.onInputOut.removeAll();
        }
        
        BALL.input.createBindings();
        
        
    },
    
    resetLevel: function() {
        BALL.gameState.resetLevel();
        
        BALL.play.ball.reset(1750 , 1700);
        BALL.play.ballOuter.reset(0, 0);
        BALL.play.ballInner.reset(0, 0);
        BALL.play.ball.wallride = null;
        
        //BALL.gameState.boulder.reset(3030, 1660);
        game.camera.follow(BALL.play.ball);
        game.camera.scale.setTo(0.5);  
        BALL.play.startTime = game.time.now;
    },

    
    saveLevel: function() {
        var level = {};
        level.objs = [];
        console.log(level);
        for (var i in BALL.gameState.objects) {
            var o = {};
            o.key = BALL.gameState.objects[i].key;
            o.x = BALL.gameState.objects[i].x;
            o.y = BALL.gameState.objects[i].y;
            o.rotSpeed = BALL.gameState.objects[i].rotSpeed;
            o.angle = BALL.gameState.objects[i].angle;
            o.mass = BALL.gameState.objects[i].mass;
            o.ID = BALL.gameState.objects[i].ID;
            
            if (o.key == "s01-launcher") {
                if (BALL.gameState.objects[i].tEvent != null) {
                    o.tEvent = {};
                    o.tEvent.interval = BALL.gameState.objects[i].tEvent.interval;
                    o.tEvent.offset = BALL.gameState.objects[i].tEvent.offset;
                }
            }
            
            if (BALL.gameState.objects[i].movePaths != null) {
                o.movePaths = [];
                
                for (var p in BALL.gameState.objects[i].movePaths) {
                    var path = {};
                    path.startX = BALL.gameState.objects[i].movePaths[p].startX;
                    path.startY = BALL.gameState.objects[i].movePaths[p].startY;
                    
                    path.points = [];
                    for (var pt in BALL.gameState.objects[i].movePaths[p].points) {
                        var point = {};
                        point.x = BALL.gameState.objects[i].movePaths[p].points[pt].pSprite.x;
                        point.y = BALL.gameState.objects[i].movePaths[p].points[pt].pSprite.y;
                        point.speed = BALL.gameState.objects[i].movePaths[p].points[pt].speed;
                        path.points.push(point);
                    }//point loop
                    
                    o.movePaths.push(path);
                }//path loop
                
            }//path IF
            
            if (BALL.gameState.objects[i].triggers != null && BALL.gameState.objects[i].triggers.length > 0) {
                o.triggers = [];
                for (var j in BALL.gameState.objects[i].triggers) {
                    var trig = {};
                    trig.type = BALL.gameState.objects[i].triggers[j].type;
                    trig.name = BALL.gameState.objects[i].triggers[j].name;
                    trig.params = BALL.gameState.objects[i].triggers[j].params;
                    trig.parentID = BALL.gameState.objects[i].triggers[j].parent.ID;
                    trig.events = [];
                    if (BALL.gameState.objects[i].triggers[j].events != null && BALL.gameState.objects[i].triggers[j].events.length > 0) {
                        for (var k in BALL.gameState.objects[i].triggers[j].events) {
                            var event = {};
                            event.delay = BALL.gameState.objects[i].triggers[j].events[k].delay;
                            event.id = BALL.gameState.objects[i].triggers[j].events[k].id;
                            event.name = BALL.gameState.objects[i].triggers[j].events[k].name;
                            event.type = BALL.gameState.objects[i].triggers[j].events[k].type;
                            event.targetID = BALL.gameState.objects[i].triggers[j].events[k].targetID;
                            event.args = BALL.gameState.objects[i].triggers[j].events[k].args;
                            if (event.targetID == 0 || event.targetID == null) {
                                console.warn("TARGET IS NULL OR 0", event, "id = ", event.targetID);
                            }
                            trig.events.push(event);
                        }
                    }
                    o.triggers.push(trig);
                }
            }
            
            level.objs.push(o);
        }//object loop
        level.joints = [];
        level.joints = level.joints.concat(BALL.jointEditor.revJoints);
        //repeat above for other joint types.(joint type is stored in array elements, e.g type=1 for revolute joints)
        
        return level;
    },
    
    loadLevel: function(level) {
        console.log(level);
        console.log("\n\n\n\n\n\n\n\n------\n" + level.objs.length + "\n----------\n\n\n");
        for (var i in level.objs) {
            if (level.objs[i].key == "chalkplat" || level.objs[i].key == "w1-iceplat") {
                level.objs[i].key = "chalkbig";
            } else if (level.objs[i].key == "w1-platbreak") {
                level.objs[i].key = "chalkbreak";
            } else if (level.objs[i].key == "k01-dublaser") {
                level.objs[i].key = "k01-redline";
            }
            //level.objs[i].x = level.objs[i].x / 2;
            //level.objs[i].y = level.objs[i].y / 2;
            console.log(level.objs[i].key);
            if (level.objs[i].xScale < 0) {
                var j = BALL.gameState.createObj(level.objs[i].x, level.objs[i].y, "flip-" + level.objs[i].key, level.objs[i].ID);
                j.scale.x = level.objs[i].xScale;
            } else {
                var j = BALL.gameState.createObj(level.objs[i].x, level.objs[i].y, level.objs[i].key, level.objs[i].ID);
            }
            
            if (level.objs[i].mass != null) {
                j.mass = level.objs[i].mass;
                j.body.data.mass = level.objs[i];
            }
                j.rotSpeed = level.objs[i].rotSpeed;
            if (j.rotSpeed != 0) {
                j.rotateUpdate = BALL.gObject.rotateUpdate(j.rotSpeed, j);
                j.updateFuncs.push(j.rotateUpdate);
                level.objs[i].angle = 0;
            }
            
            //EFFECTS
            if (j.key == "s01-launcher" && level.objs[i].tEvent != null) {
                console.log(j);
                console.log(level.objs[i].tEvent);
                j.tEvent.interval = level.objs[i].tEvent.interval;
                j.tEvent.offset = level.objs[i].tEvent.offset;
            }
            
            
            //MOVEPATHS
            if (level.objs[i].movePaths != null) {
                j.movePaths = [];
                
                for (var p in level.objs[i].movePaths) {
                    j.movePaths[p] = new BALL.MovePath(j, p);
                    j.movePaths[p].startX = level.objs[i].movePaths[p].startX;
                    j.movePaths[p].startY = level.objs[i].movePaths[p].startY;
                    
                    j.movePaths[p].points = [];
                    for (var pt in level.objs[i].movePaths[p].points) {
                        j.movePaths[p].addPoint(new BALL.PathPoint(level.objs[i].movePaths[p].points[pt].x, level.objs[i].movePaths[p].points[pt].y, level.objs[i].movePaths[p].points[pt].speed, 0, j.movePaths[p]));
                    }
                }
            } //movePath?
            
            
            
            
            //TRIGGERS/EVENTS

            
            j.angle = level.objs[i].angle;
            j.startAngle = level.objs[i].angle;
            j.rotation = level.objs[i].angle * (Math.PI / 180);
            
            if (j.body != null) {
                j.body.angle = level.objs[i].angle;
            }

            
            BALL.gameState.initObject(j);
        }
        
        
            for (var i in level.objs) {
                if (level.objs[i].triggers != null) {
                    j.triggers = [];
                    for (var a in level.objs[i].triggers) {
                        j.triggers[a] = new BALL.Trigger(BALL.gameState.getSpriteById(level.objs[i].triggers[a].parentID), level.objs[i].triggers[a].name);
                        j.triggers[a].setType(level.objs[i].triggers[a].type);
                        j.triggers[a].params = level.objs[i].triggers[a].params;
                        j.triggers[a].events = [];
                        for (var b in level.objs[i].triggers[a].events) {
                            j.triggers[a].events[b] = new BALL.Event(null, level.objs[i].triggers[a].events[b].name, null, 0);
                            j.triggers[a].events[b].setTarget(BALL.gameState.getSpriteById(level.objs[i].triggers[a].events[b].targetID));
                            j.triggers[a].events[b].setDelay(level.objs[i].triggers[a].events[b].delay);
                            if (level.objs[i].triggers[a].events[b].args != null && level.objs[i].triggers[a].events[b].args[0] != null) {
                                j.triggers[a].events[b].setParam1(level.objs[i].triggers[a].events[b].args[0]);
                            }
                            //SET TYPE LAST, SET TYPE CREATES/UPDATES EVENT FUNC
                            j.triggers[a].events[b].setType(level.objs[i].triggers[a].events[b].type);

                        }//events
                    }//triggers
                }//trigger?
            }
        
        for (var i in level.joints) {
            BALL.jointEditor.revJoints.push(level.joints[i]);
            game.physics.p2.createRevoluteConstraint(BALL.gameState.getSpriteById(level.joints[i].id1).body, level.joints[i].pos1, BALL.gameState.getSpriteById(level.joints[i].id2).body, level.joints[i].pos2, level.joints[i].power);
        }
        BALL.timer.init();
    }
    
}