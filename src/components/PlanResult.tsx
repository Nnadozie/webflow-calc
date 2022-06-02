import { ReactElement } from 'react';

interface PlanResult {
  children?: ReactElement;
}

const PlanResult: React.FC<PlanResult> = ({ children }) => {
  return (
    <div>
      {children} <button>+</button>
      <button>-</button>
    </div>
  );
};

export default PlanResult;
