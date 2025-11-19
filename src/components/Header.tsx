import Link from 'next/link';
import AddOrderButton from './AddOrderButton';
import Container from '@/src/components/Container';

export default function Header() {
  return (
    <header className="bg-purple text-white shadow-lg">
      <Container>
        <div className="py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold font-heading hover:text-beige transition-colors">
            Inkoop Planner
          </Link>
          <AddOrderButton />
        </div>
      </Container>
    </header>
  );
}
