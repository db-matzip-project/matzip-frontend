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
    <div className="border-b border-brand-light bg-cream px-4 py-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          {backTo && (
            <Link
              to={backTo}
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-brand-soft hover:text-brand"
              aria-label="뒤로 가기"
            >
              ←
            </Link>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold tracking-tight text-ink">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-0.5 truncate text-xs text-muted">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0 pt-0.5">{action}</div>}
      </div>
    </div>
  );
}
