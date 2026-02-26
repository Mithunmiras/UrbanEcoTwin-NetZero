import { createContext, useContext, useState } from 'react';

const StateContext = createContext(null);

const STATE_INFO = {
  tamilnadu: { name: 'Tamil Nadu', short: 'TN' },
  kerala: { name: 'Kerala', short: 'KL' },
  karnataka: { name: 'Karnataka', short: 'KA' },
  andhrapradesh: { name: 'Andhra Pradesh', short: 'AP' },
};

export function StateProvider({ children }) {
  const [selectedState, setSelectedState] = useState(
    () => localStorage.getItem('selectedState') || null
  );

  const selectState = (stateId) => {
    setSelectedState(stateId);
    localStorage.setItem('selectedState', stateId);
  };

  const clearState = () => {
    setSelectedState(null);
    localStorage.removeItem('selectedState');
  };

  const stateName = selectedState ? STATE_INFO[selectedState]?.name || selectedState : null;
  const stateShort = selectedState ? STATE_INFO[selectedState]?.short || '' : '';

  return (
    <StateContext.Provider value={{ selectedState, selectState, clearState, stateName, stateShort, STATE_INFO }}>
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error('useStateContext must be used within StateProvider');
  return ctx;
}
