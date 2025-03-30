import './App.css';
import Welcome from "./pages/Welcome";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Adminlogin from "./pages/Adminlogin";
import CreateLetter from "./pages/CreateLetter";
import CreateLetterTemplate from "./pages/CreateLetterTemplate";
import DefineFormat from "./pages/DefineFormat";
import FillForm from "./pages/FillForm";
import Mainlogin from "./pages/Mainlogin";
import Mainregister from "./pages/Mainregister";
import Profile from "./pages/Profile";
import QuestionsPage from "./pages/QuestionsPage";
import SelectTemplate from "./pages/SelectTemplate";
import Stafflogin from "./pages/Stafflogin";
import Staffregister from "./pages/Staffregister";
import Studentlogin from "./pages/Studentlogin";
import Studentregister from "./pages/Studentregister";
import Welcome from "./pages/Welcome";

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Welcome/>} />
        <Route path='/admindashboard' element={<AdminDashboard/>} />
        <Route path='/adminlogin' element={<Adminlogin/>} />
        <Route path='/createletter' element={<CreateLetter/>} />
        <Route path='/createlettertemplate' element={<CreateLetterTemplate/>} />
        <Route path='/defineformat' element={<DefineFormat/>} />
        <Route path='/studentlogin' element={<Studentlogin/>} />
        <Route path='./fillform' element={<FillForm/>} />
        <Route path='/mainlogin' element={<Mainlogin/>} />
        <Route path='/mainregister' element={<Mainregister/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/questionspage' element={<QuestionsPage/>} />
        <Route path='/selecttemplate' element={<SelectTemplate/>} />
        <Route path='/stafflogin' element={<Stafflogin/>} />
        <Route path='/staffregister' element={<Staffregister/>} />
        <Route path='/studentlogin' element={<Studentlogin/>} />
        <Route path='/studentregister' element={<Studentregister/>} />
        <Route path='/welcome' element={<Welcome/>} />
      </Routes>
      </BrowserRouter>   
    </div>
  );
}

export default App;