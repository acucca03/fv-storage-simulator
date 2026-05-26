import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import { cloneElement, isValidElement } from "react";

import { uiTokens } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-white text-neutral-950 hover:bg-neutral-200",
  secondary: "border border-white/15 text-white hover:bg-white/10",
  ghost: "text-neutral-300 hover:bg-white/10 hover:text-white",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-4 text-base",
};

const baseButtonClass =
  "inline-flex items-center justify-center rounded-full font-semibold disabled:pointer-events-none disabled:opacity-50";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  asChild = false,
  ...props
}: ButtonProps) {
  const buttonClassName = cn(
    baseButtonClass,
    uiTokens.transition,
    uiTokens.focusRing,
    buttonSizes[size],
    buttonVariants[variant],
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;

    return cloneElement(child, {
      className: cn(buttonClassName, child.props.className),
    });
  }

  return (
    <button type={type} className={buttonClassName} {...props}>
      {children}
    </button>
  );
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function LinkButton({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: LinkButtonProps) {
  return (
    <a
      className={cn(
        baseButtonClass,
        uiTokens.transition,
        uiTokens.focusRing,
        buttonSizes[size],
        buttonVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
