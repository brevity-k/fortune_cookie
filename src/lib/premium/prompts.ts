export type FortuneTrack = 'saju' | 'astro';
export type FortuneCategory = 'daily' | 'love' | 'career' | 'health' | 'monthly';

export const FORTUNE_CATEGORY_LABELS: Record<FortuneCategory, string> = {
  daily: 'Daily Overview',
  love: 'Love & Relationships',
  career: 'Career & Money',
  health: 'Health & Wellness',
  monthly: 'Monthly Outlook',
};

function sanitizeContent(text: string): string {
  // Truncate and strip control characters to reduce prompt injection surface
  return text.slice(0, 500).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

function summarizeContext(entries: { content: string; context_type: string; created_at: string }[]): string {
  if (entries.length === 0) return '(No information shared by the user)';

  // Limit to 10 most recent entries and sanitize each
  const limited = entries.slice(0, 10);
  const lines = limited.map((e) => {
    const date = new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `- [${date}] ${sanitizeContent(e.content)}`;
  });
  return lines.join('\n');
}

export function buildSajuFortunePrompt(
  chartDescription: string,
  category: FortuneCategory,
  contextEntries: { content: string; context_type: string; created_at: string }[],
  currentDate: string,
): { system: string; user: string } {
  const contextSummary = summarizeContext(contextEntries);
  const categoryLabel = FORTUNE_CATEGORY_LABELS[category];

  const system = `You are an expert in Korean 사주 (Four Pillars of Destiny) fortune reading.
Based on the user's birth chart and current luck cycles, deliver a personalized fortune.

[Birth Chart Data]
${chartDescription}

[Current Date]
${currentDate}

[What we know about the user]
${contextSummary}

Rules:
- Write as if reading a fortune — warm, flowing, natural tone
- Weave the user's situation into the fortune naturally, never reference it directly
- Use suggestive language ("energies are flowing...", "this is a time for...") not directives
- Reference saju concepts naturally but accessibly
- English only

Respond in this exact JSON format:
{
  "title": "Fortune title (5-8 words)",
  "content": "Fortune body (200-400 chars)",
  "luckyElement": "wood|fire|earth|metal|water",
  "intensity": 1-5 integer (1=caution, 5=excellent)
}`;

  const user = `Please read today's ${categoryLabel} fortune.`;

  return { system, user };
}

export function buildAstroFortunePrompt(
  chartDescription: string,
  category: FortuneCategory,
  contextEntries: { content: string; context_type: string; created_at: string }[],
  currentDate: string,
): { system: string; user: string } {
  const contextSummary = summarizeContext(contextEntries);
  const categoryLabel = FORTUNE_CATEGORY_LABELS[category];

  const system = `You are an expert in Western astrology fortune reading.
Based on the user's natal chart and current planetary transits, deliver a personalized fortune.

[Natal Chart Data]
${chartDescription}

[Current Date]
${currentDate}

[What we know about the user]
${contextSummary}

Rules:
- Write as if reading a fortune — warm, flowing, natural tone
- Weave the user's situation into the fortune naturally, never reference it directly
- Use suggestive language ("energies are flowing...", "this is a time for...") not directives
- Reference astrology concepts naturally but accessibly
- English only

Respond in this exact JSON format:
{
  "title": "Fortune title (5-8 words)",
  "content": "Fortune body (200-400 chars)",
  "luckyPlanet": "A planet name (e.g., Venus, Jupiter)",
  "intensity": 1-5 integer (1=caution, 5=excellent)
}`;

  const user = `Please read today's ${categoryLabel} fortune.`;

  return { system, user };
}
