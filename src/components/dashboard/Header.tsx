import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-accent px-8 py-6 font-bold text-3xl">
      <Link href="/dashboard">Qwizard</Link>
    </header>
  );
};

export default Header;
