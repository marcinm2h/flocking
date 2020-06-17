import { Boid } from "./boid";

export class Predator extends Boid {
  constructor(...args) {
    super(...args);
    this.maxForce = 0.4;
    this.maxSpeed = 7;
    this.neighbourhoodRadius = 60;
  }
}

Predator.createFlock = (length, ctx) =>
  Array(length)
    .fill()
    .map(() => new Predator(ctx));

Predator.render = (boid, ctx) => {
  ctx.push();
  ctx.textSize(16);
  ctx.text("👻", boid.position.x, boid.position.y);
  ctx.pop();
};
