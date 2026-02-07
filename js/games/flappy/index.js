import Game from './game.js';

let canvas;
let game;

export function startFlappy() {
    canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    canvas.style.background = '#70bbce';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.appendChild(canvas);

    game = new Game(canvas);
    game.start();
}

export function stopFlappy() {
    game?.stop();
    canvas?.remove();
    canvas = null;
    game = null;
}
