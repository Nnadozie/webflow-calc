import styled from 'styled-components';
import { SPlan } from './SitePlan';

interface ISelection {
  plan?: SPlan;
  animate?: boolean;
}

const Root = styled.div`
  border: 1px solid #f44336b8;
  animation: animate-background linear 0.1s;

  @keyframes animate-background {
    from {
      border: 1px solid #ffffff;
    }
    to {
      border: 1px solid #f44336b8;
    }
  }
`;

const Selection: React.FC<ISelection> = ({ plan }) => {
  return (
    <Root>
      <h2>{plan?.name} Site Plan</h2>
    </Root>
  );
};

export default Selection;
