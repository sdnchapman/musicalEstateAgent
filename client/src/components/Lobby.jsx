import React, { Component } from 'react';
import {state} from "../../../common/gameConstants";

export default class Lobby extends Component {
  constructor(props) {
    super(props);

    this.changeVip = this.changeVip.bind(this);
    this.onConductorSetup = this.onConductorSetup.bind(this);
    this.onMusicianSetup = this.onMusicianSetup.bind(this);
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

  onMusicianSetup(response) {
    const { vip } = response;
    window.isVip = vip;
    this.props.history.push('/teams');
  }

  onConductorSetup(response) {
    const { vip } = response;
    window.isVip = vip;
    this.props.history.push('/conductorsetup');
  }

  render() {
    return (
      <div className="lobby-container">
        <h1>Lobby</h1>
        {window.isVip ? <Vip/> : <Client/>}
      </div>
    );
  }
};

const Vip = () =>{
  return(
    <div className="vip-container">
      You are a VIP
      <Button content="Start"/>
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