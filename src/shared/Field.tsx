import type { ReactNode } from "react";

type FieldProps = {
  children: ReactNode;
  label: ReactNode;
};

export function Field({ children, label }: FieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
