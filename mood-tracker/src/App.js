import logo from './logo.svg';
import './App.css';
import {Logger} from './Logger';
import {Viewer} from './Viewer';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <div className="App container">
      <h3 className="d-flex justify-content-center m-3">Mood Tracker</h3>
      <nav className="navbar navbar-expand-sm bg-light navbar-dark">
        <ul className="navbar-nav">
          <li className="nav-item m-1">
            <NavLink className="btn btn-light btn-outline-primary" to="/logger">
              Logger
            </NavLink>
          </li>
          <li className="nav-item m-1">
            <NavLink className="btn btn-light btn-outline-primary" to="/viewer">
              Viewer
            </NavLink>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path='/logger' Component={Logger} />
        <Route path='/viewer' Component={Viewer} />
      </Routes>
    </div>
  </BrowserRouter>
  );
}

export default App;
