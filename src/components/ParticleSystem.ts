export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
}

const GOLD_COLORS = [
  "#f0d68a",
  "#d4a04a",
  "#ffd700",
  "#daa520",
  "#f5c842",
  "#e6b422",
  "#ffbf00",
  "#cf9f2c",
];

export class ParticleSystem {
  particles: Particle[] = [];

  emit(
    x: number,
    y: number,
    count: number,
    options?: {
      speedMin?: number;
      speedMax?: number;
      lifeMin?: number;
      lifeMax?: number;
      sizeMin?: number;
      sizeMax?: number;
      gravity?: number;
    }
  ) {
    const {
      speedMin = 2,
      speedMax = 8,
      lifeMin = 30,
      lifeMax = 80,
      sizeMin = 1,
      sizeMax = 4,
    } = options || {};

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = speedMin + Math.random() * (speedMax - speedMin);
      const life = lifeMin + Math.random() * (lifeMax - lifeMin);

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life,
        maxLife: life,
        size: sizeMin + Math.random() * (sizeMax - sizeMin),
        color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
  }

  emitAmbient(x: number, y: number, radius: number) {
    // Subtle floating particles around the cookie
    const angle = Math.random() * Math.PI * 2;
    const dist = radius * (0.5 + Math.random() * 0.8);
    const px = x + Math.cos(angle) * dist;
    const py = y + Math.sin(angle) * dist;

    this.particles.push({
      x: px,
      y: py,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.2 - Math.random() * 0.5,
      life: 60 + Math.random() * 60,
      maxLife: 60 + Math.random() * 60,
      size: 1 + Math.random() * 2,
      color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
      alpha: 0.3 + Math.random() * 0.3,
      rotation: 0,
      rotationSpeed: 0,
    });
  }

  update(gravity: number = 0.05) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += gravity;
      p.vx *= 0.99;
      p.life--;
      p.alpha = Math.max(0, p.life / p.maxLife);
      p.rotation += p.rotationSpeed;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  clear() {
    this.particles = [];
  }
}
