"use client";

import { useState } from "react";
import type { SajuChart, Element } from "@/lib/saju/types";

interface AiInterpretation {
  overall: string;
  career: string;
  love: string;
  health: string;
  advice: string;
  luckyElement: string;
  luckyColor: string;
}

const CACHE_KEY = "saju_interpretation";

function getCachedInterpretation(): AiInterpretation | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    const cached = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    if (cached.date === today) return cached.data;
    return null;
  } catch {
    return null;
  }
}

function cacheInterpretation(data: AiInterpretation) {
  if (typeof window === "undefined") return;
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem(CACHE_KEY, JSON.stringify({ date: today, data }));
}

const ELEMENT_TRAITS: Record<Element, { personality: string; career: string; love: string; health: string }> = {
  wood: {
    personality: "You have a growth-oriented nature with strong creativity and flexibility. Like a tree, you are rooted yet adaptable, always reaching upward toward new possibilities.",
    career: "You thrive in roles that involve growth, innovation, and nurturing others. Education, creative arts, and entrepreneurship align well with your energy.",
    love: "You are warm and generous in relationships, valuing emotional growth and mutual support. You seek a partner who grows alongside you.",
    health: "Pay attention to your liver and eyes. Regular stretching and time in nature help maintain your vitality.",
  },
  fire: {
    personality: "You are passionate, charismatic, and action-driven. Your warmth draws people in, and your enthusiasm lights up any room you enter.",
    career: "Leadership, performance, marketing, and any field requiring vision and persuasion suit your fiery nature. You excel when inspiring others.",
    love: "You love intensely and expressively. You need excitement and admiration in relationships but should be mindful of burning too brightly.",
    health: "Watch your heart and circulation. Avoid excessive stress and make time for cooling, restorative practices.",
  },
  earth: {
    personality: "You are dependable, nurturing, and grounded. Others naturally trust and rely on you. You bring stability to every situation.",
    career: "Real estate, agriculture, management, and caregiving roles suit your steady nature. You excel in building lasting foundations.",
    love: "You are loyal and devoted in love, seeking security and long-term commitment. You may need to guard against being overly possessive.",
    health: "Digestive health is your focus area. Maintain regular eating habits and avoid excessive worry, which weakens your earth energy.",
  },
  metal: {
    personality: "You are precise, disciplined, and principled. Like refined metal, you value clarity, structure, and justice in all things.",
    career: "Law, finance, engineering, and technology align with your sharp analytical mind. You excel in structured environments with clear standards.",
    love: "You are loyal but can be reserved in expressing emotions. Finding a partner who appreciates your depth and integrity is key.",
    health: "Lungs and respiratory health deserve attention. Breathing exercises and clean air environments support your wellbeing.",
  },
  water: {
    personality: "You are wise, intuitive, and adaptable. Like water, you find your way around obstacles and see beneath the surface of things.",
    career: "Research, philosophy, diplomacy, and creative writing suit your reflective nature. You excel in roles requiring deep thinking and flexibility.",
    love: "You connect emotionally on a deep level and value intellectual intimacy. You may need to balance your desire for independence with closeness.",
    health: "Kidneys and bladder are your focus areas. Stay hydrated and be mindful of fear and anxiety, which can deplete your water energy.",
  },
};

const STRENGTH_SUMMARY = {
  strong: "Your Day Master is strong, meaning your core element is well-supported in your chart. You have natural resilience and self-confidence. The key to balance is channeling your abundant energy outward through action and generosity.",
  weak: "Your Day Master is on the weaker side, meaning your core element needs support. You may benefit from surrounding yourself with people and environments that strengthen your element. Collaboration and strategic timing are your greatest assets.",
};

const AI_SECTIONS: { key: keyof AiInterpretation; label: string; icon: string }[] = [
  { key: "overall", label: "Overall Fortune", icon: "\u2728" },
  { key: "career", label: "Career Outlook", icon: "\uD83D\uDCBC" },
  { key: "love", label: "Love & Relationships", icon: "\uD83D\uDC95" },
  { key: "health", label: "Health", icon: "\uD83C\uDF3F" },
  { key: "advice", label: "Practical Advice", icon: "\uD83D\uDCA1" },
];

const ELEMENT_COLORS: Record<Element, string> = {
  wood: "#4ade80",
  fire: "#f87171",
  earth: "#fbbf24",
  metal: "#e2e8f0",
  water: "#60a5fa",
};

interface Props {
  chart: SajuChart;
}

export default function SajuInterpretation({ chart }: Props) {
  const [aiInterpretation, setAiInterpretation] = useState<AiInterpretation | null>(getCachedInterpretation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { dayMaster, isStrong, favorableElement } = chart.fiveElements;
  const traits = ELEMENT_TRAITS[dayMaster];

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/saju-interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fourPillars: chart.fourPillars,
          fiveElements: chart.fiveElements,
          birthInfo: chart.birthInfo,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to get interpretation.");
      }

      const data = await res.json();
      setAiInterpretation(data);
      cacheInterpretation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // AI interpretation (generated on demand)
  if (aiInterpretation) {
    return (
      <div className="rounded-2xl border border-border bg-background p-6">
        <h3 className="mb-4 text-lg font-semibold text-gold">AI Interpretation</h3>
        <div className="space-y-4">
          {AI_SECTIONS.map(({ key, label, icon }) => {
            const text = aiInterpretation[key];
            if (!text) return null;
            return (
              <div key={key} className="rounded-xl border border-border/20 bg-white/3 p-4">
                <div className="mb-1 text-sm font-medium text-gold/70">
                  {icon} {label}
                </div>
                <p className="text-sm text-foreground/60 leading-relaxed">{text}</p>
              </div>
            );
          })}
        </div>
        {aiInterpretation.luckyElement && (
          <p className="mt-4 text-center text-xs text-foreground/30">
            Lucky Element: <span className="capitalize text-gold/50">{aiInterpretation.luckyElement}</span>
            {aiInterpretation.luckyColor && (
              <> &middot; Lucky Color: <span className="text-gold/50">{aiInterpretation.luckyColor}</span></>
            )}
          </p>
        )}
      </div>
    );
  }

  // Basic interpretation (always shown from chart data)
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h3 className="mb-4 text-lg font-semibold text-gold">Chart Interpretation</h3>

      {/* Day Master summary */}
      <div className="mb-4 rounded-xl border border-border/20 bg-white/3 p-4">
        <div className="mb-1 flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: ELEMENT_COLORS[dayMaster] }}
          />
          <span className="text-sm font-medium text-gold/70 capitalize">
            {dayMaster} Day Master ({isStrong ? "Strong" : "Weak"})
          </span>
        </div>
        <p className="text-sm text-foreground/60 leading-relaxed">
          {isStrong ? STRENGTH_SUMMARY.strong : STRENGTH_SUMMARY.weak}
        </p>
        <p className="mt-2 text-xs text-foreground/40">
          Favorable element: <span className="capitalize text-gold/50">{favorableElement}</span>
        </p>
      </div>

      {/* Trait sections */}
      <div className="space-y-4">
        {[
          { label: "Personality", icon: "\u2728", text: traits.personality },
          { label: "Career", icon: "\uD83D\uDCBC", text: traits.career },
          { label: "Love & Relationships", icon: "\uD83D\uDC95", text: traits.love },
          { label: "Health", icon: "\uD83C\uDF3F", text: traits.health },
        ].map(({ label, icon, text }) => (
          <div key={label} className="rounded-xl border border-border/20 bg-white/3 p-4">
            <div className="mb-1 text-sm font-medium text-gold/70">
              {icon} {label}
            </div>
            <p className="text-sm text-foreground/60 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {/* AI upgrade button */}
      <div className="mt-6 text-center">
        {loading ? (
          <div className="space-y-3">
            {AI_SECTIONS.map(({ key }) => (
              <div key={key} className="animate-pulse">
                <div className="h-4 w-32 rounded bg-white/5 mb-2 mx-auto" />
                <div className="h-3 w-full rounded bg-white/5 mb-1" />
                <div className="h-3 w-3/4 rounded bg-white/5 mx-auto" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-foreground/40 mb-2">{error}</p>
        ) : (
          <>
            <p className="mb-3 text-xs text-foreground/30">
              Want a deeper, personalized reading?
            </p>
            <button
              onClick={handleGenerate}
              className="rounded-full bg-gold px-6 py-2 text-sm font-medium text-background hover:bg-gold/90 transition"
            >
              Generate AI Interpretation
            </button>
          </>
        )}
      </div>
    </div>
  );
}
