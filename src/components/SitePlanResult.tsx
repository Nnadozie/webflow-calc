import React, { ReactElement, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { SForm, SPlan } from './SitePlan';

interface SitePlanResult {
  children?: ReactElement;
  plan?: SPlan;
  animate?: boolean;
  controls?: boolean;
  showCount?: boolean;
  onSiteChange?: (a: number, b: number, c: number, d: number) => void;
}
interface RootProps {
  animate?: boolean;
}
const Root = styled.div<RootProps>`
  span {
    border: 1px solid #f44336b8;
    animation: animate-background linear ${({ animate }) => (animate ? 0.1 : 0)}s;

    @keyframes animate-background {
      from {
        border: #ffffff;
      }
      to {
        border: #f44336b8;
      }
    }
  }
`;

const SitePlanResult: React.FC<SitePlanResult> = ({ plan, animate, controls, showCount = true, onSiteChange }) => {
  const key = uuid();
  const billAnnual = plan?.billedAnnualyPerMonthPerSeatPrice ?? 0;
  const billMonthly = plan?.billedMonthlyPerMonthPerSeatPrice ?? 0;
  const [sites, setSites] = useState<number>(1);

  const monthlyBilledMonthly = billMonthly * sites;
  const monthlyBilledAnnualy = billAnnual * sites;

  const annualyBilledAnnualy = billAnnual * 12 * sites;
  const annualyBilledMonthly = billMonthly * 12 * sites;

  useEffect(() => {
    onSiteChange &&
      onSiteChange(monthlyBilledAnnualy, monthlyBilledMonthly, annualyBilledAnnualy, annualyBilledMonthly);
  }, [sites]);

  return (
    <Root key={key} animate={animate}>
      <p>
        Plan Name:{' '}
        <span>
          {plan?.name} Site Plan {showCount ? `x ${sites}` : ''}
        </span>
      </p>
      ---
      <p>
        Total Annual Cost Billed Annually: $
        {annualyBilledAnnualy === Infinity ? 'Custom Pricing' : annualyBilledAnnualy}
      </p>
      <p>
        Total Annual Cost Billed Monthly: ${annualyBilledMonthly === Infinity ? 'Custom Pricing' : annualyBilledMonthly}
      </p>
      ---
      <p>
        Total Monthly Cost Billed Annually: $
        {monthlyBilledAnnualy === Infinity ? 'Custom Pricing' : monthlyBilledAnnualy}
      </p>
      <p>
        Total Monthly Cost Billed Monthly: $
        {monthlyBilledMonthly === Infinity ? 'Custom Pricing' : monthlyBilledMonthly}
      </p>
      {controls && (
        <>
          <button onClick={() => setSites(sites + 1)}>Increment</button>
          <button onClick={() => (sites >= 1 ? setSites(sites - 1) : null)}>decrement</button>
        </>
      )}
    </Root>
  );
};

export default SitePlanResult;
