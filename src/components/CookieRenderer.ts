import { Application, Graphics, Container, Text, TextStyle } from "pixi.js";
import { Fragment } from "./CookiePhysics";
import { ParticleSystem } from "./ParticleSystem";

export interface CookieRendererState {
  phase: "idle" | "hover" | "breaking" | "reveal";
  hoverIntensity: number;
  shakeProgress: number;
  squeezeProgress: number;
  breathScale: number;
  cookieAlpha: number;
}

export class CookieRenderer {
  private app: Application | null = null;
  private cookieContainer: Container | null = null;
  private cookieGraphics: Graphics | null = null;
  private crackGraphics: Graphics | null = null;
  private fragmentContainer: Container | null = null;
  private particleGraphics: Graphics | null = null;
  private fortunePaperGraphics: Graphics | null = null;
  private instructionText: Text | null = null;

  private particleSystem = new ParticleSystem();
  private width = 600;
  private height = 500;
  private cookieCX = 300;
  private cookieCY = 230;
  private cookieRadius = 90;
  private breathTimer = 0;
  private ambientTimer = 0;

  state: CookieRendererState = {
    phase: "idle",
    hoverIntensity: 0,
    shakeProgress: 0,
    squeezeProgress: 0,
    breathScale: 1,
    cookieAlpha: 1,
  };

  get cx() { return this.cookieCX; }
  get cy() { return this.cookieCY; }
  get radius() { return this.cookieRadius; }

  async init(canvas: HTMLCanvasElement): Promise<Application> {
    this.app = new Application();
    await this.app.init({
      canvas,
      width: this.width,
      height: this.height,
      backgroundAlpha: 0,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio, 2),
      autoDensity: true,
    });

    this.setupScene();
    return this.app;
  }

  private setupScene() {
    if (!this.app) return;

    // Background gradient
    const bg = new Graphics();
    bg.roundRect(0, 0, this.width, this.height, 16);
    bg.fill({ color: 0x1a0e04, alpha: 0.6 });
    this.app.stage.addChild(bg);

    // Ambient glow behind cookie
    const glow = new Graphics();
    glow.circle(this.cookieCX, this.cookieCY, this.cookieRadius * 2);
    glow.fill({ color: 0xd4a04a, alpha: 0.08 });
    this.app.stage.addChild(glow);

    // Cookie container (for transforms)
    this.cookieContainer = new Container();
    this.cookieContainer.x = this.cookieCX;
    this.cookieContainer.y = this.cookieCY;
    this.app.stage.addChild(this.cookieContainer);

    // Main cookie shape
    this.cookieGraphics = new Graphics();
    this.drawCookie();
    this.cookieContainer.addChild(this.cookieGraphics);

    // Crack overlay
    this.crackGraphics = new Graphics();
    this.cookieContainer.addChild(this.crackGraphics);

    // Fragment container (for broken pieces)
    this.fragmentContainer = new Container();
    this.app.stage.addChild(this.fragmentContainer);

    // Particle layer
    this.particleGraphics = new Graphics();
    this.app.stage.addChild(this.particleGraphics);

    // Fortune paper (hidden initially)
    this.fortunePaperGraphics = new Graphics();
    this.fortunePaperGraphics.alpha = 0;
    this.app.stage.addChild(this.fortunePaperGraphics);

    // Instruction text
    const style = new TextStyle({
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 14,
      fill: "#d4a04a",
      align: "center",
      fontWeight: "400",
    });
    this.instructionText = new Text({
      text: "Click, drag, or shake to break your cookie",
      style,
    });
    this.instructionText.anchor.set(0.5);
    this.instructionText.x = this.cookieCX;
    this.instructionText.y = this.height - 50;
    this.instructionText.alpha = 0.6;
    this.app.stage.addChild(this.instructionText);
  }

  private drawCookie() {
    if (!this.cookieGraphics) return;
    this.cookieGraphics.clear();

    const r = this.cookieRadius;

    // Cookie shadow
    this.cookieGraphics.ellipse(4, 6, r + 5, r * 0.35 + 3);
    this.cookieGraphics.fill({ color: 0x000000, alpha: 0.2 });

    // Main cookie body - fortune cookie shape (crescent/folded shape)
    this.drawFortuneCookieShape(this.cookieGraphics, 0, 0, r);
  }

  private drawFortuneCookieShape(g: Graphics, cx: number, cy: number, r: number) {
    // Fortune cookie shape: two curved halves meeting in the middle
    const w = r * 2;
    const h = r * 0.8;

    // Bottom half
    g.moveTo(cx - w * 0.5, cy);
    g.quadraticCurveTo(cx - w * 0.3, cy + h * 0.9, cx, cy + h * 0.15);
    g.quadraticCurveTo(cx + w * 0.3, cy + h * 0.9, cx + w * 0.5, cy);
    g.quadraticCurveTo(cx + w * 0.3, cy - h * 0.1, cx, cy + h * 0.05);
    g.quadraticCurveTo(cx - w * 0.3, cy - h * 0.1, cx - w * 0.5, cy);
    g.fill({ color: 0xd4973e });

    // Top half
    g.moveTo(cx - w * 0.5, cy);
    g.quadraticCurveTo(cx - w * 0.3, cy - h * 0.9, cx, cy - h * 0.15);
    g.quadraticCurveTo(cx + w * 0.3, cy - h * 0.9, cx + w * 0.5, cy);
    g.quadraticCurveTo(cx + w * 0.3, cy + h * 0.1, cx, cy - h * 0.05);
    g.quadraticCurveTo(cx - w * 0.3, cy + h * 0.1, cx - w * 0.5, cy);
    g.fill({ color: 0xc4882f });

    // Center fold line
    g.moveTo(cx - w * 0.45, cy);
    g.quadraticCurveTo(cx, cy + h * 0.08, cx + w * 0.45, cy);
    g.stroke({ width: 2, color: 0xb37025, alpha: 0.6 });

    // Highlight on top
    g.moveTo(cx - w * 0.3, cy - h * 0.35);
    g.quadraticCurveTo(cx, cy - h * 0.55, cx + w * 0.3, cy - h * 0.35);
    g.stroke({ width: 3, color: 0xf0d68a, alpha: 0.25 });

    // Subtle texture lines
    for (let i = 0; i < 5; i++) {
      const offsetX = (Math.random() - 0.5) * w * 0.6;
      const offsetY = (Math.random() - 0.5) * h * 0.4;
      g.moveTo(cx + offsetX - 5, cy + offsetY);
      g.lineTo(cx + offsetX + 5, cy + offsetY);
      g.stroke({ width: 1, color: 0xb87a28, alpha: 0.15 });
    }
  }

  update(fragments: Fragment[]) {
    this.breathTimer += 0.02;
    this.ambientTimer++;

    if (this.state.phase === "idle" || this.state.phase === "hover") {
      this.updateIdle();
    }

    this.updateFragments(fragments);
    this.updateParticles();
    this.updateCracks();
  }

  private updateIdle() {
    if (!this.cookieContainer) return;

    // Breathing animation
    const breathScale = 1 + Math.sin(this.breathTimer) * 0.015;
    const squeezeScale = 1 - this.state.squeezeProgress * 0.15;
    const hoverScale = 1 + this.state.hoverIntensity * 0.03;
    const totalScale = breathScale * squeezeScale * hoverScale;

    this.cookieContainer.scale.set(totalScale);

    // Shake effect
    if (this.state.shakeProgress > 0) {
      const shakeAmount = this.state.shakeProgress * 5;
      this.cookieContainer.x = this.cookieCX + (Math.random() - 0.5) * shakeAmount;
      this.cookieContainer.y = this.cookieCY + (Math.random() - 0.5) * shakeAmount;
    } else {
      this.cookieContainer.x = this.cookieCX;
      this.cookieContainer.y = this.cookieCY;
    }

    // Ambient particles
    if (this.ambientTimer % 8 === 0) {
      this.particleSystem.emitAmbient(this.cookieCX, this.cookieCY, this.cookieRadius);
    }

    // Instruction text pulsing
    if (this.instructionText) {
      this.instructionText.alpha = 0.4 + Math.sin(this.breathTimer * 0.7) * 0.2;
    }
  }

  private updateCracks() {
    if (!this.crackGraphics) return;
    this.crackGraphics.clear();

    // Show crack lines based on hover intensity or squeeze progress
    const intensity = Math.max(this.state.hoverIntensity, this.state.squeezeProgress, this.state.shakeProgress);
    if (intensity > 0.2 && this.state.phase !== "breaking" && this.state.phase !== "reveal") {
      const numCracks = Math.floor(intensity * 4);
      for (let i = 0; i < numCracks; i++) {
        const angle = (Math.PI * 2 * i) / numCracks + this.breathTimer;
        const len = intensity * this.cookieRadius * 0.6;
        this.crackGraphics.moveTo(0, 0);
        this.crackGraphics.lineTo(
          Math.cos(angle) * len,
          Math.sin(angle) * len
        );
        this.crackGraphics.stroke({ width: 1.5, color: 0x8b6914, alpha: intensity * 0.5 });
      }
    }
  }

  triggerBreakEffect(impactX: number, impactY: number, force: number) {
    this.state.phase = "breaking";

    // Hide cookie
    if (this.cookieContainer) {
      this.cookieContainer.alpha = 0;
    }

    // Hide instruction text
    if (this.instructionText) {
      this.instructionText.alpha = 0;
    }

    // Particle burst
    this.particleSystem.emit(impactX, impactY, Math.floor(60 + force * 40), {
      speedMin: 3,
      speedMax: 10 * force,
      lifeMin: 40,
      lifeMax: 100,
      sizeMin: 1,
      sizeMax: 5,
    });

    // Additional crumb particles
    this.particleSystem.emit(impactX, impactY, 30, {
      speedMin: 1,
      speedMax: 5,
      lifeMin: 20,
      lifeMax: 50,
      sizeMin: 0.5,
      sizeMax: 2,
    });
  }

  private updateFragments(fragments: Fragment[]) {
    if (!this.fragmentContainer) return;
    this.fragmentContainer.removeChildren();

    for (const frag of fragments) {
      const g = new Graphics();
      const verts = frag.body.vertices;

      if (verts.length > 0) {
        g.moveTo(verts[0].x, verts[0].y);
        for (let i = 1; i < verts.length; i++) {
          g.lineTo(verts[i].x, verts[i].y);
        }
        g.closePath();
        g.fill({ color: frag.color });
        g.stroke({ width: 1, color: 0x8b6914, alpha: 0.5 });
      }

      this.fragmentContainer.addChild(g);
    }
  }

  private updateParticles() {
    this.particleSystem.update(0.04);

    if (!this.particleGraphics) return;
    this.particleGraphics.clear();

    for (const p of this.particleSystem.particles) {
      this.particleGraphics.circle(p.x, p.y, p.size);
      this.particleGraphics.fill({ color: p.color, alpha: p.alpha });
    }
  }

  showFortunePaper(text: string, onComplete: () => void) {
    if (!this.fortunePaperGraphics) return;

    this.state.phase = "reveal";
    const g = this.fortunePaperGraphics;
    g.clear();

    const paperW = 280;
    const paperH = 50;
    const paperX = this.cookieCX - paperW / 2;
    const paperY = this.cookieCY - paperH / 2;

    // Paper background
    g.roundRect(paperX, paperY, paperW, paperH, 4);
    g.fill({ color: 0xf5e6c8 });
    g.stroke({ width: 1, color: 0xd4a04a, alpha: 0.3 });

    // Fortune text on paper
    const style = new TextStyle({
      fontFamily: "Georgia, serif",
      fontSize: 13,
      fill: "#4a3520",
      align: "center",
      wordWrap: true,
      wordWrapWidth: paperW - 30,
    });
    const fortuneText = new Text({ text, style });
    fortuneText.anchor.set(0.5);
    fortuneText.x = this.cookieCX;
    fortuneText.y = this.cookieCY;

    // Animate in
    g.alpha = 0;
    g.y = 30;
    g.addChild(fortuneText);

    // Simple animation with requestAnimationFrame
    let frame = 0;
    const animate = () => {
      frame++;
      const progress = Math.min(1, frame / 40);
      const eased = 1 - Math.pow(1 - progress, 3);
      g.alpha = eased;
      g.y = 30 * (1 - eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };
    requestAnimationFrame(animate);
  }

  destroy() {
    this.particleSystem.clear();
    this.app?.destroy(true);
    this.app = null;
  }
}
