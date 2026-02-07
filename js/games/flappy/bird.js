export default class Bird {
    constructor(x, y) {
        this.xPosition = x;
        this.yPosition = y;
        this.width = 30;
        this.height = 30;
        this.velocity = 0;
        this.gravity = 0.2;
    }

    update(ctx) {
        this.velocity += this.gravity;
        this.yPosition += this.velocity;

        if (this.yPosition + this.height > ctx.canvas.height) {
            this.yPosition = ctx.canvas.height - this.height;
            this.velocity = 0;
        }

        if (this.yPosition < 0) {
            this.yPosition = 0;
            this.velocity = 0;
        }
    }


    flap() {
        this.velocity = -6;
    }

    draw(ctx) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.xPosition, this.yPosition, this.width, this.height);
    }
}
