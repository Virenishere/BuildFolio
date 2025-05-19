import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { LayoutDashboard,FilePenLine,FileUser   } from "lucide-react";

const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: <LayoutDashboard />,
  },
  {
    title: "Edit",
    url: "#",
    icon: <FilePenLine />,
  },
  {
    title: "Resume",
    url: "#",
    icon: <FileUser />,
  },
];

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/" className="flex items-center space-x-2 cursor-pointer">
          icon
          <span className="text-2xl font-bold text-gray-800 dark:text-white">
            BrainPin
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.url}
              className="block p-2 hover:bg-[var(--color-secondary-col)] dark:hover:bg-[var(--color-secondary-col)] rounded hover:text-black font-medium"
            >
              <div className="flex items-center gap-2">
                {item.icon} <span>{item.title}</span>
              </div>
            </Link>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <button className="w-full text-left p-2 text-red-500 hover:bg-red-100 font-medium rounded cursor-pointer">
          Logout
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
