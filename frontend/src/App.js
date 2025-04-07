import './App.css';
import Welcome from "./pages/Welcome";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import MainLogin from "./pages/Mainlogin";
import Studentlogin from "./pages/Studentlogin";
import Stafflogin from './pages/Stafflogin';
import Adminlogin from "./pages/Adminlogin";
import Mainregister from "./pages/Mainregister";
import Studentregister from "./pages/Studentregister";
import AdminDashboard from './pages/AdminDashboard';
import DefineFormat from './pages/DefineFormat'
import CreateLetterTemplate from './pages/CreateLetterTemplate';
import StudentDashboard from './pages/StudentDashboard';
import SelectTemplate from './pages/SelectTemplate';
import FillForm from './pages/FillForm';
import StaffDashboard from './pages/StaffDashboard'
import PendingApprovals from './pages/PendingApprovals';
import ApproveSubmission from './pages/QuestionsPage'
import ResubmitNote from './pages/ResubmitNote';
import RejectNote from './pages/RejectNote';
import PendingResubmission from './pages/PendingResubmission';
import EditResubmission from './pages/EditResubmission';
import ProtectedRoute from './components/ProtectedRoute';
import RealtimeTracking from './pages/RealtimeTracking';
import ViewDetails from './pages/ViewDetails';
import Requests from './pages/Requests';
import ViewRequest from './pages/ViewRequest';
import StaffHistory from './pages/StaffHistory';
import ViewHistory from './pages/ViewHistory';
import SelectEditTemplate from './pages/SelectEditTemplate';
import EditTemplate from './pages/EditTemplate';
import SuccessSubmission from './pages/SuccessSubmission';
import PrintTemplate from './pages/PrintTemplate';
import NonAcademicStaffRegister from './pages/NonAcademicStaffRegister';
import NonAcademicStaffLogin from './pages/NonAcademicStaffLogin';
import SelectManageUser from './pages/SelectManageUser';
import EditUser from './pages/EditUser';
import SuccessResubmission from './pages/SuccessResubmission';
import UserProfile from './pages/UserProfile';
import ChangePassword from './pages/ChangePassword';
import ReviewUser from './pages/ReviewUser';
import VerifySubmission from './pages/VerifySubmission';
import StudentBulkRegistration from './pages/StudentBulkRegistration';
import StaffBulkRegistration from './pages/StaffBulkRegistration';
import SelectEditUser from './pages/SelectEditUser';
import UserRegistration from './pages/UserRegistration';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Welcome/>} />
        <Route path='/studentlogin' element={<Studentlogin/>} />
        <Route path='/mainlogin' element={<MainLogin/>} />
        <Route path='/stafflogin' element={<Stafflogin/>} />
        <Route path='/adminlogin' element={<Adminlogin/>} />
        <Route path='/mainregister' element={<Mainregister/>} />
        <Route path='/studentregister' element={<Studentregister/>} />
        <Route path='/studentbulkregister' element={<StudentBulkRegistration/>} />
        <Route path='/staffregister' element={<StaffBulkRegistration/>} />
        <Route path='/nstaffregister' element={<NonAcademicStaffRegister/>} />
        <Route path='/studentlogin' element={<Studentlogin/>} />
        <Route path='/nstafflogin' element={<NonAcademicStaffLogin/>} />
        <Route path='/admindashboard' element={<AdminDashboard/>} />
        <Route path='/create-letter-template' element={<CreateLetterTemplate/>}/>
        <Route path='/define-format/:templateId' element={<DefineFormat/>} />
        <Route path='/adminlogin' element={<Adminlogin/>} />
        <Route path='/studentdashboard' element={<ProtectedRoute><StudentDashboard/></ProtectedRoute>}/>
        <Route path='/staffdashboard' element={<ProtectedRoute><StaffDashboard/></ProtectedRoute>}/>
        <Route path='/selectemplate' element={<ProtectedRoute><SelectTemplate/></ProtectedRoute>}/>
        <Route path='/pendingapprovals' element={<ProtectedRoute><PendingApprovals/></ProtectedRoute>}/>
        <Route path='/fillform' element={<ProtectedRoute><FillForm/></ProtectedRoute>}/>  
        <Route path='/approve-submission' element={<ProtectedRoute><ApproveSubmission/></ProtectedRoute>}/> 
        <Route path='/resubmit-note' element={<ProtectedRoute><ResubmitNote/></ProtectedRoute>}/>  
        <Route path='/reject-note' element={<ProtectedRoute><RejectNote/></ProtectedRoute>}/>
        <Route path="/pendingresubmissions" element={<ProtectedRoute><PendingResubmission /></ProtectedRoute>} />
        <Route path='/edit-resubmission/:resubmissionId' element={<ProtectedRoute><EditResubmission/></ProtectedRoute>}/>
        <Route path='/realtimetracking' element={<ProtectedRoute><RealtimeTracking/></ProtectedRoute>}/>
        <Route path='/viewdetails/:submittedId' element={<ProtectedRoute><ViewDetails/></ProtectedRoute>}/>
        <Route path='/requests' element={<ProtectedRoute><Requests/></ProtectedRoute>}/>
        <Route path='/ViewRequest/:id' element={<ProtectedRoute><ViewRequest/></ProtectedRoute>}/>
        <Route path='/viewhistory' element={<ProtectedRoute><StaffHistory/></ProtectedRoute>}/>
        <Route path='/submission/:id' element={<ProtectedRoute><ViewHistory/></ProtectedRoute>}/>
        <Route path='/successsubmission' element={<ProtectedRoute><SuccessSubmission/></ProtectedRoute>}/>
        <Route path='/selectemplate-admin' element={<SelectEditTemplate/>}/>
        <Route path='/editform/:templateId' element={<EditTemplate/>}/>
        <Route path='/printetemplate' element={<PrintTemplate/>}/>
        <Route path='/selectuser' element={<SelectManageUser/>}/>
        <Route path='/edituser/:userId' element={<EditUser/>}/>
        <Route path='/successresubmission' element={<ProtectedRoute><SuccessResubmission/></ProtectedRoute>}/>
        <Route path='/profile' element={<ProtectedRoute><UserProfile/></ProtectedRoute>}/>
        <Route path='/changepasssword' element={<ProtectedRoute><ChangePassword/></ProtectedRoute>}/>
        <Route path='/review-user/:userId' element={<ProtectedRoute><ReviewUser/></ProtectedRoute>}/>
        <Route path='/verify/:submissionId' element={<VerifySubmission/>}/>
        <Route path='/edit-user' element={<SelectEditUser/>}/>
        <Route path='/user-register' element={<UserRegistration/>}/>
      </Routes>
      </BrowserRouter> 
    </div>
  );
}
export default App;
