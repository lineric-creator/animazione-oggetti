const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const runPaths = [
  'animazioni/Run (1).png',
  'animazioni/Run (2).png',
  'animazioni/Run (3).png',
  'animazioni/Run (4).png',
  'animazioni/Run (5).png',
  'animazioni/Run (6).png',
  'animazioni/Run (7).png',
  'animazioni/Run (8).png',
  'animazioni/Run (9).png',
  'animazioni/Run (10).png',
  'animazioni/Run (11).png',
  'animazioni/Run (12).png',
  'animazioni/Run (13).png',
  'animazioni/Run (14).png',
  'animazioni/Run (15).png',
  'animazioni/Run (16).png',
  'animazioni/Run (17).png',
  'animazioni/Run (18).png',
  'animazioni/Run (19).png',
  'animazioni/Run (20).png'
];

const idlePaths = [
  'animazioni/Idle (1).png',
  'animazioni/Idle (2).png',
  'animazioni/Idle (3).png',
  'animazioni/Idle (4).png',
  'animazioni/Idle (5).png',
  'animazioni/Idle (6).png',
  'animazioni/Idle (7).png',
  'animazioni/Idle (8).png',
  'animazioni/Idle (9).png',
  'animazioni/Idle (10).png',
  'animazioni/Idle (11).png',
  'animazioni/Idle (12).png',
  'animazioni/Idle (13).png',
  'animazioni/Idle (14).png',
  'animazioni/Idle (15).png',
  'animazioni/Idle (16).png'
];

const runFrames = [];
const idleFrames = [];
let loadedCount = 0;
const totalSprites = runPaths.length + idlePaths.length;

const character = {
  x: canvas.width / 2 - 60,
  y: canvas.height / 2 - 60,
  width: 120,
  height: 120,
  speed: 4,
  dx: 0,
  dy: 0,
  frame: 0,
  frameTimer: 0,
  frameInterval: 2,  idleFrame: 0,
  idleFrameTimer: 0,
  idleFrameInterval: 8,  facing: 1,
};
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;
function loadSprites() {
  runPaths.forEach((path, index) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      runFrames[index] = img;
      loadedCount += 1;
      if (loadedCount === totalSprites) {
        requestAnimationFrame(loop);
      }
    };
    img.onerror = () => {
      console.error('Impossibile caricare l\'immagine:', path);
    };
  });

  idlePaths.forEach((path, index) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      idleFrames[index] = img;
      loadedCount += 1;
      if (loadedCount === totalSprites) {
        requestAnimationFrame(loop);
      }
    };
    img.onerror = () => {
      console.error('Impossibile caricare l\'immagine:', path);
    };
  });
}

function update() {
  character.x += character.dx;
  character.y += character.dy;

  if (character.x < 0) character.x = 0;
  if (character.y < 0) character.y = 0;
  if (character.x + character.width > canvas.width) character.x = canvas.width - character.width;
  if (character.y + character.height > canvas.height) character.y = canvas.height - character.height;

  const moving = character.dx !== 0 || character.dy !== 0;
  if (moving) {
    character.frameTimer += 1;
    if (character.frameTimer >= character.frameInterval) {
      character.frameTimer = 0;
      character.frame = (character.frame + 1) % runFrames.length;
    }
    
    character.idleFrame = 0;
    character.idleFrameTimer = 0;
  } else {
    character.idleFrameTimer += 1;
    if (character.idleFrameTimer >= character.idleFrameInterval) {
      character.idleFrameTimer = 0;
      character.idleFrame = (character.idleFrame + 1) % idleFrames.length;
    }
  
    character.frame = 0;
    character.frameTimer = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const moving = character.dx !== 0 || character.dy !== 0;
  const currentFrames = moving ? runFrames : idleFrames;
  const currentFrame = moving ? character.frame : character.idleFrame;

  if (currentFrames[currentFrame]) {
    ctx.save();
    if (character.facing === -1) {
      ctx.translate(character.x + character.width, character.y);
      ctx.scale(-1, 1);
      ctx.drawImage(currentFrames[currentFrame], 0, 0, character.width, character.height);
    } else {
      ctx.drawImage(currentFrames[currentFrame], character.x, character.y, character.width, character.height);
    }
    ctx.restore();
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      upPressed = true;
      character.dy = -character.speed;
      event.preventDefault();
      break;
    case 'ArrowDown':
      downPressed = true;
      character.dy = character.speed;
      event.preventDefault();
      break;
    case 'ArrowLeft':
      leftPressed = true;
      character.dx = -character.speed;
      character.facing = -1;
      event.preventDefault();
      break;
    case 'ArrowRight':
      rightPressed = true;
      character.dx = character.speed;
      character.facing = 1;
      event.preventDefault();
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      upPressed = false;
      if (!downPressed) character.dy = 0;
      event.preventDefault();
      break;
    case 'ArrowDown':
      downPressed = false;
      if (!upPressed) character.dy = 0;
      event.preventDefault();
      break;
    case 'ArrowLeft':
      leftPressed = false;
      if (!rightPressed) character.dx = 0;
      event.preventDefault();
      break;
    case 'ArrowRight':
      rightPressed = false;
      if (!leftPressed) character.dx = 0;
      event.preventDefault();
      break;
  }
});

loadSprites();
