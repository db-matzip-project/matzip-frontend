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
      className={`inline-flex items-center gap-1 rounded-full border px-3.5 py-2 text-sm font-medium transition-all ${
        selected
          ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {emoji && <span aria-hidden>{emoji}</span>}
      {label}
    </button>
  );
}
