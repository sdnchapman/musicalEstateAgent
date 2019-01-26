import React, {Component} from 'react';
import {state} from "../../../common/gameConstants";

export default class Score extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerScore: '',
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
    const {playerScore} = response;
    this.setState({
      playerScore,
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
        <h3>Congrats you finished!</h3>
        {
          this.state.receivedScore ? (
            <React.Fragment>
              <h1>Score</h1>
              <h2>{this.state.playerScore}</h2>
              {
                window.isVip && (
                  <div className="vip-container">
                    <p>You are the VIP</p>
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