import { SINGLE_FRAME_DURATION } from "./constants.js";

export default class Pipe {
    constructor(canvas, gapSize, speed, lastGapY = null) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 50;
        this.speed = speed;
        this.gapSize = gapSize;
        this.x = canvas.width;
        this.passed = false;
        const minGapTop = canvas.height * 0.2;
        const maxGapTop = canvas.height * 0.75 - gapSize;
        let gapY;
        do {
            gapY = Math.random() * (maxGapTop - minGapTop) + minGapTop;
        } while (lastGapY !== null && Math.abs(gapY - lastGapY) > canvas.height * 0.75);
        this.gapY = gapY;
    }

    update(delta) {
        this.x -= this.speed * (delta / SINGLE_FRAME_DURATION); 
    }

    draw() {
        this.drawPipe(0, this.gapY, true);
        this.drawPipe(this.gapY + this.gapSize, this.canvas.height - (this.gapY + this.gapSize), false);
    }

    drawPipe(y, height, top) {
        const ctx = this.ctx;
        const radius = 10 * (this.canvas.width / 360);

        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(this.x, y + (top ? radius : 0), this.width, height - radius);

        ctx.beginPath();
        if (top) {
            ctx.arc(this.x + this.width / 2, y + radius, this.width / 2, Math.PI, 0, false);
        } else {
            ctx.arc(this.x + this.width / 2, y + height - radius, this.width / 2, 0, Math.PI, false);
        }
        ctx.fillStyle = '#27ae60';
        ctx.fill();

        ctx.strokeStyle = '#1e8449';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, y + (top ? radius : 0), this.width, height - radius);
        ctx.stroke();
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

        if (birdRight < pipeLeft || birdLeft > pipeRight) return false;
        if (birdTop < this.gapY) return true;
        if (birdBottom > this.gapY + this.gapSize) return true;

        return false;
    }
}
