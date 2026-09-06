import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon, TrophyIcon, UserIcon, CodeIcon, BarChart3Icon, BellIcon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar-glass">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-3 transition-transform duration-200 hover:scale-105"
        >
          <div className="size-10 rounded-xl gradient-rainbow flex items-center justify-center shadow-lg animate-gradient">
            <CodeIcon className="size-6 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-xl gradient-text-animated font-mono tracking-wider">
              CodeFlow
            </span>
            <span className="text-xs text-base-content/60 font-medium -mt-1">Code Together</span>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to={"/dashboard"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${isActive("/dashboard")
              ? "bg-primary text-primary-content shadow-md"
              : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }`}
          >
            <LayoutDashboardIcon className="size-4" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            to={"/problems"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${isActive("/problems")
              ? "bg-primary text-primary-content shadow-md"
              : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }`}
          >
            <BookOpenIcon className="size-4" />
            <span className="font-medium">Problems</span>
          </Link>

          <Link
            to={"/snippets"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${isActive("/snippets")
              ? "bg-primary text-primary-content shadow-md"
              : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }`}
          >
            <CodeIcon className="size-4" />
            <span className="font-medium">Snippets</span>
          </Link>

          <Link
            to={"/leaderboard"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${isActive("/leaderboard")
              ? "bg-primary text-primary-content shadow-md"
              : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }`}
          >
            <TrophyIcon className="size-4" />
            <span className="font-medium">Leaderboard</span>
          </Link>

          <Link
            to={"/analytics"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${isActive("/analytics")
              ? "bg-primary text-primary-content shadow-md"
              : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }`}
          >
            <BarChart3Icon className="size-4" />
            <span className="font-medium">Analytics</span>
          </Link>

          <Link
            to={"/profile"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${isActive("/profile")
              ? "bg-primary text-primary-content shadow-md"
              : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }`}
          >
            <UserIcon className="size-4" />
            <span className="font-medium">Profile</span>
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-base-200 rounded-lg transition-all">
            <BellIcon className="size-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-pulse" />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Button */}
          <div className="ml-2">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
