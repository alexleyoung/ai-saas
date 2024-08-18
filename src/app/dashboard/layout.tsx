import Header from '@/components/dashboard/Header';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="w-full overflow-x-hidden">{children}</main>
    </>
  );
};

export default layout;
