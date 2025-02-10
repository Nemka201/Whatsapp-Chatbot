import React, { useState, createContext } from 'react';
import { WhitePhoneService } from '../services/WhitePhoneService';

// Create the WhitePhonesContext
const WhitePhonesContext = createContext();

function WhitePhoneProvider({ children }) {
  const [error, setError] = useState(null);
  return (
    <WhitePhonesContext.Provider value={{ whitePhoneService: WhitePhoneService }}> 
      {children}
    </WhitePhonesContext.Provider>
  );
}

export { WhitePhonesContext, WhitePhoneProvider };