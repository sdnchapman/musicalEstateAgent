import React from 'react';
import Login from './Login';
import {HashRouter as Router, Route} from 'react-router-dom';
import "./styles.scss";
import Score from "./Score";
import ConductorSetup from "./ConductorSetup";
import Instrument from "./Instrument";
import Lobby from "./Lobby";
import SelectTeam from "./SelectTeam";


const App = () => {
    return (
        <div className="app-container">
            <Router>
                <div>
                    <Route path="/" exact component={Login}/>
                    <Route path="/lobby/" exact component={Lobby}/>
                    <Route path="/teams/" exact component={SelectTeam}/>
                    <Route path="/instrument/" exact component={Instrument}/>
                    <Route path="/conductorsetup/" exact component={ConductorSetup}/>
                    <Route path="/score/" exact component={Score}/>
                </div>
            </Router>
        </div>
);
};

export default App;