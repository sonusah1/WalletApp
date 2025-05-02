import { useFormContext, FormProvider } from "react-hook-form";
import React from "react";

// ✅ Line 7: Accept `onSubmit` prop and use useFormContext
export const Form = ({ children, onSubmit }) => {
  const methods = useFormContext();
  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
      {children}
    </form>
  );
};

export const FormField = ({ name, label, children }) => {
  return (
    <div className="mb-4">
      <FormLabel>{label}</FormLabel>
      <FormControl>{children}</FormControl>
    </div>
  );
};

export const FormLabel = ({ children }) => (
  <label className="block text-sm font-medium mb-1 text-left">{children}</label>
);

export const FormControl = ({ children }) => <div>{children}</div>;
