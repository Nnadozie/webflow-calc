import { useEffect, useState } from 'react';
import { ChangeHandler, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import styled from 'styled-components';
import PlanResult from './PlanResult';

interface Form {
  seats: number;
  unhostedSites: number;
  customCode: boolean;
  codeExport: boolean;
  billingPermissions: boolean;
  publishingPermissions: boolean;
  advancedPermissions: boolean;
  advancedSecurity: boolean;
}

export interface Plan extends Form {
  name?: string;
  billedMonthlyPerMonthPerSeatPrice?: number;
  billedAnnualyPerMonthPerSeatPrice?: number;
}

const plans: Plan[] = [
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

  input {
    display: block;
    margin-top: 3px;
    margin-bottom: 3px;
    height: 30px;
  }

  input[type='number'] {
    max-width: 300px;
    width: 250px;
    padding-left: 30px;
  }
`;

function WorkspacePlan() {
  const [plan, setPlan] = useState<Plan>(plans[0]);
  const [seats, setSeats] = useState<number>(1);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Form>({
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

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    //setPlan(findPlan(plans, data));
  };

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

  function findPlan(plans: Plan[], data: { [k: string | number | symbol]: any }): Plan {
    /**go through and check if there's anything in data greater than in plan,
     * if so, discount plan.
     * Else return plan.
     * i.e. if you go through all properties but don't find one that is greater return plan
     **/
    if (data.seats > 9) data.seats = Infinity;
    if (data.unhostedSites > 10) data.unhostedSites = Infinity;

    let resPlan = plans[0];

    for (let i = 0; i < plans.length; i++) {
      resPlan = plans[i];

      let matches = true;
      for (const [k, v] of Object.entries(plans[i])) {
        if (k === 'name' || k === 'billedMonthlyPerMonthPerSeatPrice' || k === 'billedAnnualyPerMonthPerSeatPrice')
          continue;
        matches = v >= data[k];
        if (!matches) break;
      }
      if (matches) break;
    }

    return resPlan;
  }

  return (
    <Root>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Add Workspace Plan</h2>
        <label>
          Seats
          <input type="number" placeholder="Seats" defaultValue="1" {...register('seats')} />
        </label>

        <label>
          Unhosted Sites
          <input type="number" placeholder="Unhosted Sites" defaultValue="2" {...register('unhostedSites')} />
        </label>
        <label>
          Custom Code
          <input type="checkbox" placeholder="Custom Code" {...register('customCode', {})} />
        </label>
        <label>
          Code Export
          <input type="checkbox" placeholder="Code Export" {...register('codeExport', {})} />
        </label>
        <label>
          Billing Permissions
          <input type="checkbox" placeholder="Billing Permissions" {...register('billingPermissions', {})} />
        </label>
        <label>
          Publishing Permissions
          <input type="checkbox" placeholder="Publishing Permissions" {...register('publishingPermissions', {})} />
        </label>
        <label>
          Advanced Permissions
          <input type="checkbox" placeholder="Advanced Permissions" {...register('advancedPermissions', {})} />
        </label>
        <label>
          Advanced Security
          <input type="checkbox" placeholder="Advanced Security" {...register('advancedSecurity', {})} />
        </label>
        {/* <button type="submit">Add Workspace Plan</button> */}
      </form>

      <PlanResult plan={plan} seats={seats}></PlanResult>
    </Root>
  );
}

export default WorkspacePlan;
