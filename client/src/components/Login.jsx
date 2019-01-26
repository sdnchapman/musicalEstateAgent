import React, {Component} from 'react';
import { state } from '../../../common/gameConstants';

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
    const { vip, clientId } = response;
    window.isVip = vip;
    window.clientId = clientId;
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
    console.log('trees are wierd');
    return (
      <div className="login-container">
        <input placeholder="Enter username here!" value={this.state.username} onChange={this.onUsernameChange} type="text" />
        <button className="button" onClick={this.onLoginClick}>
          I'm a Login Button
        </button>
      </div>
    );
  };
}