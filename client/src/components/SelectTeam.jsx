import React, { Component } from 'react';
import {state} from "../../../common/gameConstants";

class SelectTeam extends Component {
  constructor(props) {
    super(props)
    this.setTeam = this.setTeam.bind(this);
    this.onSelectTeam = this.onSelectTeam.bind(this);
  }

  componentWillMount() {
    socket.on(state.SELECT_TEAM, this.onSelectTeam);
    socket.on(state.TEAM_SELECTED, this.setTeam);
  }

  componentWillUnmount() {
    socket.removeListener(state.SELECT_TEAM, this.onSelectTeam);
    socket.removeListener(state.TEAM_SELECTED, this.setTeam);
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
      team === undefined ?
      <div>
        <h2>Select Your Team!</h2>
        <TeamButton name="red" onSelectTeam={this.onSelectTeam} />
        <TeamButton name="green" onSelectTeam={this.onSelectTeam}/>
        <TeamButton name="blue" onSelectTeam={this.onSelectTeam}/>
      </div>
      :
      <div>
        <h2>You are the {team} team</h2>
        <h3>Wait for the conductor to start</h3>
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