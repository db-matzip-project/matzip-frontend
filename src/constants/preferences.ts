export const PREFERENCE_OPTIONS = [
  { id: 'spicy', label: '매운맛', emoji: '🌶️' },
  { id: 'japanese', label: '일식', emoji: '🍣' },
  { id: 'chinese', label: '중식', emoji: '🥟' },
  { id: 'korean', label: '한식', emoji: '🍚' },
  { id: 'western', label: '양식', emoji: '🍝' },
  { id: 'value', label: '가성비', emoji: '💰' },
  { id: 'premium', label: '고급', emoji: '✨' },
  { id: 'solo', label: '혼밥', emoji: '🙋' },
  { id: 'date', label: '데이트', emoji: '💑' },
  { id: 'late-night', label: '야식', emoji: '🌙' },
  { id: 'dessert', label: '디저트', emoji: '🍰' },
  { id: 'cafe', label: '카페', emoji: '☕' },
  { id: 'vegan', label: '채식', emoji: '🥗' },
  { id: 'drinks', label: '술안주', emoji: '🍺' },
  { id: 'local', label: '로컬맛집', emoji: '📍' },
] as const;

export const PREFERENCE_LABELS: Record<string, string> = Object.fromEntries(
  PREFERENCE_OPTIONS.map((p) => [p.id, p.label]),
);
