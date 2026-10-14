import { useEffect, useRef } from "react";

/**
 * Spring ribbon cursor trail inspired by https://amitchauhan.me/
 * Colors follow the YM logo navy palette.
 */

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = Number.parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function readThemeColors() {
  const styles = getComputedStyle(document.documentElement);
  const accent = styles.getPropertyValue("--accent").trim() || "#0b4f8c";
  const secondary = styles.getPropertyValue("--accent-secondary").trim() || "#001830";
  const light = styles.getPropertyValue("--accent-light").trim() || "#7bafcf";
  const cyan = styles.getPropertyValue("--accent-cyan").trim() || "#3d7ea6";
  return {
    trailA: hexToRgba(accent, 0.45),
    trailB: hexToRgba(secondary, 0.38),
    trailC: hexToRgba(cyan, 0.4),
    glow: hexToRgba(accent, 0.5),
    stroke: hexToRgba(light, 0.55),
  };
}

type TrailNode = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type TrailLine = {
  spring: number;
  friction: number;
  nodes: TrailNode[];
};

const FEATURE = {
  friction: 0.5,
  trails: 20,
  size: 40,
  dampening: 0.2,
  tension: 0.98,
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    let running = true;
    let started = false;
    let raf = 0;
    let clickScale = 1;
    let pulse = 0;
    let lastTs = performance.now();

    const cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const arrowPos = { x: cursorPos.x, y: cursorPos.y };
    let colors = readThemeColors();

    const refreshColors = () => {
      colors = readThemeColors();
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let lines: TrailLine[] = [];

    const populateLines = () => {
      lines = [];
      for (let i = 0; i < FEATURE.trails; i += 1) {
        const nodes: TrailNode[] = [];
        for (let n = 0; n < FEATURE.size; n += 1) {
          nodes.push({ x: cursorPos.x, y: cursorPos.y, vx: 0, vy: 0 });
        }
        lines.push({
          spring: 0.45 + (i / FEATURE.trails) * 0.025 + 0.1 * Math.random() - 0.05,
          friction: FEATURE.friction + 0.01 * Math.random() - 0.005,
          nodes,
        });
      }
    };

    const updateLine = (line: TrailLine) => {
      let spring = line.spring;
      let node = line.nodes[0];
      node.vx += (cursorPos.x - node.x) * spring;
      node.vy += (cursorPos.y - node.y) * spring;

      for (let i = 0; i < line.nodes.length; i += 1) {
        node = line.nodes[i];
        if (i > 0) {
          const prev = line.nodes[i - 1];
          node.vx += (prev.x - node.x) * spring;
          node.vy += (prev.y - node.y) * spring;
          node.vx += prev.vx * FEATURE.dampening;
          node.vy += prev.vy * FEATURE.dampening;
        }
        node.vx *= line.friction;
        node.vy *= line.friction;
        node.x += node.vx;
        node.y += node.vy;
        spring *= FEATURE.tension;
      }
    };

    const drawLine = (line: TrailLine) => {
      let n = line.nodes[0].x;
      let i = line.nodes[0].y;
      ctx.beginPath();
      ctx.moveTo(n, i);
      for (let a = 1; a < line.nodes.length - 2; a += 1) {
        const e = line.nodes[a];
        const t = line.nodes[a + 1];
        n = 0.5 * (e.x + t.x);
        i = 0.5 * (e.y + t.y);
        ctx.quadraticCurveTo(e.x, e.y, n, i);
      }
      const e = line.nodes[line.nodes.length - 2];
      const t = line.nodes[line.nodes.length - 1];
      ctx.quadraticCurveTo(e.x, e.y, t.x, t.y);
      ctx.stroke();
      ctx.closePath();
    };

    const drawArrowIcon = (x: number, y: number, scale: number) => {
      const s = 24 * scale * (1 + Math.sin(pulse) * 0.03);
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.translate(x, y);
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, s);
      ctx.lineTo(s * 0.28, s * 0.72);
      ctx.lineTo(s * 0.72, s * 0.78);
      ctx.closePath();
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    };

    const tick = (ts: number) => {
      if (!running) return;
      const dt = Math.min(0.033, (ts - lastTs) / 1000);
      lastTs = ts;
      pulse += dt * 3.2;
      clickScale = lerp(clickScale, 1, 0.14);
      arrowPos.x = lerp(arrowPos.x, cursorPos.x, 0.42);
      arrowPos.y = lerp(arrowPos.y, cursorPos.y, 0.42);

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (started) {
        ctx.globalCompositeOperation = "lighter";
        ctx.lineWidth = 1;
        for (let t = 0; t < lines.length; t += 1) {
          ctx.strokeStyle = t % 3 === 0 ? colors.trailA : t % 3 === 1 ? colors.trailB : colors.trailC;
          updateLine(lines[t]);
          drawLine(lines[t]);
        }
      }

      drawArrowIcon(arrowPos.x, arrowPos.y, clickScale);
      raf = requestAnimationFrame(tick);
    };

    const move = (event: MouseEvent | TouchEvent) => {
      if (event instanceof MouseEvent) {
        cursorPos.x = event.clientX;
        cursorPos.y = event.clientY;
      } else if (event.touches[0]) {
        cursorPos.x = event.touches[0].clientX;
        cursorPos.y = event.touches[0].clientY;
      }
    };

    const onFirstMove = (e: MouseEvent | TouchEvent) => {
      document.removeEventListener("mousemove", onFirstMove);
      document.removeEventListener("touchstart", onFirstMove);
      document.addEventListener("mousemove", move, { passive: true });
      document.addEventListener("touchmove", move, { passive: true });
      move(e);
      populateLines();
      started = true;
      document.documentElement.classList.add("has-custom-cursor");
    };

    const onDown = () => {
      clickScale = 0.78;
    };

    const onLeave = () => {
      document.documentElement.classList.remove("has-custom-cursor");
    };

    const onEnter = () => {
      if (started) document.documentElement.classList.add("has-custom-cursor");
    };

    const stop = () => {
      running = false;
    };

    const start = () => {
      if (!running) {
        running = true;
        lastTs = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    resize();
    refreshColors();
    const themeObserver = new MutationObserver(refreshColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    document.addEventListener("mousemove", onFirstMove, { passive: true });
    document.addEventListener("touchstart", onFirstMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("focus", start);
    window.addEventListener("blur", stop);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      document.documentElement.classList.remove("has-custom-cursor");
      document.removeEventListener("mousemove", onFirstMove);
      document.removeEventListener("touchstart", onFirstMove);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("touchmove", move);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", resize);
      window.removeEventListener("focus", start);
      window.removeEventListener("blur", stop);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return <canvas ref={canvasRef} className="custom-cursor-canvas" aria-hidden="true" />;
}
