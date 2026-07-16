import React, { useState, useEffect } from 'react'; // Added useEffect here!
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import './index.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [loggedInUser, setLoggedInUser] = useState('Customer');

  // Dynamically changes the browser tab title instantly!
  useEffect(() => {
    document.title = "DermaCare Store | Clinical Skincare";
  }, []);

  const handleLoginSuccess = (role, username) => {
    setLoggedInUser(username || 'ThanushriAdi');
    if (role === 'ADMIN') {
      setCurrentScreen('adminDashboard');
    } else {
      setCurrentScreen('customerDashboard');
    }
  };

  return (
    <>
      {currentScreen === 'login' && (
        <Login 
          onLoginSuccess={(role, username) => handleLoginSuccess(role, username)}
          onNavigateToRegister={() => setCurrentScreen('register')}
        />
      )}

      {currentScreen === 'register' && (
        <Register 
          onNavigateToLogin={() => setCurrentScreen('login')}
        />
      )}
      
      {currentScreen === 'adminDashboard' && (
        <AdminDashboard onLogout={() => setCurrentScreen('login')} />
      )}
      
      {currentScreen === 'customerDashboard' && (
        <CustomerDashboard 
          username={loggedInUser}
          onLogout={() => setCurrentScreen('login')} 
        />
      )}
    </>
  );
}

export default App;