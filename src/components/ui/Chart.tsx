"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ===== Bar Chart (Pure SVG) =====
interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  className?: string;
}

export function BarChart({ data, height = 200, className }: BarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.min(40, (100 / data.length) * 0.6);
  const gap = 100 / data.length;

  return (
    <div className={cn("w-full", className)}>
      <svg viewBox={`0 0 100 ${height / 3}`} className="w-full" preserveAspectRatio="none">
        {data.map((d, i) => {
          const barH = (d.value / maxVal) * (height / 3 - 15);
          return (
            <g key={i}>
              <rect
                x={i * gap + (gap - barWidth) / 2}
                y={height / 3 - barH - 10}
                width={barWidth}
                height={barH}
                rx={2}
                fill={d.color || "#6366f1"}
                opacity={0.85}
              />
              <text
                x={i * gap + gap / 2}
                y={height / 3 - 2}
                textAnchor="middle"
                className="fill-zinc-500"
                fontSize="3.5"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ===== Line Chart (Pure SVG) =====
interface LineChartProps {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
  className?: string;
}

export function LineChart({
  data,
  labels,
  color = "#6366f1",
  height = 120,
  className,
}: LineChartProps) {
  const maxVal = Math.max(...data, 1);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;
  const w = 100;
  const h = 40;
  const padding = 2;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (w - padding * 2);
    const y = h - padding - ((v - minVal) / range) * (h - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M${points.join(" L")}`;
  const areaD = `${pathD} L${padding + ((data.length - 1) / (data.length - 1)) * (w - padding * 2)},${h - padding} L${padding},${h - padding} Z`;

  return (
    <div className={cn("w-full", className)}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#grad-${color.replace('#', '')})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" />
        {data.map((v, i) => {
          const x = padding + (i / (data.length - 1)) * (w - padding * 2);
          const y = h - padding - ((v - minVal) / range) * (h - padding * 2);
          return (
            <circle key={i} cx={x} cy={y} r="1.5" fill={color} stroke="white" strokeWidth="0.5" />
          );
        })}
      </svg>
      {labels && (
        <div className="flex justify-between mt-1 px-1">
          {labels.map((l, i) => (
            <span key={i} className="text-[10px] text-zinc-500">{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== Donut Chart (Pure SVG) =====
interface DonutChartProps {
  value: number;
  max?: number;
  color?: string;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function DonutChart({
  value,
  max = 100,
  color = "#6366f1",
  size = 80,
  strokeWidth = 8,
  label,
  className,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;

  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
        {/* Center text */}
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-white text-lg font-bold"
          fontSize={size * 0.22}
        >
          {value}%
        </text>
      </svg>
      {label && <span className="text-xs text-zinc-400 mt-1.5">{label}</span>}
    </div>
  );
}

// ===== Horizontal Stacked Bar =====
interface StackedBarProps {
  segments: { label: string; value: number; color: string }[];
  className?: string;
}

export function StackedBar({ segments, className }: StackedBarProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  return (
    <div className={cn("w-full", className)}>
      <div className="flex w-full h-6 rounded-full overflow-hidden">
        {segments.map((s, i) => (
          <div
            key={i}
            style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.color }}
            className="flex items-center justify-center text-[9px] font-bold text-white/90 first:rounded-l-full last:rounded-r-full"
          >
            {Math.round((s.value / total) * 100)}%
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-3 flex-wrap">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-zinc-400">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
