import Bird from './bird.js';

export default class Game {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.running = false;
        this.bird = new Bird(100, 200);
        this.lastTime = 0;
    }

    start() {
        this.running = true;
        this.createControls();
        requestAnimationFrame(this.loop.bind(this));
    }

    createControls() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                this.bird.flap();
            }
        });
        this.ctx.canvas.addEventListener('click', () => this.bird.flap());
    }

    stop() {
        this.running = false;
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
    }

    render() {
        this.ctx.clearRect(0, 0, 400, 600);
        this.ctx.fillText('Flappy Ben 🐦', 150, 300);
        this.ctx.fillStyle = '#70bbce';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.bird.draw(this.ctx);
    }
}
