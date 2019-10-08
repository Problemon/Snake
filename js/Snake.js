"use strict"

let canvas = document.querySelector(".canvas"),
    ctx    = canvas.getContext("2d");

let boxRestartGame = document.querySelector(".restart-game");

let size;
let blockSize,
    widthInBlocks,
    heightInBlocks;

let score = 0;
let speed = 100;

let pause = false;
let endGame = false;


// Sets adaptability
function setsSize () {

  function setsSizeCanvas (size) {
    canvas.width  = size;
    canvas.height = size;
  };

  if (window.innerWidth  >= 400 && window.innerHeight >= 400) {
  	if (window.innerWidth < window.innerHeight) {
  		setsSizeCanvas(window.innerWidth);
  	} else {
  		setsSizeCanvas(window.innerHeight);
  	}
  } else {
  	setsSizeCanvas(400);
  }

	if (window.innerWidth >= 800 && window.innerHeight >= 800) {
    setsSizeCanvas(800);
	}

	size = canvas.width; // Since it is a square, one can choose the height
  
	boxRestartGame.style["margin-top"] = `${size / 1.5}px`;
	document.body.style ["font-size"]  = `${size / 50}px`;

	blockSize      = size / 40;
	widthInBlocks  = size / blockSize;
	heightInBlocks = size / blockSize;
};

setsSize();

window.addEventListener("resize", () => {
  setsSize();
  drawBackgroundSquares();
  drawBorder();
  snake.draw();
  apple.draw();
  drawScore();
  // if (pause) drawBackgroundMenu();
  if (endGame) drawGameOver();
});


function gameLoop () {
	intervalId = setInterval( () => {
	  ctx.clearRect(0, 0, size, size);

    drawBackgroundSquares();
	  drawBorder();

	  snake.draw();
	  apple.draw();
	  snake.move();
    
	  drawScore();
	}, speed);
};

function pauseGame () {
  pause ? clearInterval(intervalId) : gameLoop();
  showMenu();
};

function showMenu () {
  let menuInGame  = document.querySelector(".menu"),
      resumeGame  = document.querySelector(".resume-game"),
      newGame     = document.querySelector(".new-game");

  // drawBackgroundMenu();

  resumeGame.onclick = () => {
  	pause = !pause;
  	pauseGame();
  }

  newGame.onclick = () => {
  	pause = !pause;
  	pauseGame();
  	createNewGame();
  }

  if (pause) {
  	menuInGame.style.display = "block";
  } else {
  	menuInGame.style.display = "none";
  }
};

function createNewGame () {
	score = 0;
  speed = 100;
	endGame = false;
  snake = new Snake();
  apple = new Apple();
};

function circle (x, y, radius, fillCircle) {
  ctx.beginPath();
  ctx.arc(x, y, radius, Math.PI * 2, false);
  fillCircle ? ctx.fill() : ctx.stroke();
};

function gameOver () {
	clearInterval(intervalId);
	endGame = true;
  
  boxRestartGame.style.display = "flex";

  let buttonRestart = document.querySelector(".restart");
  buttonRestart.onclick = () => {
  	boxRestartGame.style.display = "none";
  	createNewGame();
  	gameLoop();
  }
};

function drawBackgroundSquares () {
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"

	// Draw columns
	for (let i = 2; i < widthInBlocks - 1; i++) {
		ctx.beginPath();
		ctx.moveTo(i * blockSize, 0);
		ctx.lineTo(i * blockSize, (heightInBlocks - 1) * blockSize);
		ctx.stroke();
	}
  // Draw rows
	for (let i = 2; i < heightInBlocks - 1; i++) {
		ctx.beginPath();
		ctx.moveTo(0, i * blockSize);
		ctx.lineTo((widthInBlocks - 1) * blockSize, i * blockSize);
		ctx.stroke();
	}
};

function drawBorder () {
  ctx.fillStyle = "Gray";
  ctx.fillRect(0, blockSize, blockSize, size); // left border
  ctx.fillRect(0, 0, size, blockSize); // top border
  ctx.fillRect(size - blockSize, blockSize, blockSize, size); // right border
  ctx.fillRect(0, size - blockSize, size, blockSize); // bottom border
};

function drawScore () {
	ctx.font         = `600 ${String(size / 21)}px Arial`;
	ctx.fillStyle    = "Black";
	ctx.textBaseline = "top";
	ctx.textAlign    = "left";

	ctx.fillText(`Score: ${score}`, blockSize, blockSize);
};

function drawGameOver () {
  ctx.font         = `${String(size / 6.6)}px Impact`;
	ctx.fillStyle    = "#616161";
	ctx.textBaseline = "middle";
	ctx.textAlign    = "center";
	ctx.fillText("Game over", size / 2, size / 2);
};


function getRandomCoordinate () {
  return Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
}


function Block (col, row) {
  this.col = col;
  this.row = row;
};

Block.prototype.drawSquare = function (color) {
  let x = this.col * blockSize,
      y = this.row * blockSize;

  ctx.fillStyle = color;
  ctx.fillRect(x, y, blockSize, blockSize);
  ctx.strokeStyle = "black";
  ctx.strokeRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function (color)  {
	let radius  = blockSize / 2,
	    centerX = this.col * blockSize + radius,
	    centerY = this.row * blockSize + radius;
  
  ctx.fillStyle = color;
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
	  ctx.linewidth = 1;
	  ctx.fillStyle = color;
	  ctx.beginPath();
	  circle(x1, y1, 3, true);
    circle(x2, y2, 3, true);
	}

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
	]

	this.direction = "right";
	this.newDirection = "right";
};

Snake.prototype.draw = function () {
	this.segments[0].drawHead(this.direction)

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
  	return;
  }

  this.segments.unshift(newHead);
  
  if (newHead.equal(apple.position)) {
    score++;
    speed--;
    clearInterval(intervalId);
    gameLoop();
    
    apple.move(this.segments);
    return
  } else {
  	this.segments.pop();
  }
}

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
}

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
};

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