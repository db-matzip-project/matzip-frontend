import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/home', label: '홈', icon: '🏠' },
  { to: '/restaurants', label: '맛집', icon: '🍽️' },
  { to: '/restaurants/map', label: '지도', icon: '📍' },
  { to: '/schedules', label: '일정', icon: '📅' },
  { to: '/profile', label: '마이', icon: '👤' },
] as const;

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 border-t border-gray-200 bg-white/95 backdrop-blur">
      <ul className="flex items-stretch justify-around px-2 py-2">
        {navItems.map(({ to, label, icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-xs transition-colors ${
                  isActive
                    ? 'font-semibold text-orange-600'
                    : 'text-gray-500 hover:text-gray-800'
                }`
              }
            >
              <span className="text-lg" aria-hidden>
                {icon}
              </span>
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
