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
      songId: 0,
      timeTillStart: 0,
      instrument: 1,
      notes: []
    };
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
  }

  selectTrack() {
    const { team, songId } = this.state;
    // let track = { instrument: 1, sheet: null, notes: null };
    let instrument = 0;
    let sheet = [];
    switch (team) {
      case 'RED': // trumpets
        instrument = 660
        sheet = (songId == 1 ? trumpets_hard_notes : trumpets_easy_notes);
        break;
      case 'GREEN':  // strings
        instrument = 517
        sheet = (songId == 1 ? strings_hard_notes : strings_easy_notes);
        break;
      case 'BLUE':  // bass
        instrument = 478
        sheet = (songId == 1 ? bass_hard_notes : bass_easy_notes);
        break;
    }

    let notes = [];
    for (let i = 0; i < sheet.length; i++) {
      if (sheet[i] > 0) {
        let instant = [i + 1, sheet[i]];
        notes.push(instant);
      }
    }
    return { instrument, notes };
  }

  componentDidMount() {
    this.lastTime = performance.now()
    const { instrument, notes } = this.selectTrack();
    this.setState({ instrument, notes })
    this.midiSounds.cacheInstrument(instrument);

    let newTime = performance.now();
    const newDelta = (newTime - this.lastTime) / 1000;
    this.lastTime = newTime;

    window.requestAnimationFrame(() => this.animationFrame(newDelta));
  }

  onClick() {
    const { instrument, notes } = this.state;
    let score = 0;
    if (notes.length > 0 && this.time >= notes[0][0] - 1) {
      score = 100 - (notes[0][0] - this.time) * 100;
      notes.splice(0, 1);
      // let frequency = score >= 50 ? notes[0][1] : Math.floor((Math.random() * 20) + 50);
      this.midiSounds.playChordNow(instrument, [notes[0][1]], 1);
    } else {
      score = 0;
    }
    socket.emit(state.REGISTER_SCORE, Math.ceil(score));
  }

  animationFrame(deltaTime) {
    const { notes } = this.state;
    let newTime = performance.now();
    this.time += deltaTime;

    if (!this.state.gameStart) {
      let timeTillStart = 5 - this.time;
      this.setState({ timeTillStart });
      if (timeTillStart <= 0) {
        this.time = -1;
        this.setState({ gameStart: true });
      }
    }

    if (this.state.gameStart) {
      if (notes.length > 0 && this.time >= notes[0][0] + 0.1) {
        console.log('pop');
        //   // if (this.state.lockNote === false) {
        socket.emit(state.REGISTER_SCORE, 0);
        //   // }
        notes.splice(0, 1);
        //   // this.setState({ lockNote: false });
        //   if (this.time >= notes[0][0] - 0.5 && this.time <= notes[0][0] + 0.5) {
        //     console.log('VALID');
        //   }
      }

      // if (notes.length <= 0) {
      //   socket.emit(state.CONDUCTOR_SONG_FINISHED, score);
      // }
    }

    const newDelta = (newTime - this.lastTime) / 1000;
    this.lastTime = newTime;

    window.requestAnimationFrame(() => this.animationFrame(newDelta));
  }

  render() {
    const {team} = this.state;
    return (
      <React.Fragment>
        <div className="container mt-4 p-4 bg-primary">
          <h4>Only thing better than a beautiful instrument, is a golf club. ⛳</h4>
        </div>
        <div className="container mb-4 p-4 bg-white">
          <div style={{ visibility: 'hidden', position: 'absolute' }}><MIDISounds ref={(ref) => (this.midiSounds = ref)} appElementName="root" /></div>
          <div>
            <button className="btn text-light insturment-button" onClick={() => this.onClick()}>
            {team == "RED" ? <img src="/trumpet.png" className="col-md-6 col-xs-12"/>:""}
            {team == "GREEN" ? <img src="/violin.png" className="col-md-6 col-xs-12"/>:""}
            {team == "BLUE" ? <img src="/bass.png" className="col-md-6 col-xs-12"/>:""}
            </button>
          </div>
          {this.state.timeTillStart >= 0 && (
            <h1>
              {Math.floor(this.state.timeTillStart)}
            </h1>
          )}
        </div>
      </React.Fragment>
    );
  }
}