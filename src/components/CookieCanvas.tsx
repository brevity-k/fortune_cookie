"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import { CookieRenderer } from "./CookieRenderer";
import { createCookiePhysics, CookiePhysicsWorld } from "./CookiePhysics";
import { InteractionDetector, BreakEvent } from "./InteractionDetector";
import { SoundManager } from "./SoundManager";

interface CookieCanvasProps {
  onFortuneReveal: () => void;
  onBreak: () => void;
  fortune: string;
  onNewCookie: () => void;
}

export default function CookieCanvas({
  onFortuneReveal,
  onBreak,
  fortune,
  onNewCookie,
}: CookieCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<CookieRenderer | null>(null);
  const physicsRef = useRef<CookiePhysicsWorld | null>(null);
  const interactionRef = useRef<InteractionDetector | null>(null);
  const animFrameRef = useRef<number>(0);
  const [isBroken, setIsBroken] = useState(false);
  const [showNewButton, setShowNewButton] = useState(false);
  const [breakMethod, setBreakMethod] = useState<string>("");

  const handleBreak = useCallback(
    (event: BreakEvent) => {
      const renderer = rendererRef.current;
      const physics = physicsRef.current;
      if (!renderer || !physics) return;

      setIsBroken(true);
      setBreakMethod(event.method.replace("_", " "));

      // Sound effects
      SoundManager.init();
      SoundManager.play("crack");
      setTimeout(() => SoundManager.play("break"), 100);

      // Create physics fragments
      physics.createFragments(
        renderer.cx,
        renderer.cy,
        renderer.radius,
        event.x,
        event.y,
        event.force
      );

      // Trigger visual break effect
      renderer.triggerBreakEffect(event.x, event.y, event.force);

      // Screen shake
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          x: () => (Math.random() - 0.5) * 15 * event.force,
          y: () => (Math.random() - 0.5) * 10 * event.force,
          duration: 0.05,
          repeat: 6,
          yoyo: true,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(containerRef.current, { x: 0, y: 0 });
          },
        });
      }

      onBreak();

      // Reveal fortune after delay
      setTimeout(() => {
        SoundManager.play("chime");
        renderer.showFortunePaper(() => {
          onFortuneReveal();
          setShowNewButton(true);
        });
      }, 600);
    },
    [fortune, onBreak, onFortuneReveal]
  );

  const handleReset = useCallback(() => {
    setIsBroken(false);
    setShowNewButton(false);
    setBreakMethod("");

    const renderer = rendererRef.current;
    const physics = physicsRef.current;
    const interaction = interactionRef.current;

    // Reset existing objects in place — no destroy/recreate needed
    if (physics) {
      physics.reset();
    }
    if (renderer) {
      renderer.reset();
    }
    if (interaction) {
      interaction.reset();
    }

    // Animation loop is still running from initial mount, no need to restart

    onNewCookie();
  }, [onNewCookie]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let initialized = false;
    const renderer = new CookieRenderer();
    const physics = createCookiePhysics(600, 500);
    rendererRef.current = renderer;
    physicsRef.current = physics;

    renderer.init(canvas).then(() => {
      if (cancelled) {
        // Cleanup was called before init completed — destroy now that app is ready
        renderer.destroy();
        physics.destroy();
        return;
      }

      initialized = true;

      const interaction = new InteractionDetector();
      interaction.setCookieBounds(renderer.cx, renderer.cy, renderer.radius);
      interaction.setCallbacks({
        onBreak: handleBreak,
        onHover: (intensity) => {
          renderer.state.hoverIntensity = intensity;
          if (intensity > 0.5) {
            renderer.state.phase = "hover";
          }
        },
        onShakeProgress: (progress) => {
          renderer.state.shakeProgress = progress;
        },
        onSqueezeProgress: (progress) => {
          renderer.state.squeezeProgress = progress;
        },
        onDragOffset: (dx, dy) => {
          renderer.state.dragOffsetX = dx;
          renderer.state.dragOffsetY = dy;
        },
        onClickProgress: (count) => {
          renderer.state.clickCrackLevel = count;
          // Small shake on each click
          if (count > 0 && containerRef.current) {
            gsap.to(containerRef.current, {
              x: () => (Math.random() - 0.5) * 6 * count,
              y: () => (Math.random() - 0.5) * 4 * count,
              duration: 0.04,
              repeat: 3,
              yoyo: true,
              ease: "power2.inOut",
              onComplete: () => {
                gsap.set(containerRef.current, { x: 0, y: 0 });
              },
            });
            SoundManager.init();
            SoundManager.play(count === 1 ? "crack" : "crack");
          }
        },
      });
      interaction.attach(canvas);
      interactionRef.current = interaction;

      // Animation loop — check cancelled flag each frame
      const loop = () => {
        if (cancelled) return;
        physics.step();
        renderer.update(physics.fragments);
        animFrameRef.current = requestAnimationFrame(loop);
      };
      animFrameRef.current = requestAnimationFrame(loop);
    });

    // Initialize sound on first user interaction
    const initSound = () => {
      SoundManager.init();
      window.removeEventListener("click", initSound);
      window.removeEventListener("touchstart", initSound);
    };
    window.addEventListener("click", initSound);
    window.addEventListener("touchstart", initSound);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animFrameRef.current);
      interactionRef.current?.detach();
      // Only destroy if init completed; otherwise the .then() callback handles it
      if (initialized) {
        renderer.destroy();
        physics.destroy();
      }
      window.removeEventListener("click", initSound);
      window.removeEventListener("touchstart", initSound);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-full max-w-[600px] mx-auto">
      <div
        ref={containerRef}
        className="cookie-canvas-container relative rounded-2xl overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at center, #2d1810 0%, #1a0e04 70%)",
          boxShadow: "0 0 60px rgba(212, 160, 74, 0.15), inset 0 0 60px rgba(0,0,0,0.3)",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ touchAction: "none", cursor: "pointer" }}
        />

        {/* Instruction text (HTML overlay) */}
        {!isBroken && (
          <div
            className="pointer-events-none absolute bottom-8 left-0 right-0 text-center animate-pulse"
            style={{ color: "#d4a04a", fontSize: 14, opacity: 0.6 }}
          >
            Click, drag, or shake to break your cookie
          </div>
        )}

        {/* Fortune text (HTML overlay on canvas) */}
        {showNewButton && (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div
              className="rounded px-6 py-3 text-center"
              style={{
                backgroundColor: "rgba(245, 230, 200, 0.95)",
                border: "1px solid rgba(212, 160, 74, 0.3)",
                maxWidth: 280,
              }}
            >
              <p style={{ color: "#4a3520", fontSize: 13, fontFamily: "Georgia, serif" }}>
                {fortune}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Break method indicator */}
      {breakMethod && (
        <div className="absolute top-4 right-4 rounded-full bg-gold/20 px-3 py-1 text-xs text-gold backdrop-blur-sm">
          {breakMethod}
        </div>
      )}

      {/* New Cookie button */}
      {showNewButton && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleReset}
            className="animate-pulse-glow rounded-full bg-gradient-to-r from-gold-dark to-gold px-8 py-3 text-sm font-semibold text-background transition-all hover:scale-105 hover:shadow-lg"
          >
            🥠 New Cookie
          </button>
        </div>
      )}
    </div>
  );
}
