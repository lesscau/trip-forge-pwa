import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantClassNames: Record<ButtonVariant, string> = {
  primary: "primary-action",
  secondary: "secondary-action",
  danger: "danger-action"
};

export function Button({
  children,
  className,
  variant = "secondary",
  ...props
}: ButtonProps) {
  const classes = [variantClassNames[variant], className].filter(Boolean).join(" ");

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
}
