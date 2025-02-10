import React, { useState, useEffect } from 'react';
import { UserService } from '../../services/UserService';
import { UserProvider } from '../../context/UserContext';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';

function Login() {
  const [hasUsers, setHasUsers] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkForUsers = async () => {
      try {
        const userCount = await UserService.userCount();
        console.log(userCount);
        setHasUsers(userCount > 0);
      } catch (error) {
        console.error('Error checking for users:', error);
        setError('Hubo un problema al verificar los usuarios.');
      }
    };

    checkForUsers();
  }, []);

  return (
    <UserProvider>  
      <div className="bg-gradient-to-t from-blue-200 via-blue-500/50 to-blue-800 opacity-75 w-full p-5 h-screen pt-32">
        {error ? (
          <div>
            <p style={{ color: 'red' }}>{error}</p>
          </div>
        ) : hasUsers ? (
          <LoginForm />
        ) : (
          <RegistrationForm />
        )}
      </div>

    </UserProvider>
  );
}

export default Login;
