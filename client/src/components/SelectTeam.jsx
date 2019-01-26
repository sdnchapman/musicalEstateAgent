import React, { Component } from 'react';
import {state} from "../../../common/gameConstants";

class SelectTeam extends Component {
  constructor(props) {
    super(props)
    this.setTeam = this.setTeam.bind(this);
    this.onSelectTeam = this.onSelectTeam.bind(this);
    this.onGameStart = this.onGameStart.bind(this);
  }

  componentWillMount() {
    socket.on(state.TEAM_SELECTED, this.setTeam);
    socket.on(state.GAME_START, this.onGameStart);
  }

  componentWillUnmount() {
    socket.removeListener(state.TEAM_SELECTED, this.setTeam);
    socket.removeListener(state.GAME_START, this.onGameStart);
  }

  onGameStart(responce){
    this.props.history.push('/instrument/');
  }

  setTeam(team){
    window.team = team;
    this.forceUpdate();
  }

  onSelectTeam(team) {
    let payload = {clientId: window.clientId, team};
    window.socket.emit(state.SELECT_TEAM, payload );
  }

  render() {
    const {team} = window;
    return(
      <div>
        {team === undefined ? <h2>Select Your Team!</h2>: 
          <div>
            <h1>You are in the {team} team!</h1>
            <h3>Soon you will be given your instrument</h3>
            <h3>Pay attention to the conductor</h3>
            <h4>When the conductor points at you play it by pressing the button</h4>
            <br/>
            <h4>Change Team</h4>
          </div>
        }
        <TeamButton name="red" onSelectTeam={this.onSelectTeam} />
        <TeamButton name="green" onSelectTeam={this.onSelectTeam}/>
        <TeamButton name="blue" onSelectTeam={this.onSelectTeam}/>
      </div>
      

    )
  }
}


const TeamButton = ({name, onSelectTeam}) =>{
  return(
    <button value={name} onClick={() => onSelectTeam(name.toUpperCase())}>{name}</button>
  )
}
export default SelectTeam;