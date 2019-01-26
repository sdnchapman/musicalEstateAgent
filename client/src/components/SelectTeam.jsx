import React, { Component } from 'react';

class SelectTeam extends Component {
  constructor(props) {
    super(props)
    this.state = {team: null}
    this.setTeam = this.setTeam.bind(this);
  }

  setTeam(team) {
    this.setState({team});
  }

  render() {
    const {team} = this.state;
    return(
      team === null ?
      <div>
        <h2>Select Your Team!</h2>
        <TeamButton name="red" setTeam={this.setTeam} />
        <TeamButton name="green" setTeam={this.setTeam}/>
        <TeamButton name="blue" setTeam={this.setTeam}/>
      </div>
      :
      <div>
        <h2>You are the {team} team</h2>
      </div>
    )
  }
}


const TeamButton = ({name, setTeam}) =>{
  return(
    <button value={name} onClick={() => setTeam(name)}>{name}</button>
  )
}
export default SelectTeam;