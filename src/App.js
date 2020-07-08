import './App.scss';
import React, { lazy,Suspense } from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import Navbar from './components/Navbar'

const Home = lazy(()=>
  import('./components/Home')
)

function App() {      
  return (
    <div className="App">
      <Suspense fallback={<div />}>
      <Router>
        <Navbar/> 
        <Route path={'/'} component={Home}  />
      
      </Router>
      </Suspense>
    </div>
  );
}

export default App;
