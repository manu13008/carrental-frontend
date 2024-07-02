
import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import LoadDrivingLicense from './pages/LoadDrivingLicense';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path='/loaddrivinglicense' element={<LoadDrivingLicense/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
