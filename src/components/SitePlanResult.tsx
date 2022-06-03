import React, { ReactElement, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { SForm, SPlan } from './SitePlan';

interface SitePlanResult {
  children?: ReactElement;
  plan?: SPlan;
  sites: number;
  animate?: boolean;
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

const SitePlanResult: React.FC<SitePlanResult> = ({ plan, sites }) => {
  const key = uuid();
  const billAnnual = plan?.billedAnnualyPerMonthPerSeatPrice ?? 0;
  const billMonthly = plan?.billedMonthlyPerMonthPerSeatPrice ?? 0;

  return (
    <Root key={key} animate={true}>
      <p>
        Plan Name:{' '}
        <span>
          {plan?.name} Site Plan x {sites}
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
    </Root>
  );
};

export default SitePlanResult;
