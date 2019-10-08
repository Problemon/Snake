"use strict"

function drawBackground (ctx, blockSize, widthInBlocks, heightInBlocks, size) {
  drawBackgroundSquares(ctx, blockSize, widthInBlocks, heightInBlocks);
  drawBorder(ctx, blockSize, size);
}

function circle (x, y, radius, fillCircle) {
  gameplayCtx.beginPath();
  gameplayCtx.arc(x, y, radius, Math.PI * 2, false);
  fillCircle ? gameplayCtx.fill() : gameplayCtx.stroke();
}

function drawBackgroundSquares (ctx, blockSize, widthInBlocks, heightInBlocks) {
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
 
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
}

function drawBorder (ctx, blockSize, size) {
  ctx.fillStyle = "Gray";
  ctx.fillRect(0, 0, blockSize, size); // left border
  ctx.fillRect(0, 0, size, blockSize); // top border
  ctx.fillRect(size - blockSize, 0, blockSize, size); // right border
  ctx.fillRect(0, size - blockSize, size, blockSize); // bottom border
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