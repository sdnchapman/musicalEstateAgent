import React, { Component, Fragment } from 'react';
import MIDISounds from 'midi-sounds-react';
import { state } from "../../../common/gameConstants";

const song = [0, 62, 0, 0, 61, 0, 0, 62, 0, 0, 61, 0, 0, 0, 81, 0, 78, 0, 71, 0, 74, 0, 66, 0, 0, 74, 0, 0, 73, 0, 0, 0, 0, 0, 61, 0, 74, 0, 0, 0];

export default class Instrument extends Component {

  constructor(props) {
    super(props);

    this.notes = [];
    for (let i = 0; i < song.length; i++) {
      if (song[i] > 0) {
        let instant = [i + 1, song[i]];
        this.notes.push(instant);
      }
    }
    this.state = {
      gameStart: false,
      lockNote: false,
    };
    this.time = 0;
    this.lastTime = 0;
  }

  componentDidMount() {
    this.lastTime = performance.now()
    this.midiSounds.cacheInstrument(660);

    let newTime = performance.now();
    const newDelta = (newTime - this.lastTime) / 1000;
    this.lastTime = newTime;

    window.requestAnimationFrame(() => this.animationFrame(newDelta));
  }

  onClick() {
    let score = 0;
    if (this.time > this.notes[0][0] - 0.5 && this.time < this.notes[0][0] + 0.5 && !this.state.lockNote) {
      score = Math.floor(100 - (200 * Math.abs(this.notes[0][0] - this.time)));
      this.setState({lockNote: true});
      let frequency = score >= 75 ? this.notes[0][1] : Math.floor((Math.random() * 20) + 50);
      this.midiSounds.playChordNow(660, [frequency], 1);
    } else {
      score = 0;
    }
    socket.emit(state.REGISTER_SCORE, score);
  }

  animationFrame(deltaTime) {
    let newTime = performance.now();
    this.time += deltaTime;

    if (this.time > 3 && !this.state.gameStart) {
      this.time = 0;
      this.setState({ gameStart: true });
    }
    if (this.time > this.notes[0][0] - 0.5 && this.time < this.notes[0][0] + 0.5) {
      console.log('VALID');
    }

    if (this.state.gameStart) {
      if (this.notes.length > 0 && this.time >= this.notes[0][0] + 0.5) {
        this.notes.splice(0, 1);
        this.setState({lockNote: false});
      }
    }

    const newDelta = (newTime - this.lastTime) / 1000;
    this.lastTime = newTime;

    window.requestAnimationFrame(() => this.animationFrame(newDelta));
  }

  render() {
    return (
      <Fragment>
        <div style={{ visibility: 'hidden', position: 'absolute' }}><MIDISounds ref={(ref) => (this.midiSounds = ref)} appElementName="root" instruments={[3]} /></div>
        <div>
          <button onClick={() => this.onClick()}>Make the sound!</button>
        </div>
      </Fragment>
    );
  }
}