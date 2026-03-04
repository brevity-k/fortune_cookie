import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Premium Personalized Fortunes',
  description: 'Get daily fortunes personalized to your birth chart and life story. The more we know you, the deeper your fortune becomes.',
  alternates: { canonical: '/premium' },
};

const features = [
  {
    emoji: '🔮',
    title: 'Daily Personalized Fortune',
    desc: 'Receive a unique fortune every day based on your birth chart — saju or natal chart.',
  },
  {
    emoji: '🎯',
    title: 'The More We Know You, The Deeper Your Fortune',
    desc: 'Share your concerns and interests, and watch your fortunes become remarkably accurate.',
  },
  {
    emoji: '📊',
    title: 'Detailed Category Fortunes',
    desc: 'Love, career, health — get in-depth daily readings for each area of your life.',
  },
  {
    emoji: '📅',
    title: 'Monthly Fortune Report',
    desc: 'See the big picture with a monthly outlook covering key themes and things to watch for.',
  },
];

const plans = [
  {
    label: 'Monthly',
    price: '$X.XX',
    period: 'mo',
    note: null,
    highlight: false,
  },
  {
    label: 'Yearly',
    price: '$XX.XX',
    period: 'yr',
    note: 'Save 17%',
    highlight: true,
  },
];

export default function PremiumPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 pt-14">
        {/* Hero */}
        <section className="px-4 py-12 text-center">
          <div className="mx-auto max-w-2xl space-y-4">
            <div className="text-5xl">🥠</div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              Your Personalized Fortune
            </h1>
            <p className="text-base leading-relaxed text-foreground/60 md:text-lg">
              Get daily fortunes crafted just for you.<br />
              The more we know your story, the deeper your fortune becomes.
            </p>
            <p className="text-sm text-foreground/40">7-day free trial</p>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 pb-12">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="space-y-2 rounded-xl border border-border bg-background/40 p-5"
              >
                <div className="text-2xl">{f.emoji}</div>
                <h3 className="text-sm font-bold text-foreground">{f.title}</h3>
                <p className="text-xs leading-relaxed text-foreground/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="px-4 pb-12">
          <div className="mx-auto max-w-md space-y-4">
            <h2 className="text-center text-lg font-bold text-foreground">Pricing</h2>
            <div className="grid grid-cols-2 gap-3">
              {plans.map((plan) => (
                <div
                  key={plan.label}
                  className={`space-y-1 rounded-xl border p-4 text-center ${
                    plan.highlight
                      ? 'border-gold/30 bg-gold/10'
                      : 'border-border bg-background/40'
                  }`}
                >
                  {plan.highlight && (
                    <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-gold">
                      Recommended
                    </span>
                  )}
                  <p className="text-xs text-foreground/40">{plan.label}</p>
                  <p className="text-xl font-bold text-foreground">
                    {plan.price}
                    <span className="text-xs font-normal text-foreground/40">/{plan.period}</span>
                  </p>
                  {plan.note && (
                    <p className="text-[10px] text-gold">{plan.note}</p>
                  )}
                </div>
              ))}
            </div>
            <Link
              href="/login?redirect=/my-fortune"
              className="block w-full rounded-xl bg-gold py-3.5 text-center font-bold text-background transition-colors hover:bg-gold/80"
            >
              Start 7-Day Free Trial
            </Link>
            <p className="text-center text-[10px] text-foreground/30">
              Auto-renews after free trial. Cancel anytime.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 pb-16">
          <div className="mx-auto max-w-md space-y-6">
            <h2 className="text-center text-lg font-bold text-foreground">How It Works</h2>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Chart Analysis', desc: 'We analyze your saju (Four Pillars) or natal chart to build your fortune foundation.' },
                { step: '2', title: 'Your Story', desc: 'Share what\'s on your mind — concerns, goals, interests. (Optional)' },
                { step: '3', title: 'Personalized Fortune', desc: 'Your chart data and life context combine into a deeply personalized daily fortune.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/20 text-sm font-bold text-gold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                    <p className="mt-0.5 text-xs text-foreground/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
