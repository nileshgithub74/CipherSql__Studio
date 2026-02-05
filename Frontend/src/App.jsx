import Navbar from "./component/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Assignment from "./pages/Assignment.jsx";
import Home from "./pages/Home.jsx";
import AssignmentList from "./pages/AssignmentList.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './styles/App.css';

const App = () => {
  const location = useLocation();
  const isAssignmentPage = location.pathname.startsWith('/assignment/');

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="app">
          {!isAssignmentPage && <Navbar />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/assignments" element={<AssignmentList />} />
            <Route path="/assignment/:id" element={<Assignment />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
