import Game from './game.js';

let canvas;
let game;

export function startFlappy() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);

  function resizeCanvas() {
    canvas.width = window.innerWidth * 0.5;
    canvas.height = window.innerHeight * 0.7;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const game = new Game(canvas);
  game.start();
}


export function stopFlappy() {
  game?.stop();
  canvas?.remove();
  canvas = null;
  game = null;
}
