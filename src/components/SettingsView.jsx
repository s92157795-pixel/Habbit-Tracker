import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Bell,
  Moon,
  Sun,
  HardDrive,
  AlertTriangle,
  Smartphone,
} from 'lucide-react';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendHabitNotification,
} from '../utils/notifications';
import ConfirmModal from './ConfirmModal';

export default function SettingsView({
  theme,
  onToggleTheme,
  onOpenInstallModal,
  onExportData,
  onImportData,
  onResetData,
  showToast,
}) {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState(() =>
    getNotificationPermission()
  );
  const fileInputRef = useRef(null);

  // Handle file import
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        onImportData(json);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch {
        showToast('Invalid JSON file format', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Test browser notification
  const handleRequestNotification = async () => {
    if (!isNotificationSupported()) {
      showToast('Notifications are not supported in this browser.', 'error');
      return;
    }

    const result = await requestNotificationPermission();
    setNotificationStatus(getNotificationPermission());

    if (result.granted) {
      showToast('Notification permission granted!', 'success');
      sendHabitNotification({
        id: 'test',
        name: 'HabitFlow Notifications Active',
        description: 'You will receive reminders for habits with scheduled times.',
      });
    } else {
      showToast('Notifications were denied or dismissed.', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Data & Application Settings
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage backups, imports, theme preferences, and local storage
            </p>
          </div>
        </div>
      </div>

      {/* 0. Mobile App & Phone Installation */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-white/20 text-white shrink-0 backdrop-blur-xs">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-wider mb-1">
                Install as Mobile App
              </div>
              <h3 className="text-lg font-bold">Use HabitFlow on Your Phone</h3>
              <p className="text-xs text-emerald-100 mt-0.5 leading-relaxed max-w-lg">
                Install this app on Android, iPhone, or Desktop to run fullscreen, offline, and right from your home screen.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenInstallModal}
            className="px-5 py-3 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 active:bg-emerald-100 font-extrabold text-xs shadow-md transition-all cursor-pointer shrink-0 self-start sm:self-auto flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Install / Download App
          </button>
        </div>
      </div>

      {/* 1. Theme Configuration */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-indigo-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
          Appearance & Theme
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Customize the visual interface style. Preference is stored locally.
        </p>

        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white block">
              Dark Mode
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Current mode: {theme === 'dark' ? 'Dark' : 'Light'}
            </span>
          </div>

          <button
            onClick={onToggleTheme}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" /> Switch to Light
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-500" /> Switch to Dark
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Notifications Configuration */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
          <Bell className="w-4 h-4 text-emerald-500" />
          Habit Reminders & Notifications
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Enable optional browser notifications to alert you when scheduled habit reminder times occur.
        </p>

        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white block">
              Browser Notification Status
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Status: <span className="font-semibold capitalize">{notificationStatus}</span>
            </span>
          </div>

          <button
            onClick={handleRequestNotification}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white transition-all cursor-pointer shadow-xs"
          >
            {notificationStatus === 'granted' ? 'Send Test Notification' : 'Enable Reminders'}
          </button>
        </div>
      </div>

      {/* 3. Backup, Export & Import */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
          <Download className="w-4 h-4 text-sky-500" />
          Backup, Export & Restore Data
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Export your habits, schedules, and checkmarks into an offline JSON backup file, or restore them anytime.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export card */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col justify-between gap-3">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                Export Data
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Download a complete JSON file containing all active habits and completion history.
              </p>
            </div>
            <button
              onClick={onExportData}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              Download JSON Backup
            </button>
          </div>

          {/* Import card */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col justify-between gap-3">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                Import & Restore Data
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Restore habits and historical logs from a previously exported JSON backup.
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
                id="json-import-input"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 active:bg-slate-950 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Upload className="w-4 h-4" />
                Upload JSON Backup
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Reset All Data */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-950/70 shadow-sm p-6">
        <h3 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4" />
          Reset All Habit Data
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Wipes local checkmarks and resets habits to the clean initial starter setup.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50">
          <div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white block">
              Danger Zone
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              This action cannot be undone unless you have a JSON backup file.
            </span>
          </div>

          <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white transition-all cursor-pointer shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All Data
          </button>
        </div>
      </div>

      {/* 5. Privacy Notice */}
      <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
          <span className="font-bold block text-sm mb-0.5">100% Offline & Private</span>
          All habits, schedules, and checkmarks are stored strictly within your browser's local storage.
          No accounts, cookies, analytics trackers, or external databases are used.
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset All Habit Data"
        message="Are you sure you want to reset all habits and checkmarks? This will return the application to its initial sample state."
        confirmText="Yes, Reset Everything"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={() => {
          onResetData();
          setIsResetModalOpen(false);
        }}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
}
