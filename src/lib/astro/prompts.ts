import type { NatalChart } from './types';
import { formatChart } from './format';

export function buildInterpretationPrompt(chart: NatalChart): string {
  const formatted = formatChart(chart);

  const sun = formatted.planets.find((p) => p.planet === 'Sun');
  const moon = formatted.planets.find((p) => p.planet === 'Moon');
  const mercury = formatted.planets.find((p) => p.planet === 'Mercury');
  const venus = formatted.planets.find((p) => p.planet === 'Venus');
  const mars = formatted.planets.find((p) => p.planet === 'Mars');
  const asc = formatted.ascendant;
  const mc = formatted.midheaven;

  return `You are a Western astrologer interpreting a natal chart. Write a warm, insightful personality reading based on the chart data below.

Sun: ${sun?.sign} ${sun?.degree} (House ${sun?.house})${sun?.retrograde ? ' R' : ''}
Moon: ${moon?.sign} ${moon?.degree} (House ${moon?.house})${moon?.retrograde ? ' R' : ''}
Ascendant: ${asc.sign} ${asc.degree}
Mercury: ${mercury?.sign} ${mercury?.degree} (House ${mercury?.house})${mercury?.retrograde ? ' R' : ''}
Venus: ${venus?.sign} ${venus?.degree} (House ${venus?.house})${venus?.retrograde ? ' R' : ''}
Mars: ${mars?.sign} ${mars?.degree} (House ${mars?.house})${mars?.retrograde ? ' R' : ''}
Midheaven: ${mc.sign} ${mc.degree}

Element Balance: Fire ${chart.elements.fire}, Earth ${chart.elements.earth}, Air ${chart.elements.air}, Water ${chart.elements.water}
Modality Balance: Cardinal ${chart.modalities.cardinal}, Fixed ${chart.modalities.fixed}, Mutable ${chart.modalities.mutable}

Write 2-3 sentences per section. No jargon — explain concepts in plain English. Be warm and encouraging while staying grounded in the chart data.

Respond in JSON:
{
  "personality": "...",
  "emotions": "...",
  "communication": "...",
  "love": "...",
  "ambition": "...",
  "career": "...",
  "balance": "..."
}`;
}

export function buildDailyTransitPrompt(chart: NatalChart, transitData: string): string {
  const formatted = formatChart(chart);

  const sun = formatted.planets.find((p) => p.planet === 'Sun');
  const moon = formatted.planets.find((p) => p.planet === 'Moon');
  const asc = formatted.ascendant;

  return `You are a Western astrologer providing a daily transit reading. Based on the user's natal chart and today's planetary transits, write a personalized daily reading.

Natal Sun: ${sun?.sign} ${sun?.degree}
Natal Moon: ${moon?.sign} ${moon?.degree}
Natal Ascendant: ${asc.sign} ${asc.degree}

Today's Transits:
${transitData}

Explain how today's transits interact with the natal chart. Cover:
1. Overall energy for today (2-3 sentences)
2. Relationships (1-2 sentences)
3. Career (1-2 sentences)
4. One specific actionable tip

Be warm, specific, and reference the actual planetary positions. Respond in JSON:
{
  "energy": "...",
  "relationships": "...",
  "career": "...",
  "tip": "..."
}`;
}

export function buildMonthlyForecastPrompt(chart: NatalChart, transitData: string): string {
  const formatted = formatChart(chart);

  const sun = formatted.planets.find((p) => p.planet === 'Sun');
  const moon = formatted.planets.find((p) => p.planet === 'Moon');
  const venus = formatted.planets.find((p) => p.planet === 'Venus');
  const mars = formatted.planets.find((p) => p.planet === 'Mars');
  const asc = formatted.ascendant;
  const mc = formatted.midheaven;

  return `You are a Western astrologer writing a monthly forecast. Based on the user's natal chart and this month's major planetary transits, write a detailed monthly reading.

Natal Sun: ${sun?.sign} ${sun?.degree}
Natal Moon: ${moon?.sign} ${moon?.degree}
Natal Venus: ${venus?.sign} ${venus?.degree}
Natal Mars: ${mars?.sign} ${mars?.degree}
Natal Ascendant: ${asc.sign} ${asc.degree}
Natal Midheaven: ${mc.sign} ${mc.degree}

Element Balance: Fire ${chart.elements.fire}, Earth ${chart.elements.earth}, Air ${chart.elements.air}, Water ${chart.elements.water}

This Month's Transits:
${transitData}

Write a detailed monthly reading covering:
1. Overall theme (2-3 sentences)
2. Career opportunities and cautions (2-3 sentences)
3. Love and relationships (2-3 sentences)
4. Health focus (1-2 sentences)
5. Key dates or periods to watch (1-2 sentences)
6. Practical monthly advice (1-2 sentences)

Respond in JSON:
{
  "theme": "...",
  "career": "...",
  "love": "...",
  "health": "...",
  "keyDates": "...",
  "advice": "..."
}`;
}

export function buildCompatibilityPrompt(
  chartA: NatalChart,
  chartB: NatalChart
): string {
  const a = formatChart(chartA);
  const b = formatChart(chartB);

  const sunA = a.planets.find((p) => p.planet === 'Sun');
  const moonA = a.planets.find((p) => p.planet === 'Moon');
  const venusA = a.planets.find((p) => p.planet === 'Venus');
  const marsA = a.planets.find((p) => p.planet === 'Mars');
  const ascA = a.ascendant;

  const sunB = b.planets.find((p) => p.planet === 'Sun');
  const moonB = b.planets.find((p) => p.planet === 'Moon');
  const venusB = b.planets.find((p) => p.planet === 'Venus');
  const marsB = b.planets.find((p) => p.planet === 'Mars');
  const ascB = b.ascendant;

  return `You are a Western astrologer analyzing synastry (compatibility) between two people's natal charts.

Person A:
  Sun: ${sunA?.sign} ${sunA?.degree}
  Moon: ${moonA?.sign} ${moonA?.degree}
  Venus: ${venusA?.sign} ${venusA?.degree}
  Mars: ${marsA?.sign} ${marsA?.degree}
  Ascendant: ${ascA.sign} ${ascA.degree}

Person B:
  Sun: ${sunB?.sign} ${sunB?.degree}
  Moon: ${moonB?.sign} ${moonB?.degree}
  Venus: ${venusB?.sign} ${venusB?.degree}
  Mars: ${marsB?.sign} ${marsB?.degree}
  Ascendant: ${ascB.sign} ${ascB.degree}

Analyze their compatibility covering:
1. Overall harmony (2-3 sentences)
2. Communication style match (2-3 sentences)
3. Emotional compatibility (2-3 sentences)
4. Romantic chemistry (2-3 sentences)
5. Potential challenges (2-3 sentences)
6. Advice for the relationship (2-3 sentences)

Also provide a compatibility score from 1-100.

Respond in JSON:
{
  "harmony": "...",
  "communication": "...",
  "emotional": "...",
  "chemistry": "...",
  "challenges": "...",
  "advice": "...",
  "score": 75
}`;
}
