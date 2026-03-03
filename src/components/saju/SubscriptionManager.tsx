"use client";

interface Props {
  onManage: () => Promise<void>;
}

export default function SubscriptionManager({ onManage }: Props) {
  return (
    <div className="text-center space-y-2">
      <span className="inline-block text-xs text-gold/40 bg-gold/10 px-3 py-1 rounded-full">
        Premium Active
      </span>
      <div>
        <button
          onClick={onManage}
          className="text-xs text-foreground/30 underline underline-offset-2 hover:text-foreground/50 transition"
        >
          Manage subscription
        </button>
      </div>
    </div>
  );
}
