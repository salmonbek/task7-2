import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TeachersPage from "./pages/TeachersPage";
import StudentsPage from "./pages/StudentsPage";
import NotFound from "./pages/NotFound";

import AdminLayout from "./components/layout/AdminLayout";

import { IS_LOGIN } from "./constants";

function App() {
  const [isLogin, setIsLogin] = useState(
    Boolean(localStorage.getItem(IS_LOGIN))
  );
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage setIsLogin={setIsLogin} />} />
        {isLogin ? (
          <Route element={<AdminLayout setIsLogin={setIsLogin} />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="teachers" element={<TeachersPage />} />
            <Route path="students" element={<StudentsPage />} />
          </Route>
        ) : null}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
