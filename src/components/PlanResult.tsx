import { ReactElement } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { Plan } from './WorkspacePlan';

interface PlanResult {
  children?: ReactElement;
  plan?: Plan;
  seats: number;
}

const Root = styled.div`
  padding: 40px;

  span {
    border: 1px solid #f44336b8;
    animation: animate-background linear 0.1s;

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

const PlanResult: React.FC<PlanResult> = ({ plan, seats }) => {
  const key = uuid();
  const billAnnual = plan?.billedAnnualyPerMonthPerSeatPrice ?? 0;
  const billMonthly = plan?.billedMonthlyPerMonthPerSeatPrice ?? 0;
  return (
    <Root key={key}>
      <p>
        Plan Name: <span>{plan?.name} Workspace Plan</span>
      </p>
      ---
      <p>
        Total Annual Cost Billed Annually: $
        {billAnnual * 12 * seats === Infinity ? 'Custom Pricing' : billAnnual * 12 * seats}
      </p>
      <p>
        Total Annual Cost Billed Monthly: $
        {billMonthly * 12 * seats === Infinity ? 'Custom Pricing' : billMonthly * 12 * seats}
      </p>
      ---
      <p>
        Total Monthly Cost Billed Annually: ${billAnnual * seats === Infinity ? 'Custom Pricing' : billAnnual * seats}
      </p>
      <p>
        Total Monthly Cost Billed Monthly: ${billMonthly * seats === Infinity ? 'Custom Pricing' : billMonthly * seats}
      </p>
    </Root>
  );
};

export default PlanResult;
