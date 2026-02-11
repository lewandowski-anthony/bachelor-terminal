import {
    BIRD_WIDTH,
    BIRD_HEIGHT,
    BIRD_WIDTH_RATIO,
    BIRD_HEIGHT_RATIO,
    BASE_GRAVITY_RATIO,
    SINGLE_FRAME_DURATION,
    FLAP_VELOCITY_RATIO
} from "./constants.js";

export default class Bird {
    constructor(x, y, canvas) {
        this.xPosition = x;
        this.yPosition = y;
        this.width = canvas.width * (BIRD_WIDTH * BIRD_WIDTH_RATIO);
        this.height = canvas.height * (BIRD_HEIGHT * BIRD_HEIGHT_RATIO);
        this.velocity = 0;
        this.flapVelocity = -canvas.height * (FLAP_VELOCITY_RATIO);
        this.gravity = canvas.height * BASE_GRAVITY_RATIO;
        this.image = new Image();
        this.image.src = '../../assets/games/flappy/ben_face.png';
        this.canvas = canvas;
    }

    update(canvas, deltaTime = SINGLE_FRAME_DURATION) {
        const dt = deltaTime / SINGLE_FRAME_DURATION;

        this.velocity += this.gravity * dt;

        this.velocity = Math.min(this.velocity, canvas.height * 0.04);

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

    flap(deltaTime = SINGLE_FRAME_DURATION) {
        this.velocity = this.flapVelocity;
    }

    draw(ctx) {
        ctx.save();

        const rotation = Math.max(-0.5, Math.min(0.5, this.velocity * 0.05));
        ctx.translate(this.xPosition + this.width / 2, this.yPosition + this.height / 2);
        ctx.rotate(rotation);

        ctx.drawImage(
            this.image,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );

        ctx.restore();
    }
}
