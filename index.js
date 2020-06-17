import p5 from "p5";
import { Boid } from "./boid";
import { Predator } from "./predator";
import { Vector } from "./vector";
import { createSlider, createCheckbox, createNumberInput } from "./hud";

window.onload = () => {
  let predators;
  let flock;
  const align = createSlider({
    min: 0,
    max: 5,
    defaultValue: 1,
    step: 0.1,
    label: "align",
  });
  const cohesion = createSlider({
    min: 0,
    max: 5,
    defaultValue: 1,
    step: 0.1,
    label: "cohesion",
  });
  const separation = createSlider({
    min: 0,
    max: 5,
    defaultValue: 1,
    step: 0.1,
    label: "separation",
  });
  const repelCursor = createCheckbox({
    label: "repel cursor",
    defaultValue: true,
  });
  const numOfPredators = createNumberInput({
    label: "predators",
    defaultValue: 1,
    min: 0,
    max: 10,
  });

  const state = () => ({
    alignMultiplier: align.value(),
    cohesionMultiplier: cohesion.value(),
    separationMultiplier: separation.value(),
    repelCursor: repelCursor.value(),
  });

  const sketch = (s) => {
    s.setup = () => {
      s.createCanvas(800, 600);
      Object.assign(s, { state });

      flock = Boid.createFlock(100, s);
      predators = Predator.createFlock(numOfPredators.value(), s);
      numOfPredators.onInput((e) => {
        const next = Number(e.target.value);
        if (next > predators.length) {
          predators.push(new Predator(s));
        } else if (next < predators.length) {
          predators.pop();
        }
      });
    };

    s.draw = () => {
      s.background(242, 236, 216);

      flock.forEach((boid) => {
        boid.flock(flock);
        boid.repel(
          []
            .concat(predators.map((p) => p.position))
            .concat(state().repelCursor ? [Vector(s.mouseX, s.mouseY)] : [])
        );
        boid.update();
        Boid.render(boid, s);
      });

      predators.forEach((predator) => {
        predator.update();
        predator.flock(flock);
        Predator.render(predator, s);
      });
    };
  };

  new p5(sketch);
};
