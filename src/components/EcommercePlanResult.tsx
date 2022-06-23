// import { ReactElement } from 'react';
// import styled from 'styled-components';
// import { v4 as uuid } from 'uuid';
// import { EForm, EPlan } from './EcommercePlan';

// interface EcommercePlanResult {
//   children?: ReactElement;
//   plan?: EPlan;
//   seats: number;
//   data: EForm;
// }

// const Root = styled.div`
//   padding: 40px;

//   span {
//     border: 1px solid #f44336b8;
//     animation: animate-background linear 0.1s;

//     @keyframes animate-background {
//       from {
//         border: #ffffff;
//       }
//       to {
//         border: #f44336b8;
//       }
//     }
//   }
// `;

// const EcommercePlanResult: React.FC<EcommercePlanResult> = ({ plan, seats, data }) => {
//   const key = uuid();
//   const billAnnual = plan?.billedAnnualyPerMonthPerSeatPrice ?? 0;
//   const billMonthly = plan?.billedMonthlyPerMonthPerSeatPrice ?? 0;
//   return (
//     <Root key={key}>
//       <p>
//         Plan Name: <span>{plan?.name} Site Plan</span>
//       </p>
//       {data.annualSalesVolume > 0 && data.transactionFee > 0 && (
//         <p>Transaction Fee Cut: ${data.annualSalesVolume * (data.transactionFee * 0.01)}</p>
//       )}
//       ---
//       <p>
//         Total Annual Cost Billed Annually: $
//         {billAnnual * 12 * seats === Infinity ? 'Custom Pricing' : billAnnual * 12 * seats}
//       </p>
//       <p>
//         Total Annual Cost Billed Monthly: $
//         {billMonthly * 12 * seats === Infinity ? 'Custom Pricing' : billMonthly * 12 * seats}
//       </p>
//       ---
//       <p>
//         Total Monthly Cost Billed Annually: ${billAnnual * seats === Infinity ? 'Custom Pricing' : billAnnual * seats}
//       </p>
//       <p>
//         Total Monthly Cost Billed Monthly: ${billMonthly * seats === Infinity ? 'Custom Pricing' : billMonthly * seats}
//       </p>
//     </Root>
//   );
// };

// export default EcommercePlanResult;

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { EPlan, IPlanState } from './EcommercePlan';

interface EcommercePlanResult {
  plan: EPlan;
  billing?: 'yearly' | 'monthly';
  countPlans: IPlanState;
  setCountPlans: React.Dispatch<React.SetStateAction<IPlanState>>;
}
interface RootProps {
  animate?: boolean;
}
const Root = styled.div<RootProps>`
  // margin-bottom: 10px;
  // padding: 10px;
  // border: 1px solid #000000;
  // h3 {
  //   margin-bottom: 5px;
  // }
  // display: flex;
  // flex-direction: row;

  // .price {
  //   padding: 10px;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  // }

  // .plan-name {
  //   max-width: 230px;
  //   width: 230px;
  // }

  // button {
  //   margin-right: 10px;
  //   width: 85px;
  // }
`;

const EcommercePlanResult: React.FC<EcommercePlanResult> = ({ plan, billing, countPlans, setCountPlans }) => {
  const billAnnual = plan?.billedAnnualyPerMonthPerSeatPrice ?? 0;
  const billMonthly = plan?.billedMonthlyPerMonthPerSeatPrice ?? 0;
  useEffect(() => {
    setCountPlans({ ...countPlans, [plan.name]: 1 });
  }, []);
  const sites = countPlans[plan.name];
  const monthlyBilledMonthly = billMonthly * sites;
  const monthlyBilledAnnualy = billAnnual * sites;

  const annualyBilledAnnualy = billAnnual * 12 * sites;
  const annualyBilledMonthly = billMonthly * 12 * sites;

  return (
    <Root className="plan-card">
      <div className="plan-quantity">
        <h3 className="plan-name">
          {plan?.name} Ecommerce Site {`x ${sites}`}
        </h3>
        <div className="plan-quantity-button">
          <button
            className="Decrement w-button"
            onClick={() => setCountPlans({ ...countPlans, [plan.name]: countPlans[plan.name] - 1 })}
          >
            {countPlans[plan.name] === 1 ? 'Remove' : 'Decrement'}
          </button>
          <button
            className="Increment w-button"
            onClick={() => setCountPlans({ ...countPlans, [plan.name]: countPlans[plan.name] + 1 })}
          >
            Increment
          </button>
        </div>
      </div>
      <div className="price">
        {billing === 'yearly' && <p>${annualyBilledAnnualy}/year</p>}
        {billing === 'monthly' && <p>${annualyBilledMonthly}/year</p>}
      </div>
      <div className="price">
        {billing === 'yearly' && <p>${monthlyBilledAnnualy}/month</p>}
        {billing === 'monthly' && <p>${monthlyBilledMonthly}/month</p>}
      </div>
    </Root>
  );
};

export default EcommercePlanResult;
