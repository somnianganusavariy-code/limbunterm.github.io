import React from 'react';
import { Edit3 } from 'lucide-react';
import { useCms } from '../../context/CmsContext';

interface InlineSectionEditBadgeProps {
  sectionId: string;
  sectionName: string;
}

export const InlineSectionEditBadge: React.FC<InlineSectionEditBadgeProps> = ({ 
  sectionId, 
  sectionName 
}) => {
  const { isAdminLoggedIn, jumpToEditSection } = useCms();

  if (!isAdminLoggedIn) return null;

  return (
    <div className="absolute top-4 right-4 z-20">
      <button
        onClick={e => {
          e.stopPropagation();
          jumpToEditSection(sectionId);
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-[#EA580C] text-white text-xs font-bold shadow-lg backdrop-blur-sm border border-zinc-700/80 transition-all hover:scale-105 cursor-pointer"
        title={`Edit ${sectionName} in Studio CMS`}
      >
        <Edit3 className="w-3.5 h-3.5 text-orange-400 group-hover:text-white" />
        <span>Edit {sectionName}</span>
      </button>
    </div>
  );
};
