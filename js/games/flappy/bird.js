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
