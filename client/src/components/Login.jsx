import React, {Component} from 'react';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
    this.onLoginClick = this.onLoginClick.bind(this);
    this.onUsernameChange = this.onUsernameChange.bind(this);
  }

  onLoginClick() {
    const {username} = this.state;
    if (username !== '') {
      window.socket.emit('REGISTER_USERNAME', username);
    }
  }

  onUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  render() {
    console.log('trees are wierd');
    return (
      <div className="login-container">
        <input value={this.state.username} onChange={this.onUsernameChange} type="text" />
        <button className="button" onClick={this.onLoginClick}>
          I'm a Login Button
        </button>
      </div>
    );
  };
}