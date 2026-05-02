import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
};

export function SectionHeader({ actions, eyebrow, title }: SectionHeaderProps) {
  return (
    <div className="section-title-row">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {actions ? <div className="button-row">{actions}</div> : null}
    </div>
  );
}
