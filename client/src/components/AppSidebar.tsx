import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FilePenLine,
  Target,
  Brain,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Resume Builder",
    url: "/resume-builder",
    icon: FilePenLine,
  },
  {
    title: "ATS Optimizer",
    url: "/resume-builder?tab=ats",
    icon: Target,
  },
  {
    title: "Skill Analysis",
    url: "/resume-builder?tab=skills",
    icon: Brain,
  },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/dashboard" className="flex items-center gap-2 px-1 py-1">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            Buildfolio
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.url ||
              (item.url.includes("?") &&
                location.pathname + location.search === item.url);
            return (
              <Link
                key={item.url}
                to={item.url}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
