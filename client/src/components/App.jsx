import React from 'react';
import Login from './Login';
import {HashRouter as Router, Route} from 'react-router-dom';
import "./styles.scss";
import Score from "./Score";

const App = () => {
    return (
        <div className="app-container">
            <Router>
                <div>
                    <Route path="/" exact component={Login}/>
                    <Route path="/score/" exact component={Score}/>
                </div>
            </Router>
        </div>
);
};

export default App;