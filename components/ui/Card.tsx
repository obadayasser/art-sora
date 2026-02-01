"use client";

import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "elevated";
}

const variantStyles = {
  default: "bg-[var(--card-bg)]",
  bordered: "bg-[var(--card-bg)] border border-[var(--card-border)]",
  elevated: "bg-[var(--card-bg)] shadow-lg dark:shadow-black/20",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-xl p-4
          transition-colors duration-200
          ${variantStyles[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`mb-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={`text-lg font-semibold text-[var(--foreground)] ${className}`}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = "CardTitle";

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`text-[var(--muted)] ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`mt-4 pt-4 border-t border-[var(--card-border)] ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";
