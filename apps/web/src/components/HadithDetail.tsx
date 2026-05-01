'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Bookmark, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getSimilarHadis } from '@/lib/api';
import { HadithCard } from './HadithCard';

interface HadithDetailProps {
  hadith: any;
  isOpen: boolean;
  onClose: () => void;
}

export function HadithDetail({ hadith: initialHadith, isOpen, onClose }: HadithDetailProps) {
  const [activeHadith, setActiveHadith] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveHadith(initialHadith);
    } else {
      setActiveHadith(null);
    }
  }, [isOpen, initialHadith]);

  useEffect(() => {
    if (isOpen && activeHadith?.id) {
      fetchSimilar();
    }
  }, [isOpen, activeHadith]);

  const fetchSimilar = async () => {
    if (!activeHadith?.id) return;
    setLoading(true);
    try {
      const data = await getSimilarHadis(activeHadith.id);
      setSimilar(data.hits || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!activeHadith) return;
    const text = `${activeHadith.arab}\n\n${activeHadith.terjemahan}\n\n(${activeHadith.kitab}, No. ${activeHadith.nomor})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !activeHadith) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-2xl no-scrollbar"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] uppercase tracking-widest text-white/40 font-medium">
                {activeHadith.kitab}
              </span>
              <span className="text-[10px] text-white/20 font-mono">#{activeHadith.nomor}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="glass" className="h-8 px-3 text-[10px]" onClick={copyToClipboard}>
                {copied ? <Check className="w-3 h-3 text-emerald-400 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
                {copied ? 'Tersalin' : 'Salin'}
              </Button>
              <Button variant="glass" className="h-8 w-8 p-0" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 md:p-10 space-y-10">
            <div className="space-y-6">
              <p 
                className="text-3xl text-right leading-relaxed font-arabic text-[var(--foreground)]"
                dir="rtl"
                dangerouslySetInnerHTML={{ __html: activeHadith.arab }}
              />
              <div className="h-px w-full bg-[var(--border)]" />
              <p 
                className="text-sm md:text-base text-[var(--foreground-muted)] leading-relaxed font-light"
                dangerouslySetInnerHTML={{ __html: activeHadith.terjemahan }}
              />
            </div>

            {/* Metadata Tags */}
            <div className="flex flex-wrap gap-2">
              {activeHadith.derajat && (
                <div className="px-3 py-1 rounded-lg bg-[var(--foreground)]/5 text-[11px]">
                  <span className="text-[var(--foreground-muted)]/50 mr-2">Derajat:</span>
                  <span className="text-[var(--foreground)]/60">{activeHadith.derajat}</span>
                </div>
              )}
              {activeHadith.bab && (
                <div className="px-3 py-1 rounded-lg bg-[var(--foreground)]/5 text-[11px]">
                  <span className="text-[var(--foreground-muted)]/50 mr-2">Bab:</span>
                  <span className="text-[var(--foreground)]/60">{activeHadith.bab}</span>
                </div>
              )}
            </div>

            {/* Similar Hadiths */}
            <div className="pt-10 space-y-8 border-t border-[var(--border)]">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-[var(--foreground-muted)] font-bold whitespace-nowrap">
                  Eksplorasi Hadis Serupa
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-4 h-4 animate-spin text-white/20" />
                  </div>
                ) : similar.length > 0 ? (
                  similar.map((sim: any) => (
                    <div key={sim.id} className="relative group/sim opacity-90 hover:opacity-100 transition-opacity">
                      <div className="absolute top-4 right-4 z-10 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[7px] uppercase tracking-widest text-emerald-500/80 font-bold pointer-events-none">
                        Relevan
                      </div>
                      <HadithCard hadith={sim} onClick={() => {
                        setActiveHadith(sim);
                        const modalContent = document.querySelector('.max-h-\\[90vh\\]');
                        modalContent?.scrollTo({ top: 0, behavior: 'smooth' });
                      }} />
                    </div>
                  ))
                ) : (
                  <p className="text-white/20 text-[10px] italic text-center">Tidak ada hadis terkait.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
