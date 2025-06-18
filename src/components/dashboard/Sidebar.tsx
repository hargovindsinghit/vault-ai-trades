
import { cn } from "@/lib/utils";
import { BarChart3, History, Settings, TrendingUp, Wallet } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    {
      id: "portfolio",
      label: "Portfolio",
      icon: Wallet,
    },
    {
      id: "trades",
      label: "Trading History",
      icon: History,
    },
    {
      id: "performance",
      label: "AI Performance",
      icon: BarChart3,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-emerald-600 rounded-lg">
            <TrendingUp className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">Trading Hub</span>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  activeTab === item.id
                    ? "bg-emerald-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
