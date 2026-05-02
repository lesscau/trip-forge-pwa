import type { ReactNode } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";

type CopyButtonProps = {
  text?: string;
  children: ReactNode;
};

export function CopyButton({ children, text }: CopyButtonProps) {
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
      <Button
        aria-label={typeof children === "string" ? children : undefined}
        disabled={!value}
        onClick={() => void handleCopy()}
        type="button"
      >
        {children}
      </Button>
      {status ? (
        <span className={status === "copied" ? "copy-status" : "copy-error"}>
          {t(status === "copied" ? "copy.copied" : "copy.error")}
        </span>
      ) : null}
    </span>
  );
}
