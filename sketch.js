// Taken from https://alexcodesart.com/drawing-noisy-circles-with-p5-js-a-deep-dive-into-polar-coordinates-and-perlin-noise/

const colors = {
  background: "#282828",
  accent: "#41a1b0",
  text: "#d2d2d2",
};

const params = {
  noiseDetail: 0.02,
  resolution: 360,
  noiseFactor: 160,
  speed: 0.00075,
  curvePhaseFactor: 0.0131,
  numberOfCurves: 90,
  gap: 2,
  weight: 1,
};

let curveNoiseFactor = params.noiseFactor;

let font;

function preload() {
  font = loadFont("assets/fonts/APOLLOItalic-subset.otf");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  pixelDensity(1);
  textFont(font);
  colorArray = generateColorGradient(
    colors.accent,
    colors.background,
    params.numberOfCurves
  );
}

function draw() {
  background(colors.background);
  translate(width / 2, height / 2);

  push();
  apply2DTransformations();
  noFill();
  strokeWeight(params.weight);
  createNoisyCircles(width / 2, height / 2, colorArray);
  pop();

  push();
  textAlign(CENTER, CENTER);
  textSize(50);
  fill(colors.text);
  stroke(colors.background);
  text("DECOHERENCE MEDIA", 0, 0);
  pop();
}

function generateColorGradient(color1, color2, steps) {
  const gradient = [];
  const c1 = color(color1);
  const c2 = color(color2);

  for (let i = 0; i < steps; i++) {
    const amt = i / (steps - 1); // 0 to 1
    gradient.push(lerpColor(c1, c2, amt));
  }

  return gradient;
}

function createNoisyCircles(centerX, centerY, colorArray) {
  for (j = 0; j < params.numberOfCurves; j++) {
    beginShape();
    stroke(colorArray[j % colorArray.length]);
    curveNoiseFactor = params.noiseFactor + j;

    curveRadius = j * params.gap;

    for (i = 0; i <= params.resolution; i++) {
      circlePoint = map(i, 0, params.resolution, 0, TWO_PI);

      x = centerX + cos(circlePoint) * curveRadius;
      y = centerY + sin(circlePoint) * curveRadius;

      let offsetX = 0;
      let offsetY = 0;
      const n = noise(
        x * params.noiseDetail,
        y * params.noiseDetail,
        millis() * params.speed - j * params.curvePhaseFactor
      );
      offsetX =
        (n * cos(circlePoint) * curveNoiseFactor * curveRadius) /
        (params.numberOfCurves * params.gap);
      offsetY =
        (n * sin(circlePoint) * curveNoiseFactor * curveRadius) /
        (params.numberOfCurves * params.gap);

      vertex(x + offsetX, y + offsetY);
    }
    endShape();
  }
}

function apply2DTransformations() {
  translate(-width / 2, -height / 2);
}
