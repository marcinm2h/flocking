import p5 from "p5";

export const Vector = (...args) => new p5.Vector(...args);
Vector.random2D = (...args) => p5.Vector.random2D(...args);
Vector.add = (...args) =>
  args.reduce((acc, curr) => {
    return p5.Vector.prototype.add.call(acc, curr);
  });
