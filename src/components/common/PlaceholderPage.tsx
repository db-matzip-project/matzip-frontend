import { Link } from 'react-router-dom';

type PlaceholderPageProps = {
  title: string;
  description?: string;
};

export default function PlaceholderPage({
  title,
  description = '도메인 구현 대기 중입니다. "진행해"라고 말씀해 주시면 해당 페이지를 완성합니다.',
}: PlaceholderPageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-medium text-orange-600">준비 중</p>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-500">{description}</p>
      <Link
        to="/home"
        className="mt-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
      >
        홈으로
      </Link>
    </div>
  );
}
