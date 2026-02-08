import { BIRD_WIDTH, BIRD_HEIGHT, FLAP_VELOCITY, BASE_GRAVITY,
    SINGLE_FRAME_DURATION } from "./constants.js";

export default class Bird {
    constructor(x, y) {
        this.xPosition = x;
        this.yPosition = y;
        this.width = BIRD_WIDTH;
        this.height = BIRD_HEIGHT;
        this.velocity = 0;
        this.flapVelocity = FLAP_VELOCITY;
        this.gravity = BASE_GRAVITY;
        this.image = new Image();
        this.image.src = '../../assets/games/flappy/ben_face.png';
    }

    update(canvas, deltaTime = SINGLE_FRAME_DURATION) {
        this.velocity += this.gravity * deltaTime / SINGLE_FRAME_DURATION;
        this.yPosition += this.velocity * deltaTime / SINGLE_FRAME_DURATION;

        if (!canvas) return;

        if (this.yPosition + this.height > canvas.height) {
            this.yPosition = canvas.height - this.height;
            this.velocity = 0;
        }
        if (this.yPosition < 0) {
            this.yPosition = 0;
            this.velocity = 0;
        }
    }

    flap(deltaTime = SINGLE_FRAME_DURATION) {
        const dt = deltaTime / SINGLE_FRAME_DURATION;
        this.velocity = this.flapVelocity * dt;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.xPosition, this.yPosition, this.width, this.height);
    }
}
