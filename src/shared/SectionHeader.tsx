import type { ReactNode } from "react";
import { SectionIcon, type SectionIconName } from "./SectionIcon";

type SectionHeaderProps = {
  title: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  icon?: SectionIconName;
};

export function SectionHeader({
  actions,
  eyebrow,
  icon,
  title
}: SectionHeaderProps) {
  return (
    <div className="section-title-row">
      <div className="section-heading-title">
        {icon ? <SectionIcon name={icon} /> : null}
        <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        </div>
      </div>
      {actions ? <div className="button-row">{actions}</div> : null}
    </div>
  );
}
