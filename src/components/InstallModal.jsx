import React, { useEffect } from 'react';
import {
  X,
  Share2,
  PlusSquare,
  Download,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export default function InstallModal({
  isOpen,
  onClose,
  isIOS,
  onTriggerNativeInstall,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-lg shrink-0">
              <img src="/app-icon.svg" alt="HabitFlow" className="w-11 h-11 rounded-xl" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/30 border border-emerald-300/40 text-emerald-100">
                Install as Mobile App
              </span>
              <h3 className="text-xl font-black mt-1">Download HabitFlow</h3>
              <p className="text-xs text-emerald-100/90">
                Use like a native app on your phone with zero app-store download needed!
              </p>
            </div>
          </div>
        </div>

        {/* Body Instructions */}
        <div className="p-6 space-y-4">
          {/* Benefits */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full Screen App</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Works Offline</span>
            </div>
          </div>

          {isIOS ? (
            /* iOS Safari Instructions */
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                How to install on iPhone / iPad:
              </p>
              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                    1
                  </span>
                  <div className="flex-1">
                    Tap the <strong className="text-slate-900 dark:text-white">Share</strong> icon at the bottom of Safari:
                    <span className="inline-flex items-center gap-1 font-bold text-sky-600 dark:text-sky-400 ml-1.5 px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60">
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                    2
                  </span>
                  <div className="flex-1">
                    Scroll down and tap <strong className="text-slate-900 dark:text-white">"Add to Home Screen"</strong>:
                    <span className="inline-flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 ml-1.5 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700">
                      <PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                    3
                  </span>
                  <div className="flex-1">
                    Tap <strong className="text-slate-900 dark:text-white">"Add"</strong> in the top-right corner. HabitFlow will now appear on your home screen!
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Android / Chrome One-Tap Install */
            <div className="space-y-4 pt-2">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Click the button below to install HabitFlow directly to your phone. It will create an app icon on your home screen and run in standalone app mode!
              </p>

              <button
                type="button"
                onClick={async () => {
                  const res = await onTriggerNativeInstall();
                  if (res?.success) {
                    onClose();
                  }
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                Install App on This Device
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            100% Free • No App Store needed
          </span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:underline cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
