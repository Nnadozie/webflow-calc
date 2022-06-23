import { Dispatch } from 'react';

export type SET_TOTALS = { type: 'SET_TOTALS'; value: totals };

export type Actions = SET_TOTALS;

type totals = {
  workspace: {
    annualyBilledMonthly: number;
    monthlyBilledMonthly: number;
    annualyBilledAnnualy: number;
    monthlyBilledAnnualy: number;
  };
  site: {
    annualyBilledMonthly: number;
    monthlyBilledMonthly: number;
    annualyBilledAnnualy: number;
    monthlyBilledAnnualy: number;
  };
  ecommerce: {
    annualyBilledMonthly: number;
    monthlyBilledMonthly: number;
    annualyBilledAnnualy: number;
    monthlyBilledAnnualy: number;
  };
};

export type State = {
  dispatch: Dispatch<Actions>;
  totals: totals;
};

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'SET_TOTALS':
      return {
        ...state,
        totals: { ...action.value },
      };
    default:
      return state;
  }
};

export default reducer;
