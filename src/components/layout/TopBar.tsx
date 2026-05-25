import Logo from './Logo';

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-brand-light bg-cream px-4 pt-3 pb-2">
      <Logo />
    </header>
  );
}
