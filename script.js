const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const spritePaths = [
  'animazioni/Run (1).png',
  'animazioni/Run (2).png',
  'animazioni/Run (3).png',
  'animazioni/Run (4).png',
  'animazioni/Run (5).png',
  'animazioni/Run (6).png',
  'animazioni/Run (7).png',
  'animazioni/Run (8).png'
];

const frames = [];
let loadedCount = 0;

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
  frameInterval: 8,
  facing: 1,
};

function loadSprites() {
  spritePaths.forEach((path, index) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      frames[index] = img;
      loadedCount += 1;
      if (loadedCount === spritePaths.length) {
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
      character.frame = (character.frame + 1) % frames.length;
    }
  } else {
    character.frame = 0;
    character.frameTimer = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (frames[character.frame]) {
    ctx.save();
    if (character.facing === -1) {
      ctx.translate(character.x + character.width, character.y);
      ctx.scale(-1, 1);
      ctx.drawImage(frames[character.frame], 0, 0, character.width, character.height);
    } else {
      ctx.drawImage(frames[character.frame], character.x, character.y, character.width, character.height);
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
      character.dy = -character.speed;
      event.preventDefault();
      break;
    case 'ArrowDown':
      character.dy = character.speed;
      event.preventDefault();
      break;
    case 'ArrowLeft':
      character.dx = -character.speed;
      character.facing = -1;
      event.preventDefault();
      break;
    case 'ArrowRight':
      character.dx = character.speed;
      character.facing = 1;
      event.preventDefault();
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowDown':
      character.dy = 0;
      event.preventDefault();
      break;
    case 'ArrowLeft':
    case 'ArrowRight':
      character.dx = 0;
      event.preventDefault();
      break;
  }
});

loadSprites();
