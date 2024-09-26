"use client";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const CircularProgress = ({ className }: { className?: string }) => {
  return (
    <>
      <Loader2 className={cn("size-10 animate-spin", className)}></Loader2>
    </>
  );
};
const CircularProgressIndicator = ({
  className,
  label,
  loaderClassName,
}: {
  className?: string;
  label?: string;
  loaderClassName?: string;
}) => {
  return (
    <div className={cn("relative size-10", className)}>
      <Loader2
        className={cn("size-full animate-spin", loaderClassName)}
      ></Loader2>
      <div className="absolute left-[50%] top-[50%] -translate-x-2/4  -translate-y-2/4">
        {label}
      </div>
    </div>
  );
};

interface CircularProgressFillProps {
  className?: string;
  progress: number; // 0 to 100
  size?: number; // size of the circle
  strokeWidth?: number; // width of the stroke
  label?: string; // optional label to show inside the circle
  color?: [string, string]; // [stroke color, background color]
}

const CircularProgressFill = ({
  className,
  progress,
  size = 100,
  strokeWidth = 10,
  color = ["black", "lightgray"],
  label,
}: CircularProgressFillProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          stroke={color[1]}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color[0]}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      {label && <div className="absolute text-center">{label}</div>}
    </div>
  );
};

export { CircularProgress, CircularProgressFill, CircularProgressIndicator };
