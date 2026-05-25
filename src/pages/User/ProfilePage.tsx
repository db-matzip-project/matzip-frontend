import { Link, useNavigate } from 'react-router-dom';
import ProfileMyReviews from '../../components/user/ProfileMyReviews';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import { PREFERENCE_LABELS } from '../../constants/preferences';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/PreferenceContext';
import profileImage from '../../../assets/profile.png';

export default function ProfilePage() {
  const { user, logout, hasCompletedOnboarding } = useAuth();
  const { catalog } = usePreferences();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const labelForPref = (code: string) => {
    const fromCatalog = catalog.find((p) => p.code === code)?.displayName;
    return fromCatalog ?? PREFERENCE_LABELS[code] ?? code;
  };

  if (!user) return null;

  return (
    <div className="pb-4">
      <PageHeader title="마이페이지" />

      <section className="space-y-4 bg-cream px-4 py-6">
        <div className="flex items-center gap-4 rounded-2xl border border-brand-light bg-surface p-5 shadow-sm">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-brand-light bg-brand-soft">
            <img
              src={profileImage}
              alt={`${user.name} 프로필`}
              className="h-full w-full scale-[1.28] object-cover object-[52%_50%]"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink">{user.name}</h2>
            <p className="text-sm text-muted">@{user.username}</p>
          </div>
        </div>

        <dl className="space-y-3 rounded-2xl border border-brand-light bg-surface p-4">
          <div className="flex justify-between text-sm">
            <dt className="text-muted">전화번호</dt>
            <dd className="font-medium text-ink">{user.phone}</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-muted">온보딩</dt>
            <dd className="font-medium text-ink">
              {hasCompletedOnboarding ? '완료' : '미완료'}
            </dd>
          </div>
        </dl>

        <ProfileMyReviews enabled />

        <div className="rounded-2xl border border-brand-light bg-surface p-4">
          <h3 className="mb-2 text-sm font-semibold text-brand">내 취향</h3>
          {user.preferences.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {user.preferences.map((pref) => (
                <span
                  key={pref}
                  className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand"
                >
                  {labelForPref(pref)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">아직 취향을 설정하지 않았어요.</p>
          )}
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link to="/profile/edit">
            <Button variant="secondary" fullWidth>
              정보 수정
            </Button>
          </Link>
          <Link to="/onboarding">
            <Button variant="secondary" fullWidth>
              취향 다시 설정
            </Button>
          </Link>
          <Button variant="danger" fullWidth onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      </section>
    </div>
  );
}
