"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noiseRef = useRef(createNoise3D());
  const stateRef = useRef({ w: 0, h: 0, nt: 0 });
  const animationIdRef = useRef<number | null>(null);
  const [isSafari, setIsSafari] = useState(false);

  const getSpeed = useCallback(() => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  }, [speed]);

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = w;
    canvas.height = h;
    ctx.filter = `blur(${blur}px)`;

    stateRef.current = { w, h, nt: 0 };

    const handleResize = () => {
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      canvas.width = newW;
      canvas.height = newH;
      ctx.filter = `blur(${blur}px)`;
      stateRef.current.w = newW;
      stateRef.current.h = newH;
    };

    window.addEventListener("resize", handleResize);
    render(ctx);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [blur]);

  const drawWave = useCallback((ctx: CanvasRenderingContext2D, n: number) => {
    const state = stateRef.current;
    const noise = noiseRef.current;

    state.nt += getSpeed();

    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      for (let x = 0; x < state.w; x += 5) {
        const y = noise(x / 800, 0.3 * i, state.nt) * 100;
        ctx.lineTo(x, y + state.h * 0.5);
      }
      ctx.stroke();
      ctx.closePath();
    }
  }, [getSpeed, waveColors, waveWidth]);

  const render = useCallback((ctx: CanvasRenderingContext2D) => {
    const state = stateRef.current;

    ctx.fillStyle = backgroundFill || "black";
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillRect(0, 0, state.w, state.h);
    drawWave(ctx, 5);

    animationIdRef.current = requestAnimationFrame(() => render(ctx));
  }, [backgroundFill, waveOpacity, drawWave]);

  useEffect(() => {
    const cleanup = init();
    return () => {
      if (cleanup) cleanup();
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [init]);

  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "h-screen flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
