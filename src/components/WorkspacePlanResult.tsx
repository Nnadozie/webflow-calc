// import { ReactElement } from 'react';
// import styled from 'styled-components';
// import { v4 as uuid } from 'uuid';
// import { WPlan } from './WorkspacePlan';

// interface WorkspacePlanResult {
//   children?: ReactElement;
//   plan?: WPlan;
//   seats: number;
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

// const WorkspacePlanResult: React.FC<WorkspacePlanResult> = ({ plan, seats }) => {
//   const key = uuid();
//   const billAnnual = plan?.billedAnnualyPerMonthPerSeatPrice ?? 0;
//   const billMonthly = plan?.billedMonthlyPerMonthPerSeatPrice ?? 0;
//   return (
//     <Root key={key}>
//       <p>
//         Plan Name: <span>{plan?.name} Workspace Plan</span>
//       </p>
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

// export default WorkspacePlanResult;

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { IPlanState, WPlan } from './WorkspacePlan';

interface WorkspacePlanResult {
  plan: WPlan;
  billing: 'yearly' | 'monthly';
  seats: number;
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

const WorkspacePlanResult: React.FC<WorkspacePlanResult> = ({ plan, billing, seats }) => {
  const billAnnual = plan?.billedAnnualyPerMonthPerSeatPrice ?? 0;
  const billMonthly = plan?.billedMonthlyPerMonthPerSeatPrice ?? 0;

  const monthlyBilledMonthly = billMonthly * seats;
  const monthlyBilledAnnualy = billAnnual * seats;

  const annualyBilledAnnualy = billAnnual * 12 * seats;
  const annualyBilledMonthly = billMonthly * 12 * seats;

  return (
    <Root className="plan-card">
      <div className="plan-quantity">
        <h3 className="plan-name">{plan?.name} Workspace</h3>
        <p>
          {seats} seat{seats === 1 ? '' : 's'}
        </p>
        {plan.name === 'Starter' && <sub className="plan-warning">Subject to free workspace limits</sub>}
        {/* <div>
          <button onClick={() => setCountPlans({ ...countPlans, [plan.name]: countPlans[plan.name] - 1 })}>
            {countPlans[plan.name] === 1 ? 'Remove' : 'Decrement'}
          </button>
          <button onClick={() => setCountPlans({ ...countPlans, [plan.name]: countPlans[plan.name] + 1 })}>
            Increment
          </button>
        </div> */}
      </div>
      {plan?.name === 'Enterprise' ? (
        <div className="price">Custom pricing</div>
      ) : plan?.name === 'Starter' ? (
        <>
          <div className="price">Free</div>
        </>
      ) : (
        <>
          <div className="price">
            {billing === 'yearly' && <p>${annualyBilledAnnualy}/year</p>}
            {billing === 'monthly' && <p>${annualyBilledMonthly}/year</p>}
          </div>
          <div className="price">
            {billing === 'yearly' && <p>${monthlyBilledAnnualy}/month</p>}
            {billing === 'monthly' && <p>${monthlyBilledMonthly}/month</p>}
          </div>
        </>
      )}
    </Root>
  );
};

export default WorkspacePlanResult;
