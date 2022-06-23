import React, { useEffect } from 'react';
import styled from 'styled-components';
import { IPlanState, SPlan } from './SitePlan';

interface SitePlanResult {
  plan: SPlan;
  billing?: 'yearly' | 'monthly';
  countPlans: IPlanState;
  setCountPlans: React.Dispatch<React.SetStateAction<IPlanState>>;
}
interface RootProps {
  animate?: boolean;
}
const Root = styled.div<RootProps>`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #000000;
  h3 {
    margin-bottom: 5px;
  }
  display: flex;
  flex-direction: row;

  .price {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .plan-name {
    max-width: 230px;
    width: 230px;
  }

  button {
    margin-right: 10px;
    width: 85px;
  }
`;

const SitePlanResult: React.FC<SitePlanResult> = ({ plan, billing, countPlans, setCountPlans }) => {
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
    <Root>
      <div className="plan-name">
        <h3>
          {plan?.name} Site {`x ${sites}`}
        </h3>
        {plan.name === 'Starter' && <sub>Subject to workspace limits</sub>}
        <div>
          <button onClick={() => setCountPlans({ ...countPlans, [plan.name]: countPlans[plan.name] - 1 })}>
            {countPlans[plan.name] === 1 ? 'Remove' : 'Decrement'}
          </button>
          <button onClick={() => setCountPlans({ ...countPlans, [plan.name]: countPlans[plan.name] + 1 })}>
            Increment
          </button>
        </div>
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

export default SitePlanResult;
