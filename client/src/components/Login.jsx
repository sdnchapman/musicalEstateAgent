import React, {Component} from 'react';
import {state} from '../../../common/gameConstants';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
    this.onLoginClick = this.onLoginClick.bind(this);
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onRegistered = this.onRegistered.bind(this);
  }

  componentWillMount() {
    socket.on(state.REGISTERED, this.onRegistered);
  }

  componentWillUnmount() {
    socket.removeListener(state.REGISTERED, this.onRegistered);
  }

  onRegistered(response) {
    const {vip, clientId} = response;
    const {username} = this.state;
    window.isVip = vip;
    window.clientId = clientId;
    window.username = username;
    this.props.history.push('/lobby');
  }

  onLoginClick() {
    const {username} = this.state;
    if (username !== '') {
      window.socket.emit(state.REGISTER_USERNAME, username);
    }
  }

  onUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  render() {
    return (
      <div className="container">
        <div className="row shadow-lg bg-white p-4">
          <img src="/logo_gif.gif" className="col-md-6 col-xs-12"/>
          <div className="col-md-6 col-xs-12 text-left">
            <h2 className="text-danger mb-0">A social musical construction experience</h2>
            <h4 className="text-secondary">On the beat of property</h4>
          </div>
        </div>
        <div className="mt-4 shadow-lg row bg-danger text-light">
          <div className="col-12 col-md-6 p-4">
            <h2 className="text-dark">Join our team Today!</h2>
            <p>We need talented musicians and conductors to join our unique property sales Orchestra. Enter in any name
              below and click the join button for a delightful interview experience.</p>
            <input className="form-control" placeholder="Enter username here!" value={this.state.username}
                   onChange={this.onUsernameChange} type="text"/>
            <button className="btn btn-dark mt-2" onClick={this.onLoginClick}>
              I want to join the Orchestra
            </button>
          </div>
          <div className="office-image col-12 col-md-6" style={{'background-image': "url(/beautifulOffice.png)" }} />
        </div>
        <div className="row shadow-lg p-4 mt-4 bg-info text-light">
          <div className="col-8">
            <h1>Set to be the first Grammy Award Winning Estate Agents</h1>
          </div>
          <div className="col-4 text-center">
            <span style={{'font-size': '4rem'}}>
              🏆
            </span>
          </div>
        </div>
        <div className="row shadow-lg p-4 mt-4 bg-secondary text-light">
          <div className="col-6 col-md-3">
            <h3>Reviews*</h3>
            <span>(* May not directly apply to our product or service)</span>
          </div>
          <div className="col-6 col-md-9">
            <div className="speech-bubble">Very pleased with the quality of these bricks, although a little expensive.</div>
          </div>
        </div>
        <div className="row shadow-lg mt-4 bg-light text-dark text-light">
          <div className="ladder-image col-12 col-md-4" style={{'background-image': "url(/ladder.jpeg)" }} />
          <div className="col-8 p-4">
            <h3 className="text-info">Scale the housing ladder ⚖️</h3>
            <p className="text-secondary">Don't settle do A minor flat. 🎵</p>
            <p className="text-secondary">C major improvements in your property valuations! 💸 They will be Alto this world. 🌍</p>
          </div>
        </div>
      </div>

    );
  };
}