import React, {Component} from 'react';
import {state} from "../../../common/gameConstants";
import VIP from "./VIP";
import Motivation from "./Motivation";

const adjectives = [
  'charming',
  'unique',
  'characterful',
  'sea facing',
  'penthouse',
  'spacious',
  'cute',
  'well-built',
  'large',
  'run down',
  'grade 2 listed',
  'grade 1 listed',
  'picturesque',
  'beachfront',
  'centrally located',
  'dank',
  'open plan',
  'shiny',
  'scrappy',
  'haunted',
  'smelly',
  'damp',
  'cozy',
  'airy',
  'rural',
  'morden',
  'avant-garde',
  'functional',
  'budget',
];

const housePictures = [
  'bathroom1',
  'bedroom1',
  'bedroom2',
  'bedroom3',
  'bedroom4',
  'bedroom5',
  'garage1',
  'garden1',
  'garden2',
  'gym',
  'kitchen1',
  'kitchen2',
  'kitchen3',
  'room1',
  'room2',
  'room3',
  'room4',
  'room5',
  'room6',
  'room7',
  'room8',
  'room9',
  'room10',
  'pool',
  'livingroom',
];

const houseTypes = [
  'riverboat',
  'mansion',
  'semi-detached',
  'converted council',
  'terrace',
  'loft conversion',
  'barn conversion',
  'hut',
  'cottage',
  'ranch',
  'castle',
  'longhouse',
  'igloo',
  'log cabin',
  'trench',
  'teepee',
  'tent',
  'tree ',
  'mobile',
  'garage',
  'apartment',
  'eco',
  'bunker',
  'shack',
  'basement'
];

const getRandomHouseImagePath = () => {
  return '/' + housePictures[Math.floor(Math.random() * housePictures.length)] + '.jpg';
};

const getRandomAdjective = () => {
  return adjectives[Math.floor(Math.random() * adjectives.length)];
};

const getRandomHouseType = () => {
  return houseTypes[Math.floor(Math.random() * houseTypes.length)];
};

export default class Lobby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerCount: 0,
    };

    this.changeVip = this.changeVip.bind(this);
    this.onConductorSetup = this.onConductorSetup.bind(this);
    this.onMusicianSetup = this.onMusicianSetup.bind(this);
    this.onEverybodyReady = this.onEverybodyReady.bind(this);
    this.onPlayerCountChange = this.onPlayerCountChange.bind(this);
  }

  componentWillMount() {
    socket.on(state.NEW_VIP, this.changeVip);
    socket.on(state.MUSICIAN_SETUP, this.onMusicianSetup);
    socket.on(state.CONDUCTOR_SETUP, this.onConductorSetup);
    socket.on(state.PLAYER_COUNT, this.onPlayerCountChange);
  }

  componentWillUnmount() {
    socket.removeListener(state.NEW_VIP, this.changeVip);
    socket.removeListener(state.MUSICIAN_SETUP, this.onMusicianSetup);
    socket.removeListener(state.CONDUCTOR_SETUP, this.onConductorSetup);
    socket.removeListener(state.PLAYER_COUNT, this.onPlayerCountChange);
  }

  onPlayerCountChange(playerCount) {
    this.setState({
      playerCount,
    });
  }

  changeVip(response) {
    const {vip} = response;
    window.isVip = vip;
    this.forceUpdate()
  }

  onMusicianSetup() {
    this.props.history.push('/teams/');
  }

  onConductorSetup() {
    this.props.history.push('/conductorsetup/');
  }

  onEverybodyReady() {
    console.log('Sending Everybody In');
    window.socket.emit(state.EVERYBODY_READY);
  }

  render() {
    const { playerCount } = this.state;
    return (
      <React.Fragment>
        <div className="row">
          <div className="lobby-image col-4 col-md-2 pr-0 mt-4 mb-4" style={{'background-image': "url(" + getRandomHouseImagePath() + ")" }} />
          <div className="lobby-image col-4 col-md-2 pr-0 mt-4 mb-4" style={{'background-image': "url(" + getRandomHouseImagePath() + ")" }} />
          <div className="lobby-image col-4 col-md-2 pr-0 mt-4 mb-4" style={{'background-image': "url(" + getRandomHouseImagePath() + ")" }} />
        </div>
        <div className="p-4 bg-white">
          <div className="container">
            <h1 className="text-secondary">
              {`A ${getRandomAdjective()} ${playerCount} bedroom ${getRandomHouseType()} Lobby`}
            </h1>
            {
              window.isVip ? (
                  <div>
                    <VIP/>
                    <button className="btn btn-info" onClick={this.onEverybodyReady}>Everybody Ready</button>
                  </div>
                )
                : <Client/>
            }
            <h4 className="text-white bg-danger p-2 mt-4">
              🔈 🔈 🔈 This game requires sound to play from your device. Please turn up the media volume. 🔈 🔈 🔈
            </h4>
          </div>
        </div>
        <Motivation />
      </React.Fragment>
    );
  }
};

const Vip = (onClick) => {
  return (
    <div className="vip-container">
      You are a VIP

    </div>
  )
}

const Button = ({content}) => {
  return (
    <button>{content}</button>
  )
}

const Client = () => {
  return (
    <div>
      Waiting for all players to join...
    </div>
  )
}