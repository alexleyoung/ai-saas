import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="border-b border-accent flex justify-between gap-2 p-4">
      <nav className="flex gap-4 items-center font-medium tracking-wide">
        <Image src="/logo.png" alt="logo" height={40} width={40} />
        <Link href="/dashboard">Dashboard</Link>
      </nav>
    </header>
  );
};

export default Header;
