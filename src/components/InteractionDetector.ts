export type BreakMethod =
  | "click_smash"
  | "drag_crack"
  | "shake_break"
  | "double_tap"
  | "squeeze";

export interface BreakEvent {
  method: BreakMethod;
  x: number;
  y: number;
  force: number; // 0-1
}

interface MouseState {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  isDown: boolean;
  downTime: number;
  downX: number;
  downY: number;
  velocityHistory: { vx: number; vy: number; time: number }[];
  shakeIntensity: number;
  lastClickTime: number;
  isOverCookie: boolean;
  dragDistance: number;
}

export class InteractionDetector {
  private mouse: MouseState = {
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    isDown: false,
    downTime: 0,
    downX: 0,
    downY: 0,
    velocityHistory: [],
    shakeIntensity: 0,
    lastClickTime: 0,
    isOverCookie: false,
    dragDistance: 0,
  };

  private cookieCenterX = 0;
  private cookieCenterY = 0;
  private cookieRadius = 0;
  private onBreak: ((event: BreakEvent) => void) | null = null;
  private onHover: ((intensity: number) => void) | null = null;
  private onShakeProgress: ((progress: number) => void) | null = null;
  private onSqueezeProgress: ((progress: number) => void) | null = null;
  private broken = false;
  private element: HTMLElement | null = null;

  private readonly SHAKE_THRESHOLD = 40;
  private readonly SQUEEZE_DURATION = 2000;
  private readonly DOUBLE_TAP_WINDOW = 400;
  private readonly DRAG_THRESHOLD = 80;
  private firstTapDone = false;

  setCookieBounds(cx: number, cy: number, radius: number) {
    this.cookieCenterX = cx;
    this.cookieCenterY = cy;
    this.cookieRadius = radius;
  }

  setCallbacks(callbacks: {
    onBreak: (event: BreakEvent) => void;
    onHover?: (intensity: number) => void;
    onShakeProgress?: (progress: number) => void;
    onSqueezeProgress?: (progress: number) => void;
  }) {
    this.onBreak = callbacks.onBreak;
    this.onHover = callbacks.onHover || null;
    this.onShakeProgress = callbacks.onShakeProgress || null;
    this.onSqueezeProgress = callbacks.onSqueezeProgress || null;
  }

  attach(element: HTMLElement) {
    this.element = element;
    element.addEventListener("mousedown", this.handleMouseDown);
    element.addEventListener("mousemove", this.handleMouseMove);
    element.addEventListener("mouseup", this.handleMouseUp);
    element.addEventListener("mouseleave", this.handleMouseLeave);
    // Touch support
    element.addEventListener("touchstart", this.handleTouchStart, { passive: false });
    element.addEventListener("touchmove", this.handleTouchMove, { passive: false });
    element.addEventListener("touchend", this.handleTouchEnd);
  }

  detach() {
    if (this.element) {
      this.element.removeEventListener("mousedown", this.handleMouseDown);
      this.element.removeEventListener("mousemove", this.handleMouseMove);
      this.element.removeEventListener("mouseup", this.handleMouseUp);
      this.element.removeEventListener("mouseleave", this.handleMouseLeave);
      this.element.removeEventListener("touchstart", this.handleTouchStart);
      this.element.removeEventListener("touchmove", this.handleTouchMove);
      this.element.removeEventListener("touchend", this.handleTouchEnd);
    }
  }

  reset() {
    this.broken = false;
    this.mouse.shakeIntensity = 0;
    this.firstTapDone = false;
  }

  private isOverCookie(x: number, y: number): boolean {
    const dx = x - this.cookieCenterX;
    const dy = y - this.cookieCenterY;
    return Math.sqrt(dx * dx + dy * dy) <= this.cookieRadius;
  }

  private getRelativePos(e: MouseEvent | Touch): { x: number; y: number } {
    if (!this.element) return { x: 0, y: 0 };
    const rect = this.element.getBoundingClientRect();
    const scaleX = 600 / rect.width;
    const scaleY = 500 / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  private triggerBreak(method: BreakMethod, x: number, y: number, force: number) {
    if (this.broken) return;
    this.broken = true;
    this.onBreak?.({ method, x, y, force: Math.min(1, force) });
  }

  private handleMouseDown = (e: MouseEvent) => {
    const pos = this.getRelativePos(e);
    this.mouse.isDown = true;
    this.mouse.downTime = Date.now();
    this.mouse.downX = pos.x;
    this.mouse.downY = pos.y;
    this.mouse.dragDistance = 0;

    if (!this.isOverCookie(pos.x, pos.y)) return;

    // Double-tap detection
    const now = Date.now();
    if (this.firstTapDone && now - this.mouse.lastClickTime < this.DOUBLE_TAP_WINDOW) {
      this.triggerBreak("double_tap", pos.x, pos.y, 0.8);
      this.firstTapDone = false;
      return;
    }
    this.mouse.lastClickTime = now;
    this.firstTapDone = true;

    // Reset after double-tap window
    setTimeout(() => {
      if (this.firstTapDone && !this.broken && !this.mouse.isDown) {
        // Single click smash
        this.triggerBreak("click_smash", pos.x, pos.y, 0.6);
        this.firstTapDone = false;
      }
    }, this.DOUBLE_TAP_WINDOW + 50);
  };

  private handleMouseMove = (e: MouseEvent) => {
    const pos = this.getRelativePos(e);
    this.mouse.prevX = this.mouse.x;
    this.mouse.prevY = this.mouse.y;
    this.mouse.x = pos.x;
    this.mouse.y = pos.y;
    this.mouse.isOverCookie = this.isOverCookie(pos.x, pos.y);

    // Track velocity for shake detection
    const vx = pos.x - this.mouse.prevX;
    const vy = pos.y - this.mouse.prevY;
    const now = Date.now();
    this.mouse.velocityHistory.push({ vx, vy, time: now });
    // Keep only recent history (300ms)
    this.mouse.velocityHistory = this.mouse.velocityHistory.filter(
      (v) => now - v.time < 300
    );

    if (this.broken) return;

    // Hover intensity
    if (this.mouse.isOverCookie) {
      const dx = pos.x - this.cookieCenterX;
      const dy = pos.y - this.cookieCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const intensity = 1 - dist / this.cookieRadius;
      this.onHover?.(intensity);
    } else {
      this.onHover?.(0);
    }

    // Shake detection (mouse is over cookie, not pressed down)
    if (this.mouse.isOverCookie && !this.mouse.isDown) {
      const recentVels = this.mouse.velocityHistory;
      if (recentVels.length > 3) {
        let dirChanges = 0;
        for (let i = 1; i < recentVels.length; i++) {
          if (
            Math.sign(recentVels[i].vx) !== Math.sign(recentVels[i - 1].vx) ||
            Math.sign(recentVels[i].vy) !== Math.sign(recentVels[i - 1].vy)
          ) {
            dirChanges++;
          }
        }
        const speed = Math.sqrt(vx * vx + vy * vy);
        if (dirChanges > 3 && speed > 3) {
          this.mouse.shakeIntensity += 1.5;
        } else {
          this.mouse.shakeIntensity = Math.max(0, this.mouse.shakeIntensity - 0.5);
        }

        const progress = Math.min(1, this.mouse.shakeIntensity / this.SHAKE_THRESHOLD);
        this.onShakeProgress?.(progress);

        if (this.mouse.shakeIntensity >= this.SHAKE_THRESHOLD) {
          this.triggerBreak("shake_break", this.cookieCenterX, this.cookieCenterY, 0.9);
        }
      }
    }

    // Drag detection
    if (this.mouse.isDown && this.isOverCookie(this.mouse.downX, this.mouse.downY)) {
      const dx = pos.x - this.mouse.downX;
      const dy = pos.y - this.mouse.downY;
      this.mouse.dragDistance = Math.sqrt(dx * dx + dy * dy);

      if (this.mouse.dragDistance > this.DRAG_THRESHOLD) {
        this.triggerBreak("drag_crack", pos.x, pos.y, 0.7);
      }
    }

    // Squeeze detection (hold)
    if (this.mouse.isDown && this.mouse.isOverCookie) {
      const holdDuration = Date.now() - this.mouse.downTime;
      if (this.mouse.dragDistance < 20) {
        const progress = Math.min(1, holdDuration / this.SQUEEZE_DURATION);
        this.onSqueezeProgress?.(progress);
        if (holdDuration >= this.SQUEEZE_DURATION) {
          this.triggerBreak("squeeze", this.mouse.downX, this.mouse.downY, 1.0);
        }
      }
    }
  };

  private handleMouseUp = () => {
    this.mouse.isDown = false;
    this.mouse.dragDistance = 0;
    this.onSqueezeProgress?.(0);
  };

  private handleMouseLeave = () => {
    this.mouse.isDown = false;
    this.mouse.isOverCookie = false;
    this.mouse.shakeIntensity = 0;
    this.onHover?.(0);
    this.onShakeProgress?.(0);
    this.onSqueezeProgress?.(0);
  };

  // Touch handlers
  private handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    this.handleMouseDown({
      clientX: touch.clientX,
      clientY: touch.clientY,
    } as MouseEvent);
  };

  private handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    this.handleMouseMove({
      clientX: touch.clientX,
      clientY: touch.clientY,
    } as MouseEvent);
  };

  private handleTouchEnd = () => {
    this.handleMouseUp();
  };
}
