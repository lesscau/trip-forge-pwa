import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: "article" | "section";
};

export function Card({
  as: Component = "article",
  children,
  className,
  ...props
}: CardProps) {
  const classes = ["focus-card", className].filter(Boolean).join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
