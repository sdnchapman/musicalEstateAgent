import React, {Component} from 'react';
import {state} from "../../../common/gameConstants";
import VIP from "./VIP";
import ScoreBall from "./ScoreBall";

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
      redScore,
      greenScore,
      blueScore,
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
    const { playerScore, redScore, greenScore, blueScore } = this.state;
    let highestScore = redScore > greenScore ? redScore : greenScore;
    highestScore = blueScore > highestScore ? blueScore : highestScore;
    return (
      <div>
        <h2>Congrats! What an amazing performance!</h2>
        {
          this.state.receivedScore ? (
            <React.Fragment>
              <h4>It isn't all about the individual ... but you did score:</h4>
              <h2>{playerScore}</h2>
              <h4>How did the teams do?</h4>
              <div className='_flex _ms' style={{ 'justify-content': 'center' }}>
                <ScoreBall className='red-ball' teamScore={redScore} highestScore={highestScore} />
                <ScoreBall className='green-ball' teamScore={greenScore} highestScore={highestScore} />
                <ScoreBall className='blue-ball' teamScore={blueScore} highestScore={highestScore} />
              </div>
              {
                window.isVip ? (
                  <div className="vip-container">
                    <VIP/>
                    <button onClick={this.restartGame}>Restart everyone's game</button>
                  </div>
                )
                  : (
                    <span>Wait for the VIP to reset the game. Thanks for playing!</span>
                  )
              }
            </React.Fragment>
          ) : <span>Loading Scores</span>
        }
      </div>
    );
  }
}