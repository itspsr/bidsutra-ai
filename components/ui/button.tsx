"use client";

import { cn } from "@/utils/cn";
import { motion, type MotionProps } from "framer-motion";
import * as React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
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
  const { className, variant = "secondary", size = "md", leftIcon, rightIcon, ...rest } = props;

  const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium num " +
    "transition focus:outline-none focus:ring-2 focus:ring-teal/20 " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<Variant, string> = {
    primary:
      "bg-gold text-bg-0 border border-line/0 hover:bg-gold-500 " +
      "shadow-[0_1px_0_rgba(255,255,255,0.06)]",
    secondary:
      "bg-surface-2/60 text-text-1 border border-line hover:border-line-strong hover:bg-surface-2/80",
    ghost: "bg-transparent text-text-2 hover:text-text-1 hover:bg-white/5 border border-transparent",
    danger: "bg-critical/15 text-critical border border-critical/25 hover:bg-critical/22"
  };

  const sizes: Record<Size, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-3.5 text-sm",
    lg: "h-11 px-4 text-base"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, boxShadow: "0 1px 0 rgba(255,255,255,0.06), 0 10px 24px rgba(0,0,0,0.28)" }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {leftIcon}
      {props.children}
      {rightIcon}
    </motion.button>
  );
}
