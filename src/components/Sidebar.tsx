import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import { DashboardLogo, OrderIcon, SettingsIcon } from "@/assets/icons/icons";
import { useRouter } from "next/router";

interface SidebarProps {}

const Sidebar: React.FunctionComponent<SidebarProps> = () => {
  const router = useRouter();
  return (
    <div className="w-[260px] bg-white min-h-[100vh] max-sm:w-full max-sm:p-5 max-sm:min-h-[2vh] max-sm:fixed max-sm:bottom-0 max-sm:bg-white max-sm:shadow-[0px_-4px_4px_0px_rgba(0,0,0,0.05)] max-sm:z-[100]">
      <div className="py-10 pl-[40px] max-sm:hidden">
        <Image src={logo} alt="logo" priority />
      </div>
      <div className="flex flex-col gap-6 max-sm:flex-row max-sm:gap-3 max-sm:overflow-scroll">
        <button
          onClick={() => router.push("/")}
          className="flex gap-1 sidebar-nav active"
        >
          <span className="flex gap-1 pl-[30px] bg-span max-sm:pl-2 max-sm:pr-4">
            <span>
              <DashboardLogo />
            </span>
            <span className="text-[#5F01D2]">Dashboard</span>
          </span>
        </button>
        <button className="flex gap-1 sidebar-nav text-[#666666]">
          <span className="flex gap-1 pl-[30px] bg-span max-sm:pl-2 max-sm:pr-4">
            <span>
              <OrderIcon />
            </span>
            <span>Orders</span>
          </span>
        </button>
        <button className="flex gap-1 sidebar-nav text-[#666666]">
          <span className="flex gap-1 pl-[30px] bg-span max-sm:pl-2 max-sm:pr-4">
            <span>
              <SettingsIcon />
            </span>
            <span>Settings</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
