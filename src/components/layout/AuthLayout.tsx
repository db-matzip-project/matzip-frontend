import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';

export default function AuthLayout() {
  return (
    <div className="mx-auto flex min-h-svh max-w-lg flex-col bg-cream">
      <TopBar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
