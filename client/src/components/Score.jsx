import React, {Component} from 'react';
import {state} from "../../../common/gameConstants";
import VIP from "./VIP";
import ScoreBall from "./ScoreBall";
import Motivation from "./Motivation";

const adjectives = [
  'Amazing',
  'Wonderful',
  'Fantastic',
  'Clean',
  'Great',
  'Musical',
  'Technical',
  'Fun',
  'Inspiring',
  'Creative',
  'Impressive',
  'Astonishing',
  'Astounding',
  'Brilliant',
  'Formidable',
  'Glorious',
  'Grandiose',
  'Heroic',
  'Imposing',
  'Lofty',
  'Majestic',
  'Noble',
  'Moving'
]

const getRandomAdjective = () => {
  return adjectives[Math.floor(Math.random() * adjectives.length)];
};

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
    setTimeout(() => {
      new Audio('/whooo.wav').play()
    }, Math.random() * 500)
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
      receivedScore: true,
    })
  }

  restartGame() {
    socket.emit(state.REQUEST_RESTART);
  }

  changeVip(response) {
    const {vip} = response;
    window.isVip = vip;
    this.forceUpdate()
  }

  render() {
    const {playerScore, redScore, greenScore, blueScore} = this.state;
    let highestScore = redScore > greenScore ? redScore : greenScore;
    highestScore = blueScore > highestScore ? blueScore : highestScore;
    return (
      <React.Fragment>
        <div className="container mt-4 mb-4 p-4 bg-warning">
          <h2>Congratulations! {getRandomAdjective()} performance!</h2>
        </div>
        <div className="container mt-4 mb-4 p-4 bg-dark text-light">
          <h4>It isn't all about the individual ... but you did score:</h4>
          <p>{playerScore + ' points'}</p>
        </div>
        <div className="container mt-4 mb-4 p-4 bg-white">
          {
            this.state.receivedScore ? (
              <React.Fragment>
                <h4>How did the teams do?</h4>
                <div className='_flex _ms' style={{'justify-content': 'center'}}>
                  <ScoreBall className='red-ball' teamScore={redScore} highestScore={highestScore}/>
                  <ScoreBall className='green-ball' teamScore={greenScore} highestScore={highestScore}/>
                  <ScoreBall className='blue-ball' teamScore={blueScore} highestScore={highestScore}/>
                </div>
              </React.Fragment>
            ) : <span>Loading Scores</span>
          }
        </div>
        <div className="container mt-4 mb-4 p-4 d-flex bg-white">
          {
            window.isVip ? (
                <React.Fragment>
                  <VIP/>
                  <button className="btn btn-primary" onClick={this.restartGame}> Restart everyone's game</button>
                </React.Fragment>
              )
              : (
                <span>Wait for the VIP to reset the game. Thanks for playing!</span>
              )
          }
        </div>
        <Motivation />
      </React.Fragment>
    );
  }
}