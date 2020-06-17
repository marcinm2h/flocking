import p5 from "p5";

export class Boid {
  constructor(ctx) {
    this.ctx = ctx;
    this.position = ctx.createVector(
      ctx.random(ctx.width),
      ctx.random(ctx.height)
    ); // losowa pozycja
    this.velocity = p5.Vector.random2D() // wektor predkosci
      .setMag(ctx.random(2, 4)); // losowa długość wektora z przedzialu
    this.acceleration = ctx.createVector(); // wektor przyspieszenia
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
    return this.ctx.dist(
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
      return this.ctx.createVector();
    }

    const steeringForce = neighbours.reduce((acc, boid) => {
      return acc.add(boid.velocity);
    }, this.ctx.createVector());

    steeringForce.div(neighbours.length); // srednia predkosc boidow
    steeringForce.setMag(this.maxSpeed); // ustawienie predkosci na maksymalna w momencie znalezienia sie w zasiegu
    steeringForce.sub(this.velocity); // docelowa predkosc = aktualna - srednia
    steeringForce.limit(this.maxForce); // nie wieksza niz max

    return steeringForce;
  }

  cohesion(boids) {
    const neighbours = this.findNeighbours(boids);
    if (neighbours.length === 0) {
      return this.ctx.createVector();
    }

    const steeringForce = neighbours.reduce((acc, boid) => {
      return acc.add(boid.position);
    }, this.ctx.createVector());

    steeringForce.div(neighbours.length); // srednia predkosc boidow
    steeringForce.sub(this.position); // - pozycja
    steeringForce.setMag(this.maxSpeed); // ustawienie predkosci na maksymalna w momencie znalezienia sie w zasiegu
    steeringForce.sub(this.velocity); // - predkosc
    steeringForce.limit(this.maxForce);

    return steeringForce;
  }

  separation(boids) {
    const neighbours = this.findNeighbours(boids);
    if (neighbours.length === 0) {
      return this.ctx.createVector();
    }

    const steeringForce = neighbours.reduce((acc, boid) => {
      const distance = this.distance(boid);
      const diff = p5.Vector.sub(this.position, boid.position); // wektor roznica pozycji boida i jego sasiada
      diff.div(distance ** 2); // odwrotnie proporcjonalna do odleglosci - wieksza odleglosc - mniejsza sila
      return acc.add(diff);
    }, this.ctx.createVector());

    steeringForce.div(neighbours.length); // srednia
    steeringForce.setMag(this.maxSpeed); // normalizacja
    steeringForce.sub(this.velocity); // normalizacja
    steeringForce.limit(this.maxForce); // normalizacja

    return steeringForce;
  }

  flock(boids) {
    const alignment = this.align(boids);
    const cohesion = this.cohesion(boids);
    const separation = this.separation(boids);

    alignment.mult(this.ctx.alignSlider.value());
    cohesion.mult(this.ctx.cohesionSlider.value());
    separation.mult(this.ctx.separationSlider.value());

    this.acceleration = this.ctx
      .createVector()
      .add(alignment)
      .add(cohesion)
      .add(separation);
  }

  update() {
    this.position.add(this.velocity); // ruch o predkosc
    this.velocity.add(this.acceleration); // zmiana predkosci o przyspieszenie
    this.velocity.limit(this.maxSpeed);
  }
}

Boid.render = (boid, ctx) => {
  // ctx.stroke(129,10,12, 10);
  // ctx.fill(129,10,12, 10);
  // ctx.strokeWeight(1);
  // ctx.circle(boid.position.x, boid.position.y, boid.perceptionRadius * 2);
  ctx.stroke(200);
  ctx.strokeWeight(8);
  ctx.point(boid.position.x, boid.position.y);
};
