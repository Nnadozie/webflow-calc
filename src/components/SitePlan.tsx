import { ChangeEventHandler, ReactEventHandler, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import styled from 'styled-components';
import Selection from './Selection';
import { v4 as uuid } from 'uuid';

import SitePlanResult from './SitePlanResult';

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
  display: flex;
  flex-wrap: wrap;
  padding: 40px;
  height: 540px;

  form {
    min-width: 550px;
    max-width: 550px;
    width: 550px;
    text-align: start;
    padding: 30px 40px 30px;
    border: 1px solid;
    button {
      padding: 10px;
    }
    display: flex;
    flex-direction: column;
  }

  label {
    display: block;
  }

  input,
  select {
    display: block;
    margin-top: 3px;
    margin-bottom: 3px;
    height: 30px;
  }

  input[type='number'],
  select {
    width: 100%;
    box-sizing: border-box;
    padding-left: 30px;
    padding-right: 30px;
  }

  button {
    margin-top: 10px;
  }
`;

const SelectedPlans = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  h2 {
    min-width: 100%;
    margin: 0px 40px;
  }
  border: 1px solid;
  min-height: 370px;
  padding: 40px;

  .choose-pricing {
    margin-left: auto;
    display: flex;
  }

  max-width: 550px;
  width: 550px;
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

  return (
    <>
      <Root>
        <form onSubmit={handleSubmit(onSubmit)} onClick={() => setAddedWarning(false)}>
          <h2>Add Site Plan</h2>
          <label>
            Custom Domain
            <input type="checkbox" placeholder="Custom Domain" defaultValue="1" {...register('customDomain')} />
          </label>

          <label>
            CMS Items
            <input type="number" placeholder="CMS Items" defaultValue="2" {...register('cmsItems')} />
          </label>

          <label>
            Bandwidth (GB)
            <input type="number" placeholder="Bandwidth" {...register('bandwidth', {})} />
          </label>
          <label>
            Guest Editors
            <input type="number" placeholder="Guest Editors" {...register('guestEditors', {})} />
          </label>
          <label>
            Uptime SLA
            <input type="checkbox" placeholder="Uptime SLA" {...register('uptimeSla', {})} />
          </label>
          <label></label>
          <Selection key={uuid()} plan={plan}></Selection>

          <button type="submit">Add Plan</button>
          {addedWarning && <h3>You already added one {plan.name?.toLocaleLowerCase()} site. Increment to add more.</h3>}
        </form>

        <div>
          <SelectedPlans>
            <div className="choose-pricing">
              <label>
                <select value={billing} onChange={onSelect}>
                  <option selected value="yearly">
                    Billed yearly
                  </option>
                  <option value="monthly">Billed monthly</option>
                </select>
              </label>
            </div>
            {['Starter', 'Basic', 'CMS', 'Business', 'Enterprise'].map((key) => {
              return countPlans[key as 'Starter' | 'Basic' | 'CMS' | 'Business' | 'Enterprise'] > 0 ? (
                <SitePlanResult
                  plan={plans.find((val) => val.name === key) as SPlan}
                  billing={billing}
                  countPlans={countPlans}
                  setCountPlans={setCountPlans}
                ></SitePlanResult>
              ) : null;
            })}
          </SelectedPlans>
          <p>Sum Total Annual Cost</p>
          <p>Billed Annualy:{}</p>
          <p>Billed Montlhy:</p>

          <br></br>

          <p>Sum Total Monthly Cost</p>
          <p>Billed Annualy:</p>
          <p>Billed Montlhy:</p>
        </div>
      </Root>
    </>
  );
}

export default SitePlan;
