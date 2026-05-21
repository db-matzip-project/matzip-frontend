type ChipProps = {
  label: string;
  emoji?: string;
  selected?: boolean;
  onClick?: () => void;
};

export default function Chip({
  label,
  emoji,
  selected = false,
  onClick,
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${
        selected
          ? 'border-brand bg-brand text-white'
          : 'border-brand-light bg-cream text-ink hover:border-brand-muted hover:bg-brand-soft'
      }`}
    >
      {emoji && <span aria-hidden>{emoji}</span>}
      {label}
    </button>
  );
}
