import { Link } from 'react-router-dom';

type PlaceholderPageProps = {
  title: string;
  description?: string;
};

export default function PlaceholderPage({
  title,
  description = '도메인 구현 대기 중입니다.',
}: PlaceholderPageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-medium text-brand">준비 중</p>
      <h1 className="text-2xl font-bold text-ink">{title}</h1>
      <p className="text-sm text-muted">{description}</p>
      <Link
        to="/home"
        className="mt-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark"
      >
        홈으로
      </Link>
    </div>
  );
}
