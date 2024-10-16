import { BrowserRouter, Route, Routes,Navigate } from "react-router-dom";
import LoginPage from "../pages/Login";
import SignUpPage from "../pages/Signup";
import ForgotPage from "../pages/ForGotpass";
import HomePage from "../pages/MainPage";
import NewCase from "../pages/Newcase";
import AdminPage from "../pages/AdminPage";
import CreateUserPage from "../pages/CreateUser";
import AdminRoute from "../components/AdminRoute";
import CasePage from "../pages/CasePage";
import AdmitPage from "../pages/AdmitPage";


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgotpassword" element={<ForgotPage />} />
        <Route path="/MainPage" element={<HomePage />} />
        <Route path="/MainPage/Newcase" element={<NewCase />} />
        <Route path="/cases/:id" element={<CasePage />} />
        <Route path="/admit" element={<AdmitPage />} />
        {/* Protect the admin routes */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } 
        />
        <Route 
          path="/CreateUser" 
          element={
            <AdminRoute>
              <CreateUserPage />
            </AdminRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
