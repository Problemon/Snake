"use strict"

let cvs = document.querySelector(".canvas"),
    ctx = cvs.getContext("2d"),
    width = cvs.width,
    height = cvs.height;

let blockSize = width / 40,
    widthInBlocks = width / blockSize,
    heightInBlocks = height / blockSize;

let score = 0;
let animationTime = 100;
let GameOver = false;

////BLOCK////
function Block (col, row) {
  this.col = col;
  this.row = row;
};

Block.prototype.drawSquare = function (color) {
  let x = this.col * blockSize,
      y = this.row * blockSize;

  ctx.fillStyle = color;
  ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function (color) {
  let centerX = this.col * blockSize + blockSize / 2,
      centerY = this.row * blockSize + blockSize / 2;

  ctx.fillStyle = color;
  circle(centerX, centerY, blockSize / 2, true)
};

Block.prototype.equal = function (otherBlock) {
  return this.col === otherBlock.col && this.row === otherBlock.row;
};
////Block////

////SNAKE////
function Snake () {
  this.segments = [
    new Block(7, 5),
    new Block(6, 5),
    new Block(5, 5)
  ];

  this.direction = "right";
  this.nextDirection = "right";
};

Snake.prototype.draw = function () {
  this.segments[0].drawSquare("#3ec162") //head

  for (let i = 1; i < this.segments.length; i++) {
    if (i % 2 == 0) {
      this.segments[i].drawSquare("#D3E817")
    } else {
      this.segments[i].drawSquare("#2C17E8")
    }
  }
};

Snake.prototype.move = function () {
  let head = this.segments[0];
  let newHead;

  this.direction = this.nextDirection;

  if (this.direction === "right") {
    newHead = new Block(head.col + 1, head.row);
  } else if (this.direction === "down") {
    newHead = new Block(head.col, head.row + 1);
  } else if (this.direction === "left") {
    newHead = new Block(head.col - 1, head.row);
  } else if (this.direction === "up") {
    newHead = new Block(head.col, head.row - 1);
  }

  if (this.checkCollision(newHead)) {
    gameOver();
    return;
  }

  this.segments.unshift(newHead);

  if (newHead.equal(apple.position)) {
    score++;
    animationTime--;
    

    apple.move();
  } else {
    this.segments.pop();
  }
};

Snake.prototype.checkCollision = function (head) {
  let leftCollision = (head.col === 0),
      topCollision = (head.row === 0),
      rightCollision = (head.col === widthInBlocks - 1),
      bottomCollision = (head.row === heightInBlocks - 1);

  let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;

  let selfCollision = false;

  for (let i = 0; i < this.segments.length; i++) {
    if (head.equal(this.segments[i])) {
      selfCollision = true;
    }
  }

  return wallCollision || selfCollision;
};

Snake.prototype.setDirection = function (newDirection) {

  if (this.direction === "up" && newDirection === "down") {
    return
  } else if (this.direction === "down" && newDirection === "up") {
    return;
  } else if (this.direction === "left" && newDirection === "right") {
    return
  } else if (this.direction === "right" && newDirection === "left") {
    return;
  }
  
  this.nextDirection = newDirection;
};
////SNAKE////

////APPLE////
function Apple () {
  this.position = new Block(10, 10);
};

Apple.prototype.draw = function () {
  this.position.drawCircle("#df5620")
};

Apple.prototype.move = function () {
  let inSnake = true;
  while (inSnake) {
    let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1,
        randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    for (let i = 0; i < snake.segments.length; i++) {

      if (!(snake.segments[i].col === randomCol && snake.segments[i].row === randomRow)) {
        inSnake = false;
        this.position = new Block(randomCol, randomRow);
      }
    }
  }

  
}

////FUNCTIONS////
function circle (x, y, radius, fillCircle) {
  ctx.beginPath();
  ctx.arc(x, y, radius, Math.PI * 2, false);

  if (fillCircle) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
};

function drawBorder () {
  ctx.fillStyle = "Gray";
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height); 
};

function drawScore () {
  ctx.font = "20px Courier";
  ctx.fillStyle = "Black";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`Счет: ${score}`, blockSize, blockSize);
};

function gameOver () {
  GameOver = true;
  ctx.font = "60px Courier";
  ctx.fillStyle = "Black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Конец игры", width / 2, height / 2);
};
////FUNCTIONS////

let snake = new Snake(),
    apple = new Apple();

function gameLoop () {
    ctx.clearRect(0, 0, width, height);
    drawBorder();

    snake.move();
    snake.draw();
    apple.draw();

    drawScore();
  if (!GameOver) {
    setTimeout(gameLoop, animationTime);
  }
};
gameLoop();
let directions = {
  37: "left",
  38: "up",
  39: "right",
  40: "down"
};

document.body.addEventListener("keydown", (event) => {
  let newDirection = directions[event.keyCode];
  if (newDirection != undefined) {
    snake.setDirection(newDirection);
  }
});
