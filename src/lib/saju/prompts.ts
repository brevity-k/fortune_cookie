// src/lib/saju/prompts.ts
import type { SajuChart, Pillar } from './types';
import { formatPillar } from './format';

export function buildDailyPrompt(chart: SajuChart, todayPillar: Pillar): string {
  const today = formatPillar(todayPillar);
  const dayMaster = formatPillar(chart.fourPillars.day);
  return `You are a Korean 사주 fortune advisor. Based on the user's birth chart and today's cosmic energy, write a personalized daily reading.

User's Day Master: ${dayMaster.stemHanja} (${dayMaster.stemElement}, ${dayMaster.yinYang})
Favorable Element: ${chart.fiveElements.favorableElement}
Day Master Strength: ${chart.fiveElements.isStrong ? 'Strong' : 'Weak'}

Today's Pillar: ${today.stemHanja}${today.branchHanja} (${today.stemElement} ${today.branchAnimal})

Explain how today's energy interacts with the user's chart. Cover:
1. Overall energy for today (2-3 sentences)
2. Work/career advice (1-2 sentences)
3. Relationships (1-2 sentences)
4. One specific actionable tip

Be warm, specific, and reference the actual elements. Respond in JSON:
{
  "energy": "...",
  "career": "...",
  "relationships": "...",
  "tip": "...",
  "favorableTime": "morning|afternoon|evening"
}`;
}

export function buildMonthlyPrompt(chart: SajuChart, monthPillar: Pillar): string {
  const month = formatPillar(monthPillar);
  const dayMaster = formatPillar(chart.fourPillars.day);
  return `You are a Korean 사주 fortune advisor. Write a monthly outlook based on this month's pillar and the user's birth chart.

User's Day Master: ${dayMaster.stemHanja} (${dayMaster.stemElement}, ${dayMaster.yinYang})
Favorable Element: ${chart.fiveElements.favorableElement}
Element Balance: Wood ${chart.fiveElements.counts.wood}, Fire ${chart.fiveElements.counts.fire}, Earth ${chart.fiveElements.counts.earth}, Metal ${chart.fiveElements.counts.metal}, Water ${chart.fiveElements.counts.water}

This Month's Pillar: ${month.stemHanja}${month.branchHanja} (${month.stemElement} ${month.branchAnimal})

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

export function buildYearlyPrompt(chart: SajuChart, yearPillar: Pillar): string {
  const year = formatPillar(yearPillar);
  const dayMaster = formatPillar(chart.fourPillars.day);
  return `You are a Korean 사주 fortune advisor. Write a comprehensive yearly forecast.

User's Day Master: ${dayMaster.stemHanja} (${dayMaster.stemElement}, ${dayMaster.yinYang})
Favorable Element: ${chart.fiveElements.favorableElement}
Day Master Strength: ${chart.fiveElements.isStrong ? 'Strong' : 'Weak'}
Birth Chart: ${JSON.stringify(chart.fourPillars)}
Element Balance: Wood ${chart.fiveElements.counts.wood}, Fire ${chart.fiveElements.counts.fire}, Earth ${chart.fiveElements.counts.earth}, Metal ${chart.fiveElements.counts.metal}, Water ${chart.fiveElements.counts.water}

This Year's Pillar: ${year.stemHanja}${year.branchHanja} (${year.stemElement} ${year.branchAnimal})

Write a deep yearly forecast covering:
1. Year overview and main theme (3-4 sentences)
2. Career and finances (3-4 sentences)
3. Love and relationships (3-4 sentences)
4. Health and wellness (2-3 sentences)
5. Best months and challenging months (2-3 sentences)
6. Year-long strategic advice (2-3 sentences)

Respond in JSON:
{
  "overview": "...",
  "career": "...",
  "love": "...",
  "health": "...",
  "timing": "...",
  "strategy": "..."
}`;
}

export function buildCompatibilityPrompt(
  chartA: SajuChart,
  chartB: SajuChart
): string {
  const dayMasterA = formatPillar(chartA.fourPillars.day);
  const dayMasterB = formatPillar(chartB.fourPillars.day);
  return `You are a Korean 사주 compatibility advisor. Compare these two birth charts.

Person A — Day Master: ${dayMasterA.stemHanja} (${dayMasterA.stemElement}, ${dayMasterA.yinYang}), Favorable: ${chartA.fiveElements.favorableElement}
Person B — Day Master: ${dayMasterB.stemHanja} (${dayMasterB.stemElement}, ${dayMasterB.yinYang}), Favorable: ${chartB.fiveElements.favorableElement}

Person A Elements: Wood ${chartA.fiveElements.counts.wood}, Fire ${chartA.fiveElements.counts.fire}, Earth ${chartA.fiveElements.counts.earth}, Metal ${chartA.fiveElements.counts.metal}, Water ${chartA.fiveElements.counts.water}
Person B Elements: Wood ${chartB.fiveElements.counts.wood}, Fire ${chartB.fiveElements.counts.fire}, Earth ${chartB.fiveElements.counts.earth}, Metal ${chartB.fiveElements.counts.metal}, Water ${chartB.fiveElements.counts.water}

Analyze their compatibility covering:
1. Overall harmony (2-3 sentences)
2. Communication style match (2-3 sentences)
3. Emotional compatibility (2-3 sentences)
4. Potential challenges (2-3 sentences)
5. Advice for the relationship (2-3 sentences)

Also provide a compatibility score from 1-100.

Respond in JSON:
{
  "harmony": "...",
  "communication": "...",
  "emotional": "...",
  "challenges": "...",
  "advice": "...",
  "score": 75
}`;
}
