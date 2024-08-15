import Sidebar from '@/components/dashboard/Sidebar';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full">{children}</main>
    </div>
  );
};

export default layout;
