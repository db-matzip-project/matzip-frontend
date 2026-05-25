import { Link } from 'react-router-dom';
import logoIcon from '../../../assets/logo_icon.png';

export default function Logo() {
  return (
    <Link
      to="/home"
      className="font-logo inline-flex items-center gap-2 text-[1.4rem] leading-none tracking-tight text-brand transition-colors hover:text-brand-dark"
    >
      <img
        src={logoIcon}
        alt=""
        className="h-10 w-10 rounded-full object-cover"
        aria-hidden="true"
      />
      <span className="translate-y-px">맛집탐방</span>
    </Link>
  );
}
