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
  }

  componentDidMount() {
    this.requestScore();
  }

  requestScore() {
    socket.emit(state.REQUEST_SCORE);
  }

  componentWillMount() {
    socket.on(state.FINAL_SCORE, this.onReceiveScore);
  }

  componentWillUnmount() {
    socket.removeListener(state.FINAL_SCORE, this.onReceiveScore);
  }

  onReceiveScore(response) {
    const {playerScore} = response;
    this.setState({
      playerScore,
      receivedScore:true,
    })
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
            </React.Fragment>
          ) : <span>Loading Scores</span>
        }
      </div>
    );
  }
}