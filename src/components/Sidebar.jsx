import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  BarChart3,
  Settings,
  Flame,
  Plus,
  Sun,
  Moon,
  Smartphone,
  X,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  onSelectTab,
  todayStats,
  bestStreak,
  onOpenCreateModal,
  onOpenInstallModal,
  theme,
  onToggleTheme,
  isOpen,
  onCloseMobile,
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Monthly Calendar', icon: Calendar },
    { id: 'habits', label: 'Manage Habits', icon: CheckSquare },
    { id: 'stats', label: 'Streaks & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Data & Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Nav */}
        <div className="p-5">
          {/* Logo */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-emerald-500/20">
                HF
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Habit<span className="text-emerald-500">Flow</span>
                </h1>
                <p className="text-[11px] font-medium text-slate-400">
                  Daily Habit Calendar
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 md:hidden"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Habit Quick Button */}
          <div className="mt-5">
            <button
              onClick={() => {
                onOpenCreateModal();
                if (isOpen) onCloseMobile();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer hover:shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              New Habit
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (isOpen) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Card: Today's Mini Summary & Theme Toggle */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
          {/* Mini progress card */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              <span>Today's Progress</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {todayStats.completed}/{todayStats.total}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${todayStats.percentage}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                {bestStreak}d best streak
              </span>
              <span>{todayStats.percentage}%</span>
            </div>
          </div>

          {/* Install Mobile App CTA */}
          <button
            onClick={() => {
              onOpenInstallModal();
              if (isOpen) onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer shadow-xs"
          >
            <span className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Install on Phone
            </span>
            <span className="text-[10px] uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
              PWA
            </span>
          </button>

          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-indigo-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">
              Toggle
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
