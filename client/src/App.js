import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Signin from './components/signin';
import Signup from './components/signup';
import { Layout } from './components/layout.js';
import './stylesheets/main_screen.sass';
import './stylesheets/index.sass';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<Signin />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/user/*" element={<Layout />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
