import React, { useState, useEffect, createContext } from 'react';
import { UserService } from '../services/UserService';

// Create the UserContext
const UserContext = createContext();

function UserProvider({ children }) {
  const [hasUsers, setHasUsers] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkForUsers = async () => {
      try {
        const userCount = await UserService.userCount(); 
        setHasUsers(userCount > 0);
      } catch (error) {
        console.error('Error checking for users:', error);
        setError('Hubo un problema al verificar los usuarios.');
      }
    };

    checkForUsers();
  }, []);

  return (
    <UserContext.Provider value={{ hasUsers, userService: UserService }}> 
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };