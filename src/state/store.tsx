import React, { createContext, ReactFragment, useReducer } from 'react';
import reducer, { State } from './reducer';

const defaultState: State = {
  dispatch: () => {},
  totals: {
    workspace: {
      annualyBilledMonthly: 0,
      monthlyBilledMonthly: 0,
      annualyBilledAnnualy: 0,
      monthlyBilledAnnualy: 0,
    },
    site: {
      annualyBilledMonthly: 0,
      monthlyBilledMonthly: 0,
      annualyBilledAnnualy: 0,
      monthlyBilledAnnualy: 0,
    },
    ecommerce: {
      annualyBilledMonthly: 0,
      monthlyBilledMonthly: 0,
      annualyBilledAnnualy: 0,
      monthlyBilledAnnualy: 0,
    },
  },
};

export const Context = createContext(defaultState);

interface StoreProps {
  children: React.ReactNode;
}
const Store: React.FC<StoreProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return <Context.Provider value={{ ...state, dispatch: dispatch }}>{children}</Context.Provider>;
};

export default Store;
