import React from 'react';
import { useCms } from '../../context/CmsContext';
import { 
  Save, 
  Send, 
  RotateCcw, 
  Eye, 
  LayoutDashboard, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const PublishBar: React.FC = () => {
  const { 
    isAdminLoggedIn, 
    hasUnpublishedChanges, 
    isDraftMode, 
    setIsDraftMode,
    saveDraft, 
    publishLive, 
    revertDraft, 
    isSaving, 
    isPublishing,
    currentView,
    setCurrentView
  } = useCms();

  if (!isAdminLoggedIn) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#121214] text-white border-t border-zinc-800 shadow-2xl py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Status Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${hasUnpublishedChanges ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="font-bold text-white">
              {hasUnpublishedChanges ? 'Unpublished Draft Changes' : 'All Changes Published Live'}
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-700 hidden sm:block" />

          {/* Preview vs Published Mode Badge */}
          <div className="hidden md:flex items-center gap-1.5 bg-zinc-800/80 px-2.5 py-1 rounded-full text-zinc-300 text-[11px]">
            <span>Mode:</span>
            <strong className={isDraftMode ? 'text-amber-400' : 'text-emerald-400'}>
              {isDraftMode ? 'Draft Preview' : 'Live Public'}
            </strong>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2 justify-end">
          
          {/* Switch View: Dashboard / Portfolio */}
          {currentView === 'portfolio' ? (
            <button
              onClick={() => setCurrentView('cms_dashboard')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors font-semibold"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Studio CMS Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('portfolio')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors font-semibold"
            >
              <Eye className="w-3.5 h-3.5 text-zinc-300" />
              <span>View Website</span>
            </button>
          )}

          {/* Toggle Draft Preview */}
          <button
            onClick={() => setIsDraftMode(!isDraftMode)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors font-semibold ${
              isDraftMode 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
            }`}
            title="Toggle between Draft Preview and Live Public View"
          >
            <span>Preview Draft</span>
          </button>

          {/* Revert Changes */}
          {hasUnpublishedChanges && (
            <button
              onClick={() => {
                if (confirm('Discard all unpublished draft changes and revert to live published site?')) {
                  revertDraft();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-red-950 text-zinc-300 hover:text-red-300 border border-zinc-700 hover:border-red-800 transition-colors"
              title="Discard draft changes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Revert</span>
            </button>
          )}

          {/* Save Draft Button */}
          <button
            onClick={() => saveDraft()}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          {/* Publish Button */}
          <button
            onClick={() => publishLive()}
            disabled={isPublishing}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EA580C] hover:bg-[#D94F04] text-white font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isPublishing ? 'Publishing...' : 'Publish Live'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
