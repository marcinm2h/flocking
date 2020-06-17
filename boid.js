import p5 from "p5";

// TODO: użyć 'vectors'
const Vector = (...args) => new p5.Vector(...args);
Vector.random2D = (...args) => p5.Vector.random2D(...args);
Vector.add = (...args) =>
  args.reduce((acc, curr) => {
    return p5.Vector.prototype.add.call(acc, curr);
  });

const random = (...args) => p5.prototype.random(...args);
const distance = (...args) => p5.prototype.dist(...args);

export class Boid {
  constructor(ctx) {
    this.ctx = ctx;
    this.position = Vector(random(ctx.width), random(ctx.height)); // losowa pozycja
    this.velocity = Vector.random2D() // wektor predkosci
      .setMag(random(2, 4)); // losowa długość wektora z przedzialu
    this.acceleration = Vector(); // wektor przyspieszenia
    // TODO: kontrolowane przez slidery
    this.maxForce = 0.2;
    this.maxSpeed = 4;
    this.perceptionRadius = 50;
  }

  edges() {
    // jesli boid wypada poza obszar -> przeniesienie go na druga strone
    //TODO: przenieść do klasy Flock || odbijanie sie od krawedzi
    const { width, height } = this.ctx;
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  distance(other) {
    return distance(
      this.position.x,
      this.position.y,
      other.position.x,
      other.position.y
    );
  }

  findNeighbours(boids) {
    // FIXME: przeniesc do Flock
    return boids.filter(
      (boid) => boid !== this && this.distance(boid) < this.perceptionRadius
    );
  }

  align(boids) {
    const neighbours = this.findNeighbours(boids);
    if (neighbours.length === 0) {
      return Vector();
    }

    const alignVector = neighbours.reduce((acc, boid) => {
      return Vector.add(acc, boid.velocity);
    }, Vector());
    alignVector.div(neighbours.length); // srednia predkosc boidow
    alignVector.setMag(this.maxSpeed); // ustawienie predkosci na maksymalna w momencie znalezienia sie w zasiegu
    alignVector.sub(this.velocity); // docelowa predkosc = aktualna - srednia
    alignVector.limit(this.maxForce); // nie wieksza niz max

    return alignVector;
  }

  cohesion(boids) {
    const neighbours = this.findNeighbours(boids);
    if (neighbours.length === 0) {
      return Vector();
    }

    const cohesionVector = neighbours.reduce((acc, boid) => {
      return Vector.add(acc, boid.position);
    }, Vector());
    cohesionVector.div(neighbours.length); // srednia predkosc boidow
    cohesionVector.sub(this.position); // - pozycja
    cohesionVector.setMag(this.maxSpeed); // ustawienie predkosci na maksymalna w momencie znalezienia sie w zasiegu
    cohesionVector.sub(this.velocity); // - predkosc
    cohesionVector.limit(this.maxForce);

    return cohesionVector;
  }

  separation(boids) {
    const neighbours = this.findNeighbours(boids);
    if (neighbours.length === 0) {
      return Vector();
    }

    const separationVector = neighbours.reduce((acc, boid) => {
      const distance = this.distance(boid);
      const diff = p5.Vector.sub(this.position, boid.position); // wektor roznica pozycji boida i jego sasiada
      diff.div(distance ** 2); // odwrotnie proporcjonalna do odleglosci - wieksza odleglosc - mniejsza sila
      return Vector.add(acc, diff);
    }, Vector());
    separationVector.div(neighbours.length); // srednia
    separationVector.setMag(this.maxSpeed); // normalizacja
    separationVector.sub(this.velocity); // normalizacja
    separationVector.limit(this.maxForce); // normalizacja

    return separationVector;
  }

  flock(boids) {
    const alignment = this.align(boids);
    const cohesion = this.cohesion(boids);
    const separation = this.separation(boids);

    alignment.mult(this.ctx.alignSlider.value());
    cohesion.mult(this.ctx.cohesionSlider.value());
    separation.mult(this.ctx.separationSlider.value());

    this.acceleration = Vector.add(alignment, cohesion, separation);
  }

  update() {
    this.position = Vector.add(this.position, this.velocity); // ruch o predkosc
    this.velocity = Vector.add(this.velocity, this.acceleration); // zmiana predkosci o przyspieszenie
    this.velocity.limit(this.maxSpeed);
  }
}

Boid.render = (() => {
  const colors = new Map();
  return (boid, ctx) => {
    // ctx.stroke(129,10,12, 10);
    // ctx.fill(129,10,12, 10);
    // ctx.strokeWeight(1);
    // ctx.circle(boid.position.x, boid.position.y, boid.perceptionRadius * 2);
    const color = colors.has(boid)
      ? colors.get(boid)
      : (() => {
          const randomColor = [random(0, 255), random(0, 255), random(0, 255)];
          colors.set(boid, randomColor);
          return randomColor;
        })();

    ctx.stroke(...color);
    ctx.strokeWeight(8);
    ctx.point(boid.position.x, boid.position.y);
  };
})();
