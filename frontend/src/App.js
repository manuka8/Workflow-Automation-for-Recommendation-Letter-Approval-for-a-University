import './App.css';
import Welcome from "./pages/Welcome";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Mainlogin from "./pages/Mainlogin";
import Studentlogin from "./pages/Stafflogin";
import Stafflogin from "./pages/Stafflogin";
import Adminlogin from "./pages/Adminlogin";
import Mainregister from "./pages/Mainregister";
import Studentregister from "./pages/Studentregister";
import Staffregister from "./pages/Staffregister";

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Welcome/>} />
        <Route path='/studentlogin' element={<Studentlogin/>} />
        <Route path='/mainlogin' element={<Mainlogin/>} />
        <Route path='/stafflogin' element={<Stafflogin/>} />
        <Route path='/adminlogin' element={<Adminlogin/>} />
        <Route path='/mainregister' element={<Mainregister/>} />
        <Route path='/studentregister' element={<Studentregister/>} />
        <Route path='/staffregister' element={<Staffregister/>} />
      </Routes>
      </BrowserRouter>   
    </div>
  );
}

export default App;
