/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  FormProviderProps,
  useForm,
  useFormContext,
  UseFormHandleSubmit,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';
import { z } from 'zod';

/**
 * Merge type T with type K.
 * The key of K will override T's one, if conflict occurs.
 */
export type Combine<T, K> = Omit<T, keyof K> & K;

type UseGoalFormProps<
  TFieldValues extends FieldValues,
  ZodSchema extends z.ZodType,
  TDefaultValues extends FieldValues = TFieldValues,
> = Omit<UseFormProps<TFieldValues>, 'resolver' | 'defaultValues'> & {
  zodSchema: ZodSchema;
  // Ensure that defaultValues must be given.
  defaultValues: TDefaultValues;
};
export type UseGoalFormReturn<
  TFieldValues extends FieldValues,
  ZodSchema extends z.ZodType = z.ZodTypeAny,
> = Omit<UseFormReturn<TFieldValues>, 'handleSubmit'> & {
  handleSubmit: UseFormHandleSubmit<z.infer<ZodSchema>>;
};

export const useGoalForm = <
  TFieldValues extends FieldValues,
  ZodSchema extends z.ZodType,
  TDefaultValues extends FieldValues = TFieldValues,
>(
  props: UseGoalFormProps<TFieldValues, ZodSchema, TDefaultValues>
): UseGoalFormReturn<TFieldValues, ZodSchema> => {
  const { zodSchema, defaultValues, ...rest } = props;
  return useForm({
    ...rest,
    defaultValues: defaultValues as DefaultValues<TFieldValues>,
    resolver: zodResolver(zodSchema as any),
  });
};

// Simply override type for provider related utils
type GoalFormProviderProps<
  TFieldValues extends FieldValues,
  ZodSchema extends z.ZodType = z.ZodTypeAny,
  TContext = any,
> = Combine<
  FormProviderProps<TFieldValues, TContext>,
  UseGoalFormReturn<TFieldValues, ZodSchema>
>;
type GoalFormProviderType = <
  TFieldValues extends FieldValues,
  ZodSchema extends z.ZodType = z.ZodTypeAny,
  TContext = any,
>(
  props: GoalFormProviderProps<TFieldValues, ZodSchema, TContext>
) => JSX.Element;
export const GoalFormProvider = FormProvider as GoalFormProviderType;

type UseGoalFormContext = <
  TFieldValues extends FieldValues,
  ZodSchema extends z.ZodType = z.ZodTypeAny,
>() => UseGoalFormReturn<TFieldValues, ZodSchema>;
export const useGoalFormContext = useFormContext as UseGoalFormContext;
