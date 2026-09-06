import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            style={{
                background: theme === 'dark'
                    ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                    : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            }}
            aria-label="Toggle theme"
        >
            <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-lg transform transition-all duration-300 flex items-center justify-center ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
                    }`}
            >
                {theme === 'dark' ? (
                    <MoonIcon className="w-4 h-4 text-slate-700" />
                ) : (
                    <SunIcon className="w-4 h-4 text-yellow-500" />
                )}
            </div>
        </button>
    );
}

export default ThemeToggle;
