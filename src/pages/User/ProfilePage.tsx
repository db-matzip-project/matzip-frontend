import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import { PREFERENCE_LABELS } from '../../constants/preferences';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user, logout, hasCompletedOnboarding } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  return (
    <div className="pb-4">
      <PageHeader title="마이페이지" />

      <section className="px-4 py-6">
        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-2xl">
            👤
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>

        <dl className="mt-4 space-y-3 rounded-2xl border border-gray-100 bg-white p-4">
          <div className="flex justify-between text-sm">
            <dt className="text-gray-500">전화번호</dt>
            <dd className="font-medium text-gray-900">{user.phone}</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-gray-500">온보딩</dt>
            <dd className="font-medium text-gray-900">
              {hasCompletedOnboarding ? '완료' : '미완료'}
            </dd>
          </div>
        </dl>

        <div className="mt-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-700">내 취향</h3>
          {user.preferences.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {user.preferences.map((pref) => (
                <span
                  key={pref}
                  className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
                >
                  {PREFERENCE_LABELS[pref] ?? pref}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">아직 취향을 설정하지 않았어요.</p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
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
