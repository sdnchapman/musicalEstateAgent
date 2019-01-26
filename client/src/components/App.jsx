import React from 'react';
import Login from './Login';
import { HashRouter as Router, Route } from 'react-router-dom';
import "./styles.scss";

const App = () => {
    return (
        <div className="app-container">
            <Router>
                <Route path="/" exact component={Login}/>
            </Router>
        </div>
    );
};

export default App;