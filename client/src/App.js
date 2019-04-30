import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Welcome from './components/Welcome';
import LineChart from './components/LineChart';
import GrowthChart from './components/GrowthChart';



function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Welcome}></Route>
        <Route exact path="/graph" component={LineChart}></Route>
        <Route exact path="/growth" component={GrowthChart}></Route>
      </Switch>
    </Router>
  );
}

export default App;
