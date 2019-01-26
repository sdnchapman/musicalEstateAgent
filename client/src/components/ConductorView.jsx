import React, { Component } from 'react';
let time = 0;
let lastTime = performance.now();
const noteTravelTime = 2;
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
  
    gameObjects = [
      ...redNodes.map((note, index) => new Note(0, (distanceToBar / 2) * -(index+1.5), '#ffa0a0')),
      ...redNodes.map((note, index) => new Note(0, (distanceToBar / 2) * -(index+1.5), '#a0ffa0')),
      ...redNodes.map((note, index) => new Note(0, (distanceToBar / 2) * -(index+1.5), '#a0a7ff')),
    ];
    

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
        (canvas.width / 4) * (index + 1) - (laneWidth / 2),
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

    // notes
    gameObjects.forEach(obj => {
      ctx.fillStyle = obj.color;
      let xPos = (canvas.width / 4);
      switch (obj.color) {
        case '#ffa0a0': //red
          xPos *= 1;
          break;
        case '#a0ffa0':
          xPos *= 2;
          break;
        case '#a0a7ff':
          xPos *= 3;
          break;
      }
      ctx.fillRect(xPos - obj.width/2, obj.y, obj.width, obj.height);
    });
  }

  animationFrame(canvas, ctx, deltaTime) {
    let newTime = performance.now();
    time += deltaTime;

    noteSpeed = distanceToBar / (noteTravelTime / deltaTime);

    this.update(deltaTime);
    this.renderGame(canvas, ctx);

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