import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chip from '../../components/ui/Chip';
import Button from '../../components/ui/Button';
import { PREFERENCE_OPTIONS } from '../../constants/preferences';
import { useAuth } from '../../context/AuthContext';

const MIN_SELECTION = 3;

export default function OnboardingPage() {
  const { user, setPreferences } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(user?.preferences ?? []);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleComplete = () => {
    if (selected.length < MIN_SELECTION) return;
    setPreferences(selected);
    navigate('/home', { replace: true });
  };

  const handleSkip = () => {
    if (selected.length > 0) setPreferences(selected);
    navigate('/home', { replace: true });
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

      <div className="flex flex-wrap gap-2">
        {PREFERENCE_OPTIONS.map(({ id, label, emoji }) => (
          <Chip
            key={id}
            label={label}
            emoji={emoji}
            selected={selected.includes(id)}
            onClick={() => toggle(id)}
          />
        ))}
      </div>

      <p className="mt-4 text-center text-sm text-muted">
        <span className="font-semibold text-brand">{selected.length}</span>
        개 선택됨
        {selected.length < MIN_SELECTION && (
          <span className="text-subtle">
            {' '}
            · {MIN_SELECTION - selected.length}개 더 선택해 주세요
          </span>
        )}
      </p>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Button
          fullWidth
          disabled={selected.length < MIN_SELECTION}
          onClick={handleComplete}
        >
          맞춤 추천 시작하기
        </Button>
        <Button variant="ghost" fullWidth onClick={handleSkip}>
          {selected.length > 0 ? '선택한 취향으로 건너뛰기' : '나중에 할게요'}
        </Button>
      </div>
    </div>
  );
}
