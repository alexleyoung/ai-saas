import Sidebar from '@/components/dashboard/Sidebar';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full  overflow-x-hidden">{children}</main>
    </div>
  );
};

export default layout;
