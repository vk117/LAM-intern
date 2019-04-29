import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Welcome from './components/Welcome';
import LineChart from './components/LineChart';



function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Welcome}></Route>
        <Route exact path="/graph" component={LineChart}></Route>
      </Switch>
    </Router>
  );
}

export default App;
