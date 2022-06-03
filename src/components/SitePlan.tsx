import { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import styled from 'styled-components';

import SitePlanResult from './SitePlanResult';

export interface SForm {
  customDomain: boolean;
  cmsItems: number;
  bandwidth: number;
  guestEditors: number;
  uptimeSla: boolean;
}

export interface SPlan extends SForm {
  name?: string;
  billedMonthlyPerMonthPerSeatPrice?: number;
  billedAnnualyPerMonthPerSeatPrice?: number;
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

  form {
    width: 300px;
    text-align: start;
    padding: 30px 40px 30px;
    border: 1px solid;
    border-radius: 10px;

    button {
      padding: 10px;
    }
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
    max-width: 300px;
    width: 250px;
    padding-left: 30px;
    display: ;
  }
`;

const SelectedPlans = styled.div`
  display: flex;
  flex-wrap: wrap;
  h2 {
    min-width: 100%;
    margin: 0px 40px;
  }
  border: 1px solid;
`;

function SitePlan() {
  const [plan, setPlan] = useState<SPlan>(plans[0]);
  const [addedPlans, setAddedPlans] = useState<{ [k: string]: number }>({
    starterPlan: 0,
    basicPlan: 0,
    cmsPlan: 0,
    businessPlan: 0,
    enterprisePlan: 0,
  });

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
    switch (plan.name) {
      case 'Starter':
        setAddedPlans({ ...addedPlans, starterPlan: addedPlans.starterPlan + 1 });
        break;
      case 'Basic':
        setAddedPlans({ ...addedPlans, basicPlan: addedPlans.basicPlan + 1 });
        break;
      case 'CMS':
        setAddedPlans({ ...addedPlans, cmsPlan: addedPlans.cmsPlan + 1 });
        break;
      case 'Business':
        setAddedPlans({ ...addedPlans, businessPlan: addedPlans.businessPlan + 1 });
        break;
      case 'Enterprise':
        setAddedPlans({ ...addedPlans, enterprisePlan: addedPlans.enterprisePlan + 1 });
        break;
      default:
        break;
    }
  };

  const formData = watch();
  useEffect(() => {
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

  return (
    <Root>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <button type="submit">Add Site Plan</button>
      </form>

      <SitePlanResult sites={1} plan={plan}></SitePlanResult>
      <SelectedPlans>
        <h2>Added Site Plans</h2>
        {addedPlans.starterPlan > 0 && <SitePlanResult sites={addedPlans.starterPlan} plan={plans[0]}></SitePlanResult>}
        {addedPlans.basicPlan > 0 && <SitePlanResult sites={addedPlans.basicPlan} plan={plans[1]}></SitePlanResult>}
        {addedPlans.cmsPlan > 0 && <SitePlanResult sites={addedPlans.cmsPlan} plan={plans[2]}></SitePlanResult>}
        {addedPlans.businessPlan > 0 && (
          <SitePlanResult sites={addedPlans.businessPlan} plan={plans[3]}></SitePlanResult>
        )}
        {addedPlans.enterprisePlan > 0 && (
          <SitePlanResult sites={addedPlans.enterprisePlan} plan={plans[4]}></SitePlanResult>
        )}
      </SelectedPlans>
    </Root>
  );
}

export default SitePlan;
