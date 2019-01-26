import React, { Component, Fragment } from 'react';
import MIDISounds from 'midi-sounds-react';
import { state } from "../../../common/gameConstants";

const trumpets_hard_notes = [0, 62, 0, 0, 61, 0, 0, 62, 0, 0, 61, 0, 0, 0, 81, 0, 78, 0, 71, 0, 74, 0, 66, 0, 0, 74, 0, 0, 73, 0, 0, 0, 0, 0, 61, 0, 74, 0, 0, 0];
const strings_hard_notes = [0, 66, 0, 0, 66, 0, 0, 66, 0, 0, 66, 0, 0, 78, 0, 79, 0, 73, 0, 73, 0, 69, 62, 0, 0, 66, 0, 0, 69, 0, 0, 66, 0, 0, 69, 0, 0, 69, 0, 0];
const bass_hard_notes = [43, 0, 0, 38, 0, 0, 43, 0, 0, 38, 0, 0, 43, 0, 0, 38, 0, 0, 43, 0, 0, 38, 0, 0, 43, 50, 0, 38, 49, 0, 43, 0, 0, 38, 0, 0, 0, 0, 38, 0];

const trumpets_easy_notes = [60, 0, 64, 59, 0, 57, 0, 0, 0, 0, 0, 0, 55, 0, 57, 0];
const strings_easy_notes = [0, 0, 0, 0, 0, 0, 0, 69, 0, 76, 0, 79, 71, 0, 0, 0];
const bass_easy_notes = [0, 0, 64, 59, 0, 45, 0, 0, 0, 40, 0, 0, 0, 0, 45, 0];


export default class Instrument extends Component {

  constructor(props) {
    super(props);

    this.state = {
      gameStart: false,
      lockNote: false,
      startTime: false,
      songId: false,
      timeTillStart: 0,
      instrument: 1,
      notes: []
    };
    this.countdown = 0;
    this.time = 0;
    this.lastTime = 0;
  }

  componentWillMount() {
    const params = new URLSearchParams(this.props.location.search);
    const songId = params.get('songId');
    const startTime = params.get('startTime');
    const team = params.get('team');
    this.setState({
      songId,
      startTime: new Date(startTime).getTime(),
      team,
    });
    console.log('received componentWillMount', songId, startTime);
  }

  selectTrack() {
    const { team, songId } = this.state;
    let track = { instrument: 1, sheet: null, notes: null };
    switch (team) {
      case 'RED': // trumpets
        track.instrument = 660
        track.sheet = songId === 1 ? trumpets_hard_notes : trumpets_easy_notes;
        break;
      case 'GREEN':  // strings
        track.instrument = 517
        track.sheet = songId === 1 ? strings_hard_notes : strings_easy_notes;
        break;
      case 'BLUE':  // bass
        track.instrument = 478
        track.sheet = songId === 1 ? bass_hard_notes : bass_easy_notes;
        break;
    }

    track.notes = [];
    for (let i = 0; i < track.sheet.length; i++) {
      if (track.sheet[i] > 0) {
        let instant = [i + 1, track.sheet[i]];
        track.notes.push(instant);
      }
    }

    return track;
  }



  componentDidMount() {

    const { instrument, notes } = this.selectTrack()
    this.setState({ instrument, notes })
    console.log(instrument)
    this.lastTime = performance.now()
    this.midiSounds.cacheInstrument(instrument);

    this.countdown = this.state.startTime - new Date().getTime();

    let newTime = performance.now();
    const newDelta = (newTime - this.lastTime) / 1000;
    this.lastTime = newTime;

    window.requestAnimationFrame(() => this.animationFrame(newDelta));
  }

  onClick() {
    const { instrument, notes } = this.state;
    let score = 0;
    if (this.time > notes[0][0] - 0.5 && this.time < notes[0][0] + 0.5 && !this.state.lockNote) {
      score = Math.floor(100 - (200 * Math.abs(notes[0][0] - this.time)));
      this.setState({ lockNote: true });
      let frequency = score >= 75 ? notes[0][1] : Math.floor((Math.random() * 20) + 50);
      this.midiSounds.playChordNow(instrument, [frequency], 1);
    } else {
      score = 0;
    }
    socket.emit(state.REGISTER_SCORE, score);
  }

  animationFrame(deltaTime) {
    const { notes } = this.state;
    let newTime = performance.now();
    this.time += deltaTime;

    if (!this.state.gameStart) {
      let timeTillStart = (this.countdown / 1000) - this.time;
      this.setState({ timeTillStart });
      if (this.timeTillStart <= 0) {
        this.time = 0;
        this.setState({ gameStart: true });
      }
    }
    if (this.time > notes[0][0] - 0.5 && this.time < notes[0][0] + 0.5) {
      console.log('VALID');
    }

    if (this.state.gameStart) {
      if (notes.length > 0 && this.time >= notes[0][0] + 0.5) {
        if (this.state.lockNote === false) {
          socket.emit(state.REGISTER_SCORE, 0);
        }
        notes.splice(0, 1);
        this.setState({ lockNote: false });
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
        {this.state.timeTillStart >= 0 && (
          <h1>
            {Math.floor(this.state.timeTillStart)}
          </h1>
        )}
      </Fragment>
    );
  }
}