import { ChangeEventHandler, ReactEventHandler, useContext, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import styled from 'styled-components';
import Selection from './Selection';
import { v4 as uuid } from 'uuid';

import EcommercePlanResult from './EcommercePlanResult';
import { Context } from '../state/store';

export interface EForm {
  customDomain: boolean;
  cmsItems: number;
  bandwidth: number;
  guestEditors: number;
  transactionFee: number;
  annualSalesVolume: number;
}

export interface EPlan extends EForm {
  name: 'Standard' | 'Plus' | 'Advanced';
  billedMonthlyPerMonthPerSeatPrice: number;
  billedAnnualyPerMonthPerSeatPrice: number;
}

const plans: EPlan[] = [
  {
    name: 'Standard',
    billedMonthlyPerMonthPerSeatPrice: 42,
    billedAnnualyPerMonthPerSeatPrice: 29,
    customDomain: true,
    cmsItems: 2000,

    bandwidth: 200,
    guestEditors: 3,

    transactionFee: 2,
    annualSalesVolume: 50000,
  },
  {
    name: 'Plus',
    billedMonthlyPerMonthPerSeatPrice: 84,
    billedAnnualyPerMonthPerSeatPrice: 74,
    customDomain: true,
    cmsItems: 10000,

    bandwidth: 400,
    guestEditors: 10,

    transactionFee: 0,
    annualSalesVolume: 200000,
  },
  {
    name: 'Advanced',
    billedMonthlyPerMonthPerSeatPrice: 235,
    billedAnnualyPerMonthPerSeatPrice: 212,
    customDomain: true,
    cmsItems: 10000,

    bandwidth: 400,
    guestEditors: 10,

    transactionFee: 0,
    annualSalesVolume: Infinity,
  },
];

const Root = styled.div`
  // display: flex;
  // flex-wrap: wrap;
  // padding: 40px;

  // form {
  //   min-width: 550px;
  //   max-width: 550px;
  //   width: 550px;
  //   text-align: start;
  //   padding: 30px 40px 30px;
  //   border: 1px solid;
  //   button {
  //     padding: 10px;
  //   }
  //   display: flex;
  //   flex-direction: column;
  // }

  // label {
  //   display: block;
  // }

  // input,
  // select {
  //   display: block;
  //   margin-top: 3px;
  //   margin-bottom: 3px;
  //   height: 30px;
  // }

  // input[type='number'],
  // select {
  //   width: 100%;
  //   box-sizing: border-box;
  //   padding-left: 30px;
  //   padding-right: 30px;
  // }

  // button {
  //   margin-top: 10px;
  // }
`;

const SelectedPlans = styled.div`
  // display: flex;
  // flex-wrap: wrap;
  // flex-direction: column;
  // h2 {
  //   min-width: 100%;
  //   margin: 0px 40px;
  // }
  // border: 1px solid;
  // min-height: 370px;
  // padding: 40px;

  // .choose-pricing {
  //   margin-left: auto;
  //   display: flex;
  // }

  // max-width: 550px;
  // width: 550px;
`;

const Total = styled.div`
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
`;

export interface IPlanState {
  Standard: number;
  Plus: number;
  Advanced: number;
}

function EcommercePlan() {
  const [plan, setPlan] = useState<EPlan>(plans[0]);
  const [countPlans, setCountPlans] = useState<IPlanState>({
    Standard: 0,
    Plus: 0,
    Advanced: 0,
  });
  const [addedWarning, setAddedWarning] = useState<boolean>(false);
  const [billing, setBilling] = useState<'yearly' | 'monthly'>('yearly');
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EForm>({
    defaultValues: {
      customDomain: false,
      cmsItems: 0,

      bandwidth: 1,
      guestEditors: 0,

      transactionFee: 2,
      annualSalesVolume: 0,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = () => {
    if (countPlans[plan.name] <= 0) {
      setCountPlans({ ...countPlans, [plan.name]: countPlans[plan.name] + 1 });
    } else {
      setAddedWarning(true);
    }
  };

  const formData = watch();
  useEffect(() => {
    console.log('here');
    if (formData.cmsItems > 3000) setValue('cmsItems', 3000);
    if (formData.cmsItems < 0) setValue('cmsItems', 0);

    if (formData.bandwidth < 0) setValue('bandwidth', 1);

    if (formData.annualSalesVolume < 0) setValue('annualSalesVolume', 0);

    if (formData.guestEditors < 0) setValue('guestEditors', 0);

    if (formData.annualSalesVolume > 50000) setValue('transactionFee', 0);

    //if (formData.annualSalesVolume <= 50000) setValue('transactionFee', 2);

    const newPlan = findPlan(plans, formData);
    if (newPlan.name !== plan.name) {
      setPlan(newPlan);
    }
  }, [formData]);

  function findPlan(plans: EPlan[], data: { [k: string | number | symbol]: any }): EPlan {
    /**go through and check if there's anything in data greater than in plan,
     * if so, discount plan.
     * Else return plan.
     * i.e. if you go through all properties but don't find one that is greater return plan
     **/
    if (data.bandwidth > 400) data.bandwidth = Infinity;
    if (data.guestEditors > 10) data.guestEditors = Infinity;
    if (data.annualSalesVolume > 200000) data.annualSalesVolume = Infinity;

    let reEPlan = plans[0];

    for (let i = 0; i < plans.length; i++) {
      reEPlan = plans[i];

      let matches = true;
      for (const [k, v] of Object.entries(plans[i])) {
        if (k === 'name' || k === 'billedMonthlyPerMonthPerSeatPrice' || k === 'billedAnnualyPerMonthPerSeatPrice')
          continue;
        if (k === 'transactionFee') {
          matches = v <= data[k];
        } else {
          matches = v >= data[k];
        }

        if (!matches) break;
      }
      if (matches) break;
    }

    return reEPlan;
  }

  const onSelect: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setBilling(e.target.value as 'monthly' | 'yearly');
  };

  const monthlyBilledMonthly = plans.reduce((prev, curr) => {
    return prev + countPlans[curr.name] * curr.billedMonthlyPerMonthPerSeatPrice;
  }, 0);
  const monthlyBilledAnnualy = plans.reduce((prev, curr) => {
    return prev + countPlans[curr.name] * curr.billedAnnualyPerMonthPerSeatPrice;
  }, 0);

  const annualyBilledAnnualy = plans.reduce((prev, curr) => {
    return prev + countPlans[curr.name] * curr.billedAnnualyPerMonthPerSeatPrice * 12;
  }, 0);
  const annualyBilledMonthly = plans.reduce((prev, curr) => {
    return prev + countPlans[curr.name] * curr.billedMonthlyPerMonthPerSeatPrice * 12;
  }, 0);

  const { dispatch, totals } = useContext(Context);

  useEffect(() => {
    dispatch({
      type: 'SET_TOTALS',
      value: {
        ...totals,
        ecommerce: {
          annualyBilledMonthly: annualyBilledMonthly,
          monthlyBilledMonthly: monthlyBilledMonthly,
          annualyBilledAnnualy: annualyBilledAnnualy,
          monthlyBilledAnnualy: monthlyBilledAnnualy,
        },
      },
    });
  }, [annualyBilledMonthly, monthlyBilledMonthly, annualyBilledAnnualy, monthlyBilledAnnualy]);

  return (
    <Root className="plan-container">
      <div className="form-div">
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <h2>Add Ecommerce Plan</h2>
          <label className="w-checkbox checkbox-field">
            <input
              className="w-checkbox-input"
              type="checkbox"
              placeholder="Custom Domain"
              defaultValue="1"
              {...register('customDomain')}
            />
            <span className="w-form-label">Custom Domain</span>
          </label>

          <label htmlFor="cmsItems">CMS Items</label>
          <input
            className="text-field w-input"
            type="number"
            placeholder="CMS Items"
            defaultValue="2"
            {...register('cmsItems')}
          />

          <label htmlFor="bandwidth">Bandwidth (GB)</label>
          <input className="text-field w-input" type="number" placeholder="Bandwidth" {...register('bandwidth', {})} />

          <label htmlFor="guestEditors">Guest Editors</label>
          <input
            className="text-field w-input"
            type="number"
            placeholder="Guest Editors"
            {...register('guestEditors', {})}
          />

          <label htmlFor="transactionFee">Transaction Fee (%)</label>
          <select className="text-field w-select" {...register('transactionFee')}>
            <option value="0">0</option>
            <option value="2">2</option>
          </select>

          <label htmlFor="annualSalesVolume">Annual Sales Volume ($) </label>
          <input
            className="text-field w-input"
            type="number"
            placeholder="Annual Sales Volume"
            {...register('annualSalesVolume', {})}
          />

          <Selection key={uuid()}>
            <h2 className="pre-add-name-text">{plan?.name} Ecommerce Plan</h2>
          </Selection>

          <button className="submit-button w-button" type="submit">
            Add Plan
          </button>
          {addedWarning && <h3>You already added one {plan.name?.toLocaleLowerCase()} site. Increment to add more.</h3>}
        </form>
      </div>
      <div className="plan-output">
        <SelectedPlans className="selected-plans">
          <div className="choose-pricing">
            <label className="label-standin">
              <select value={billing} onChange={onSelect} className="select-standin w-button">
                <option selected value="yearly">
                  Billed yearly
                </option>
                <option value="monthly">Billed monthly</option>
              </select>
            </label>
          </div>
          {plans.map((plan) => {
            return countPlans[plan.name] > 0 ? (
              <EcommercePlanResult
                plan={plans.find((val) => val.name === plan.name) as EPlan}
                billing={billing}
                countPlans={countPlans}
                setCountPlans={setCountPlans}
              ></EcommercePlanResult>
            ) : null;
          })}
        </SelectedPlans>
        <Total className="total">
          <div className="total-label">
            <p className="total-text">Total</p>
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
        </Total>
      </div>
    </Root>
  );
}

export default EcommercePlan;
