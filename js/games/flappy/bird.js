export default class Bird {
    constructor(x, y) {
        this.xPosition = x;
        this.yPosition = y;
        this.width = 70;
        this.height = 70;
        this.velocity = 0;
        this.gravity = 0.2;
        this.image = new Image();
        this.image.src = '../../assets/games/flappy/ben_face.png';
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
        ctx.drawImage(this.image, this.xPosition, this.yPosition, this.width, this.height);
    }
}
