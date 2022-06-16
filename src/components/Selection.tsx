import { ReactElement } from 'react';
import styled from 'styled-components';

interface ISelection {
  children: ReactElement;
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

const Selection: React.FC<ISelection> = ({ children }) => {
  return <Root>{children}</Root>;
};

export default Selection;
