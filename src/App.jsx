import React, { useState } from 'react';
import { useHabits } from './hooks/useHabits';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import HabitManagement from './components/HabitManagement';
import StatsView from './components/StatsView';
import SettingsView from './components/SettingsView';
import HabitModal from './components/HabitModal';
import Toast from './components/Toast';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  BarChart3,
  Settings,
} from 'lucide-react';

export default function App() {
  const {
    habits,
    logs,
    selectedDate,
    setSelectedDate,
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    isModalOpen,
    setIsModalOpen,
    editingHabit,
    setEditingHabit,
    toast,
    showToast,
    closeToast,
    toggleHabitCompletion,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleArchiveHabit,
    exportData,
    importData,
    resetData,
    todayStats,
    habitStreaks,
    bestStreak,
  } = useHabits();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Open modal for creating new habit
  const handleOpenCreateModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  // Open modal for editing existing habit
  const handleOpenEditModal = (habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  // Save habit (create or edit)
  const handleSaveHabit = (habitData) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
    } else {
      createHabit(habitData);
    }
  };

  const mobileNavItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'habits', label: 'Habits', icon: CheckSquare },
    { id: 'stats', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Sidebar for Desktop & Mobile drawer */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        todayStats={todayStats}
        bestStreak={bestStreak}
        onOpenCreateModal={handleOpenCreateModal}
        theme={theme}
        onToggleTheme={toggleTheme}
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area (Offset by sidebar on desktop) */}
      <div className="md:pl-64 flex flex-col flex-1 pb-16 md:pb-0">
        {/* Top Header */}
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCreateModal={handleOpenCreateModal}
          theme={theme}
          onToggleTheme={toggleTheme}
          todayStats={todayStats}
        />

        {/* Dynamic Main View */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">
          {activeTab === 'dashboard' && (
            <Dashboard
              habits={habits}
              logs={logs}
              todayStats={todayStats}
              bestStreak={bestStreak}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              habitStreaks={habitStreaks}
              onToggleHabit={toggleHabitCompletion}
              onEditHabit={handleOpenEditModal}
              onOpenCreateModal={handleOpenCreateModal}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              habits={habits}
              logs={logs}
              habitStreaks={habitStreaks}
              onToggleHabit={toggleHabitCompletion}
              onEditHabit={handleOpenEditModal}
              onOpenCreateModal={handleOpenCreateModal}
            />
          )}

          {activeTab === 'habits' && (
            <HabitManagement
              habits={habits}
              habitStreaks={habitStreaks}
              onOpenCreateModal={handleOpenCreateModal}
              onEditHabit={handleOpenEditModal}
              onToggleArchiveHabit={toggleArchiveHabit}
              onDeleteHabit={deleteHabit}
            />
          )}

          {activeTab === 'stats' && (
            <StatsView
              habits={habits}
              logs={logs}
              habitStreaks={habitStreaks}
              bestStreak={bestStreak}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              theme={theme}
              onToggleTheme={toggleTheme}
              onExportData={exportData}
              onImportData={importData}
              onResetData={resetData}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar for easy thumb navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around py-2 px-1 md:hidden">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-all ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Create / Edit Habit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        habit={editingHabit}
        onSave={handleSaveHabit}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHabit(null);
        }}
      />

      {/* Toast feedback alerts */}
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
