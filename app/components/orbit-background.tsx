import { useEffect, useRef } from "react";
import { startOrbitScene } from "./orbit-scene";

/**
 * Fixed, full-viewport canvas behind every page. Purely decorative: it's
 * hidden from assistive tech, starts transparent (so the prerendered page and
 * no-WebGL browsers just show the plain background), and fades in once the
 * first frame is drawn.
 */
export function OrbitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return startOrbitScene(canvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh w-full opacity-0 transition-opacity duration-1000"
    />
  );
}
