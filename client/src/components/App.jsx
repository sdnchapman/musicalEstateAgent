import React from 'react';
import Login from './Login';
import {HashRouter as Router, Route} from 'react-router-dom';
import "./styles.scss";
import Score from "./Score";
import Lobby from "./Lobby";
import SelectTeam from "./SelectTeam";


const App = () => {
    return (
        <div className="app-container">
            <Router>
                <div>
                    <Route path="/" exact component={Login}/>
                    <Route path="/score/" exact component={Score}/>
                    <Route path="/lobby/" exact component={Lobby}/>
                    <Route path="/teams/" exact component={SelectTeam}/>
                </div>
            </Router>
        </div>
);
};

export default App;