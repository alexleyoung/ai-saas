import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="bg-accent h-screen px-8 py-6 font-bold text-3xl">
      <Link href="/dashboard">Qwizard</Link>
    </aside>
  );
};

export default Sidebar;
