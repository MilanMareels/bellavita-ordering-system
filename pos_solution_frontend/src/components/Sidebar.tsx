import { LayoutGrid, Settings, Pizza, LogOut } from "lucide-react";
import type { SidebarProps } from "../types";

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, isAdmin }) => {
  const navItems = [{ id: "kassa", icon: LayoutGrid, label: "Kassa" }, ...(isAdmin ? [{ id: "admin", icon: Settings, label: "Beheer" }] : [])];

  return (
    <div className="w-20 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-6 shrink-0 z-20">
      <div className="mb-8 p-2 bg-indigo-600 rounded-lg">
        <Pizza className="text-white" size={24} />
      </div>

      <div className="flex-1 w-full flex flex-col gap-4 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all w-full aspect-square ${
              activeTab === item.id ? "bg-gray-800 text-indigo-400 shadow-lg border border-gray-700" : "text-gray-500 hover:bg-gray-800 hover:text-gray-300"
            }`}
          >
            <item.icon size={24} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <button onClick={onLogout} className="mt-auto p-3 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-xl transition" title="Uitloggen">
        <LogOut size={24} />
      </button>
    </div>
  );
};

export default Sidebar;
