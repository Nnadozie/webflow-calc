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
  padding: 40px;

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

  useEffect(() => {
    const monthlyBilledMonthly = 10;
    const monthlyBilledAnnualy = 20;

    const annualyBilledAnnualy = 30;
    const annualyBilledMonthly = 40;
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
        {billAnnual * 12 * sites === Infinity ? 'Custom Pricing' : billAnnual * 12 * sites}
      </p>
      <p>
        Total Annual Cost Billed Monthly: $
        {billMonthly * 12 * sites === Infinity ? 'Custom Pricing' : billMonthly * 12 * sites}
      </p>
      ---
      <p>
        Total Monthly Cost Billed Annually: ${billAnnual * sites === Infinity ? 'Custom Pricing' : billAnnual * sites}
      </p>
      <p>
        Total Monthly Cost Billed Monthly: ${billMonthly * sites === Infinity ? 'Custom Pricing' : billMonthly * sites}
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
