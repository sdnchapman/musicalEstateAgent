import React, {Component} from 'react';
import {state} from '../../../common/gameConstants';

export default class ConductorSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 1,
    };

    this.onPreviousScreen = this.onPreviousScreen.bind(this);
    this.onNextScreen = this.onNextScreen.bind(this);
    this.onStartGame = this.onStartGame.bind(this);
    this.onGameStart = this.onGameStart.bind(this);
  }

  componentWillMount() {
    socket.on(state.GAME_START, this.onGameStart);
  }

  componentWillUnmount() {
    socket.removeListener(state.GAME_START, this.onGameStart);
  }

  onGameStart(response) {
    const {startTime, songId} = response;
    this.props.history.push(`/conductor?songId=${songId}&startTime=${startTime}`);
  }

  onNextScreen() {
    const {screen} = this.state;
    this.setState({
      screen: screen + 1,
    })
  }

  onPreviousScreen() {
    const {screen} = this.state;
    this.setState({
      screen: screen - 1,
    })
  }

  onStartGame(songid) {
    socket.emit(state.CONDUCTOR_READY, songid);
  }

  render() {
    const {screen} = this.state;
    return (
      <div className="container mt-4 mb-4 p-4 d-flex bg-white">
        {
          screen > 1 && <button className="btn btn-primary" onClick={this.onPreviousScreen}>Back</button>
        }
        <div className="flex-fill pr-4 pl-4">
          {
            (screen === 1) && (
              <React.Fragment>
                <p>You are the conductor.</p>
                <h3>Stand up and take a bow!</h3>
                <p>Ready to get to business? Click the next button!</p>
              </React.Fragment>
            )
          }
          {
            (screen === 2) && (
              <React.Fragment>
                <p>Split the rest of the players into 3 groups.</p>
                <p>If this is your first game, we recommend splitting them into left, centre and right.</p>
              </React.Fragment>
            )
          }
          {
            (screen === 3) && (
              <React.Fragment>
                <p>Point in the direction of your first group (left) and announce that they are the 'Red Team'.</p>
              </React.Fragment>
            )
          }
          {
            (screen === 4) && (
              <React.Fragment>
                <p>Point in the direction of your second group (center) and announce that they are in the 'Green Team'.</p>
              </React.Fragment>
            )
          }
          {
            (screen === 5) && (
              <React.Fragment>
                <p>Point in the direction of your third group (right) and announce that they are in the 'Blue Team'.</p>
              </React.Fragment>
            )
          }
          {
            (screen === 6) && (
              <React.Fragment>
                <p>Now your Orchestra is ready to play.</p>
                <p>Take a deep breathe to compose yourself.</p>
              </React.Fragment>
            )
          }
          {
            (screen === 7) && (
              <React.Fragment>
                <p>During the performance you will see 3 coloured tracks.</p>
                <p>Each track represents one of your groups (Red - Left, Green - Center, Blue - Right).</p>
                <p>When a note hits the bottom bar on the screen point / gesticulate to that group and they will play their instrument.</p>
              </React.Fragment>
            )
          }
          {
            (screen === 8) && (
              <React.Fragment>
                <p>Today is a big day for you!</p>
                <p>Good luck!</p>
              </React.Fragment>
            )
          }
          {
            (screen === 9) && (
              <React.Fragment>
                <p>When you are ready to start playing, select a song from below.</p>
                <button className="btn btn-warning" onClick={() => this.onStartGame(0)}>Begin the easy song!</button>
                <button className="btn btn-danger" onClick={() => this.onStartGame(1)}>Begin the hard song!</button>
              </React.Fragment>
            )
          }
        </div>
        {
          screen < 9 && <button className="btn btn-primary" onClick={this.onNextScreen}>Next</button>
        }
      </div>
    );
  }
}