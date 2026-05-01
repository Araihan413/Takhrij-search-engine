'use client';

import React from 'react';

interface HadithCardProps {
  hadith: {
    id: string;
    kitab: string;
    nomor: number;
    arab: string;
    terjemahan: string;
    derajat?: string;
  };
  onClick?: () => void;
}

export function HadithCard({ hadith, onClick }: HadithCardProps) {
  return (
    <div
      className="group cursor-pointer py-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--foreground)]/[0.02] px-3 rounded-lg transition-colors"
      onClick={onClick}
    >
      <div className="space-y-2">
        {/* Header Metadata */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] font-medium">
            {hadith.kitab}
          </span>
          <span className="text-[10px] text-[var(--foreground-muted)]/40 font-mono">#{hadith.nomor}</span>
          {hadith.derajat && (
            <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded border ${
              hadith.derajat.toLowerCase().includes('shahih') ? 'border-emerald-500/20 text-emerald-500/60 bg-emerald-500/5' :
              hadith.derajat.toLowerCase().includes('hasan') ? 'border-amber-500/20 text-amber-500/60 bg-amber-500/5' :
              'border-[var(--border)] text-[var(--foreground-muted)]'
            }`}>
              {hadith.derajat}
            </span>
          )}
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <p 
            className="text-xl text-right leading-relaxed font-arabic text-[var(--foreground)] group-hover:text-[var(--foreground)] transition-colors"
            dir="rtl"
            dangerouslySetInnerHTML={{ __html: hadith.arab }}
          />
          <p 
            className="text-[var(--foreground-muted)] text-sm leading-relaxed line-clamp-2 font-light group-hover:text-[var(--foreground)] transition-colors"
            dangerouslySetInnerHTML={{ __html: hadith.terjemahan }}
          />
        </div>
      </div>
    </div>
  );
}
