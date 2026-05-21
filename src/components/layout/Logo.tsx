import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link
      to="/home"
      className="font-logo inline-block text-[1.4rem] leading-none tracking-tight text-brand transition-colors hover:text-brand-dark"
    >
      맛집탐방
    </Link>
  );
}
