import { Link } from 'react-router-dom';
import logoIcon from '../../../assets/logo_icon.png';

export default function Logo() {
  return (
    <Link
      to="/home"
      className="font-logo inline-flex translate-y-0.5 items-center gap-2 text-[1.4rem] leading-none tracking-tight text-brand transition-colors hover:text-brand-dark"
    >
      <img
        src={logoIcon}
        alt=""
        className="h-9 w-9 rounded-full object-cover"
        aria-hidden="true"
      />
      <span className="translate-y-0.5">맛집탐방</span>
    </Link>
  );
}
