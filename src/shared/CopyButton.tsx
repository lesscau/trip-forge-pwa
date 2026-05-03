import type { ReactNode } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IconButton } from "./IconButton";

type CopyButtonProps = {
  text?: string;
  children: ReactNode;
  icon?: "copy" | "mapPin" | "text" | "ticket";
};

export function CopyButton({ children, icon = "copy", text }: CopyButtonProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"copied" | "error">();
  const value = text?.trim();

  const handleCopy = async () => {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  };

  return (
    <span className="copy-action">
      <IconButton
        disabled={!value}
        icon={icon}
        label={typeof children === "string" ? children : t("copy.copy")}
        onClick={() => void handleCopy()}
        type="button"
      />
      {status ? (
        <span className={status === "copied" ? "copy-status" : "copy-error"}>
          {t(status === "copied" ? "copy.copied" : "copy.error")}
        </span>
      ) : null}
    </span>
  );
}
