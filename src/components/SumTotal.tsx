import { ChangeEventHandler, useContext, useState } from 'react';
import styled from 'styled-components';
import { Context } from '../state/store';

const Total = styled.div`
  // .choose-pricing {
  //   width: 100%;
  //   display: flex;
  //   label {
  //     margin-left: auto;
  //   }
  // }
  // display: flex;
  // flex-wrap: wrap;
  // flex-direction: row;

  // border: 1px solid;
  // padding: 40px;

  // max-width: 550px;
  // width: 550px;

  // .center {
  //   padding: 10px;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  // }
  // h2 {
  //   margin-bottom: 5px;
  // }
  // .label {
  //   width: 230px;
  // }
  // margin-left: auto;
  // position: fixed;
  // bottom: 0px;
  // right: 0px;
  // background: yellow;
`;

function SumTotal() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const { totals } = useContext(Context);
  const onSelect: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setBilling(e.target.value as 'monthly' | 'yearly');
  };

  let monthlyBilledMonthly = 0;
  let monthlyBilledAnnualy = 0;

  let annualyBilledAnnualy = 0;
  let annualyBilledMonthly = 0;

  for (const [k, v] of Object.entries(totals)) {
    monthlyBilledMonthly += v.monthlyBilledMonthly;
    monthlyBilledAnnualy += v.monthlyBilledAnnualy;

    annualyBilledAnnualy += v.annualyBilledAnnualy;
    annualyBilledMonthly += v.annualyBilledMonthly;
  }

  return (
    <Total className="plan-container">
      <div className="space-filler"></div>
      <div className="sum-total">
        <div className="sum-choose-pricing">
          <label className="sum-label-standin">
            <select className="sum-select-standin w-button" value={billing} onChange={onSelect}>
              <option selected value="yearly">
                Billed yearly
              </option>
              <option value="monthly">Billed monthly</option>
            </select>
          </label>
        </div>
        <div className="total-label">
          <p className="total-text">Sum Total</p>
          <p className="total-sub-text">Excludes all enterprise plans</p>
        </div>
        {billing === 'monthly' && (
          <>
            <div className="price">${annualyBilledMonthly}/year</div>
            <div className="price">${monthlyBilledMonthly}/month</div>
          </>
        )}
        {billing === 'yearly' && (
          <>
            <div className="price">${annualyBilledAnnualy}/year</div>
            <div className="price">${monthlyBilledAnnualy}/month</div>
          </>
        )}
      </div>
    </Total>
  );
}

export default SumTotal;
