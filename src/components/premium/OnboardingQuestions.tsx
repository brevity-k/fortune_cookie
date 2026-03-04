'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface OnboardingQuestionsProps {
  onComplete: () => void;
}

const TOPIC_CHIPS = [
  { label: 'Career / Money', value: 'career' },
  { label: 'Love / Relationships', value: 'love' },
  { label: 'Health', value: 'health' },
  { label: 'Personal Growth', value: 'study' },
  { label: 'Family / Home', value: 'family' },
];

interface Step {
  question: string;
  type: 'chips' | 'text';
  placeholder?: string;
  contextType: string;
  topic?: string;
}

const STEPS: Step[] = [
  {
    question: 'What areas of life interest you most right now?',
    type: 'chips',
    contextType: 'onboarding',
    topic: 'general',
  },
  {
    question: 'Have there been any major changes in your life recently?',
    type: 'text',
    placeholder: 'Job change, moving, new relationship...',
    contextType: 'onboarding',
    topic: 'general',
  },
  {
    question: 'What is your biggest concern right now?',
    type: 'text',
    placeholder: 'Share freely',
    contextType: 'onboarding',
  },
  {
    question: 'What do you hope to achieve this year?',
    type: 'text',
    placeholder: 'Goals, wishes, dreams...',
    contextType: 'onboarding',
  },
];

export default function OnboardingQuestions({ onComplete }: OnboardingQuestionsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [textValue, setTextValue] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  async function saveAndNext() {
    const hasInput =
      step.type === 'chips' ? selectedChips.length > 0 : textValue.trim().length > 0;

    if (hasInput) {
      setSaving(true);
      setError(null);
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Please sign in to continue.');
        setSaving(false);
        return;
      }

      const content =
        step.type === 'chips' ? selectedChips.join(', ') : textValue.trim().slice(0, 1000);

      const { error: insertError } = await supabase.from('user_context').insert({
        user_id: user.id,
        content,
        context_type: step.contextType,
        topic: step.topic || null,
      });

      if (insertError) {
        setError('Failed to save. Please try again.');
        setSaving(false);
        return;
      }

      setSaving(false);
    }

    if (isLast) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
      setTextValue('');
      setSelectedChips([]);
      setError(null);
    }
  }

  function toggleChip(value: string) {
    setSelectedChips((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  return (
    <div className="space-y-5 rounded-xl border border-border bg-background/40 p-6">
      {/* Progress */}
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= currentStep ? 'bg-gold' : 'bg-foreground/10'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <p className="text-sm font-medium text-foreground">{step.question}</p>

      {/* Input */}
      {step.type === 'chips' ? (
        <div className="flex flex-wrap gap-2">
          {TOPIC_CHIPS.map((chip) => (
            <button
              key={chip.value}
              onClick={() => toggleChip(chip.value)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                selectedChips.includes(chip.value)
                  ? 'border-gold/40 bg-gold/20 text-gold'
                  : 'border-border bg-background/30 text-foreground/60 hover:border-foreground/20'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      ) : (
        <textarea
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder={step.placeholder}
          rows={2}
          maxLength={500}
          className="w-full resize-none rounded-lg border border-border bg-background/30 px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-gold/40 focus:outline-none"
        />
      )}

      {/* Error */}
      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={saveAndNext}
          disabled={saving}
          className="text-xs text-foreground/30 transition-colors hover:text-foreground/60"
        >
          Skip
        </button>
        <button
          onClick={saveAndNext}
          disabled={saving}
          className="rounded-lg border border-gold/30 bg-gold/20 px-4 py-2 text-sm text-gold transition-colors hover:bg-gold/30 disabled:opacity-50"
        >
          {saving ? 'Saving...' : isLast ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
}
