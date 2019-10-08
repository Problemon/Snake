"use strict"
let colors = [];

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

function Snake () {

  for (let i = 0; i < 3; i++) {
    colors.push( `rgb(0, 148, 0)` )
    partsOfSnake[i].style["background-color"] = colors[i];
  }

  this.segments = [
    new Block(3, heightInBlocks / 2),
    new Block(2, heightInBlocks / 2),
    new Block(1, heightInBlocks / 2),
  ];

  this.direction = "right";
  this.newDirection = "right";
}

Snake.prototype.draw = function () {
  let drawHead = function (direction, head, color) {
    let x = head.col * blockSize,
        y = head.row * blockSize;

    head.drawSquare(color);

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

  let numberOfSegment = 1;
  drawHead(this.direction, this.segments[0], colors[0]);

  for (let i = 1; i < this.segments.length; i++) {
    switch (numberOfSegment) {
      case 1:
        this.segments[i].drawSquare(colors[1]);
        break;
      case 2:
        this.segments[i].drawSquare(colors[2]);
        numberOfSegment = 0;
        break;
    }
    numberOfSegment++;
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