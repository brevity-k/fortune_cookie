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
  dragVelocityX?: number;
  dragVelocityY?: number;
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
  private readonly DRAG_THRESHOLD = 40;
  private readonly CLICK_MAX_DURATION = 300;
  private readonly CLICK_MAX_MOVE = 15;

  // Device motion shake detection
  private readonly DEVICE_SHAKE_ACCEL_THRESHOLD = 18;
  private readonly DEVICE_SHAKE_ACCUMULATION = 2.5;
  private readonly DEVICE_SHAKE_DECAY = 0.4;
  private deviceMotionEnabled = false;
  private lastAccel = { x: 0, y: 0, z: 0 };
  private hasLastAccel = false;
  private deviceMotionHandler: ((e: DeviceMotionEvent) => void) | null = null;

  private lastClickTime = 0;
  private clickCount = 0;
  private clickTimeout: ReturnType<typeof setTimeout> | null = null;
  private squeezeInterval: ReturnType<typeof setInterval> | null = null;
  private onClickProgress: ((count: number) => void) | null = null;
  private onDragOffset: ((dx: number, dy: number) => void) | null = null;

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
    onClickProgress?: (count: number) => void;
    onDragOffset?: (dx: number, dy: number) => void;
  }) {
    this.onBreak = callbacks.onBreak;
    this.onHover = callbacks.onHover || null;
    this.onShakeProgress = callbacks.onShakeProgress || null;
    this.onSqueezeProgress = callbacks.onSqueezeProgress || null;
    this.onClickProgress = callbacks.onClickProgress || null;
    this.onDragOffset = callbacks.onDragOffset || null;
  }

  attach(element: HTMLElement) {
    this.element = element;
    element.addEventListener("pointerdown", this.handlePointerDown);
    element.addEventListener("pointermove", this.handlePointerMove);
    element.addEventListener("pointerup", this.handlePointerUp);
    element.addEventListener("pointerleave", this.handleMouseLeave);
  }

  enableDeviceMotion() {
    if (this.deviceMotionEnabled) return;
    this.deviceMotionEnabled = true;
    this.deviceMotionHandler = (e: DeviceMotionEvent) => {
      this.handleDeviceMotion(e);
    };
    window.addEventListener("devicemotion", this.deviceMotionHandler);
  }

  private handleDeviceMotion(e: DeviceMotionEvent) {
    if (this.broken) return;

    const accel = e.accelerationIncludingGravity;
    if (!accel || accel.x == null || accel.y == null || accel.z == null) return;

    if (!this.hasLastAccel) {
      this.lastAccel = { x: accel.x, y: accel.y, z: accel.z };
      this.hasLastAccel = true;
      return;
    }

    // Calculate jerk (change in acceleration) to detect shaking
    const dx = accel.x - this.lastAccel.x;
    const dy = accel.y - this.lastAccel.y;
    const dz = accel.z - this.lastAccel.z;
    const delta = Math.sqrt(dx * dx + dy * dy + dz * dz);

    this.lastAccel = { x: accel.x, y: accel.y, z: accel.z };

    if (delta > this.DEVICE_SHAKE_ACCEL_THRESHOLD) {
      this.mouse.shakeIntensity += this.DEVICE_SHAKE_ACCUMULATION;
    } else {
      this.mouse.shakeIntensity = Math.max(
        0,
        this.mouse.shakeIntensity - this.DEVICE_SHAKE_DECAY
      );
    }

    const progress = Math.min(1, this.mouse.shakeIntensity / this.SHAKE_THRESHOLD);
    this.onShakeProgress?.(progress);

    if (this.mouse.shakeIntensity >= this.SHAKE_THRESHOLD) {
      this.triggerBreak(
        "shake_break",
        this.cookieCenterX,
        this.cookieCenterY,
        0.9
      );
    }
  }

  detach() {
    this.stopSqueezeTimer();
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }
    if (this.element) {
      this.element.removeEventListener("pointerdown", this.handlePointerDown);
      this.element.removeEventListener("pointermove", this.handlePointerMove);
      this.element.removeEventListener("pointerup", this.handlePointerUp);
      this.element.removeEventListener("pointerleave", this.handleMouseLeave);
    }
    if (this.deviceMotionHandler) {
      window.removeEventListener("devicemotion", this.deviceMotionHandler);
      this.deviceMotionHandler = null;
      this.deviceMotionEnabled = false;
    }
  }

  reset() {
    this.broken = false;
    this.mouse.shakeIntensity = 0;
    this.mouse.isDown = false;
    this.mouse.dragDistance = 0;
    this.lastClickTime = 0;
    this.clickCount = 0;
    this.hasLastAccel = false;
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }
    this.stopSqueezeTimer();
    this.onShakeProgress?.(0);
    this.onSqueezeProgress?.(0);
    this.onClickProgress?.(0);
    this.onDragOffset?.(0, 0);
    this.onHover?.(0);
  }

  private isPointOverCookie(x: number, y: number): boolean {
    const dx = x - this.cookieCenterX;
    const dy = y - this.cookieCenterY;
    return Math.sqrt(dx * dx + dy * dy) <= this.cookieRadius * 1.2;
  }

  private getRelativePos(e: { clientX: number; clientY: number }): { x: number; y: number } {
    if (!this.element) return { x: 0, y: 0 };
    const rect = this.element.getBoundingClientRect();
    const scaleX = 600 / rect.width;
    const scaleY = 500 / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  private triggerBreak(
    method: BreakMethod,
    x: number,
    y: number,
    force: number,
    dragVelocityX?: number,
    dragVelocityY?: number
  ) {
    if (this.broken) return;
    this.broken = true;
    this.stopSqueezeTimer();
    this.onBreak?.({ method, x, y, force: Math.min(1, force), dragVelocityX, dragVelocityY });
  }

  private startSqueezeTimer() {
    this.stopSqueezeTimer();
    this.squeezeInterval = setInterval(() => {
      if (this.broken || !this.mouse.isDown) {
        this.stopSqueezeTimer();
        return;
      }
      // Cancel squeeze if user moved too much (it's a drag)
      if (this.mouse.dragDistance > this.CLICK_MAX_MOVE) {
        this.stopSqueezeTimer();
        this.onSqueezeProgress?.(0);
        return;
      }
      const holdDuration = Date.now() - this.mouse.downTime;
      const progress = Math.min(1, holdDuration / this.SQUEEZE_DURATION);
      this.onSqueezeProgress?.(progress);

      if (holdDuration >= this.SQUEEZE_DURATION) {
        this.triggerBreak("squeeze", this.mouse.downX, this.mouse.downY, 1.0);
      }
    }, 50);
  }

  private stopSqueezeTimer() {
    if (this.squeezeInterval) {
      clearInterval(this.squeezeInterval);
      this.squeezeInterval = null;
    }
  }

  private handlePointerDown = (e: PointerEvent) => {
    // Capture pointer so drag works even if cursor leaves the canvas
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
    e.preventDefault();

    const pos = this.getRelativePos(e);
    this.mouse.isDown = true;
    this.mouse.downTime = Date.now();
    this.mouse.downX = pos.x;
    this.mouse.downY = pos.y;
    this.mouse.dragDistance = 0;

    if (!this.isPointOverCookie(pos.x, pos.y)) return;
    if (this.broken) return;

    // Start squeeze timer (will be cancelled if user drags or releases quickly)
    this.startSqueezeTimer();
  };

  private handlePointerMove = (e: PointerEvent) => {
    const pos = this.getRelativePos(e);
    this.mouse.prevX = this.mouse.x;
    this.mouse.prevY = this.mouse.y;
    this.mouse.x = pos.x;
    this.mouse.y = pos.y;
    this.mouse.isOverCookie = this.isPointOverCookie(pos.x, pos.y);

    // Track velocity for shake detection
    const vx = pos.x - this.mouse.prevX;
    const vy = pos.y - this.mouse.prevY;
    const now = Date.now();
    this.mouse.velocityHistory.push({ vx, vy, time: now });
    this.mouse.velocityHistory = this.mouse.velocityHistory.filter(
      (v) => now - v.time < 300
    );

    if (this.broken) return;

    // Hover intensity
    if (this.mouse.isOverCookie && !this.mouse.isDown) {
      const dx = pos.x - this.cookieCenterX;
      const dy = pos.y - this.cookieCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const intensity = Math.max(0, 1 - dist / (this.cookieRadius * 1.2));
      this.onHover?.(intensity);
    } else if (!this.mouse.isDown) {
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
          this.mouse.shakeIntensity = Math.max(0, this.mouse.shakeIntensity - 0.3);
        }

        const progress = Math.min(1, this.mouse.shakeIntensity / this.SHAKE_THRESHOLD);
        this.onShakeProgress?.(progress);

        if (this.mouse.shakeIntensity >= this.SHAKE_THRESHOLD) {
          this.triggerBreak("shake_break", this.cookieCenterX, this.cookieCenterY, 0.9);
        }
      }
    }

    // Drag detection — move cookie visually while dragging
    if (this.mouse.isDown && this.isPointOverCookie(this.mouse.downX, this.mouse.downY)) {
      const dx = pos.x - this.mouse.downX;
      const dy = pos.y - this.mouse.downY;
      this.mouse.dragDistance = Math.sqrt(dx * dx + dy * dy);

      // Move cookie with pointer
      this.onDragOffset?.(dx, dy);

      if (this.mouse.dragDistance > this.DRAG_THRESHOLD) {
        // Calculate throw velocity from drag direction
        const dist = this.mouse.dragDistance || 1;
        const throwSpeed = Math.min(dist / this.DRAG_THRESHOLD, 3);
        const dvx = (dx / dist) * throwSpeed;
        const dvy = (dy / dist) * throwSpeed;
        this.triggerBreak("drag_crack", pos.x, pos.y, 0.7, dvx, dvy);
      }
    }
  };

  private handlePointerUp = () => {
    if (this.broken || !this.mouse.isDown) {
      this.mouse.isDown = false;
      this.stopSqueezeTimer();
      this.onSqueezeProgress?.(0);
      this.onDragOffset?.(0, 0);
      return;
    }

    const holdDuration = Date.now() - this.mouse.downTime;
    const wasOverCookie = this.isPointOverCookie(this.mouse.downX, this.mouse.downY);
    const clickX = this.mouse.downX;
    const clickY = this.mouse.downY;

    this.mouse.isDown = false;
    this.stopSqueezeTimer();
    this.onSqueezeProgress?.(0);
    // Snap cookie back if released without breaking
    this.onDragOffset?.(0, 0);

    // Only process clicks if it was on the cookie, quick, and didn't move much
    if (
      wasOverCookie &&
      holdDuration < this.CLICK_MAX_DURATION &&
      this.mouse.dragDistance < this.CLICK_MAX_MOVE
    ) {
      const now = Date.now();

      // Check for double-tap: two quick clicks close together → instant break
      if (now - this.lastClickTime < this.DOUBLE_TAP_WINDOW) {
        this.lastClickTime = 0;
        this.clickCount = 0;
        if (this.clickTimeout) {
          clearTimeout(this.clickTimeout);
          this.clickTimeout = null;
        }
        this.triggerBreak("double_tap", clickX, clickY, 0.8);
        return;
      }

      this.lastClickTime = now;

      // Clear any pending click timeout (from previous click waiting for double-tap check)
      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
        this.clickTimeout = null;
      }

      // Wait briefly to see if a second click is coming (double-tap)
      // If not, register as a single click toward the 3-click break
      this.clickTimeout = setTimeout(() => {
        this.clickTimeout = null;
        if (this.broken) return;

        this.clickCount++;
        this.onClickProgress?.(this.clickCount);

        if (this.clickCount >= 3) {
          this.clickCount = 0;
          this.triggerBreak("click_smash", clickX, clickY, 0.6);
        }
      }, this.DOUBLE_TAP_WINDOW + 50);
    }
  };

  private handleMouseLeave = () => {
    this.mouse.isDown = false;
    this.mouse.isOverCookie = false;
    this.mouse.shakeIntensity = 0;
    this.stopSqueezeTimer();
    this.onHover?.(0);
    this.onShakeProgress?.(0);
    this.onSqueezeProgress?.(0);
    this.onDragOffset?.(0, 0);
  };
}
