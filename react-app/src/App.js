import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Stagiaires from './Stagiaires';
import Groupes from './Groupes';
import Signin from './Signin';
import Signup from './Signup';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/stagiaires">Home</Link>
            </li>
            <li>
              <Link to="/groupes">Groups</Link>
            </li>
            <li>
              <Link to="/signin">Signin</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stagiaires" element={<Stagiaires />} />
          <Route path="/groupes" element={<Groupes />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return <h1>Welcome to the Home page!</h1>;
}

export default App;
