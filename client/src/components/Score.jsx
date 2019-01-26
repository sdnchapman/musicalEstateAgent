import React, {Component} from 'react';
import {state} from "../../../common/gameConstants";
import VIP from "./VIP";

export default class Score extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerScore: '',
      redScore: '',
      blueScore: '',
      greenScore: '',
      receivedScores: false,
    };

    this.onReceiveScore = this.onReceiveScore.bind(this);
    this.requestScore = this.requestScore.bind(this);
    this.changeVip = this.changeVip.bind(this);
  }

  componentDidMount() {
    this.requestScore();
  }

  requestScore() {
    socket.emit(state.REQUEST_SCORE);
  }

  componentWillMount() {
    socket.on(state.FINAL_SCORE, this.onReceiveScore);
    socket.on(state.NEW_VIP, this.changeVip);
  }

  componentWillUnmount() {
    socket.removeListener(state.FINAL_SCORE, this.onReceiveScore);
    socket.removeListener(state.NEW_VIP, this.changeVip);
  }

  onReceiveScore(response) {
    const {playerScore, redScore, greenScore, blueScore} = response;
    this.setState({
      playerScore,
      redScore: 123,
      greenScore: 321,
      blueScore: 888,
      receivedScore:true,
    })
  }

  restartGame() {
    socket.emit(state.REQUEST_RESTART);
  }

  changeVip(response) {
    const { vip } = response;
    window.isVip = vip;
    this.forceUpdate()
  }

  render() {
    return (
      <div>
        <h3>Congrats! What an amazing performance!</h3>
        {
          this.state.receivedScore ? (
            <React.Fragment>
              <h3>It isn't all about the individual ... but you did score:</h3>
              <h2>{this.state.playerScore}</h2>
              <h2>{this.state.redScore}</h2>
              <h2>{this.state.greenScore}</h2>
              <h2>{this.state.blueScore}</h2>
              {
                window.isVip && (
                  <div className="vip-container">
                    <VIP/>
                    <button onClick={this.restartGame}>Restart everyone's game</button>
                  </div>
                )
              }
            </React.Fragment>
          ) : <span>Loading Scores</span>
        }
      </div>
    );
  }
}