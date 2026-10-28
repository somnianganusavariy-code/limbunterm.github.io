import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  message?: string;
  warningTitle?: string;
  warningList?: string[];
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  itemName,
  message,
  warningTitle,
  warningList,
  onConfirm,
  onCancel,
  isDeleting = false
}) => {
  if (!isOpen) return null;

  const hasWarnings = warningList && warningList.length > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="fixed inset-0" onClick={onCancel} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 bg-white text-zinc-900 rounded-[28px] max-w-lg w-full shadow-2xl border border-zinc-200 overflow-hidden p-6 sm:p-7 space-y-5"
        >
          {/* Top Icon & Close */}
          <div className="flex items-start justify-between">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
              hasWarnings ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
            }`}>
              <AlertTriangle className="w-6 h-6 stroke-[2]" />
            </div>
            <button
              onClick={onCancel}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Heading & Content */}
          <div className="space-y-3">
            <h3 className="text-xl font-extrabold text-zinc-950 tracking-tight">
              Delete {title}?
            </h3>
            
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {message || (
                <>
                  Are you sure you want to permanently delete{' '}
                  <strong className="text-zinc-950">&quot;{itemName}&quot;</strong>? This item will be removed from your website and database.
                </>
              )}
            </p>

            {hasWarnings && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{warningTitle || 'Warning: File is currently in use!'}</span>
                </div>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  This media file is actively referenced in the following website sections. Deleting it will cause broken visuals for visitors:
                </p>
                <ul className="list-disc list-inside space-y-1 font-medium pl-1 text-[11px] text-amber-900 max-h-32 overflow-y-auto">
                  {warningList.map((item, idx) => (
                    <li key={idx} className="truncate">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-full border border-zinc-300 hover:bg-zinc-100 text-xs font-semibold text-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
