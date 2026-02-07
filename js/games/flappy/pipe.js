export default class Pipe {
    constructor(canvas, gapSize = 150, speed = 2) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 50;
        this.gapSize = gapSize;
        this.speed = speed;
        this.x = canvas.width;
        const minGapTop = canvas.height * 0.2;
        const maxGapTop = canvas.height * 0.75 - gapSize;
        this.gapY = Math.random() * (maxGapTop - minGapTop) + minGapTop;
        this.passed = false;
    }

    update() {
        this.x -= this.speed;
    }

    draw() {
        const ctx = this.ctx;
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, 0, this.width, this.gapY);
        ctx.fillRect(this.x, this.gapY + this.gapSize, this.width, this.canvas.height - (this.gapY + this.gapSize));
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    isCollidingWith(bird) {
        const birdLeft = bird.xPosition;
        const birdRight = bird.xPosition + bird.width;
        const birdTop = bird.yPosition;
        const birdBottom = bird.yPosition + bird.height;
        const pipeLeft = this.x;
        const pipeRight = this.x + this.width;
        const hitsTop = birdRight > pipeLeft && birdLeft < pipeRight && birdTop < this.gapY;
        const hitsBottom = birdRight > pipeLeft && birdLeft < pipeRight && birdBottom > this.gapY + this.gapSize;
        return hitsTop || hitsBottom;
    }
}
