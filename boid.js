import { distance, random } from "./math";
import { Vector } from "./vector";

export class Boid {
  constructor(ctx) {
    this.ctx = ctx;
    this.position = Vector(random(ctx.width), random(ctx.height)); // losowa pozycja
    this.velocity = Vector.random2D() // wektor predkosci
      .setMag(random(2, 4)); // losowa długość wektora z przedzialu
    this.acceleration = Vector(); // wektor przyspieszenia
    this.maxForce = 0.2;
    this.maxRepelForce = 1;
    this.maxSpeed = 4;
    this.neighbourhoodRadius = 50;
  }

  edges() {
    // jesli boid wypada poza obszar -> przeniesienie go na druga strone
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
    return distance(this.position.x, this.position.y, other.x, other.y);
  }

  findNeighbours(boids) {
    return boids.filter(
      (boid) =>
        boid !== this && this.distance(boid.position) < this.neighbourhoodRadius
    );
  }

  align(boids) {
    const neighbours = this.findNeighbours(boids);
    if (neighbours.length === 0) {
      return Vector();
    }

    let alignVector = neighbours.reduce((acc, boid) => {
      return Vector.add(acc, boid.velocity);
    }, Vector());
    alignVector = Vector.div(alignVector, neighbours.length); // srednia
    alignVector = Vector.setMagnitude(alignVector, this.maxSpeed); // ustawienie dlugosci na max
    alignVector = Vector.sub(alignVector, this.velocity); // docelowa predkosc = aktualna - srednia
    alignVector = Vector.limit(alignVector, this.maxForce); // nie wieksza sila niz max

    return alignVector;
  }

  cohesion(boids) {
    const neighbours = this.findNeighbours(boids);
    if (neighbours.length === 0) {
      return Vector();
    }

    let cohesionVector = neighbours.reduce((acc, boid) => {
      return Vector.add(acc, boid.position);
    }, Vector());
    cohesionVector = Vector.div(cohesionVector, neighbours.length); // srednia
    cohesionVector = Vector.sub(cohesionVector, this.position); // minus pozycja
    cohesionVector = Vector.setMagnitude(cohesionVector, this.maxSpeed); // ustawienie dlugosci na maksymalna
    cohesionVector = Vector.sub(cohesionVector, this.velocity); // minus predkosc
    cohesionVector = Vector.limit(cohesionVector, this.maxForce); // nie wieksza sila niz max

    return cohesionVector;
  }

  separation(boids) {
    const neighbours = this.findNeighbours(boids);
    if (neighbours.length === 0) {
      return Vector();
    }

    let separationVector = neighbours.reduce((acc, boid) => {
      const distance = this.distance(boid.position);
      let diff = Vector.sub(this.position, boid.position); // wektor roznica pozycji boida i jego sasiada
      diff = Vector.div(diff, distance ** 2); // sila odwrotnie proporcjonalna do odleglosci
      return Vector.add(acc, diff);
    }, Vector());
    separationVector = Vector.div(separationVector, neighbours.length); // srednia
    separationVector = Vector.setMagnitude(separationVector, this.maxSpeed); // ustawienie dlugosci na max
    separationVector = Vector.sub(separationVector, this.velocity); // minus predkosc
    separationVector = Vector.limit(separationVector, this.maxForce); // nie wieksza niz sila max

    return separationVector;
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    const {
      alignMultiplier,
      cohesionMultiplier,
      separationMultiplier,
    } = this.ctx.state();
    alignment = Vector.mult(alignment, alignMultiplier);
    cohesion = Vector.mult(cohesion, cohesionMultiplier);
    separation = Vector.mult(separation, separationMultiplier);

    this.acceleration = Vector.add(
      this.acceleration,
      alignment,
      cohesion,
      separation
    );
  }

  repealment(obstacle, { obstacleRadius = 60 } = {}) {
    let repelVector = Vector();
    if (this.distance(obstacle) < obstacleRadius) {
      repelVector = Vector.sub(obstacle, this.position);
      repelVector = Vector.normalize(repelVector);
      repelVector = Vector.mult(repelVector, this.maxRepelForce);
    }

    return repelVector;
  }

  repel(obstacles) {
    const repelVector = obstacles.reduce(
      (acc, obstacle) => Vector.sub(acc, this.repealment(obstacle)),
      Vector()
    );
    this.acceleration = Vector.add(this.acceleration, repelVector);
  }

  update() {
    this.position = Vector.add(this.position, this.velocity); // ruch o predkosc
    this.velocity = Vector.add(this.velocity, this.acceleration); // zmiana predkosci o przyspieszenie
    this.velocity = Vector.limit(this.velocity, this.maxSpeed); // ograniczenie do max predkosci
    this.acceleration = Vector(); // zerowanie co krok
    this.edges();
  }
}

Boid.createFlock = (length, ctx) =>
  Array(length)
    .fill()
    .map(() => new Boid(ctx));

Boid.render = (() => {
  const colors = new Map();
  return (boid, ctx) => {
    // ctx.stroke(1,1,1, 10);
    // ctx.fill(255,255,255, 10);
    // ctx.strokeWeight(1);
    // ctx.circle(boid.position.x, boid.position.y, boid.neighbourhoodRadius * 2);
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
