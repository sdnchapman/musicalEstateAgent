import React, {Component} from 'react';
import {state} from "../../../common/gameConstants";

export default class Instrument extends Component {
  constructor(props) {
    super(props);

    this.onScored = this.onScored.bind(this);
  }

  onScored(points) {
    socket.emit(state.REGISTER_SCORE, points);
  }

  render() {
    return (
      <div>
        <button onClick={() => {this.onScored(100)}}>Make the sound!</button>
      </div>
    );
  }
}