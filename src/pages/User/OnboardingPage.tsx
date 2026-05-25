import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chip from '../../components/ui/Chip';
import Button from '../../components/ui/Button';
import { PREFERENCE_OPTIONS } from '../../constants/preferences';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/PreferenceContext';

const MIN_SELECTION = 3;

export default function OnboardingPage() {
  const { user, setPreferences } = useAuth();
  const { catalog, loading: catalogLoading } = usePreferences();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(user?.preferences ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const options = useMemo(
    () =>
      catalog.length > 0
        ? catalog.map((p) => {
            const local = PREFERENCE_OPTIONS.find((o) => o.id === p.code);
            return {
              id: p.code,
              label: p.displayName,
              emoji: local?.emoji ?? '✨',
            };
          })
        : PREFERENCE_OPTIONS.map((p) => ({ id: p.id, label: p.label, emoji: p.emoji })),
    [catalog],
  );

  const selectableIds = useMemo(() => new Set(options.map((option) => option.id)), [options]);
  const selectedCount = selected.filter((id) => selectableIds.has(id)).length;

  useEffect(() => {
    setSelected((prev) => prev.filter((id) => selectableIds.has(id)));
  }, [selectableIds]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const saveAndGo = async (codes: string[]) => {
    setSubmitting(true);
    setError('');
    const result = await setPreferences(codes);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? '취향 저장에 실패했습니다.');
      return;
    }
    navigate('/home', { replace: true });
  };

  const handleComplete = () => {
    const selectedCodes = selected.filter((id) => selectableIds.has(id));
    if (selectedCodes.length < MIN_SELECTION) return;
    saveAndGo(selectedCodes);
  };

  return (
    <div className="flex flex-col px-6 pb-10 pt-4">
      <div className="mb-6">
        <p className="text-sm font-semibold text-brand">STEP 1 / 1</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">
          어떤 맛을 좋아하세요?
        </h1>
        <p className="mt-2 text-sm text-muted">
          {MIN_SELECTION}개 이상 선택하면 더 정확한 맞춤 추천을 받을 수 있어요.
        </p>
      </div>

      {catalogLoading ? (
        <p className="text-sm text-muted">취향 목록 불러오는 중...</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {options.map(({ id, label, emoji }) => (
            <Chip
              key={id}
              label={label}
              emoji={emoji}
              selected={selected.includes(id)}
              onClick={() => toggle(id)}
            />
          ))}
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <p className="mt-4 text-center text-sm text-muted">
        <span className="font-semibold text-brand">{selectedCount}</span>
        개 선택됨
        {selectedCount < MIN_SELECTION && (
          <span className="text-subtle">
            {' '}
            · {MIN_SELECTION - selectedCount}개 더 선택해 주세요
          </span>
        )}
      </p>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Button
          fullWidth
          disabled={catalogLoading || selectedCount < MIN_SELECTION || submitting}
          onClick={handleComplete}
        >
          {submitting ? '저장 중...' : '맞춤 추천 시작하기'}
        </Button>
      </div>
    </div>
  );
}
