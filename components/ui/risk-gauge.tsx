"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import * as React from "react";

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const a = (angle - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export function RiskGauge(props: { value: number; label?: string; size?: number }) {
  const size = props.size ?? 240;
  const value = Math.max(0, Math.min(100, props.value));

  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 120, damping: 18 });
  const angle = useTransform(spring, [0, 100], [-130, 130]);

  React.useEffect(() => {
    mv.set(value);
  }, [value, mv]);

  const arc = describeArc(size / 2, size / 2, size * 0.38, -130, 130);

  const color = value >= 85 ? "#D4B15A" : value >= 70 ? "#5B8DEF" : value >= 50 ? "#93C5FD" : "#F59E0B";

  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="bsGauge" x1="0" x2="1">
            <stop offset="0" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.05)" />
          </linearGradient>
        </defs>

        <path d={arc} fill="none" stroke="url(#bsGauge)" strokeWidth={16} strokeLinecap="round" />
        <path
          d={arc}
          fill="none"
          stroke={color}
          strokeWidth={16}
          strokeLinecap="round"
          pathLength={100}
          style={{ strokeDasharray: 100, strokeDashoffset: 100 - value }}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.29}
          fill="rgba(2,6,23,0.25)"
          stroke="rgba(255,255,255,0.08)"
        />
      </svg>

      <motion.div className="absolute left-1/2 top-1/2" style={{ rotate: angle, x: "-50%", y: "-50%" }}>
        <div
          style={{
            width: 2,
            height: size * 0.32,
            background: "rgba(255,255,255,0.75)",
            transformOrigin: "bottom center",
            borderRadius: 999
          }}
        />
        <div
          style={{
            width: 10,
            height: 10,
            background: "rgba(212,177,90,0.9)",
            borderRadius: 999,
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            boxShadow: "0 0 0 6px rgba(196,154,51,0.15)"
          }}
        />
      </motion.div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        <div className="text-xs text-white/60 tracking-wide uppercase">{props.label ?? "Risk Score"}</div>
      </div>
    </div>
  );
}
