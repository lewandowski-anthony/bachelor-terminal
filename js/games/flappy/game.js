import Bird from './bird.js';
import Pipe from './pipe.js';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.running = false;
        this.bird = new Bird(100, 200);
        this.lastTime = 0;
        this.pipes = [];
        this.pipeSpawnTimer = 0;
        this.pipeSpawnInterval = 1500;
        this.score = 0;
        this.baseWidth = 600;
        this.baseHeight = 600;

    }

    start() {
        this.running = true;
        this.createControls();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        requestAnimationFrame(this.loop.bind(this));
    }

    createControls() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                this.bird.flap();
            }
        });
        this.canvas.addEventListener('click', () => this.bird.flap());
    }

    stop() {
        this.running = false;
    }

    resizeCanvas() {
        const oldWidth = this.canvas.width;
        const oldHeight = this.canvas.height;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        const scale = Math.min(this.canvas.width / this.baseWidth, this.canvas.height / this.baseHeight);

        this.bird.width = 60 * scale;
        this.bird.height = 60 * scale;
        this.bird.gravity = 0.2 * scale;
        this.bird.xPosition = this.bird.xPosition * (this.canvas.width / oldWidth);
        this.bird.yPosition = this.bird.yPosition * (this.canvas.height / oldHeight);

        this.pipes.forEach(pipe => {
            pipe.gapSize = 150 * scale;
            pipe.gapY = Math.random() * (this.canvas.height - pipe.gapSize - 40) + 20;
            pipe.width = 50 * scale;
            pipe.speed = 2 * scale;
        });

        this.bird.velocity = -8 * scale;
    }


    loop(time) {
        if (!this.running) return;

        const delta = time - this.lastTime;
        this.lastTime = time;

        this.update(delta);
        this.render();

        requestAnimationFrame(this.loop.bind(this));
    }

    update(delta) {
        this.bird.update(this.ctx);

        this.pipeSpawnTimer += delta;
        if (this.pipeSpawnTimer > this.pipeSpawnInterval) {
            this.pipeSpawnTimer = 0;
            this.pipes.push(new Pipe(this.canvas, 150 * scale, 2 * scale));
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
            if (pipe.isCollidingWith(this.bird)) {
                this.gameOver();
            }
        }
    }

    gameOver() {
        this.stop();

        const replayBtn = document.getElementById('replayBtn');
        replayBtn.style.display = 'block';

        replayBtn.onclick = () => {
            this.bird = new Bird(100, this.canvas.height / 2);
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
        ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.pipes.forEach(pipe => pipe.draw());
        this.bird.draw(ctx);
        ctx.fillStyle = 'white';
        ctx.font = '24px sans-serif';
        ctx.fillText('Flappy Ben 🐦', 20, 30);
        ctx.fillText('Score: ' + this.score, 20, 60);
    }
}
