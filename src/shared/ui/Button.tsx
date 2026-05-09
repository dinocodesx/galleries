import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
  block?: boolean;
};

export function Button({
  children,
  variant = "primary",
  block = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = [
    "ui-button",
    variant === "primary" ? "ui-button--primary" : "ui-button--secondary",
    block ? "ui-button--block" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
