// ARCHIVED: 4/3/2025 3:22 PM UTC

// water sort ad recreation
// basically i saw this ad about sorting water into tubes and i wanted to recreate the game shown in the ad, this will be a keyboard game for simplicity
// Controls: ASD, press to select and press again to pour

// Changelog:
// 1.1: Added ERROR liquid and genius rating system.
// 1.2: Added new genius system and orientation and stuff.
// 1.3 IN DEV

textAlign(CENTER);
frameRate(60);

var selected = 0; // current selection, 1-3 if selected, 0 if idle
var level = 0;    // the "intelligence meter", state 0 to 6
var leint = 0;    // the level integer, state 0 to 90 integer
var genius = 0;   // actual level, state 0 to 6 integer
var movement = 0; // movement case, -1 to 1
var message = "Help me reach BLUE";
var rate = 30;    // How exaggerated the rotation is, in degrees.

var tube = [undefined, // Tube state 2d Array
    [0, 1, 2], // 0 = air, 1 = blue, 2 = red
    [0, 1, 2], // 0 = air, 1 = blue, 2 = red
    [0, 1, 2]  // 0 = air, 1 = blue, 2 = red
];

var geniusrender = [ // Genius Rendering 1D Array
    "❎", // State 0
    "🙃", // State 1
    "🤨", // State 2
    "🥳", // State 3
    "😎", // State 4
    "😍", // State 5
    "🤩"  // State 6
];

var renderTubes = function(x, y) {
    var blue = x===selected?color(0, 0, 200):color(0, 0, 255);
    var red = x===selected?color(200, 0, 0):color(255, 0, 0);
    var air = x===selected?color(200):color(255);
    var invalid = x===selected?color(128):color(200);
    var state = tube[x][y];
    fill(state===0?air:(state===1?blue:(state===2?red:invalid)));
    rect((width/3)*(x-1)+5, (height/3-20)*y+59, x===3?width/3-11:width/3-10, height/3-20, 20);
};

var renderBack = function() {
    fill(225);
    rect(5, 59, width/3-10, height-60, 20);
    rect((width/3)+5, 59, width/3-10, height-60, 20);
    rect((width/3)*2+5, 59, width/3-11, height-60, 20);
    rect(5, 59, width/3-10, height-80);
    rect((width/3)+5, 59, width/3-10, height-80);
    rect((width/3)*2+5, 59, width/3-11, height-80);
};

var renderGenius = function() {
    var gen = Math.round((leint - 7) / 15);
    var h = 15;
    line(0, 60, 0, 60-h);
    line(width/3, 60, width/3, 60-h);
    line(width/3*2, 60, width/3*2, 60-h);
    line(width-1, 60, width-1, 60-h);
    fill(0);
    textSize(20);
    text(message, width/2, 20);

    // Rotate text based on movement
    if (movement !== 0) {
        pushMatrix();
        translate(width * (level / 6), 40);
        rotate(movement * rate);
        text(geniusrender[gen], 0, 0);
        popMatrix();
    } else {
        text(geniusrender[gen], width*(level/6), 40);
    }
};

var sortGenius = function(item) {
    var blueCount = 0;
    var redCount = 0;

    for (var i = 0; i < 3; i++) {
        if (item[i] === 1) {
            blueCount++;
        } else if (item[i] === 2) {
            redCount++;
        }
    }

    // Scoring logic:
    if (blueCount === 3) {
        return 4; // All blue = 4 points
    } else if (redCount === 3) {
        return 2; // All red = 2 points
    } else if (blueCount === 2) {
        return 2; // Two blue = 2 points
    } else if (redCount === 2) {
        return 1; // Two red = 1 point
    } else {
        return 0; // One red/blue or no colors = 0 points
    }
};

var rateGenius = function() {
    var score = 0;
    for (var i = 1; i < 4; i++) {
        score += sortGenius(tube[i]);
    }
    genius = score;
};

var smoothMovement = function() {
    if(level < genius) {
        leint++;
        movement = 1;
    } else if(level > genius) {
        leint--;
        movement = -1;
    } else {
        movement = 0;
    }
    level = leint/15;
    if(Math.abs(leint-(genius*15)) === 1) {
        movement = movement / 2;
    }
};

draw = function() {
    color(level>6?level=6:(level<0?level=0:undefined));
    background(255);
    renderBack();
    for(var x = 1; x < 4; x++) {
        for(var y = 0; y < 3; y++) {
            renderTubes(x, y);
        }
    }
    rateGenius();
    smoothMovement();
    renderGenius();
};

var transport = function(New) {
    var to = tube[New];
    var from = tube[selected];
    var froml = -1;
    for(var i = 0; i < 3; i++) {
        if(from[i]>0 && froml === -1) {var froml = i;}
    }
    var tol = 2;
    if(to[2]>0) {tol = 1;}
    if(to[1]>0) {tol = 0;}
    if(to[0]>0) {tol = -1;}
    //println(tol);
    //println(froml);
    if(tol>-1) {
        to[tol] = from[froml];
        from[froml] = 0;
    }
};

keyReleased = function() {
    if(selected === 0) {
        if (key.toString() === "a") {selected = 1;}
        else if (key.toString() === "s") {selected = 2;}
        else if (key.toString() === "d") {selected = 3;}
    } else {
        var New = key.toString() === "a" ? 1 : (
            key.toString() === "s" ? 2 : (
                key.toString() === "d" ? 3 : selected
            )
        );
        if(selected !== New) {
            transport(New);
        }
        selected = 0;
    }
};
