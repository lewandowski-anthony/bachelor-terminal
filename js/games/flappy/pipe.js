export default class Pipe {
  constructor(canvas, gapSize = 150, speed = 2) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.width = 50;
    this.gapSize = gapSize;
    this.speed = speed;          

    this.x = canvas.width;
    this.gapY = Math.random() * (canvas.height - this.gapSize - 40) + 20;
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
        const pipeTop = 0;
        const pipeBottom = this.gapY;
        const pipeTopBottom = this.gapY + this.gapSize;
        const pipeBottomBottom = this.canvas.height;

        // Collision avec pipe du haut
        const hitsTop = birdRight > pipeLeft && birdLeft < pipeRight && birdTop < pipeBottom;
        // Collision avec pipe du bas
        const hitsBottom = birdRight > pipeLeft && birdLeft < pipeRight && birdBottom > pipeTopBottom;

        return hitsTop || hitsBottom;
    }
}
