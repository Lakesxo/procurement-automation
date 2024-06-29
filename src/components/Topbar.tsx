import { BellIcon, DashNavIcon } from "@/assets/icons/icons";
import Image from "next/image";
import avatar from "@/assets/images/user.png";
import { usePathname } from "next/navigation";

interface TopbarProps {}

const Topbar: React.FunctionComponent<TopbarProps> = () => {
  const pathname = usePathname();
  return (
    <div className="px-8 py-7 flex justify-between items-center max-sm:px-4">
      <div className="flex items-center">
        <span>
          <DashNavIcon />
        </span>
        <span className="text-[#667185] ml-1 max-sm:hidden">
          Dashboard{pathname !== "/" && "/"}
        </span>
        {pathname !== "/" && (
          <span className="text-[#98A2B3] max-sm:ml-2">
            {pathname?.includes("new")
              ? "Create purchase order"
              : pathname?.includes("edit")
              ? "Edit purchase order"
              : "Purchase order detail"}
          </span>
        )}
      </div>
      <div className="flex items-center gap-6">
        <BellIcon />
        <Image src={avatar} alt="avatar" />
      </div>
    </div>
  );
};

export default Topbar;
