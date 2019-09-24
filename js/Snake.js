"use strict";

let  gameplay      = document.querySelector(".gameplay"),
     gameplayCtx   = gameplay.getContext("2d");

let boxRestartGame = document.querySelector(".restart-game");

let size,
    blockSize,
    widthInBlocks,
    heightInBlocks;

let score = 0;
let speed = 100;

let pause = false;
let endGame = false;


// Sets adaptability
function setsSize () {
  function setsSizegameplay (size) {
    gameplay.width  = size;
    gameplay.height = size;
  }

  if (window.innerWidth  >= 400 && window.innerHeight >= 400) {
    if (window.innerWidth < window.innerHeight) {
      setsSizegameplay(window.innerWidth);
    } else {
      setsSizegameplay(window.innerHeight);
    }
  } else {
    setsSizegameplay(400);
  }

  if (window.innerWidth >= 800 && window.innerHeight >= 800) {
    setsSizegameplay(800);
  }

  size = gameplay.width; // Since it is a square, one can choose the height
  
  boxRestartGame.style["margin-top"] = `${size / 1.5}px`;
  document.body.style ["font-size"]  = `${size / 50}px`;

  blockSize      = size / 40;
  widthInBlocks  = size / blockSize;
  heightInBlocks = size / blockSize;
}

setsSize();

window.addEventListener("resize", () => {
  setsSize();
  drawBackgroundSquares();
  drawScore();
  drawBorder();
  snake.draw();
  apple.draw();
  if (endGame) drawGameOver();
});

function gameLoop () {
  intervalId = setInterval( () => {
    gameplayCtx.clearRect(0, 0, size, size);
    drawScore();
    drawBackgroundSquares();
    drawBorder();

    snake.draw();
    apple.draw();
    snake.move();
    
  }, speed);
}

function pauseGame () {
  pause ? clearInterval(intervalId) : gameLoop();
  showMenu();
}

function showMenu () {
  let menuInGame  = document.querySelector(".menu-buttons"),
      resumeGame  = document.querySelector(".resume-game"),
      newGame     = document.querySelector(".new-game");

  resumeGame.onclick = () => {
  	pause = !pause;
  	pauseGame();
  };

  newGame.onclick = () => {
    pause = !pause;
    pauseGame();
    createNewGame();
  };

  if (pause) {
    menuInGame.style.display = "block";
  } else {
    menuInGame.style.display = "none";
  }
}

function createNewGame () {
  score = 0;
  speed = 100;
  endGame = false;
  snake = new Snake();
  apple = new Apple();
}

function circle (x, y, radius, fillCircle) {
  gameplayCtx.beginPath();
  gameplayCtx.arc(x, y, radius, Math.PI * 2, false);
  fillCircle ? gameplayCtx.fill() : gameplayCtx.stroke();
}

function gameOver () {
  clearInterval(intervalId);
  endGame = true;
  gameplayCtx.clearRect(0, 0, size, size);
  drawScore();
  drawBackgroundSquares();
  drawBorder();

  snake.draw();
  apple.draw();

  
  boxRestartGame.style.display = "flex";

  let buttonRestart = document.querySelector(".restart");
  buttonRestart.onclick = () => {
    boxRestartGame.style.display = "none";
    createNewGame();
    gameLoop();
  };
}

function drawBackground () {
  drawBackgroundSquares();
  drawBorder();
}

function drawBackgroundSquares () {
  gameplayCtx.lineWidth = 0.5;
  gameplayCtx.strokeStyle = "rgba(0, 0, 0, 0.5)";
 
  // Draw columns
  for (let i = 2; i < widthInBlocks - 1; i++) {
    gameplayCtx.beginPath();
    gameplayCtx.moveTo(i * blockSize, 0);
    gameplayCtx.lineTo(i * blockSize, (heightInBlocks - 1) * blockSize);
    gameplayCtx.stroke();
  }
  // Draw rows
  for (let i = 2; i < heightInBlocks - 1; i++) {
    gameplayCtx.beginPath();
    gameplayCtx.moveTo(0, i * blockSize);
    gameplayCtx.lineTo((widthInBlocks - 1) * blockSize, i * blockSize);
    gameplayCtx.stroke();
  }
}

function drawBorder () {
  gameplayCtx.fillStyle = "Gray";
  gameplayCtx.fillRect(0, blockSize, blockSize, size); // left border
  gameplayCtx.fillRect(0, 0, size, blockSize); // top border
  gameplayCtx.fillRect(size - blockSize, blockSize, blockSize, size); // right border
  gameplayCtx.fillRect(0, size - blockSize, size, blockSize); // bottom border
}

function drawScore () {
  gameplayCtx.textBaseline = "top";
  gameplayCtx.textAlign    = "center";

  if (!endGame) {
    gameplayCtx.font         = `600 ${String(size / 19)}px Poppins`;
    gameplayCtx.fillStyle    = "rgba(100, 100, 100, 0.6)";
    gameplayCtx.fillText(`${score}`, size / 2, blockSize);
  } else {
    gameplayCtx.font         = `600 ${String(size / 7)}px Poppins`;
    gameplayCtx.fillStyle    = "#616161";
    gameplayCtx.fillText(`${score}`, size / 2, size / 3.5);
  }
}

function drawGameOver () {
  gameplayCtx.font         = `${String(size / 6.6)}px Impact`;
  gameplayCtx.fillStyle    = "#616161";
  gameplayCtx.textBaseline = "middle";
  gameplayCtx.textAlign    = "center";
  gameplayCtx.fillText("Game over", size / 2, size / 2);
}


function getRandomCoordinate () {
  return Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
}


function Block (col, row) {
  this.col = col;
  this.row = row;
}

Block.prototype.drawSquare = function (color) {
  let x = this.col * blockSize,
      y = this.row * blockSize;

  gameplayCtx.fillStyle = color;
  gameplayCtx.fillRect(x, y, blockSize, blockSize);
  gameplayCtx.strokeStyle = "black";
  gameplayCtx.strokeRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function (color)  {
  let radius  = blockSize / 2,
      centerX = this.col * blockSize + radius,
      centerY = this.row * blockSize + radius;
  
  gameplayCtx.fillStyle = color;
  circle(centerX, centerY, radius, true); 
};

Block.prototype.equal = function (otherBlock) {
  return this.col == otherBlock.col && this.row == otherBlock.row;
};

Block.prototype.drawHead = function (direction) {
  let x = this.col * blockSize,
      y = this.row * blockSize;

  this.drawSquare("Green");

  let eyes = function (x1, y1, x2, y2, color = "black") {
    gameplayCtx.linewidth = 1;
    gameplayCtx.fillStyle = color;
    gameplayCtx.beginPath();
    circle(x1, y1, 3, true);
    circle(x2, y2, 3, true);
  };

  // Draw Eyes
  if (direction == "up") {
    eyes(x + 2, y + 2, x + blockSize - 2, y + 2);
  } else if (direction == "right") {
    eyes(x + blockSize - 2, y + 2, x + blockSize - 2, y + blockSize - 2);
  } else if (direction == "down") {
    eyes(x + blockSize - 2, y + blockSize - 2, x + 2, y + blockSize - 2);
  } else if (direction == "left") {
    eyes(x + 2, y + blockSize - 2, x + 2, y + 2);
  }
};


function Snake () {
  this.segments = [
    new Block(3, heightInBlocks / 2),
    new Block(2, heightInBlocks / 2),
    new Block(1, heightInBlocks / 2),
  ];

  this.direction = "right";
  this.newDirection = "right";
}

Snake.prototype.draw = function () {
  this.segments[0].drawHead(this.direction);

  for (let i = 1; i < this.segments.length; i++) {
    this.segments[i].drawSquare("Green");
  }
};

Snake.prototype.move = function () {
  let head = this.segments[0],
      newHead;

  this.direction = this.newDirection;

  if (this.direction == "left") {
    newHead = new Block(head.col - 1, head.row);
  } else if (this.direction == "up") {
    newHead = new Block(head.col, head.row - 1);
  } else if (this.direction == "right") {
    newHead = new Block(head.col + 1, head.row);
  } else if (this.direction == "down") {
    newHead = new Block(head.col, head.row + 1);
  }

  if (this.checkCollision(newHead)) {
    gameOver();
    drawGameOver();
    drawScore();
    return;
  }

  this.segments.unshift(newHead);
  
  if (newHead.equal(apple.position)) {
    score++;
    speed--;
    clearInterval(intervalId);
    gameLoop();
    
    apple.move(this.segments);
    return;
  } else {
    this.segments.pop();
  }
};

Snake.prototype.setDirection = function (newDirection) {
  if (this.direction == "left" && newDirection == "right") {
    return;
  } else if (this.direction == "up"    && newDirection == "down") {
    return;
  } else if (this.direction == "right" && newDirection == "left") {
    return;
  } else if (this.direction == "down"  && newDirection == "up") {
    return;
  }

  this.newDirection = newDirection;
};

Snake.prototype.checkCollision = function (head) {
  let leftCollision   = (head.col == 0),
      topCollision    = (head.row == 0),
      rightCollision  = (head.col == widthInBlocks  - 1),
      bottomCollision = (head.row == heightInBlocks - 1);

  let borderCollision = leftCollision  || topCollision || 
                        rightCollision || bottomCollision;
  
  let selfCollision = false;

  for (let i = 1; i < this.segments.length; i++) {
    if( head.equal(this.segments[i]) ) selfCollision = true;
  }

  if (borderCollision || selfCollision) return true;
};


function Apple () {
  this.position = new Block (getRandomCoordinate(), getRandomCoordinate());
}

Apple.prototype.draw = function () {
  this.position.drawCircle("Red");
};

Apple.prototype.move = function (bodySnake) {
  while (true) {
    let position = new Block (getRandomCoordinate(), getRandomCoordinate());
    let inSnake = bodySnake.some((item) => item.equal(position));

    if (!inSnake) {
      this.position = position;
      break;
    }
  }
};


let snake,
    apple,
    intervalId;

createNewGame();
drawBackground();
gameLoop();

let directions = {
  37: "left",
  38: "up",
  39: "right",
  40: "down"
};

document.body.addEventListener("keydown", (event) => {
  let newDirection = directions[event.keyCode];
  
  // Setting of the direction
  if (newDirection != undefined && !pause) {
    snake.setDirection(newDirection);
  }
  
  // Set pause
  if (event.keyCode == 27 && !endGame) {
    pause = !pause;
    pauseGame();
  }
});