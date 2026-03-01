"use client";

import { motion } from "framer-motion";
import * as React from "react";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const sx = cx + r * Math.cos(rad(start));
  const sy = cy + r * Math.sin(rad(start));
  const ex = cx + r * Math.cos(rad(end));
  const ey = cy + r * Math.sin(rad(end));
  const large = end - start <= 180 ? 0 : 1;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
}

export function RiskGauge(props: { value: number; label?: string; size?: number }) {
  const size = props.size ?? 240;
  const value = clamp(props.value, 0, 100);

  const stroke = 14;
  const r = (size / 2) * 0.78;
  const cx = size / 2;
  const cy = size / 2;

  const start = 200;
  const end = -20;
  const path = arcPath(cx, cy, r, start, end);

  const tone = value >= 85 ? "#EF4444" : value >= 70 ? "#F59E0B" : value >= 55 ? "#C8A94C" : "#10B981";

  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path d={path} fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth={stroke} strokeLinecap="round" />
        <motion.path
          d={path}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          pathLength={100}
          initial={{ strokeDasharray: 100, strokeDashoffset: 100 }}
          animate={{ strokeDasharray: 100, strokeDashoffset: 100 - value }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
        <circle cx={cx} cy={cy} r={r - 22} fill="rgba(255,255,255,0.02)" stroke="rgba(148,163,184,0.12)" />
      </svg>

      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-3xl font-semibold num tracking-tight">{value}</div>
          <div className="mt-1 text-xs uppercase tracking-widest text-text-2">{props.label ?? "Risk"}</div>
        </div>
      </div>
    </div>
  );
}
