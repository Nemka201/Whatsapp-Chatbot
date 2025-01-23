import React, { useState, useContext, useEffect } from 'react';
import { UserService } from '../../services/UserService';
import RegistrationForm from './RegistrationForm'; 

function LoginForm() {
  const [hasUsers, setHasUsers] = useState(false);
  const [userService] = useContext(UserService); 

  useEffect(() => {
    const checkForUsers = async () => {
      try {
        const userCount = await userService.userCount(); 
        setHasUsers(userCount > 0);
      } catch (error) {
        console.error('Error checking for users:', error);
      }
    };

    checkForUsers();
  }, [userService]); 

  return (
    <>
      {hasUsers ? (
        <LoginForm /> // Render LoginForm if users exist 
      ) : (
        <RegistrationForm /> // Render RegisterForm if no users exist
      )}
    </>
  );
}

export default LoginForm;