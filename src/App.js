 import React, { Component } from 'react';
 import {BrowserRouter, Router, HashRouter, Switch, Route, Navigate} from 'react-router-dom';
 import Todo from './pages/Todos';

 class App extends Component {
   render(){
     return(
       <HashRouter>
       <Switch>
       <Route exact path="/" component={Todo} />
       </Switch>

     </HashRouter>
     )
   }
 }

 export default App;
