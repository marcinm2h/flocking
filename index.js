import p5 from "p5";
import { Boid } from "./boid";

let flock;
let alignSlider, cohesionSlider, separationSlider;
const state = () => ({
  alignMultiplier: alignSlider.value(),
  cohesionMultiplier: cohesionSlider.value(),
  separationMultiplier: separationSlider.value(),
});

const sketch = (s) => {
  s.setup = () => {
    s.createCanvas(640, 480);
    alignSlider = s.createSlider(0, 5, 1, 0.1);
    cohesionSlider = s.createSlider(0, 5, 1, 0.1);
    separationSlider = s.createSlider(0, 5, 1, 0.1);
    Object.assign(s, { state });

    flock = Boid.createFlock(100, s);
  };

  s.draw = () => {
    s.background(242, 236, 216);

    flock.forEach((boid) => {
      boid.flock(flock);
      boid.repel([s.createVector(s.mouseX, s.mouseY)]);
      boid.update();
      Boid.render(boid, s);
    });
  };
};

new p5(sketch);
