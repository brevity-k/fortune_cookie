import Matter from "matter-js";

export interface Fragment {
  body: Matter.Body;
  vertices: { x: number; y: number }[];
  color: string;
}

export interface CookiePhysicsWorld {
  engine: Matter.Engine;
  world: Matter.World;
  fragments: Fragment[];
  boundaries: Matter.Body[];
  runner: Matter.Runner;
  destroy: () => void;
  reset: () => void;
  createFragments: (
    cx: number,
    cy: number,
    radius: number,
    impactX: number,
    impactY: number,
    force: number
  ) => Fragment[];
  step: () => void;
}

const COOKIE_COLORS = [
  "#c4882f",
  "#d4973e",
  "#b87a28",
  "#daa04d",
  "#c99038",
  "#bf8530",
  "#d19940",
  "#b37025",
];

function generateVoronoiFragments(
  cx: number,
  cy: number,
  radius: number,
  count: number
): { x: number; y: number }[][] {
  // Generate seed points around the center
  const seeds: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const dist = radius * (0.2 + Math.random() * 0.6);
    seeds.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
    });
  }

  // Create wedge-like fragments radiating from center
  const fragments: { x: number; y: number }[][] = [];
  const angleStep = (Math.PI * 2) / count;

  for (let i = 0; i < count; i++) {
    const startAngle = angleStep * i + (Math.random() - 0.5) * 0.3;
    const endAngle = angleStep * (i + 1) + (Math.random() - 0.5) * 0.3;
    const midAngle = (startAngle + endAngle) / 2;

    const innerRadius = radius * (0.05 + Math.random() * 0.15);
    const outerRadius = radius * (0.75 + Math.random() * 0.25);
    const midOuterRadius = radius * (0.8 + Math.random() * 0.2);

    const verts = [
      { x: cx + Math.cos(startAngle) * innerRadius, y: cy + Math.sin(startAngle) * innerRadius },
      { x: cx + Math.cos(startAngle) * outerRadius, y: cy + Math.sin(startAngle) * outerRadius },
      { x: cx + Math.cos(midAngle) * midOuterRadius, y: cy + Math.sin(midAngle) * midOuterRadius },
      { x: cx + Math.cos(endAngle) * outerRadius, y: cy + Math.sin(endAngle) * outerRadius },
      { x: cx + Math.cos(endAngle) * innerRadius, y: cy + Math.sin(endAngle) * innerRadius },
    ];

    fragments.push(verts);
  }

  return fragments;
}

export function createCookiePhysics(
  canvasWidth: number,
  canvasHeight: number
): CookiePhysicsWorld {
  const engine = Matter.Engine.create({
    gravity: { x: 0, y: 1.5, scale: 0.001 },
  });
  const world = engine.world;
  const runner = Matter.Runner.create();

  // Create boundaries
  const wallThickness = 50;
  const boundaries = [
    // Floor
    Matter.Bodies.rectangle(
      canvasWidth / 2, canvasHeight + wallThickness / 2,
      canvasWidth + 100, wallThickness,
      { isStatic: true, restitution: 0.3, friction: 0.8 }
    ),
    // Left wall
    Matter.Bodies.rectangle(
      -wallThickness / 2, canvasHeight / 2,
      wallThickness, canvasHeight * 2,
      { isStatic: true, restitution: 0.3 }
    ),
    // Right wall
    Matter.Bodies.rectangle(
      canvasWidth + wallThickness / 2, canvasHeight / 2,
      wallThickness, canvasHeight * 2,
      { isStatic: true, restitution: 0.3 }
    ),
  ];
  Matter.Composite.add(world, boundaries);

  const fragments: Fragment[] = [];

  function createFragments(
    cx: number,
    cy: number,
    radius: number,
    impactX: number,
    impactY: number,
    force: number
  ): Fragment[] {
    const fragCount = 8 + Math.floor(Math.random() * 5); // 8-12 fragments
    const voronoiShapes = generateVoronoiFragments(cx, cy, radius, fragCount);

    const newFragments: Fragment[] = [];

    for (let i = 0; i < voronoiShapes.length; i++) {
      const verts = voronoiShapes[i];

      // Calculate centroid
      let centroidX = 0;
      let centroidY = 0;
      for (const v of verts) {
        centroidX += v.x;
        centroidY += v.y;
      }
      centroidX /= verts.length;
      centroidY /= verts.length;

      // Create body at centroid with local vertices
      const localVerts = verts.map((v) => ({
        x: v.x - centroidX,
        y: v.y - centroidY,
      }));

      try {
        const body = Matter.Bodies.fromVertices(centroidX, centroidY, [localVerts], {
          restitution: 0.4,
          friction: 0.6,
          density: 0.002,
          frictionAir: 0.01,
        });

        if (body) {
          // Apply explosive force away from impact point
          const dx = centroidX - impactX;
          const dy = centroidY - impactY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const forceMag = force * (1 + Math.random() * 0.5);
          const fx = (dx / dist) * forceMag * 0.05;
          const fy = (dy / dist) * forceMag * 0.05 - 0.03 * force;

          Matter.Body.applyForce(body, body.position, { x: fx, y: fy });
          Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.3);

          Matter.Composite.add(world, body);

          const fragment: Fragment = {
            body,
            vertices: verts,
            color: COOKIE_COLORS[i % COOKIE_COLORS.length],
          };
          newFragments.push(fragment);
          fragments.push(fragment);
        }
      } catch {
        // Skip invalid fragment shapes
      }
    }

    return newFragments;
  }

  function step() {
    Matter.Engine.update(engine, 1000 / 60);
  }

  function reset() {
    // Remove fragment bodies from the world, keep boundaries
    for (const frag of fragments) {
      Matter.World.remove(world, frag.body);
    }
    fragments.length = 0;
  }

  function destroy() {
    Matter.Runner.stop(runner);
    Matter.World.clear(world, false);
    Matter.Engine.clear(engine);
  }

  return {
    engine,
    world,
    fragments,
    boundaries,
    runner,
    destroy,
    reset,
    createFragments,
    step,
  };
}
