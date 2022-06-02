import { useEffect, useState } from 'react';
import { ChangeHandler, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
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

interface Plan extends Form {
  name?: string;
  billedMonthlyPerMonthPerSeatPrice?: number;
  billedAnnualyPerMonthPerSeatPrice?: number;
}

function WorkspacePlan() {
  const plans: Plan[] = [
    {
      name: 'starter',
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
      name: 'core',
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
      name: 'growth',
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
      name: 'enterprise',
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

  const [plan, setPlan] = useState<Plan>(plans[0]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
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
    console.log(formData);
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
      //console.log(plans[i], data);
      resPlan = plans[i];

      let matches = true;
      //console.log(plans[i].name);
      for (const [k, v] of Object.entries(plans[i])) {
        if (k === 'name' || k === 'billedMonthlyPerMonthPerSeatPrice' || k === 'billedAnnualyPerMonthPerSeatPrice')
          continue;
        matches = v >= data[k];
        //console.log(k, v, data[k], matches);
        if (!matches) break;
      }
      //console.log('\n\n');

      if (matches) break;
    }

    return resPlan;
  }

  // const onChange = () => {
  //   setValue('seats', 2);
  //   console.log(getValues());
  //   const data = getValues();
  //   setPlan(findPlan(plans, data));
  // };

  //console.log(errors);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Seats
          <input
            type="number"
            placeholder="Seats"
            defaultValue="1"
            {...register('seats', { required: true, min: 1 })}
          />
        </label>

        <label>
          Unhosted Sites
          <input
            type="number"
            placeholder="Unhosted Sites"
            defaultValue="2"
            {...register('unhostedSites', { required: true, min: 2 })}
          />
        </label>
        <label>
          <input type="checkbox" placeholder="Custom Code" {...register('customCode', {})} />
          Custom Code
        </label>
        <label>
          <input type="checkbox" placeholder="Code Export" {...register('codeExport', {})} />
          Code Export
        </label>
        <label>
          <input type="checkbox" placeholder="Billing Permissions" {...register('billingPermissions', {})} />
          Billing Permissions
        </label>
        <label>
          <input type="checkbox" placeholder="Publishing Permissions" {...register('publishingPermissions', {})} />
          Publishing Permissions
        </label>
        <label>
          <input type="checkbox" placeholder="Advanced Permissions" {...register('advancedPermissions', {})} />
          Advanced Permissions
        </label>
        <label>
          <input type="checkbox" placeholder="Advanced Security" {...register('advancedSecurity', {})} />
          Advanced Security
        </label>
        <button type="submit">Add Workspace Plan</button>
      </form>

      <PlanResult>
        <span>{plan ? plan.name : ''}</span>
      </PlanResult>
    </>
  );
}

export default WorkspacePlan;
