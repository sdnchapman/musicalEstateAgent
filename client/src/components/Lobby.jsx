import React, { Component } from 'react';
import {state} from "../../../common/gameConstants";

export default class Lobby extends Component {
  constructor(props) {
    super(props);

    this.changeVip = this.changeVip.bind(this);
    this.onConductorSetup = this.onConductorSetup.bind(this);
    this.onMusicianSetup = this.onMusicianSetup.bind(this);
    this.onEverybodyReady = this.onEverybodyReady.bind(this);
  }

  componentWillMount() {
    socket.on(state.NEW_VIP, this.changeVip);
    socket.on(state.MUSICIAN_SETUP, this.onMusicianSetup);
    socket.on(state.CONDUCTOR_SETUP, this.onConductorSetup);
  }

  componentWillUnmount() {
    socket.removeListener(state.NEW_VIP, this.changeVip);
    socket.removeListener(state.MUSICIAN_SETUP, this.onMusicianSetup);
    socket.removeListener(state.CONDUCTOR_SETUP, this.onConductorSetup);
  }

  changeVip(response) {
    const { vip } = response;
    window.isVip = vip;
    this.forceUpdate()
  }

  onMusicianSetup() {
    this.props.history.push('/teams/');
  }

  onConductorSetup() {
    this.props.history.push('/conductorsetup/');
  }

  onEverybodyReady () {
    console.log('Sending Everybody In');
    window.socket.emit(state.EVERYBODY_READY);
  }

  render() {
    return (
      <div className="lobby-container">
        <h1>Lobby</h1>
        {
          window.isVip ? (
            <div className="vip-container">
              <p>You are a VIP</p>
              <button onClick={this.onEverybodyReady}>Everybody Ready</button>
            </div>
          )
          : <Client/>
        }
      </div>
    );
  }
};

const Vip = (onClick) =>{
  return(
    <div className="vip-container">
      You are a VIP

    </div>
  )
}

const Button = ({content}) =>{
  return(
    <button>{content}</button>
  )
}

const Client = () =>{
  return(
    <div>
      Waiting for all players to join...
    </div>
  )
}