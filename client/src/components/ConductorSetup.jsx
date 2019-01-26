import React, {Component} from 'react';
import { state } from '../../../common/gameConstants';

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
    const { startTime, songId } = response;
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
      <div>
        {
          screen > 1 && <button onClick={this.onPreviousScreen}>Back</button>
        }
        {
          (screen === 1) && (
            <React.Fragment>
              <h3>You are the conductor</h3>
              <h1>Stand Up and take a bow!</h1>
              <h3>Ready to get to business? Click the next arrow!</h3>
            </React.Fragment>
          )
        }
        {
          (screen === 2) && (
            <React.Fragment>
              <p>In your head split your audience into 3 groups.</p>
              <p>In the next stage you will assign each group a colour. Red, Green and Blue.</p>
            </React.Fragment>
          )
        }
        {
          (screen === 3) && (
            <React.Fragment>
              <p>Lets begin with the Red Team.</p>
              <p>Point in the direction of your first group and announce that they are the 'Red Team'.</p>
              <p>They will then register this into their App.</p>
            </React.Fragment>
          )
        }
        {
          (screen === 4) && (
            <React.Fragment>
              <p>Now onto the Green team.</p>
              <p>Point in the direction of your second group and announce that they are in the 'Green Team'.</p>
              <p>They will then register this into their App.</p>
            </React.Fragment>
          )
        }
        {
          (screen === 5) && (
            <React.Fragment>
              <p>Now onto the Blue team.</p>
              <p>Point in the direction of your third and final group and announce that they are in the 'Blue Team'.</p>
              <p>They will then register this into their App.</p>
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
              <p>Today is a big day!</p>
            </React.Fragment>
          )
        }
        {
          (screen === 8) && (
            <React.Fragment>
              <p>When you are ready to start playing, click the button below.</p>
              <button className="_ms" onClick={() => this.onStartGame(0)}>Begin the easy song!</button>
              <button className="_ms" onClick={() => this.onStartGame(1)}>Begin the hard song!</button>
            </React.Fragment>
          )
        }
        {
          screen < 8 && <button onClick={this.onNextScreen}>Next</button>
        }
      </div>
    );
  }
}