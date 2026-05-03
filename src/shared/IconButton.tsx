import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode
} from "react";

type IconName =
  | "arrowDown"
  | "arrowUp"
  | "chevronDown"
  | "chevronUp"
  | "copy"
  | "edit"
  | "external"
  | "mapPin"
  | "text"
  | "ticket"
  | "trash";

type IconVariant = "secondary" | "danger";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName;
  label: string;
  variant?: IconVariant;
};

type IconLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  icon: IconName;
  label: string;
  variant?: IconVariant;
};

const iconPaths: Record<IconName, ReactNode> = {
  arrowDown: (
    <>
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </>
  ),
  arrowUp: (
    <>
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronUp: <path d="m18 15-6-6-6 6" />,
  copy: (
    <>
      <rect height="11" rx="2" width="11" x="8" y="8" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  external: (
    <>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </>
  ),
  mapPin: (
    <>
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  text: (
    <>
      <path d="M4 7V4h16v3" />
      <path d="M9 20h6" />
      <path d="M12 4v16" />
    </>
  ),
  ticket: (
    <>
      <path d="M2 9a3 3 0 0 0 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 0 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6 18 20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </>
  )
};

export function IconButton({
  className,
  icon,
  label,
  type = "button",
  variant = "secondary",
  ...props
}: IconButtonProps) {
  const classes = ["icon-button", `icon-button-${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      aria-label={label}
      className={classes}
      title={label}
      type={type}
      {...props}
    >
      <Icon name={icon} />
    </button>
  );
}

export function IconLink({
  className,
  icon,
  label,
  variant = "secondary",
  ...props
}: IconLinkProps) {
  const classes = ["icon-button", `icon-button-${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <a aria-label={label} className={classes} title={label} {...props}>
      <Icon name={icon} />
    </a>
  );
}

function Icon({ name }: { name: IconName }) {
  return (
    <svg
      aria-hidden="true"
      className="icon-button-svg"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {iconPaths[name]}
    </svg>
  );
}
