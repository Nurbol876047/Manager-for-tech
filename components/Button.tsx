"use client";

import { Loader2, type LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: LucideIcon;
  loading?: boolean;
  loadingText?: string;
};

export function PrimaryButton({
  icon: Icon,
  loading,
  loadingText,
  children,
  className = "",
  disabled,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={`btn-primary ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          {loadingText ?? "Жүктелуде…"}
        </>
      ) : (
        <>
          {Icon && <Icon size={20} strokeWidth={2.3} />}
          {children}
        </>
      )}
    </button>
  );
}
