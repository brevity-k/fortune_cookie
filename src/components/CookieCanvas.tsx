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
        renderer.showFortunePaper(fortune, () => {
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

    if (physics) {
      physics.destroy();
    }
    if (renderer) {
      renderer.destroy();
    }
    if (interaction) {
      interaction.reset();
    }

    // Re-initialize
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newRenderer = new CookieRenderer();
    const newPhysics = createCookiePhysics(600, 500);
    rendererRef.current = newRenderer;
    physicsRef.current = newPhysics;

    newRenderer.init(canvas).then(() => {
      const newInteraction = new InteractionDetector();
      newInteraction.setCookieBounds(newRenderer.cx, newRenderer.cy, newRenderer.radius);
      newInteraction.setCallbacks({
        onBreak: handleBreak,
        onHover: (intensity) => {
          newRenderer.state.hoverIntensity = intensity;
          if (intensity > 0.5) {
            newRenderer.state.phase = "hover";
          }
        },
        onShakeProgress: (progress) => {
          newRenderer.state.shakeProgress = progress;
        },
        onSqueezeProgress: (progress) => {
          newRenderer.state.squeezeProgress = progress;
        },
      });
      newInteraction.attach(canvas);
      interactionRef.current = newInteraction;
    });

    onNewCookie();
  }, [handleBreak, onNewCookie]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new CookieRenderer();
    const physics = createCookiePhysics(600, 500);
    rendererRef.current = renderer;
    physicsRef.current = physics;

    renderer.init(canvas).then(() => {
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
      });
      interaction.attach(canvas);
      interactionRef.current = interaction;

      // Animation loop
      const loop = () => {
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
      cancelAnimationFrame(animFrameRef.current);
      renderer.destroy();
      physics.destroy();
      interactionRef.current?.detach();
      window.removeEventListener("click", initSound);
      window.removeEventListener("touchstart", initSound);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-full max-w-[600px] mx-auto">
      <div
        ref={containerRef}
        className="cookie-canvas-container rounded-2xl overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at center, #2d1810 0%, #1a0e04 70%)",
          boxShadow: "0 0 60px rgba(212, 160, 74, 0.15), inset 0 0 60px rgba(0,0,0,0.3)",
        }}
      >
        <canvas ref={canvasRef} />
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
