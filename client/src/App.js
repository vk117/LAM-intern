import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Welcome from './components/Welcome';



function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Welcome}></Route>
        {/*<Route exact path="/graph" component={Graph}></Route>*/}
      </Switch>
    </Router>
  );
}

export default App;
