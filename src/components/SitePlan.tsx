import { ChangeEventHandler, ReactEventHandler, useContext, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import styled from 'styled-components';
import Selection from './Selection';
import { v4 as uuid } from 'uuid';

import SitePlanResult from './SitePlanResult';
import { Context } from '../state/store';

export interface SForm {
  customDomain: boolean;
  cmsItems: number;
  bandwidth: number;
  guestEditors: number;
  uptimeSla: boolean;
}

export interface SPlan extends SForm {
  name: 'Starter' | 'Basic' | 'CMS' | 'Business' | 'Enterprise';
  billedMonthlyPerMonthPerSeatPrice: number;
  billedAnnualyPerMonthPerSeatPrice: number;
}

const plans: SPlan[] = [
  {
    name: 'Starter',
    billedMonthlyPerMonthPerSeatPrice: 0,
    billedAnnualyPerMonthPerSeatPrice: 0,
    customDomain: false,
    cmsItems: 50,
    bandwidth: 1,
    guestEditors: 0,
    uptimeSla: false,
  },

  {
    name: 'Basic',
    billedMonthlyPerMonthPerSeatPrice: 15,
    billedAnnualyPerMonthPerSeatPrice: 12,
    customDomain: true,
    cmsItems: 0,
    bandwidth: 50,
    guestEditors: 0,
    uptimeSla: false,
  },

  {
    name: 'CMS',
    billedMonthlyPerMonthPerSeatPrice: 20,
    billedAnnualyPerMonthPerSeatPrice: 16,
    customDomain: true,
    cmsItems: 2000,
    bandwidth: 200,
    guestEditors: 3,
    uptimeSla: false,
  },

  {
    name: 'Business',
    billedMonthlyPerMonthPerSeatPrice: 45,
    billedAnnualyPerMonthPerSeatPrice: 36,
    customDomain: true,
    cmsItems: 10000,
    bandwidth: 400,
    guestEditors: 10,
    uptimeSla: false,
  },
  {
    name: 'Enterprise',
    billedMonthlyPerMonthPerSeatPrice: Infinity,
    billedAnnualyPerMonthPerSeatPrice: Infinity,
    customDomain: true,
    cmsItems: 10000,
    bandwidth: Infinity,
    guestEditors: Infinity,
    uptimeSla: true,
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
  Starter: number;
  Basic: number;
  CMS: number;
  Business: number;
  Enterprise: number;
}

function SitePlan() {
  const [plan, setPlan] = useState<SPlan>(plans[0]);
  const [countPlans, setCountPlans] = useState<IPlanState>({
    Starter: 0,
    Basic: 0,
    CMS: 0,
    Business: 0,
    Enterprise: 0,
  });
  const [addedWarning, setAddedWarning] = useState<boolean>(false);
  const [billing, setBilling] = useState<'yearly' | 'monthly'>('yearly');
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SForm>({
    defaultValues: {
      customDomain: false,
      cmsItems: 0,
      bandwidth: 1,
      guestEditors: 0,
      uptimeSla: false,
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
    if (formData.cmsItems > 10000) setValue('cmsItems', 10000);
    if (formData.cmsItems < 0) setValue('cmsItems', 0);

    if (formData.bandwidth < 0) setValue('bandwidth', 1);

    if (formData.guestEditors < 0) setValue('guestEditors', 0);

    const newPlan = findPlan(plans, formData);
    if (newPlan.name !== plan.name) {
      setPlan(newPlan);
    }
  }, [formData]);

  function findPlan(plans: SPlan[], data: { [k: string | number | symbol]: any }): SPlan {
    /**go through and check if there's anything in data greater than in plan,
     * if so, discount plan.
     * Else return plan.
     * i.e. if you go through all properties but don't find one that is greater return plan
     **/
    if (data.bandwidth > 400) data.bandwidth = Infinity;
    if (data.guestEditors > 10) data.guestEditors = Infinity;

    let resPlan = plans[0];

    for (let i = 0; i < plans.length; i++) {
      resPlan = plans[i];

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

    return resPlan;
  }

  const onSelect: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setBilling(e.target.value as 'monthly' | 'yearly');
  };

  const monthlyBilledMonthly = plans.reduce((prev, curr) => {
    return curr.name === 'Enterprise' ? prev : prev + countPlans[curr.name] * curr.billedMonthlyPerMonthPerSeatPrice;
  }, 0);
  const monthlyBilledAnnualy = plans.reduce((prev, curr) => {
    return curr.name === 'Enterprise' ? prev : prev + countPlans[curr.name] * curr.billedAnnualyPerMonthPerSeatPrice;
  }, 0);

  const annualyBilledAnnualy = plans.reduce((prev, curr) => {
    return curr.name === 'Enterprise'
      ? prev
      : prev + countPlans[curr.name] * curr.billedAnnualyPerMonthPerSeatPrice * 12;
  }, 0);
  const annualyBilledMonthly = plans.reduce((prev, curr) => {
    return curr.name === 'Enterprise'
      ? prev
      : prev + countPlans[curr.name] * curr.billedMonthlyPerMonthPerSeatPrice * 12;
  }, 0);

  const { dispatch, totals } = useContext(Context);

  useEffect(() => {
    dispatch({
      type: 'SET_TOTALS',
      value: {
        ...totals,
        site: {
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
        <form onSubmit={handleSubmit(onSubmit)} onClick={() => setAddedWarning(false)} className="form">
          <h2>Add Site Plan</h2>
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
            type="number"
            placeholder="CMS Items"
            defaultValue="2"
            {...register('cmsItems')}
            className="text-field w-input"
          />

          <label htmlFor="bandwidth">Bandwidth (GB)</label>
          <input type="number" placeholder="Bandwidth" {...register('bandwidth', {})} className="text-field w-input" />

          <label htmlFor="guestEditors">Guest Editors</label>
          <input
            type="number"
            placeholder="Guest Editors"
            {...register('guestEditors', {})}
            className="text-field w-input"
          />

          <label className="w-checkbox checkbox-field">
            <input
              type="checkbox"
              placeholder="Uptime SLA"
              {...register('uptimeSla', {})}
              className="w-checkbox-input"
            />
            Uptime SLA
          </label>

          <label></label>
          <Selection key={uuid()}>
            <h2 className="pre-add-name-text">{plan?.name} Site Plan</h2>
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
              <SitePlanResult
                plan={plans.find((val) => val.name === plan.name) as SPlan}
                billing={billing}
                countPlans={countPlans}
                setCountPlans={setCountPlans}
              ></SitePlanResult>
            ) : null;
          })}
        </SelectedPlans>
        <Total className="total">
          <div className="total-label">
            <p className="total-text">Total</p>
            <p>Excludes enterprise sites</p>
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

export default SitePlan;
