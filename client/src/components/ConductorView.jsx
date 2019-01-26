import React, { Component } from 'react';
let time = 0;
let lastTime = performance.now();
const noteTravelTime = 1;
let distanceToBar;
let noteSpeed;
const laneWidth = 10;
const colors = ['red', 'green', 'blue'];
const redNodes = [
  [0, 30],
  [1, 30],
  [1, 30],
  [0, 30],
  [0, 30],
  [1, 30],
  [0, 30],
];

class Note {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = 50;
    this.height = 50;
  }

  update() {
    this.y += noteSpeed;
  }
}

let gameObjects = [];


class ConductorView extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  initCanvas() {
    const canvas = this.canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");


    let newTime = performance.now();
    const newDelta = (newTime - lastTime) / 1000;
    lastTime = newTime;

    distanceToBar = (canvas.height / 1.1) + laneWidth / 2; // distance to bar
    gameObjects = redNodes.map((note, index) => new Note(0, distanceToBar * -index));

    window.requestAnimationFrame(() => this.animationFrame(canvas, ctx, newDelta))
  }

  update(deltaTime) {
    gameObjects.forEach(obj => {
      obj.update(deltaTime);
    });
  }

  renderGame(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Render note lanes
    colors.forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect(
        (canvas.width / 4 - laneWidth / 2) * (index + 1),
        0,
        laneWidth,
        canvas.height
      );
    });
    ctx.fillStyle = 'black';
    ctx.fillRect(
      0,
      canvas.height / 1.1,
      canvas.width,
      laneWidth
    );

    gameObjects.forEach(obj => {
      ctx.fillStyle = obj.color;
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    });
  }

  animationFrame(canvas, ctx, deltaTime) {
    let newTime = performance.now();
    time += deltaTime;
    console.log(time);

    noteSpeed = distanceToBar / (noteTravelTime / deltaTime);

    if (time > 1) {
      this.update(deltaTime);
      this.renderGame(canvas, ctx);
    }
      const newDelta = (newTime - lastTime) / 1000;
      lastTime = newTime;
      window.requestAnimationFrame(() => this.animationFrame(canvas, ctx, newDelta));
    
  }

  componentDidMount() {
    this.initCanvas();
  }

  render() {
    return (
      <div>
        <canvas id="canvas" ref={this.canvasRef} />
      </div>
    );
  }
}

export default ConductorView;