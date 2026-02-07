import { BIRD_HEIGHT, BIRD_WIDTH, FLAP_VELOCITY } from "./constants.js";

export default class Bird {
    constructor(x, y) {
        this.xPosition = x;
        this.yPosition = y;
        this.width = BIRD_WIDTH;
        this.height = BIRD_HEIGHT;
        this.velocity = 0;
        this.flapVelocity = FLAP_VELOCITY;
        this.gravity = 0.2;
        this.image = new Image();
        this.image.src = '../../assets/games/flappy/ben_face.png';
    }

    update(canvas) {
        this.velocity += this.gravity;
        this.yPosition += this.velocity;
        if (this.yPosition + this.height > canvas.height) {
            this.yPosition = canvas.height - this.height;
            this.velocity = 0;
        }
        if (this.yPosition < 0) {
            this.yPosition = 0;
            this.velocity = 0;
        }
    }

    flap() {
        this.velocity = this.flapVelocity;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.xPosition, this.yPosition, this.width, this.height);
    }
}
