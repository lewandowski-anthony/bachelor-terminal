import Bird from './bird.js';
import Pipe from './pipe.js';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.running = false;

        this.baseWidth = 360;
        this.baseHeight = 640;
        this.scale = 1;

        this.bird = new Bird(100, 200);
        this.pipes = [];
        this.pipeSpawnTimer = 0;
        this.pipeSpawnInterval = 1750;
        this.score = 0;

        this.loop = this.loop.bind(this);
    }

    start() {
        this.running = true;
        this.createControls();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        requestAnimationFrame(this.loop);
    }

    createControls() {
        document.addEventListener('keydown', e => {
            if (e.code === 'Space') this.bird.flap();
        });
        this.canvas.addEventListener('click', () => this.bird.flap());
    }

    stop() {
        this.running = false;
    }

    resizeCanvas() {
        const windowRatio = window.innerWidth / window.innerHeight;
        const gameRatio = this.baseWidth / this.baseHeight;

        if (windowRatio > gameRatio) {
            this.canvas.height = window.innerHeight;
            this.canvas.width = window.innerHeight * gameRatio;
        } else {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerWidth / gameRatio;
        }

        this.scale = this.canvas.width / this.baseWidth;
        this.bird.width = 40 * this.scale;
        this.bird.height = 40 * this.scale;
        this.bird.xPosition = this.canvas.width * 0.2;
    }

    loop(time) {
        if (!this.running) return;
        const delta = time - (this.lastTime || time);
        this.lastTime = time;
        this.update(delta);
        this.render();
        requestAnimationFrame(this.loop);
    }

    update(delta) {
        this.bird.update(this.canvas);

        this.pipeSpawnTimer += delta;
        if (this.pipeSpawnTimer > this.pipeSpawnInterval) {
            this.pipeSpawnTimer = 0;
            const gapSize = 120 * this.scale;
            const speed = 2 * this.scale;
            this.pipes.push(new Pipe(this.canvas, gapSize, speed));
        }

        this.pipes.forEach(pipe => {
            pipe.update();
            if (!pipe.passed && pipe.x + pipe.width < this.bird.xPosition) {
                pipe.passed = true;
                this.score += 1;
            }
        });

        this.pipes = this.pipes.filter(pipe => !pipe.isOffScreen());

        for (let pipe of this.pipes) {
            if (pipe.isCollidingWith(this.bird)) this.gameOver();
        }
    }

    gameOver() {
        this.stop();
        const replayBtn = document.getElementById('replayBtn');
        replayBtn.style.display = 'block';
        replayBtn.onclick = () => {
            this.bird = new Bird(this.canvas.width * 0.2, this.canvas.height / 2);
            this.pipes = [];
            this.pipeSpawnTimer = 0;
            this.score = 0;
            replayBtn.style.display = 'none';
            this.start();
        };
    }

    render() {
        const ctx = this.ctx;
        ctx.fillStyle = '#70bbce';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.pipes.forEach(pipe => pipe.draw());
        this.bird.draw(ctx);

        ctx.fillStyle = 'white';
        ctx.font = `${20 * this.scale}px sans-serif`;
        ctx.fillText('Flappy Ben 🐦', 10, 30 * this.scale);
        ctx.fillText('Score: ' + this.score, 10, 60 * this.scale);
    }
}
