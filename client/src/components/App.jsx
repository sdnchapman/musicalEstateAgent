import React, {Fragment} from 'react';
import Login from './Login';
import {HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import "./styles.scss";
import Score from "./Score";
import ConductorSetup from "./ConductorSetup";
import Instrument from "./Instrument";
import Lobby from "./Lobby";
import SelectTeam from "./SelectTeam";
import ConductorView from './ConductorView';

const PrivateRoute = ({component: Component}) => (
  <Route render={(props) => (
    window.username !== undefined
      ? <Component {...props} />
      : <Redirect to='/'/>
  )}/>
)


const App = () => {

  return (
    <Router>
      <Fragment>
        <div>
          <Switch>
            <Route path="/" exact component={Login}/>
            <PrivateRoute path="/lobby/" exact component={Lobby}/>
            <PrivateRoute path="/teams/" exact component={SelectTeam}/>
            <PrivateRoute path="/instrument/" exact component={Instrument}/>
            <PrivateRoute path="/conductorsetup/" exact component={ConductorSetup}/>
            <PrivateRoute path="/score/" exact component={Score}/>
            <PrivateRoute path="/conductor/" exact component={ConductorView}/>
            <Redirect to='/'/>
          </Switch>
        </div>
      </Fragment>
    </Router>
  );
};


export default App;
