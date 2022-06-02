import { useEffect, useState } from 'react';
import { ChangeHandler, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import styled from 'styled-components';
import PlanResult from './PlanResult';
import SitePlanResult from './SitePlanResult';

export interface SForm {
  customDomain: boolean;
  cmsItems: number;
  ecommerceItems: number;
  bandwidth: number;
  guestEditors: number;
  uptimeSla: boolean;
  transactionFee: number;
  annualSalesVolume: number;
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
    ecommerceItems: 0,
    bandwidth: 1,
    guestEditors: 0,
    uptimeSla: false,
    transactionFee: 0,
    annualSalesVolume: 0,
  },

  {
    name: 'Basic',
    billedMonthlyPerMonthPerSeatPrice: 15,
    billedAnnualyPerMonthPerSeatPrice: 12,
    customDomain: true,
    cmsItems: 0,
    ecommerceItems: 0,
    bandwidth: 50,
    guestEditors: 0,
    uptimeSla: false,
    transactionFee: 0,
    annualSalesVolume: 0,
  },

  {
    name: 'CMS',
    billedMonthlyPerMonthPerSeatPrice: 20,
    billedAnnualyPerMonthPerSeatPrice: 16,
    customDomain: true,
    cmsItems: 2000,
    ecommerceItems: 0,
    bandwidth: 200,
    guestEditors: 3,
    uptimeSla: false,
    transactionFee: 0,
    annualSalesVolume: 0,
  },

  {
    name: 'Business',
    billedMonthlyPerMonthPerSeatPrice: 45,
    billedAnnualyPerMonthPerSeatPrice: 36,
    customDomain: true,
    cmsItems: 10000,
    ecommerceItems: 0,
    bandwidth: 400,
    guestEditors: 10,
    uptimeSla: false,
    transactionFee: 0,
    annualSalesVolume: 0,
  },
  {
    name: 'Enterprise',
    billedMonthlyPerMonthPerSeatPrice: Infinity,
    billedAnnualyPerMonthPerSeatPrice: Infinity,
    customDomain: true,
    cmsItems: 10000,
    ecommerceItems: 0,
    bandwidth: Infinity,
    guestEditors: Infinity,
    uptimeSla: true,
    transactionFee: 0,
    annualSalesVolume: 0,
  },
  {
    name: 'Standard',
    billedMonthlyPerMonthPerSeatPrice: 42,
    billedAnnualyPerMonthPerSeatPrice: 29,
    customDomain: true,
    cmsItems: 2000,
    ecommerceItems: 500,
    bandwidth: 200,
    guestEditors: 3,
    uptimeSla: false,
    transactionFee: 2,
    annualSalesVolume: 50000,
  },
  {
    name: 'Plus',
    billedMonthlyPerMonthPerSeatPrice: 84,
    billedAnnualyPerMonthPerSeatPrice: 74,
    customDomain: true,
    cmsItems: 10000,
    ecommerceItems: 1000,
    bandwidth: 400,
    guestEditors: 10,
    uptimeSla: false,
    transactionFee: 0,
    annualSalesVolume: 200000,
  },
  {
    name: 'Advanced',
    billedMonthlyPerMonthPerSeatPrice: 235,
    billedAnnualyPerMonthPerSeatPrice: 212,
    customDomain: true,
    cmsItems: 10000,
    ecommerceItems: 3000,
    bandwidth: 400,
    guestEditors: 10,
    uptimeSla: false,
    transactionFee: 0,
    annualSalesVolume: Infinity,
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
  }
`;

function SitePlan() {
  const [plan, setPlan] = useState<SPlan>(plans[0]);
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
      ecommerceItems: 0,
      bandwidth: 1,
      guestEditors: 0,
      uptimeSla: false,
      transactionFee: 0,
      annualSalesVolume: 0,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    //setPlan(findPlan(plans, data));
  };

  const formData = watch();
  useEffect(() => {
    if (formData.cmsItems > 10000) setValue('cmsItems', 10000);
    if (formData.cmsItems < 0) setValue('cmsItems', 0);

    if (formData.ecommerceItems > 3000) setValue('ecommerceItems', 3000);
    if (formData.ecommerceItems < 0) setValue('ecommerceItems', 0);

    if (formData.bandwidth < 1) setValue('bandwidth', 1);

    if (formData.annualSalesVolume < 0) setValue('annualSalesVolume', 0);

    if (formData.guestEditors < 0) setValue('guestEditors', 0);

    if (formData.annualSalesVolume > 50000) setValue('transactionFee', 0);

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
    if (data.annualSalesVolume > 200000) data.annualSalesVolume = Infinity;

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
          Ecommerce Items
          <input type="number" placeholder="Ecommerce Items" {...register('ecommerceItems', {})} />
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
        <label>
          Transaction Fee (%)
          <select {...register('transactionFee')}>
            <option value="0">0</option>
            <option value="2">2</option>
          </select>
        </label>
        <label>
          Annual Sales Volume ($)
          <input type="number" placeholder="Annual Sales Volume" {...register('annualSalesVolume', {})} />
        </label>
        {/* <button type="submit">Add Workspace Plan</button> */}
      </form>

      <SitePlanResult seats={1} plan={plan} data={formData}></SitePlanResult>
    </Root>
  );
}

export default SitePlan;
