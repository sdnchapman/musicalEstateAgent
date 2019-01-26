import React, {Component} from 'react';

export default class Score extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const params = new URLSearchParams(this.props.location.search);
    const totalScore = params.get('total'); // bar

    return (
      <div>
        <h3>Congrats you finished!</h3>
        <h1>Score</h1>
        <h2>{totalScore || ''}</h2>
      </div>
    );
  }
}