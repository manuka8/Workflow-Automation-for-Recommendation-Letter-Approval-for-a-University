import './App.css';
import Welcome from "./pages/Welcome";
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
      <Welcome />
      <Mainlogin />
      <Studentlogin />
      <Stafflogin />
      <Adminlogin />
      <Mainregister />
      <Studentregister />
      <Staffregister /> 
       <p></p>
    </div>
  );
}

export default App;
