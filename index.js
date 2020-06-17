import p5 from "p5";
import { Boid } from './boid';

let flock = [];
let alignSlider, cohesionSlider, separationSlider;

const sketch = s => {
  s.setup = () => {
    s.createCanvas(640, 480);
    alignSlider = s.createSlider(0, 5, 1, 0.1);
    cohesionSlider = s.createSlider(0, 5, 1, 0.1);
    separationSlider = s.createSlider(0, 5, 1, 0.1);
    Object.assign(s, { alignSlider, cohesionSlider, separationSlider });
    flock = Array(100).fill().map(() => new Boid(s));
  };

  s.draw = () => {
    s.background(51);
    flock.forEach((boid) => {
      boid.edges();
      boid.flock(flock);
      boid.update();
      Boid.render(boid, s);
    })
  };
};

const sketchInstance = new p5(sketch);
