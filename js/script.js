"use strict";

let gameplay      = document.querySelector(".gameplay"),
    gameplayCtx   = gameplay.getContext("2d");

let boxRestartGame = document.querySelector(".restart-game");
let customization = document.querySelector(".customization");
let partsOfSnake = document.querySelectorAll(".segment");
let partsOfSnakeAnimation = document.querySelectorAll(".segment-animation");
let arrow = document.querySelector(".arrow");
let RGBForm = document.querySelectorAll(".colors-rgb");
let intervalIdAnimation;

let size, blockSize, widthInBlocks, heightInBlocks;
let score = 0;
let speed = 100;
let pause = false;
let endGame = false;


function drawingObjects () {
  drawScore();
  drawBackground(gameplayCtx, blockSize, widthInBlocks, heightInBlocks, size);

  snake.draw();
  apple.draw();
}

// Sets adaptability
function setsSize () {
  function setsSizeGameplay (size) {
    gameplay.width  = size;
    gameplay.height = size;
  }

  if (window.innerWidth  >= 400 && window.innerHeight >= 400) {
    if (window.innerWidth < window.innerHeight) {
      setsSizeGameplay(window.innerWidth);
    } else {
      setsSizeGameplay(window.innerHeight);
    }
  } else {
    setsSizeGameplay(400);
  }

  if (window.innerWidth >= 800 && window.innerHeight >= 800) {
    setsSizeGameplay(800);
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
  drawingObjects();
  if (endGame) drawGameOver();
});

function gameLoop () {
  intervalId = setInterval( () => {
    gameplayCtx.clearRect(0, 0, size, size);
    drawingObjects();
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
      newGame     = document.querySelector(".new-game"),
      customizationBtn       = document.querySelector(".customization-btn");

  resumeGame.onclick = () => {
  	pause = !pause;
  	pauseGame();
  };

  newGame.onclick = () => {
    pause = !pause;
    pauseGame();
    createNewGame();
  };

  customizationBtn.onclick = () => {
    customization.style.display = "flex";
    
    let segment = 0;

    partsOfSnakeAnimation.forEach( (item, id) => {item.style["background-color"] = partsOfSnake[id].style["background-color"]})

    // Shows color number in RGB fields.
    partsOfSnake.forEach( (i, index) => {
      i.onclick = () => {
        partsOfSnake.forEach( (item) => {item.classList.remove("active")}) // Removing the class "active" from all elements
        i.classList.add("active");

        arrow.style.cssText = `
          left: ${1.15 + 3.13 * index}em;
          display: block;
        `
        segment = index;
        let styleArr = i.style["background-color"].slice(4, -1).split(", ");

        ColorPicker(
          document.getElementById('color-picker'),
    
          function(hex, hsv, rgb) {
              partsOfSnake[segment].style.backgroundColor = hex;
              partsOfSnakeAnimation[segment].style.backgroundColor = hex;       // #HEX
              styleArr = i.style["background-color"].slice(4, -1).split(", ");
              RGBForm.forEach( (item, id) => {
                item.value = styleArr[id];
              })
          });

        RGBForm.forEach( (item, id) => {
          item.value = styleArr[id];
        })
      }

      // To select the first segment.
      partsOfSnake[segment].click();

      // If changed the value in the field that changes the color of the snake.
      RGBForm.forEach( (item, id) => {
        item.oninput = () => {
          if (+item.value > 255) item.value = "255";
          if (item.value.length > 3) item.value = item.value.slice(0, 3);

          let changedColor = partsOfSnake[segment].style["background-color"].slice(4, -1).split(", ");
          changedColor[id] = item.value;

          partsOfSnake[segment].style["background-color"] = `rgb(${changedColor.join(", ")})`;
          partsOfSnakeAnimation[segment].style["background-color"] = `rgb(${changedColor.join(", ")})`;
        }
      })
    })
    
    let apply = document.querySelector(".apply");
    apply.onclick = () => {
      partsOfSnake.forEach( (item, id) => {
        colors[id] = item.style["background-color"];
      })
    }

    let back = document.querySelector(".back");
    back.onclick = () => {
      closeCustomization();
    }
  }

  if (pause) {
    menuInGame.style.display = "block";
  } else {
    menuInGame.style.display = "none";
  }
}

function closeCustomization () {
  customization.style.display = "none";
  partsOfSnake.forEach( (item, id) => {
    item.style["background-color"] = colors[id];
  })
}

function createNewGame () {
  score = 0;
  speed = 100;
  endGame = false;
  snake = new Snake();
  apple = new Apple();
}

function gameOver () {
  clearInterval(intervalId);
  endGame = true;
  gameplayCtx.clearRect(0, 0, size, size);
  drawingObjects();

  boxRestartGame.style.display = "flex";

  let buttonRestart = document.querySelector(".restart");
  buttonRestart.onclick = () => {
    boxRestartGame.style.display = "none";
    createNewGame();
    gameLoop();
  };
}

function getRandomCoordinate () {
  return Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
}


let snake, apple, intervalId;

createNewGame();
drawBackground(gameplayCtx, blockSize, widthInBlocks, heightInBlocks, size);
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
    if (customization.style.display === "flex" && pause) {
      closeCustomization();
    } else {
      pause = !pause;
      pauseGame();
    }

  }
});