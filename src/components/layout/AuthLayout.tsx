import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="mx-auto flex min-h-svh max-w-lg flex-col bg-white">
      <Outlet />
    </div>
  );
}
