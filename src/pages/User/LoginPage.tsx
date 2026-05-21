import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('아이디와 비밀번호를 입력해 주세요.');
      return;
    }
    const loggedIn = login(username, password);
    if (!loggedIn) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      return;
    }
    navigate(
      loggedIn.preferences.length > 0 ? '/home' : '/onboarding',
      { replace: true },
    );
  };

  return (
    <div className="flex flex-col px-6 pb-8 pt-2">
      <p className="mb-6 text-sm text-muted">나만의 맛집 탐방을 시작해요</p>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
        <Input
          label="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="아이디 입력"
          autoComplete="username"
        />
        <Input
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
          autoComplete="current-password"
        />
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <Button type="submit" fullWidth className="mt-2">
          로그인
        </Button>
      </form>

      <div className="mt-6 space-y-4 text-center text-sm">
        <p className="text-muted">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="font-semibold text-brand">
            회원가입
          </Link>
        </p>
        <div className="rounded-xl border border-brand-light bg-brand-soft px-4 py-3 text-left text-xs text-muted">
          <p className="font-medium text-ink">테스트 계정</p>
          <p className="mt-1">demo / demo1234 (취향 설정 완료)</p>
          <p>newuser / pass1234 (온보딩 필요)</p>
        </div>
      </div>
    </div>
  );
}
