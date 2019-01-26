import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ConductorSetup extends Component {
    render() {
        return (
            <div>
                <h3>You are the conductor</h3>
                <h1>Standup and take a bow!</h1>
                <h3>Ready to get to business?</h3>
                <p>Your orchestra is split into 3 instruments. Each instrument is represented by a colour.</p>
                <p>Look at your audience and split them into 3 groups of your choosing.</p>
                <p>Look at the first group and announce to them that they are the Red group.</p>
                <p>Look at the second group and announce to them that they are the Green group.</p>
                <p>Look at the third group and announce to them that they are the Blue group.</p>
                <p>Once your orchestra are ready click the button below to begin!</p>
                <Link to="conductor"><button>Begin the song!</button></Link>
            </div>
        );
    }
}