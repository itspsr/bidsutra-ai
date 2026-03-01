"use client";

import { cn } from "@/utils/cn";
import { motion, type MotionProps } from "framer-motion";
import * as React from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

type Props = Omit<NativeButtonProps, keyof MotionProps | "children"> &
  Omit<MotionProps, "children"> & {
    children?: React.ReactNode;
    variant?: Variant;
    size?: Size;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

export function Button(props: Props) { 
  const { className, variant = "primary", size = "md", leftIcon, rightIcon, ...rest } = props;

  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium " +
    "transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<Variant, string> = {
    primary:
      "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] " +
      "shadow-[0_10px_25px_rgba(2,6,23,0.35)] hover:brightness-110",
    secondary:
      "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] " +
      "border border-[hsl(var(--border))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-[rgba(148,163,184,0.10)]",
    ghost: "bg-transparent text-[hsl(var(--foreground))] hover:bg-[rgba(148,163,184,0.10)] border border-transparent"
  };

  const sizes: Record<Size, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-base"
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {leftIcon}
      {props.children}
      {rightIcon}
    </motion.button>
  );
}
