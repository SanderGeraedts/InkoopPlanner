import Link from 'next/link';
import AddOrderButton from './AddOrderButton';

export default function Header() {
  return (
    <header className="bg-purple text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold font-heading hover:text-beige transition-colors">
          Inkoop Planner
        </Link>
        <AddOrderButton />
      </div>
    </header>
  );
}
