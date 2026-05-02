import type { ReactNode } from "react";

type EmptyStateProps = {
  title?: ReactNode;
  children: ReactNode;
};

export function EmptyState({ children, title }: EmptyStateProps) {
  return (
    <article className="empty-state" role="status">
      {title ? <strong>{title}</strong> : null}
      <div>{children}</div>
    </article>
  );
}
