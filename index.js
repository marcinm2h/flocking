import p5 from "p5";
// https://discourse.processing.org/t/how-do-i-import-p5-via-npm/11543

const sketch = (s) => {
  s.setup = () => {
    s.createCanvas(100, 100);
    s.createSlider(0, 2, 1.5, 0.1);
  };

  s.draw = () => {
    console.log(s.width);
    s.background(100,255, 30);
    s.circle(10, 10, 10);
  };
};

const sketchInstance = new p5(sketch);
