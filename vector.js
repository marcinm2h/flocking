import p5 from "p5";

export const Vector = (...args) => new p5.Vector(...args);

Vector.random2D = (...args) => p5.Vector.random2D(...args);

Vector.add = (...args) =>
  args.reduce((acc, curr) => {
    return p5.Vector.prototype.add.call(acc, curr);
  });

Vector.setMagnitude = (...args) => p5.Vector.prototype.setMag.call(...args);

Vector.normalize = (...args) => p5.Vector.prototype.normalize.call(...args);

Vector.div = (...args) => p5.Vector.prototype.div.call(...args);

Vector.mult = (...args) => p5.Vector.prototype.mult.call(...args);

Vector.sub = (...args) => p5.Vector.sub(...args);

Vector.limit = (...args) => p5.Vector.prototype.limit.call(...args);

Vector.limit = (...args) => p5.Vector.prototype.limit.call(...args);
