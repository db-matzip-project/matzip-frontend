import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/ui/PageHeader';
import { useAuth } from '../../context/AuthContext';

export default function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    passwordConfirm: '',
    phone: '',
  });
  const [error, setError] = useState('');

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.username.trim() || !form.password || !form.phone.trim()) {
      setError('모든 항목을 입력해 주세요.');
      return;
    }
    if (form.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    const phonePattern = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    if (!phonePattern.test(form.phone.replace(/\s/g, ''))) {
      setError('올바른 전화번호 형식을 입력해 주세요. (예: 010-1234-5678)');
      return;
    }

    const result = signUp({
      name: form.name,
      username: form.username,
      password: form.password,
      phone: form.phone,
    });

    if (!result.ok) {
      setError(result.error ?? '회원가입에 실패했습니다.');
      return;
    }
    navigate('/onboarding', { replace: true });
  };

  return (
    <div className="flex min-h-svh flex-col">
      <PageHeader title="회원가입" backTo="/login" />
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 px-6 py-6">
        <Input
          label="이름"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="홍길동"
        />
        <Input
          label="아이디"
          value={form.username}
          onChange={(e) => update('username', e.target.value)}
          placeholder="영문·숫자 조합"
        />
        <Input
          label="비밀번호"
          type="password"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          placeholder="6자 이상"
        />
        <Input
          label="비밀번호 확인"
          type="password"
          value={form.passwordConfirm}
          onChange={(e) => update('passwordConfirm', e.target.value)}
          placeholder="비밀번호 재입력"
        />
        <Input
          label="전화번호"
          type="tel"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="010-1234-5678"
        />
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        <Button type="submit" fullWidth className="mt-auto">
          가입하기
        </Button>
        <p className="text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-semibold text-orange-600">
            로그인
          </Link>
        </p>
      </form>
    </div>
  );
}
