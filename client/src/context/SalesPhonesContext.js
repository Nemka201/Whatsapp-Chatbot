import React, { useState, createContext } from 'react';
import { SalesPhoneService } from '../services/SalesPhoneService';

// Create the SalesPhonesContext
const SalesPhonesContext = createContext();

function SalesPhoneProvider({ children }) {
  const [error, setError] = useState(null);
  return (
    <WhitePhonesContext.Provider value={{ SalesPhoneService: SalesPhoneService }}> 
      {children}
    </WhitePhonesContext.Provider>
  );
}

export { SalesPhonesContext, SalesPhoneProvider };