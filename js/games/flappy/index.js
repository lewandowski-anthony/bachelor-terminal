import Game from './game.js';

let canvas;
let game;

export function startFlappy() {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    game = new Game(canvas);
    game.start();
}

export function stopFlappy() {
    game?.stop();
    canvas?.remove();
    game = null;
    canvas = null;
}
