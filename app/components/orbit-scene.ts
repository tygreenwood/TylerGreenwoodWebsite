const VERTEX = /* glsl */ `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uCenter;   // sun position, device px from bottom-left
uniform float uScale;   // device px per scene unit
uniform float uTilt;    // sin of the camera's elevation above the orbital plane
uniform float uTime;
uniform float uDpr;
uniform float uDark;    // 0 = light theme, 1 = dark, fractional mid-transition
uniform float uDim;     // 1 in the hero, lower once scrolled into content
uniform vec3 uBg;
uniform vec3 uInk;      // orbit lines
uniform vec3 uSun;

const float TAU = 6.28318530718;
const float SUN_R = 0.065;
const int PLANETS = 6;

// Orbit radius, body radius, colour per theme, and starting angle.
void planet(int i, out float orbit, out float size, out vec3 light, out vec3 dark, out float phase) {
  if (i == 0)      { orbit = 0.20; size = 0.013; light = vec3(0.52, 0.45, 0.41); dark = vec3(0.78, 0.71, 0.66); phase = 1.2; }
  else if (i == 1) { orbit = 0.31; size = 0.021; light = vec3(0.70, 0.50, 0.28); dark = vec3(0.93, 0.79, 0.57); phase = 4.1; }
  else if (i == 2) { orbit = 0.45; size = 0.023; light = vec3(0.19, 0.41, 0.62); dark = vec3(0.46, 0.67, 0.90); phase = 2.4; }
  else if (i == 3) { orbit = 0.60; size = 0.017; light = vec3(0.64, 0.29, 0.21); dark = vec3(0.91, 0.52, 0.40); phase = 5.5; }
  else if (i == 4) { orbit = 0.82; size = 0.036; light = vec3(0.60, 0.49, 0.35); dark = vec3(0.87, 0.76, 0.60); phase = 0.3; }
  else             { orbit = 1.06; size = 0.026; light = vec3(0.26, 0.45, 0.51); dark = vec3(0.56, 0.79, 0.85); phase = 3.3; }
}

// Kepler-ish: outer planets are slower, so the system never looks in lockstep.
float angleOf(float orbit, float phase) {
  return phase + uTime * 0.022 * pow(orbit, -1.5);
}

vec3 drawOrbits(vec3 col, vec2 p, float px, bool far) {
  // Undo the camera tilt to get positions in the orbital plane.
  vec2 q = vec2(p.x, p.y / uTilt);
  if ((q.y > 0.0) != far) return col;

  float lq = max(length(q), 1e-4);
  float ang = atan(q.y, q.x);
  // |gradient| of the ellipse field, so every line is the same pixel width.
  float grad = length(vec2(q.x, q.y / uTilt)) / lq;
  float width = 0.55 * uDpr;

  for (int i = 0; i < PLANETS; i++) {
    float orbit, size, phase; vec3 light, dark;
    planet(i, orbit, size, light, dark, phase);

    float dpx = abs(lq - orbit) / grad / px;
    float line = 1.0 - smoothstep(width, width + uDpr, dpx);
    if (line <= 0.0) continue;

    // A fading trail behind each planet along its orbit.
    float behind = mod(angleOf(orbit, phase) - ang, TAU);
    float trail = exp(-behind * 2.6);

    float a = line * (mix(0.12, 0.16, uDark) + trail * 0.5);
    col = mix(col, uInk, a * (far ? 0.7 : 1.0));
  }
  return col;
}

vec3 drawRing(vec3 col, vec2 local, float aa, vec3 base, bool front) {
  vec2 rq = vec2(local.x, local.y / uTilt);
  if ((rq.y < 0.0) != front) return col;
  float lr = length(rq);
  float band = smoothstep(1.45 - aa, 1.45 + aa, lr) * (1.0 - smoothstep(2.2 - aa, 2.2 + aa, lr));
  float bands = 0.72 + 0.28 * sin(lr * 19.0);
  return mix(col, mix(base, uBg, 0.25), band * bands * 0.75);
}

vec3 drawPlanets(vec3 col, vec2 p, float px, bool far) {
  float cosT = sqrt(1.0 - uTilt * uTilt);

  for (int i = 0; i < PLANETS; i++) {
    float orbit, size, phase; vec3 light, dark;
    planet(i, orbit, size, light, dark, phase);

    float a = angleOf(orbit, phase);
    vec2 world = orbit * vec2(cos(a), sin(a));   // y = depth, positive is away
    if ((world.y > 0.0) != far) continue;

    vec2 screen = vec2(world.x, world.y * uTilt);
    float r = size * (1.0 - 0.12 * sin(a));      // a touch of perspective
    vec2 local = (p - screen) / r;
    float dl = length(local);
    bool ringed = i == 4;
    if (dl > (ringed ? 2.4 : 1.2)) continue;

    vec3 base = mix(light, dark, uDark);
    float aa = px / r;

    if (ringed) col = drawRing(col, local, aa * 1.5, base, false);

    // Shade the body as a sphere lit from the sun, so planets show phases:
    // full on the far side of their orbit, a crescent on the near side.
    vec3 n = vec3(local, sqrt(max(0.0, 1.0 - dl * dl)));
    vec3 toSun = normalize(vec3(-world.x, -world.y * uTilt, world.y * cosT));
    float lit = smoothstep(-0.15, 0.45, dot(n, toSun));
    vec3 night = mix(base * 0.42, uBg, 0.8 * uDark);
    float body = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, dl);
    col = mix(col, mix(night, base, lit), body);

    if (ringed) col = drawRing(col, local, aa * 1.5, base, true);
  }
  return col;
}

void main() {
  vec2 p = (gl_FragCoord.xy - uCenter) / uScale;
  float px = 1.0 / uScale;
  vec3 col = uBg;

  // Corona, under everything else.
  float ds = length(p);
  float glow = exp(-max(ds - SUN_R, 0.0) * 8.0) * mix(0.14, 0.3, uDark)
             + exp(-ds * 2.4) * mix(0.03, 0.08, uDark);
  col = mix(col, uSun, glow);

  // Far half of the system, then the sun, then the near half in front of it.
  col = drawOrbits(col, p, px, true);
  col = drawPlanets(col, p, px, true);

  float limb = sqrt(max(0.0, 1.0 - (ds / SUN_R) * (ds / SUN_R)));
  vec3 sun = uSun * (0.84 + 0.16 * limb);
  sun = mix(sun, vec3(1.0, 0.96, 0.88), limb * limb * 0.45 * uDark);
  col = mix(col, sun, 1.0 - smoothstep(SUN_R - px, SUN_R + px, ds));

  col = drawOrbits(col, p, px, false);
  col = drawPlanets(col, p, px, false);

  gl_FragColor = vec4(mix(uBg, col, uDim), 1.0);
}
`;

type Rgb = [number, number, number];

type Palette = { bg: Rgb; ink: Rgb; sun: Rgb; dark: number };

/** Seconds of simulated time to start from, so planets begin spread out. */
const START_TIME = 420;

/** Keeps the fragment count sane on high-density screens. */
const MAX_DPR = 1.5;

export function startOrbitScene(canvas: HTMLCanvasElement): () => void {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: "low-power",
  });
  if (!gl) return () => {};

  const program = createProgram(gl);
  if (!program) return () => {};
  gl.useProgram(program);

  // One triangle that covers the whole viewport.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const u = {
    center: uniform("uCenter"),
    scale: uniform("uScale"),
    tilt: uniform("uTilt"),
    time: uniform("uTime"),
    dpr: uniform("uDpr"),
    dark: uniform("uDark"),
    dim: uniform("uDim"),
    bg: uniform("uBg"),
    ink: uniform("uInk"),
    sun: uniform("uSun"),
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let target = readPalette();
  const shown: Palette = structuredClone(target);
  let scroll = 0;
  const pointer = { x: 0, y: 0 };
  const pointerTarget = { x: 0, y: 0 };
  let time = START_TIME;
  let last = performance.now();
  let raf = 0;
  let firstFrame = true;
  let lost = false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const width = Math.round(canvas.clientWidth * dpr);
    const height = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    return dpr;
  }

  function render(now: number) {
    raf = 0;
    if (lost) return;

    const still = reducedMotion.matches;
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    // Frame-rate independent easing toward each target.
    const ease = still ? 1 : 1 - Math.exp(-dt * 6);

    if (!still) time += dt;

    const scrollTarget = scrollProgress();
    scroll += (scrollTarget - scroll) * ease;
    pointer.x += (pointerTarget.x - pointer.x) * ease * 0.5;
    pointer.y += (pointerTarget.y - pointer.y) * ease * 0.5;
    let settled = Math.abs(scrollTarget - scroll) < 1e-3;
    for (const key of ["bg", "ink", "sun"] as const) {
      for (let i = 0; i < 3; i++) {
        shown[key][i] += (target[key][i] - shown[key][i]) * ease;
        if (Math.abs(target[key][i] - shown[key][i]) > 1e-3) settled = false;
      }
    }
    shown.dark += (target.dark - shown.dark) * ease;

    const dpr = resize();
    const { width: w, height: h } = canvas;
    const landscape = w >= h;
    const s = scroll * scroll * (3 - 2 * scroll);

    // Hero: sun beside the headline (landscape) or above it (portrait).
    // Content: tucked toward the top-right, clear of the reading column.
    const [hx, hy] = landscape ? [0.7, 0.5] : [0.5, 0.76];
    const [rx, ry] = landscape ? [0.86, 0.66] : [0.9, 1.0];
    const cx = mix(hx, rx, s) * w + pointer.x * 22 * dpr;
    const cy = mix(hy, ry, s) * h - pointer.y * 14 * dpr;
    const scale = landscape ? Math.max(w, h) * 0.42 : w * 0.62;

    gl!.viewport(0, 0, w, h);
    gl!.uniform2f(u.center, cx, cy);
    gl!.uniform1f(u.scale, scale);
    gl!.uniform1f(u.tilt, mix(0.4, 0.52, s) + pointer.y * 0.03);
    gl!.uniform1f(u.time, time);
    gl!.uniform1f(u.dpr, dpr);
    gl!.uniform1f(u.dark, shown.dark);
    gl!.uniform1f(u.dim, mix(1, 0.5, s));
    gl!.uniform3fv(u.bg, shown.bg);
    gl!.uniform3fv(u.ink, shown.ink);
    gl!.uniform3fv(u.sun, shown.sun);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);

    if (firstFrame) {
      firstFrame = false;
      canvas.style.opacity = "1";
    }

    if (!still || !settled) schedule();
  }

  function schedule() {
    if (!raf && !lost) raf = requestAnimationFrame(render);
  }

  function onPointerMove(event: PointerEvent) {
    if (event.pointerType !== "mouse") return;
    pointerTarget.x = event.clientX / window.innerWidth - 0.5;
    pointerTarget.y = event.clientY / window.innerHeight - 0.5;
    schedule();
  }

  function onContextLost(event: Event) {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(raf);
    canvas.style.opacity = "0";
  }

  // The theme toggle flips a class on <html>; follow it.
  const themeObserver = new MutationObserver(() => {
    target = readPalette();
    schedule();
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  reducedMotion.addEventListener("change", schedule);
  canvas.addEventListener("webglcontextlost", onContextLost);
  schedule();

  return () => {
    lost = true;
    cancelAnimationFrame(raf);
    themeObserver.disconnect();
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    window.removeEventListener("pointermove", onPointerMove);
    reducedMotion.removeEventListener("change", schedule);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  };
}

/** 0 at the top of the page, 1 once the hero has scrolled away. */
function scrollProgress() {
  return Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.85)));
}

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * The tokens are oklch(), which the shader can't use directly. Painting each
 * one into a 1×1 2D canvas and reading the pixel back lets the browser do the
 * conversion, so the scene matches the CSS exactly and stays in sync with it.
 */
function readPalette(): Palette {
  const probe = document.createElement("canvas").getContext("2d", {
    willReadFrequently: true,
  });
  const styles = getComputedStyle(document.documentElement);

  const read = (token: string, fallback: Rgb): Rgb => {
    const value = styles.getPropertyValue(token).trim();
    if (!probe || !value) return fallback;
    probe.fillStyle = "#000";
    probe.fillStyle = value;
    probe.clearRect(0, 0, 1, 1);
    probe.fillRect(0, 0, 1, 1);
    const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
    return [r / 255, g / 255, b / 255];
  };

  const dark = document.documentElement.classList.contains("dark");
  return {
    bg: read("--bg", dark ? [0.1, 0.09, 0.08] : [0.98, 0.98, 0.97]),
    ink: read("--muted", [0.5, 0.5, 0.5]),
    sun: read("--accent", [0.85, 0.55, 0.25]),
    dark: dark ? 1 : 0,
  };
}

function createProgram(gl: WebGLRenderingContext) {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertex = compile(gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram()!;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}
