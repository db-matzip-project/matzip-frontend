import { Link } from 'react-router-dom';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  backTo?: string;
  action?: React.ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  backTo,
  action,
}: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 px-4 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {backTo && (
            <Link
              to={backTo}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
              aria-label="뒤로 가기"
            >
              ←
            </Link>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="truncate text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
        {action}
      </div>
    </header>
  );
}
