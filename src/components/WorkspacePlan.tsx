import { ChangeEventHandler, useContext, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import styled from 'styled-components';
import Selection from './Selection';
import { v4 as uuid } from 'uuid';

import WorkspacePlanResult from './WorkspacePlanResult';
import { Context } from '../state/store';

interface WForm {
  seats: number;
  unhostedSites: number;
  customCode: boolean;
  codeExport: boolean;
  billingPermissions: boolean;
  publishingPermissions: boolean;
  advancedPermissions: boolean;
  advancedSecurity: boolean;
}

export interface WPlan extends WForm {
  name: 'Starter' | 'Core' | 'Growth' | 'Enterprise';
  billedMonthlyPerMonthPerSeatPrice: number;
  billedAnnualyPerMonthPerSeatPrice: number;
}

const plans: WPlan[] = [
  {
    name: 'Starter',
    billedMonthlyPerMonthPerSeatPrice: 0,
    billedAnnualyPerMonthPerSeatPrice: 0,
    seats: 1,
    unhostedSites: 2,
    customCode: false,
    codeExport: false,
    billingPermissions: false,
    publishingPermissions: false,
    advancedPermissions: false,
    advancedSecurity: false,
  },

  {
    name: 'Core',
    billedMonthlyPerMonthPerSeatPrice: 28,
    billedAnnualyPerMonthPerSeatPrice: 19,
    seats: 3,
    unhostedSites: 10,
    customCode: true,
    codeExport: true,
    billingPermissions: true,
    publishingPermissions: false,
    advancedPermissions: false,
    advancedSecurity: false,
  },

  {
    name: 'Growth',
    billedMonthlyPerMonthPerSeatPrice: 60,
    billedAnnualyPerMonthPerSeatPrice: 49,
    seats: 9,
    unhostedSites: Infinity,
    customCode: true,
    codeExport: true,
    billingPermissions: true,
    publishingPermissions: true,
    advancedPermissions: false,
    advancedSecurity: false,
  },

  {
    name: 'Enterprise',
    billedMonthlyPerMonthPerSeatPrice: Infinity,
    billedAnnualyPerMonthPerSeatPrice: Infinity,
    seats: Infinity,
    unhostedSites: Infinity,
    customCode: true,
    codeExport: true,
    billingPermissions: true,
    publishingPermissions: true,
    advancedPermissions: true,
    advancedSecurity: true,
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
  Core: number;
  Growth: number;
  Enterprise: number;
}

function WorkspacePlan() {
  const [plan, setPlan] = useState<WPlan>(plans[0]);
  const [countPlans, setCountPlans] = useState<IPlanState>({
    Starter: 0,
    Core: 0,
    Growth: 0,
    Enterprise: 0,
  });
  const [addedWarning, setAddedWarning] = useState<boolean>(false);
  const [billing, setBilling] = useState<'yearly' | 'monthly'>('yearly');
  const [seats, setSeats] = useState<number>(1);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<WForm>({
    defaultValues: {
      seats: 1,
      unhostedSites: 2,
      customCode: false,
      codeExport: false,
      billingPermissions: false,
      publishingPermissions: false,
      advancedPermissions: false,
      advancedSecurity: false,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = () => {};

  const formData = watch();
  useEffect(() => {
    if (formData.seats < 1) setValue('seats', 1);
    if (formData.unhostedSites < 2) setValue('unhostedSites', 2);
    setSeats(formData.seats);
    const newPlan = findPlan(plans, formData);
    if (newPlan.name !== plan.name) {
      setPlan(newPlan);
    }
  }, [formData]);

  function findPlan(plans: WPlan[], data: { [k: string | number | symbol]: any }): WPlan {
    /**go through and check if there's anything in data greater than in plan,
     * if so, discount plan.
     * Else return plan.
     * i.e. if you go through all properties but don't find one that is greater return plan
     **/
    if (data.bandwidth > 400) data.bandwidth = Infinity;
    if (data.guestEditors > 10) data.guestEditors = Infinity;

    let reWPlan = plans[0];

    for (let i = 0; i < plans.length; i++) {
      reWPlan = plans[i];

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

    return reWPlan;
  }

  const onSelect: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setBilling(e.target.value as 'monthly' | 'yearly');
  };

  // const monthlyBilledMonthly = plans.reduce((prev, curr) => {
  //   return curr.name === 'Enterprise'
  //     ? prev
  //     : prev + countPlans[curr.name] * curr.billedMonthlyPerMonthPerSeatPrice * seats;
  // }, 0);
  // const monthlyBilledAnnualy = plans.reduce((prev, curr) => {
  //   return curr.name === 'Enterprise'
  //     ? prev
  //     : prev + countPlans[curr.name] * curr.billedAnnualyPerMonthPerSeatPrice * seats;
  // }, 0);

  // const annualyBilledAnnualy = plans.reduce((prev, curr) => {
  //   return curr.name === 'Enterprise'
  //     ? prev
  //     : prev + countPlans[curr.name] * curr.billedAnnualyPerMonthPerSeatPrice * 12 * seats;
  // }, 0);
  // const annualyBilledMonthly = plans.reduce((prev, curr) => {
  //   return curr.name === 'Enterprise'
  //     ? prev
  //     : prev + countPlans[curr.name] * curr.billedMonthlyPerMonthPerSeatPrice * 12 * seats;
  // }, 0);

  const monthlyBilledMonthly = plan.billedMonthlyPerMonthPerSeatPrice * seats;
  const monthlyBilledAnnualy = plan.billedAnnualyPerMonthPerSeatPrice * seats;

  const annualyBilledAnnualy = plan.billedAnnualyPerMonthPerSeatPrice * 12 * seats;
  const annualyBilledMonthly = plan.billedMonthlyPerMonthPerSeatPrice * 12 * seats;

  const { dispatch, totals } = useContext(Context);

  useEffect(() => {
    dispatch({
      type: 'SET_TOTALS',
      value: {
        ...totals,
        workspace: {
          annualyBilledMonthly: annualyBilledMonthly === Infinity ? 0 : annualyBilledMonthly,
          monthlyBilledMonthly: monthlyBilledMonthly === Infinity ? 0 : monthlyBilledMonthly,
          annualyBilledAnnualy: annualyBilledAnnualy === Infinity ? 0 : annualyBilledAnnualy,
          monthlyBilledAnnualy: monthlyBilledAnnualy === Infinity ? 0 : monthlyBilledAnnualy,
        },
      },
    });
  }, [annualyBilledMonthly, monthlyBilledMonthly, annualyBilledAnnualy, monthlyBilledAnnualy]);

  return (
    <>
      <Root className="plan-container">
        <div className="form-div">
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <h2>Add Workspace Plan</h2>
            <label>Seats</label>
            <input type="number" placeholder="Seats" defaultValue="1" {...register('seats')} className="text-field" />

            <label>Unhosted Sites</label>
            <input
              type="number"
              placeholder="Unhosted Sites"
              defaultValue="2"
              {...register('unhostedSites')}
              className="text-field"
            />

            <label>Custom Code</label>
            <input
              type="checkbox"
              placeholder="Custom Code"
              {...register('customCode', {})}
              className="checkbox-field"
            />

            <label>Code Export</label>
            <input
              type="checkbox"
              placeholder="Code Export"
              {...register('codeExport', {})}
              className="checkbox-field"
            />

            <label>Billing Permissions</label>
            <input
              type="checkbox"
              placeholder="Billing Permissions"
              {...register('billingPermissions', {})}
              className="checkbox-field"
            />

            <label>Publishing Permissions</label>
            <input
              type="checkbox"
              placeholder="Publishing Permissions"
              {...register('publishingPermissions', {})}
              className="checkbox-field"
            />

            <label>Advanced Permissions</label>
            <input
              type="checkbox"
              placeholder="Advanced Permissions"
              {...register('advancedPermissions', {})}
              className="checkbox-field"
            />

            <label>Advanced Security</label>
            <input
              type="checkbox"
              placeholder="Advanced Security"
              {...register('advancedSecurity', {})}
              className="checkbox-field"
            />

            {/* <Selection key={uuid()}>
            <h2>{plan?.name} Workspace Plan</h2>
          </Selection> */}
            {/* <button type="submit">Add Plan</button>
          {addedWarning && <h3>You already added one {plan.name?.toLocaleLowerCase()} site. Increment to add more.</h3>} */}
          </form>
        </div>
        <div className="plan-output">
          <SelectedPlans className="selected-plans">
            <div className="choose-pricing">
              <label className="label-standin">
                <select value={billing} onChange={onSelect} className="select-standin">
                  <option selected value="yearly">
                    Billed yearly
                  </option>
                  <option value="monthly">Billed monthly</option>
                </select>
              </label>
            </div>
            {/* {plans.map((plan) => {
              return countPlans[plan.name] > 0 ? (
                <WorkspacePlanResult
                  plan={plans.find((val) => val.name === plan.name) as WPlan}
                  billing={billing}
                  countPlans={countPlans}
                  setCountPlans={setCountPlans}
                ></WorkspacePlanResult>
              ) : null;
            })} */}
            {<WorkspacePlanResult plan={plan} billing={billing} seats={seats}></WorkspacePlanResult>}
          </SelectedPlans>
          <Total className="total">
            <div className="total-label">
              <h2 className="total-text">Total</h2>
            </div>
            {plan.name === 'Enterprise' ? (
              <div className="price">Custom Pricing</div>
            ) : (
              <>
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
              </>
            )}
          </Total>
        </div>
      </Root>
    </>
  );
}

export default WorkspacePlan;
