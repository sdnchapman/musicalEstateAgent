import React from 'react';
import {HashRouter as Router, Route} from 'react-router-dom';
import Login from './Login';
import Score from "./Score";
import Lobby from "./Lobby";
import SelectTeam from "./SelectTeam";
import "./styles.scss";


const App = () => {
    return (
        <div className="app-container">
            <Router>
                <div>
                    <Route path="/" exact component={Login}/>
                    <Route path="/lobby/" exact component={Lobby}/>
                    <Route path="/teams/" exact component={SelectTeam}/>
                    <Route path="/score/" exact component={Score}/>
                </div>
            </Router>
        </div>
);
};

export default App;