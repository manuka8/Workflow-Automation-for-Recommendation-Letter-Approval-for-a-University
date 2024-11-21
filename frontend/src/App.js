import './App.css';
import Welcome from "./components/Welcome";
import Mainlogin from "./components/Mainlogin";
import Studentlogin from "./components/Stafflogin";
import Stafflogin from "./components/Stafflogin";
import Adminlogin from "./components/Adminlogin";
import Mainregister from "./components/Mainregister";
import Studentregister from "./components/Studentregister";
import Staffregister from "./components/Staffregister";

function App() {
  return (
    <div>
      <Welcome />
      <Mainlogin />
      <Studentlogin />
      <Stafflogin />
      <Adminlogin />
      <Mainregister />
      <Studentregister />
      <Staffregister /> 
      <h1>Hanzul</h1> 
    </div>
  );
}

export default App;
