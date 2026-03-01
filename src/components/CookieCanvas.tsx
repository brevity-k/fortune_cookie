"use client";

import { useEffect, useRef, useCallback, useState, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { CookieRenderer } from "./CookieRenderer";
import Matter from "matter-js";
import { createCookiePhysics, CookiePhysicsWorld } from "./CookiePhysics";
import { InteractionDetector, BreakEvent } from "./InteractionDetector";
import { SoundManager } from "./SoundManager";

interface DeviceMotionEvtConstructor {
  requestPermission?: () => Promise<"granted" | "denied">;
}

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

const noopSubscribe = () => () => {};
const getIsMobile = () => isTouchDevice();
const getServerIsMobile = () => false;

async function requestDeviceMotionPermission(): Promise<boolean> {
  const DME = DeviceMotionEvent as unknown as DeviceMotionEvtConstructor;
  if (typeof DME.requestPermission === "function") {
    // iOS 13+ requires explicit permission from a user gesture
    try {
      const result = await DME.requestPermission();
      return result === "granted";
    } catch {
      return false;
    }
  }
  // Android and older iOS — permission not required
  return true;
}

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
  const motionEnabledRef = useRef(false);
  const [isBroken, setIsBroken] = useState(false);
  const [showNewButton, setShowNewButton] = useState(false);
  const [breakMethod, setBreakMethod] = useState<string>("");
  const [shakeProgress, setShakeProgress] = useState(0);
  const isMobile = useSyncExternalStore(noopSubscribe, getIsMobile, getServerIsMobile);

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

      // For drag_crack, use the dragged cookie position as the fragment origin
      const fragmentCX = renderer.cx + renderer.state.dragOffsetX;
      const fragmentCY = renderer.cy + renderer.state.dragOffsetY;

      // Create physics fragments at the cookie's current visual position
      const frags = physics.createFragments(
        fragmentCX,
        fragmentCY,
        renderer.radius,
        event.x,
        event.y,
        event.force
      );

      // For drag_crack, apply throw velocity to all fragments
      if (event.method === "drag_crack" && event.dragVelocityX != null && event.dragVelocityY != null) {
        for (const frag of frags) {
          const throwForce = {
            x: event.dragVelocityX * 0.04,
            y: event.dragVelocityY * 0.04 - 0.02,
          };
          Matter.Body.applyForce(frag.body, frag.body.position, throwForce);
        }
      }

      // Trigger visual break effect at the dragged position
      renderer.triggerBreakEffect(fragmentCX, fragmentCY, event.force);

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

    // Helper to enable device motion (called from multiple places)
    const tryEnableDeviceMotion = async () => {
      if (motionEnabledRef.current || !isTouchDevice()) return;
      if (!interactionRef.current) return;
      const granted = await requestDeviceMotionPermission();
      if (granted && interactionRef.current) {
        interactionRef.current.enableDeviceMotion();
        motionEnabledRef.current = true;
      }
    };

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
          setShakeProgress(progress);
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

      // Try enabling device motion now that interaction detector is ready
      tryEnableDeviceMotion();

      // Animation loop — check cancelled flag each frame
      const loop = () => {
        if (cancelled) return;
        physics.step();
        renderer.update(physics.fragments);
        animFrameRef.current = requestAnimationFrame(loop);
      };
      animFrameRef.current = requestAnimationFrame(loop);
    });

    // Initialize device motion and sound on first user interaction.
    // DeviceMotion permission MUST be requested first (before SoundManager)
    // because iOS requires it to be the first async call in a user gesture.
    const initOnInteraction = async () => {
      // Request device motion permission first — must be first in gesture handler
      await tryEnableDeviceMotion();

      // Sound init after permission (also gesture-gated but less strict)
      SoundManager.init();

      // Only remove listeners once device motion is enabled (or not a touch device)
      if (motionEnabledRef.current || !isTouchDevice()) {
        window.removeEventListener("click", initOnInteraction);
        window.removeEventListener("touchstart", initOnInteraction);
      }
    };
    window.addEventListener("click", initOnInteraction);
    window.addEventListener("touchstart", initOnInteraction);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animFrameRef.current);
      interactionRef.current?.detach();
      // Only destroy if init completed; otherwise the .then() callback handles it
      if (initialized) {
        renderer.destroy();
        physics.destroy();
      }
      window.removeEventListener("click", initOnInteraction);
      window.removeEventListener("touchstart", initOnInteraction);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-full max-w-[600px] mx-auto">
      <div
        ref={containerRef}
        className="cookie-canvas-container relative rounded-2xl overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at center, #1a1528 0%, #0f0b1a 70%)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.3), inset 0 0 40px rgba(212, 160, 74, 0.06)",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ touchAction: "none", cursor: "pointer" }}
        />

        {/* Shake progress bar (mobile only) */}
        {isMobile && !isBroken && shakeProgress > 0 && (
          <div
            className="pointer-events-none absolute top-4 left-4 right-4"
          >
            <div
              style={{
                height: 4,
                borderRadius: 2,
                backgroundColor: "rgba(212, 160, 74, 0.2)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${shakeProgress * 100}%`,
                  backgroundColor: "#d4a04a",
                  borderRadius: 2,
                  transition: "width 0.1s ease-out",
                }}
              />
            </div>
          </div>
        )}

        {/* Instruction text (HTML overlay) */}
        {!isBroken && (
          <div
            className="pointer-events-none absolute bottom-8 left-0 right-0 text-center animate-pulse"
            style={{ color: "#8b7fa8", fontSize: 14, opacity: 0.8 }}
          >
            {isMobile
              ? "Tap, drag, or shake your phone to break"
              : "Click, drag, or shake to break your cookie"}
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
                backgroundColor: "rgba(26, 21, 40, 0.95)",
                border: "1px solid rgba(212, 160, 74, 0.3)",
                maxWidth: 280,
              }}
            >
              <p style={{ color: "#e8e0f0", fontSize: 13, fontFamily: "Georgia, serif" }}>
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
