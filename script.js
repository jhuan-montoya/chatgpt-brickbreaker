// Get the canvas element and context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set the initial ball position and speed
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballRadius = 10;
let ballSpeedX = 3;
let ballSpeedY = -3;

// Set the initial paddle position and size
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// Set the initial brick properties
let brickRowCount = 3;
let brickColumnCount = 3;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

// Set the initial score and lives
let score = 0;
let lives = 3;

// Set the game over flag
let gameOver = false;

// Create the bricks array
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Draw the ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Draw the paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Move the paddle using arrow keys
let rightPressed = false;
let leftPressed = false;
document.addEventListener("keydown", function(e) {
  if (e.keyCode === 39) {
    rightPressed = true;
  } else if (e.keyCode === 37) {
    leftPressed = true;
  }
});
document.addEventListener("keyup", function(e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  } else if (e.keyCode === 37) {
    leftPressed = false;
  }
});

// Update the ball position and check for collisions
function moveBall() {
  // Check for collision with walls
  if (ballX + ballSpeedX > canvas.width - ballRadius || ballX + ballSpeedX < ballRadius) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballY + ballSpeedY < ballRadius) {
    ballSpeedY = -ballSpeedY;
  } else if (ballY + ballSpeedY > canvas.height - ballRadius - paddleHeight) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      // Ball hits the paddle
      ballSpeedY = -ballSpeedY;
      ballSpeedX = 8 * ((ballX - (paddleX + paddleWidth / 2)) / paddleWidth);
    } else {
      // Ball misses the paddle
      lives--;
      if (lives === 0) {
        gameOver = true;
      } else {
        ballX = canvas.width / 2;
        ballY = canvas.height - paddleHeight - ballRadius;
        ballSpeedX = 3;
        ballSpeedY = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
  }
}
  }

// Update the ball position
ballX += ballSpeedX;
ballY += ballSpeedY;
}

// Draw the bricks on canvas
function drawBricks() {
for (let c = 0; c < brickColumnCount; c++) {
for (let r = 0; r < brickRowCount; r++) {
if (bricks[c][r].status === 1) {
const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
bricks[c][r].x = brickX;
bricks[c][r].y = brickY;
ctx.beginPath();
ctx.rect(brickX, brickY, brickWidth, brickHeight);
ctx.fillStyle = "#0095DD";
ctx.fill();
ctx.closePath();
}
}
}
}

// Detect collisions between ball and bricks
function collisionDetection() {
for (let c = 0; c < brickColumnCount; c++) {
for (let r = 0; r < brickRowCount; r++) {
const b = bricks[c][r];
if (b.status === 1) {
if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
ballSpeedY = -ballSpeedY;
b.status = 0;
score++;
if (score === brickRowCount * brickColumnCount) {
gameOver = true;
}
}
}
}
}
}

// Draw the score on canvas
function drawScore() {
ctx.font = "16px Arial";
ctx.fillStyle = "#0095DD";
ctx.fillText("Score: " + score, 8, 20);
}

// Draw the lives on canvas
function drawLives() {
ctx.font = "16px Arial";
ctx.fillStyle = "#0095DD";
ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

// Draw everything on canvas
function draw() {
// Clear the canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

drawBricks();
drawBall();
drawPaddle();
drawScore();
drawLives();

collisionDetection();
moveBall();

// Move the paddle if arrow keys are pressed
if (rightPressed && paddleX < canvas.width - paddleWidth) {
paddleX += 7;
} else if (leftPressed && paddleX > 0) {
paddleX -= 7;
}

// Check if game is over
if (gameOver) {
ctx.font = "30px Arial";
ctx.fillStyle = "#0095DD";
ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
} else {
requestAnimationFrame(draw);
}
}

draw(); // Start the game loop