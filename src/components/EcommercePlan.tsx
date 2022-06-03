import { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import styled from 'styled-components';

import EcommercePlanResult from './EcommercePlanResult';

export interface EForm {
  customDomain: boolean;
  cmsItems: number;
  bandwidth: number;
  guestEditors: number;
  transactionFee: number;
  annualSalesVolume: number;
}

export interface EPlan extends EForm {
  name?: string;
  billedMonthlyPerMonthPerSeatPrice?: number;
  billedAnnualyPerMonthPerSeatPrice?: number;
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

function EcommercePlan() {
  const [plan, setPlan] = useState<EPlan>(plans[0]);
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

      transactionFee: 0,
      annualSalesVolume: 0,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    //setPlan(findPlan(plans, data));
  };

  const formData = watch();
  useEffect(() => {
    if (formData.cmsItems > 3000) setValue('cmsItems', 3000);
    if (formData.cmsItems < 0) setValue('cmsItems', 0);

    if (formData.bandwidth < 0) setValue('bandwidth', 1);

    if (formData.annualSalesVolume < 0) setValue('annualSalesVolume', 0);

    if (formData.guestEditors < 0) setValue('guestEditors', 0);

    if (formData.annualSalesVolume > 50000) setValue('transactionFee', 0);

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

  return (
    <Root>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Add Ecommerce Plan</h2>
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

      <EcommercePlanResult seats={1} plan={plan} data={formData}></EcommercePlanResult>
    </Root>
  );
}

export default EcommercePlan;
