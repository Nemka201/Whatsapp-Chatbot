import React, { useState, createContext } from 'react';
import { MenuItemService } from '../services/MenuItemService';

// Create the MenuItemServiceContext
const MenuItemServiceContext = createContext();

function MenuItemServiceProvider({ children }) {
  const [error, setError] = useState(null);
  return (
    <WhitePhonesContext.Provider value={{ MenuItemService: MenuItemService }}> 
      {children}
    </WhitePhonesContext.Provider>
  );
}

export { MenuItemServiceContext, MenuItemServiceProvider };