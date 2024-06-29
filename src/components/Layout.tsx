import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-[#F8F9FD] min-h-[100vh]">
      <div className="flex max-sm:flex-col-reverse">
        <Sidebar />
        <div className="w-[calc(100%_-_260px)] max-sm:w-full max-sm:pb-[150px]">
          <Topbar />
          <div className="px-8 py-3 max-sm:px-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
