import React, { Component } from 'react';
import MIDISounds from 'midi-sounds-react';
 
class MusicTest extends Component {

  playBass(pitch) {
    if (pitch != 0) {
      this.midiSounds.playChordNow(478, [pitch], 1);
    }
  }

  playTrumpet(pitch) {
    if (pitch != 0) {
      this.midiSounds.playChordNow(660, [pitch], 1);
    }
  }

  playString(pitch) {
    if (pitch != 0) {
      this.midiSounds.playChordNow(517, [pitch], 1);
    }
  }

  playSequenceTrumpets() {
    // [60, 0, 64, 59, 0, 57, 0, 0, 0, 0, 0, 0, 55, 0, 57].forEach((pitch, index) => {
    //   setTimeout(() =>this.playTrumpet(pitch), 1000 * index);
    // });
    [0, 62, 0, 0, 61, 0, 0, 62, 0, 0, 61, 0, 0, 0, 81, 0, 78, 0, 71, 0, 74, 0, 66, 0, 0, 74, 0, 0, 73, 0, 0, 0, 0, 0, 61, 0, 74, 0, 0, 0].forEach((pitch, index) => {
      setTimeout(() =>this.playTrumpet(pitch), 1000 * index);
    });
  }

  playSequenceBass() {
    // [0, 0, 64, 59, 0, 45, 0, 0, 0, 40, 0, 0, 0, 0, 45].forEach((pitch, index) => {
    //   setTimeout(() =>this.playBass(pitch), 1000 * index);
    // });
    [43, 0, 0, 38, 0, 0, 43, 0, 0, 38, 0, 0, 43, 0, 0, 38, 0, 0, 43, 0, 0, 38, 0, 0, 43, 50, 0, 38, 49, 0, 43, 0, 0, 38, 0, 0, 0, 0, 38, 0].forEach((pitch, index) => {
      setTimeout(() =>this.playBass(pitch), 1000 * index);
    });
  }

  playSequenceStrings() {
    [0, 66, 0, 0, 66, 0, 0, 66, 0, 0, 66, 0, 0, 78, 0, 79, 0, 73, 0, 73, 0, 69, 62, 0, 0, 66, 0, 0, 69, 0, 0, 66, 0, 0, 69, 0, 0, 69, 0, 0].forEach((pitch, index) => {
      setTimeout(() =>this.playString(pitch), 1000 * index);
    });
  }

  playAll() {
    this.playSequenceStrings()
    this.playSequenceBass()
    this.playSequenceTrumpets()
  }

  componentDidMount(){
    this.midiSounds.cacheInstrument(478);  //contrabass 4
    this.midiSounds.cacheInstrument(517);  //string ensemble 1
    this.midiSounds.cacheInstrument(660);  //brass section 2
  }

  render() {
    return (
      <div className="App">
        <p className="MusicTest-intro">Press Play to play instrument sound.</p>
        <p><button onClick={() => this.playSequenceBass()}>Bass</button></p>
        <p><button onClick={() => this.playSequenceStrings()}>Strings</button></p>
        <p><button onClick={() => this.playSequenceTrumpets()}>Trumpets</button></p>
        <p><button onClick={() => this.playAll()}>All</button></p>
        <MIDISounds ref={(ref) => (this.midiSounds = ref)} appElementName="root" instruments={[3]} />	
      </div>
    );
  }
}
 
export default MusicTest;