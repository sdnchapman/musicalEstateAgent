import React, {Component} from 'react';
import {state} from "../../../common/gameConstants";
import Motivation from "./Motivation";

class SelectTeam extends Component {
  constructor(props) {
    super(props);
    this.setTeam = this.setTeam.bind(this);
    this.onSelectTeam = this.onSelectTeam.bind(this);
    this.onGameStart = this.onGameStart.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      new Audio('/clapping.wav').play()
    }, Math.random() * 1500)
  }

  componentWillMount() {
    socket.on(state.TEAM_SELECTED, this.setTeam);
    socket.on(state.GAME_START, this.onGameStart);
    const params = new URLSearchParams(this.props.location.search);
    const songId = params.get('songId');
    const startTime = params.get('startTime');
    this.setState({
      songId,
      startTime,
    });
  }

  componentWillUnmount() {
    socket.removeListener(state.TEAM_SELECTED, this.setTeam);
    socket.removeListener(state.GAME_START, this.onGameStart);
  }

  onGameStart(response) {
    const {startTime, songId, clientData:{type} } = response;
    console.log(response)
    this.props.history.push(`/instrument?songId=${songId}&startTime=${startTime}&team=${type}`);
  }

  setTeam(team) {
    window.team = team;
    this.forceUpdate();
  }

  onSelectTeam(team) {
    let payload = {clientId: window.clientId, team};
    window.socket.emit(state.SELECT_TEAM, payload);
  }

  render() {
    const {team} = window;
    return (
      <React.Fragment>
          <div className="container mt-4 mb-4 p-4 bg-white">
          {team === undefined ? <h2>Select Your Team!</h2> :
            <div>
              <h3>You are in the {team} team!</h3>
              <p>Soon you will be given your instrument</p>
              <p>Pay attention to the conductor</p>
              <p>When the conductor points at you play it by pressing the button</p>
              <br/>
              <h4>Change Team</h4>
            </div>
          }
          <div className="btn-group" role="group" aria-label="Basic example">
            <button value="red" type="button" className="btn btn-danger" onClick={() => this.onSelectTeam('RED')}>Red
            </button>
            <button value="green" type="button" className="btn btn-success"
                    onClick={() => this.onSelectTeam('GREEN')}>Green
            </button>
            <button value="blue" type="button" className="btn btn-primary"
                    onClick={() => this.onSelectTeam('BLUE')}>Blue
            </button>
          </div>
        </div>
        <Motivation />
      </React.Fragment>
    )
  }
}

export default SelectTeam;