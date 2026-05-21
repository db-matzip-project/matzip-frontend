import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/ui/PageHeader';
import { useAuth } from '../../context/AuthContext';

export default function ProfileEditPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaved(false);

    if (!name.trim() || !phone.trim()) {
      setError('이름과 전화번호를 입력해 주세요.');
      return;
    }
    const phonePattern = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    if (!phonePattern.test(phone.replace(/\s/g, ''))) {
      setError('올바른 전화번호 형식을 입력해 주세요.');
      return;
    }

    updateUser({ name: name.trim(), phone: phone.trim() });
    setSaved(true);
    setTimeout(() => navigate('/profile'), 800);
  };

  if (!user) return null;

  return (
    <div className="flex min-h-[60vh] flex-col">
      <PageHeader title="정보 수정" backTo="/profile" />
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 px-6 py-6">
        <Input
          label="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input label="아이디" value={user.username} disabled />
        <Input
          label="전화번호"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        {saved && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
            저장되었습니다.
          </p>
        )}
        <Button type="submit" fullWidth className="mt-auto">
          저장하기
        </Button>
      </form>
    </div>
  );
}
