import React, { Fragment } from 'react';
import Login from './Login';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import "./styles.scss";
import Score from "./Score";
import ConductorSetup from "./ConductorSetup";
import Instrument from "./Instrument";
import Lobby from "./Lobby";
import SelectTeam from "./SelectTeam";
import ConductorView from './ConductorView';


const App = () => {
  return (
    <Router>
      <Fragment>
        <div className="app-container _flex" class="_ms _ps _bg-background-light _text-center">
          <Route path="/" exact component={Login} />
          <Route path="/lobby/" exact component={Lobby} />
          <Route path="/teams/" exact component={SelectTeam} />
          <Route path="/instrument/" exact component={Instrument} />
          <Route path="/conductorsetup/" exact component={ConductorSetup} />
          <Route path="/score/" exact component={Score} />
          <Route path="/conductor/" exact component={ConductorView} />
        </div>
      </Fragment>
    </Router>
  );
};

export default App;
