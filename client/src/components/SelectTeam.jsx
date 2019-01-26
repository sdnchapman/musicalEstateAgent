import React, { Component } from 'react';

class SelectTeam extends Component {
  render() {
    return (
      <div>
        <h1>Select Your Team!</h1>
        <Team name="Red"/>
        <Team name="Green"/>
        <Team name="Blue"/>
      </div>
    );
  }
}

const Team = ({name}) => {
  return(
    <div>
      <h2>{name}</h2>
    </div>
  )
}


export default SelectTeam;