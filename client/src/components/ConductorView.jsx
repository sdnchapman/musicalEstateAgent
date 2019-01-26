import React, { Component } from 'react';
import {state} from "../../../common/gameConstants";

const easy_trumpets = [1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0];
const easy_strings = [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0];
const easy_bass = [0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0];

const hard_trumpets = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0];
const hard_strings = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0];
const hard_bass = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0];

const noteTravelTime = 2;
const laneWidth = 10;
const colors = ['red', 'green', 'blue'];


class Note {
  constructor(x, y, color, screenHeight, length) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = 50;
    this.height = 50;
    this.screenHeight = screenHeight;
    this.isOffScreen = false;
    this.length = length;
  }

  update(noteSpeed) {
    this.y += noteSpeed;
    if (this.y > this.screenHeight) {
      this.isOffScreen = true;
    }
  }
}

class ConductorView extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      gameStart: false,
      shouldUpdate: true,
      songId: null,
      startTime: null,
    };
    this.gameObjects = [];
    this.time = 0;
    this.lastTime = 0;
    this.distanceToBar = 0;
    this.noteSpeed = 0;

    this.onSongEnd = this.onSongEnd.bind(this);
    this.onGameOver = this.onGameOver.bind(this);

    this.countdown = 0;
  }

  onSongEnd() {
    socket.emit(state.CONDUCTOR_SONG_FINISHED);
  }

  componentWillMount() {
    const params = new URLSearchParams(this.props.location.search);
    const songId = params.get('songId');
    const startTime = params.get('startTime');
    this.setState({
      songId,
      startTime: new Date(startTime).getTime(),
    });
    socket.on(state.GAME_OVER, this.onGameOver);
  }

  componentWillUnmount() {
    socket.removeListener(state.GAME_OVER, this.onGameOver);
  }

  onGameOver() {
    this.props.history.push(`/score`);
  }

  initCanvas() {
    const canvas = this.canvasRef.current;
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    const ctx = canvas.getContext("2d");

    let newTime = performance.now();
    const newDelta = (newTime - this.lastTime) / 1000;
    this.lastTime = newTime;

    this.distanceToBar = (canvas.height / 1.1) + laneWidth / 2; // distance to bar

    const bassMusic = this.state.songId === 0 ? easy_bass : hard_bass;
    const trumpetMusic = this.state.songId === 0 ? easy_trumpets : hard_trumpets;
    const stringsMusic = this.state.songId === 0 ? easy_strings : hard_strings;

    bassMusic.forEach((note, index) => {
      if (trumpetMusic[index] === 1) {
        this.gameObjects.push(new Note(0, (this.distanceToBar / 2) * -(index), '#ffa0a0', canvas.height * 2))
      }
      if(stringsMusic[index]) {
        this.gameObjects.push(new Note(0, (this.distanceToBar / 2) * -(index), '#a0ffa0', canvas.height * 2))
      }
      if(bassMusic[index]) {
        this.gameObjects.push(new Note(0, (this.distanceToBar / 2) * -(index), '#a0a7ff', canvas.height * 2))
      }
    });
    setTimeout(() => this.setState({ gameStart: true }), 5000);
    window.requestAnimationFrame(() => this.animationFrame(canvas, ctx, newDelta))
  }

  update(noteSpeed) {
    let destroyNotes = [];
    this.gameObjects.forEach((obj, index) => {
      obj.update(noteSpeed);
      if (obj.isOffScreen) {
        destroyNotes.push(index);
      }
    });
    for (let i = destroyNotes.length - 1; i >= 0; i--) {
      this.gameObjects.splice(destroyNotes[i], 1);
    }
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
      laneWidth,
    );

    // notes
    this.gameObjects.forEach(obj => {
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
      // note
      ctx.fillRect(xPos - obj.width / 2, obj.y, obj.width, obj.height);
      //note length
      ctx.fillRect(xPos - obj.width / 6, obj.y - (this.distanceToBar / 2) * obj.length, obj.width / 3, (this.distanceToBar / 2) * obj.length);
    });

    if (!this.state.gameStart) {
      ctx.fillStyle = 'black';
      ctx.font = "240px Arial";
      let countDown = (5) - this.time;
      // if (countDown <= -1) { this.setState({ gameStart: true }) }
      ctx.fillText(countDown <= 0 ? '🏁' : Math.floor(countDown), canvas.width / 2 - 70, canvas.height / 2);
    }
  }

  animationFrame(canvas, ctx, deltaTime) {
    let newTime = performance.now();
    this.time += deltaTime;

    this.noteSpeed = this.distanceToBar / (noteTravelTime / deltaTime);

    if (this.state.gameStart) {
      this.update(this.noteSpeed);

      if(this.gameObjects.length <= 0){
        socket.emit(state.CONDUCTOR_SONG_FINISHED);
      }
    }

    this.renderGame(canvas, ctx);

    const newDelta = (newTime - this.lastTime) / 1000;
    this.lastTime = newTime;

    window.requestAnimationFrame(() => this.animationFrame(canvas, ctx, newDelta));
  }

  componentDidMount() {
    this.countdown = this.state.startTime - new Date().getTime();
    this.lastTime = performance.now();
    this.initCanvas();
  }

  render() {
    return (
      <div className="container mt-4 mb-4 p-4 d-flex bg-white" style={{ height: '80vh' }}>
        <canvas id="canvas" ref={this.canvasRef} />
      </div>
    );
  }
}

export default ConductorView;