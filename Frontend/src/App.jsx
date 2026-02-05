import Navbar from "./component/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Assignment from "./pages/Assignment.jsx";
import Home from "./pages/Home.jsx";
import AssignmentList from "./pages/AssignmentList.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";
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
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/assignments" element={
              <ProtectedRoute>
                <AssignmentList />
              </ProtectedRoute>
            } />
            <Route path="/assignment/:id" element={
              <ProtectedRoute>
                <Assignment />
              </ProtectedRoute>
            } />
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
