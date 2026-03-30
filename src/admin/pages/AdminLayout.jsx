import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { LayoutDashboard, BedDouble, PlusCircle, Tag, Settings, LogOut, Images } from "lucide-react";

const navItems = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/rooms", icon: BedDouble, label: "Rooms" },
  { to: "/admin/rooms/new", icon: PlusCircle, label: "Add" },
  { to: "/admin/categories", icon: Tag, label: "Categories" },
  { to: "/admin/gallery", icon: Images, label: "Gallery" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-56 bg-white border-r border-gray-200 flex-col fixed h-full z-40">
        <div className="px-5 py-5 border-b border-gray-100">
          <span className="text-base font-bold text-gray-900">
            ANJANI<span className="text-red-500">ROOMS</span>
          </span>
          <p className="text-[11px] text-gray-400 mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 truncate mb-2">{admin?.email}</p>
          <button onClick={handleLogout} className="w-full text-sm text-red-500 hover:text-red-600 font-medium text-left">
            Sign out →
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:ml-56 flex-1 w-full p-4 md:p-6 min-h-screen pb-20 md:pb-6">
        <Outlet />
      </main>

      {/* Bottom nav — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/admin/dashboard"}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 text-[10px] font-medium transition-colors ${
                isActive ? "text-red-500" : "text-gray-400"
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            {label}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center py-2 text-[10px] font-medium text-gray-400"
        >
          <LogOut className="w-5 h-5 mb-0.5" />
          Logout
        </button>
      </nav>
    </div>
  );
}
