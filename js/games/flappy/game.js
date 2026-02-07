import Bird from './bird.js';
import Pipe from './pipe.js';
import {
    BIRD_WIDTH,
    BIRD_HEIGHT,
    GAP_SIZE,
    PIPE_SPEED,
    PIPE_SPAWN_INTERVAL,
    BIRD_START_X,
    BIRD_START_Y
} from './constants.js';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.running = false;

        this.baseWidth = 360;
        this.baseHeight = 640;
        this.scale = 1;

        this.bird = new Bird(BIRD_START_X, BIRD_START_Y);
        this.pipes = [];
        this.pipeSpawnTimer = 0;
        this.pipeSpawnInterval = PIPE_SPAWN_INTERVAL;
        this.score = 0;

        this.isPause = false;
        this.isGameOver = false;

        this.loop = this.loop.bind(this);
        this.createPauseButton();

        this.background = new Image();
        this.background.src = '../../assets/games/flappy/background.png';

        this.pipePassedSound = new Audio('../../assets/games/flappy/beep.mp3');
        this.bgMusic = new Audio('../../assets/games/flappy/background_music.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.7;
    }

    start() {
        this.running = true;
        this.createControls();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        requestAnimationFrame(this.loop);
    }

    createControls() {
    const startAudio = () => {
        if (this.bgMusic && this.bgMusic.paused) {
            this.bgMusic.play().catch(e => {});
        }
        document.removeEventListener('keydown', startAudio);
        this.canvas.removeEventListener('click', startAudio);
    };

    document.addEventListener('keydown', startAudio);
    this.canvas.addEventListener('click', startAudio);

    document.addEventListener('keydown', e => {
        if (e.code === 'Space') this.bird.flap();
        if (e.code === 'KeyP') this.togglePause();
    });

    this.canvas.addEventListener('click', () => this.bird.flap());
}


    createPauseButton() {
        const btn = document.createElement('button');
        btn.innerText = 'Pause';
        btn.classList.add('game-button');
        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#2ecc71';
            btn.style.transform = 'scale(1.05)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = '#27ae60';
            btn.style.transform = 'scale(1)';
        });
        btn.addEventListener('click', () => {
            this.togglePause();
            btn.blur();
        });
        document.body.appendChild(btn);
        this.pauseBtn = btn;
    }


    togglePause() {
        this.isPause = !this.isPause;
        this.pauseBtn.innerText = this.isPause ? 'Resume' : 'Pause';
        if (this.paused) {
            this.bgMusic.pause();
        } else {
            this.bgMusic.play();
        }
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
        this.bird.width = BIRD_WIDTH * this.scale;
        this.bird.height = BIRD_HEIGHT * this.scale;
        this.bird.xPosition = this.canvas.width * 0.2;

        if (this.pauseBtn) {
            const rect = this.canvas.getBoundingClientRect();
            this.pauseBtn.style.top = rect.top + 10 + 'px';
            this.pauseBtn.style.right = (window.innerWidth - rect.right + 10) + 'px';
        }
    }

    loop(time) {
        if (!this.running) return;
        if (!this.lastTime) this.lastTime = time;
        const delta = time - this.lastTime;
        this.lastTime = time;

        if (!this.isPause) this.update(delta);
        this.render();

        requestAnimationFrame(this.loop);
    }

    update(delta) {
        this.bird.update(this.canvas);

        this.pipeSpawnTimer += delta;
        if (this.pipeSpawnTimer > this.pipeSpawnInterval) {
            this.pipeSpawnTimer = 0;
            const gapSize = GAP_SIZE * this.scale;
            const speed = PIPE_SPEED * this.scale;
            this.pipes.push(new Pipe(this.canvas, gapSize, speed));
        }

        this.pipes.forEach(pipe => {
            pipe.update();
            if (!pipe.passed && pipe.x + pipe.width < this.bird.xPosition) {
                pipe.passed = true;
                this.score += 1;
                this.pipePassedSound.play();
            }
        });

        this.pipes = this.pipes.filter(pipe => !pipe.isOffScreen());

        for (let pipe of this.pipes) {
            if (pipe.isCollidingWith(this.bird)) this.gameOver();
        }
    }

    gameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;

        this.stop();
        this.isPause = false;

        if (this.pauseBtn) this.pauseBtn.style.display = 'none';

        const replayBtn = document.getElementById('replayBtn');
        replayBtn.style.display = 'block';
        replayBtn.classList.add('game-button');
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;

        replayBtn.onclick = () => {
            this.isGameOver = false;
            this.bird = new Bird(this.canvas.width * 0.2, this.canvas.height / 2);
            this.pipes = [];
            this.pipeSpawnTimer = 0;
            this.score = 0;
            replayBtn.classList.remove('game-button');
            replayBtn.style.display = 'none';
            if (this.pauseBtn) this.pauseBtn.style.display = 'block';
            this.start();
        };
    }


    render() {
        const ctx = this.ctx;

        const imgRatio = this.background.width / this.background.height;
        const canvasRatio = this.canvas.width / this.canvas.height;

        let drawWidth, drawHeight;

        if (canvasRatio > imgRatio) {
            drawWidth = this.canvas.width;
            drawHeight = drawWidth / imgRatio;
        } else {
            drawHeight = this.canvas.height;
            drawWidth = drawHeight * imgRatio;
        }

        ctx.drawImage(
            this.background,
            0,
            0,
            drawWidth,
            drawHeight
        );


        this.pipes.forEach(pipe => pipe.draw());
        this.bird.draw(ctx);

        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.font = `${20 * this.scale}px sans-serif`;
        ctx.fillText('Flappy Ben', 10 * this.scale, 30 * this.scale);
        ctx.fillText('Score: ' + this.score, 10 * this.scale, 60 * this.scale);

        if (this.isPause || this.isGameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.font = `${40 * this.scale}px sans-serif`;
            ctx.fillText(this.isPause ? 'PAUSE' : 'GAME OVER', this.canvas.width / 2, this.canvas.height / 3);
            if (this.isGameOver) {
                ctx.font = `${25 * this.scale}px sans-serif`;
                ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 3 + 50 * this.scale);
                ctx.fillText('Click to Replay', this.canvas.width / 2, this.canvas.height / 3 + 75 * this.scale);
            }
        }
    }
}
