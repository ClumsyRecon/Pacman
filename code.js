var move = setInterval(movePlayer, 1);
var map = ["BXXXXXXXXXXXXXXXXXXXB",
           "BX        X        XB",
           "BXPXX XXX X XXX XXPXB",
           "BX                 XB",
           "BX XX X XXXXX X XX XB",
           "BX    X   X   X    XB",
           "BXXXX XXXBXBXXX XXXXB",
           "BBBBX XBBB0BBBX XBBBB",
           "XXXXX XBXXGXXBX XXXXX",
           "LBBBB BBX123XBB BBBBR",
           "XXXXX XBXXXXXBX XXXXX",
           "BBBBX XBBBFBBBX XBBBB",
           "BXXXX XBXXXXXBX XXXXB",
           "BX        X        XB",
           "BX XX XXX X XXX XX XB",
           "BXP X     B     X PXB",
           "BXX X X XXXXX X X XXB",
           "BX    X   X   X    XB",
           "BX XXXXXX X XXXXXX XB",
           "BX                 XB",
           "BXXXXXXXXXXXXXXXXXXXB"
          ];
var size = 50;
var pacX = 500; //10
var pacY = 750; //11
var currentDir = "";
var nextDir = "";
var width = game.getBoundingClientRect().right - game.getBoundingClientRect().left;
var height = game.getBoundingClientRect().bottom - game.getBoundingClientRect().top;
var score = 0;
var pills = 0;
var powers = 0;
var pTime = 0;
var powerTimer = setInterval(checkPower, 1000);;
var ghosts = [
  {    name:    "red",
          x:    500,
          y:    350,
         sx:    500,
         sy:    450,
  direction:    "",
     justTP:    false
  },
  {    name:    "blue",
          x:    450,
          y:    450,
         sx:    500,
         sy:    450,
  direction:    "",
     justTP:    false
  },
  {    name:    "pink",
          x:    500,
          y:    450,
         sx:    500,
         sy:    450,
  direction:    "",
     justTP:    false
  },
  {    name:    "orange",
          x:    550,
          y:    450,
         sx:    500,
         sy:    450,
  direction:    "",
     justTP:    false
  }
];

init(true);
var patrol = setInterval(moveGhosts, 5);

function init(reset) {
  game.innerHTML = "<div id='pac' class='cell'></div>";
  for(var i=0;i<map.length;i++) {
    drawMap(i);
  }
  tpL.style.left = -size+"px";
  tpR.style.left = (width - 0.001) + "px";
  pacX = 500;
  pacY = 750;
  ghosts[0].x = 500;
  ghosts[0].y = 350;
  ghosts[1].x = 450;
  ghosts[1].y = 450;
  ghosts[2].x = 500;
  ghosts[2].y = 450;
  ghosts[3].x = 550;
  ghosts[3].y = 450;
  addMovement();

  if(reset) {
    score = 0;
  }
}

function drawMap(y) {
  for(var x=0;x<map[y].length;x++) {
    if(map[y][x] == "X") {
      game.innerHTML += "<div class='wall cell'></div>";
    }
    if(map[y][x] == "G") {
      game.innerHTML += "<div id='gate' class='cell'></div>";
    }
    for(var i=0;i<ghosts.length;i++) {
      if(map[y][x] == i.toString()) {
        game.innerHTML += "<div id='"+ghosts[i].name+"' class='cell ghost'></div><div class='path cell'></div>";
      }
    }
    if(map[y][x] == "F") {
      game.innerHTML += "<div id='fruitSpawner' class='cell'></div>";
    }
    if(map[y][x] == "B") {
      game.innerHTML += "<div class='path cell'></div>";
    }
    if(map[y][x] == " ") {
      game.innerHTML += "<div class='path cell'><div class='pill'></div></div>";
      pills += 1;
    }
    if(map[y][x] == "P") {
      game.innerHTML += "<div class='path cell'><div class='power'></div></div>";
      powers += 1;
    }
    if(map[y][x] == "L") {
      game.innerHTML += "<div class='path cell'></div><div id='tpL' class='tp cell'></div>";
    }
    if(map[y][x] == "R") {
      game.innerHTML += "<div class='path cell'></div><div id='tpR' class='tp cell'></div>";
    }
  }
}

// TODO: Fruit
spawnFruit("cherry");
function spawnFruit(name) {
  if(fruitSpawner.innerHTML != null) {
    fruitSpawner.innerHTML = "<div id='fruit' class='"+name+"' cell'></div>";
  }
}

function addMovement() {
  document.addEventListener('keydown', function(event) {
    if(event.keyCode == 32) {
      nextDir = "";
    }
    if(event.keyCode == 87) {
      nextDir = "up";
    }
    if(event.keyCode == 83) {
      nextDir = "down";
    }
    if(event.keyCode == 65) {
      nextDir = "left";
    }
    if(event.keyCode == 68) {
      nextDir = "right";
    }
  });
}

function overlap(rect1, rect2) {
  var flag = !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
  return flag;
}

function checkPath() {
  var canMove = true;
  if(pacX % size == 0 && pacY % size == 0) {
    var x = pacX / size;
    var y = pacY / size;
    if(currentDir == "left") {
      if(map[y][x-1] == "X") {
        canMove = false;
      }
    }
    if(currentDir == "right") {
      if(map[y][x+1] == "X") {
        canMove = false;
      }
    }
    if(currentDir == "up") {
      if(map[y-1][x] == "X") {
        canMove = false;
      }
    }
    if(currentDir == "down") {
      if(map[y+1][x] == "X" || map[y+1][x] == "G") {
        canMove = false;
      }
    }
  }
  return canMove;
}

function movePlayer() {
  if(pacX % size == 0 && pacY % size == 0) {
    currentDir = nextDir;
  }
  if(currentDir == "left" && pacX > 0 && checkPath()) {
    pacX -= 1;
  }
  if(currentDir == "right" && pacX < (width - size) && checkPath()) {
    pacX += 1;
  }
  if(currentDir == "up" && pacY > 0 && checkPath()) {
    pacY -= 1;
  }
  if(currentDir == "down" && pacY < (height - size) && checkPath()) {
    pacY += 1;
  }
  if(overlap(pac.getBoundingClientRect(),tpL.getBoundingClientRect())) {
    pacX = width - (size + 1);
  }
  if(overlap(pac.getBoundingClientRect(),tpR.getBoundingClientRect())) {
    pacX = 1;
  }
  for(var i=0;i<document.getElementsByClassName('pill').length;i++) {
    if(overlap(pac.getBoundingClientRect(),document.getElementsByClassName('pill')[i].getBoundingClientRect())) {
      eat(i);
    }
  }
  for(var i=0;i<document.getElementsByClassName('power').length;i++) {
    if(overlap(pac.getBoundingClientRect(),document.getElementsByClassName('power')[i].getBoundingClientRect())) {
      powerUp(i);
    }
  }
  pac.style.left = pacX + "px";
  pac.style.top = pacY + "px";
}

function checkGhost(i) {
  var canMove = true;
  if(ghosts[i].x % size == 0 && ghosts[i].y % size == 0) {
    var x = ghosts[i].x / size;
    var y = ghosts[i].y / size;
    if(ghosts[i].direction == "left") {
      if(map[y][x-1] == "X") {
        canMove = false;
      }
    }
    if(ghosts[i].direction == "right") {
      if(map[y][x+1] == "X") {
        canMove = false;
      }
    }
    if(ghosts[i].direction == "up") {
      if(map[y-1][x] == "X") {
        canMove = false;
      }
    }
    if(ghosts[i].direction == "down") {
      if(map[y+1][x] == "X" || map[y+1][x] == "G") {
        canMove = false;
      }
    }
    if(!canMove) {
      ghosts[i].direction == "";
    }
  }
  return canMove;
}

function randomAI(i) {
  var choice = Math.floor(Math.random()*5+1);
  switch (choice) {
   case 1:
     if(ghosts[i].direction != "right")  {
       ghosts[i].direction = "left";
     }
     break;
   case 2:
     if(ghosts[i].direction != "left")  {
       ghosts[i].direction = "right";
     }
     break;
   case 3:
     if(ghosts[i].direction != "down")  {
       ghosts[i].direction = "up";
     }
     break;
   case 4:
     if(ghosts[i].direction != "up") {
       ghosts[i].direction = "down";
     }
     break;
   default:
     // weighted choice
     switch (i) {
      case 0:
        if(ghosts[i].direction != "right")  {
          ghosts[i].direction = "left";
        }
        break;
      case 1:
        if(ghosts[i].direction != "left")  {
          ghosts[i].direction = "right";
        }
        break;
      case 2:
        if(ghosts[i].direction != "down")  {
          ghosts[i].direction = "up";
        }
        break;
      case 3:
        if(ghosts[i].direction != "up") {
          ghosts[i].direction = "down";
        }
        break;
      }
  }
}

function moveGhosts() {
  for(var i=0;i<ghosts.length;i++) {
    if(ghosts[i].x % size == 0 && ghosts[i].y % size == 0) {
      randomAI(i);
      if(ghosts[i].x > 800 && ghosts[i].y == 450 && ghosts[i].justTP) {
        ghosts[i].direction = "left";
      }
      if(ghosts[i].x < 200 && ghosts[i].y == 450 && ghosts[i].justTP) {
        ghosts[i].direction = "right";
      }
    }

    var ghost = document.getElementById(ghosts[i].name);

    if(overlap(ghost.getBoundingClientRect(),pac.getBoundingClientRect())) {
      if(pTime > 0 && ghost.classList.contains('powered')) {
        ghosts[i].x = ghosts[i].sx;
        ghosts[i].y = ghosts[i].sy;
        ghost.classList.remove('powered');
        updateScore(200);
      } else {
        init(true);
      }
    }
    if(overlap(ghost.getBoundingClientRect(),tpL.getBoundingClientRect())) {
      ghosts[i].x = width - (size + 1);
      ghosts[i].justTP = true;
      ghosts[i].direction = "left";
    }
    if(overlap(ghost.getBoundingClientRect(),tpR.getBoundingClientRect())) {
      ghosts[i].x = 1;
      ghosts[i].justTP = true;
      ghosts[i].direction = "right";
    }

    if(ghosts[i].direction == "left" && ghosts[i].x > 0 && checkGhost(i)) {
      ghosts[i].x -= 1;
    }
    if(ghosts[i].direction == "right" && ghosts[i].x < (width - size) && checkGhost(i)) {
      ghosts[i].x += 1;
    }
    if(ghosts[i].direction == "up" && ghosts[i].y > 0 && checkGhost(i)) {
      ghosts[i].y -= 1;
    }
    if(ghosts[i].direction == "down" && ghosts[i].y < (height - size) && checkGhost(i)) {
      ghosts[i].y += 1;
    }

    ghost.style.left = ghosts[i].x + "px";
    ghost.style.top = ghosts[i].y + "px";
  }
}

function eat(i) {
  document.getElementsByClassName('pill')[i].style.display = "none";
  pills -= 1;
  updateScore(10);
}

function powerUp(i) {
  document.getElementsByClassName('power')[i].style.display = "none";
  powers -= 1;
  for(var i=0;i<ghosts.length;i++) {
    document.getElementById(ghosts[i].name).classList.add('powered');
  }
  pTime = 12;
  updateScore(10);
}

function checkPower() {
  time.innerHTML = "Power: "+pTime;
  if(pTime <= 0) {
    for(var i=0;i<ghosts.length;i++) {
      document.getElementById(ghosts[i].name).classList.remove('powered');
    }
  } else {
    pTime -= 1;
  }
}

function updateScore(num) {
  score += num;
  points.innerHTML = "Score: " + score;
  if(pills <= 0 && powers <= 0) {
    init(false);
  }
}
