'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowLeft, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { searchHadis } from '@/lib/api';
import { HadithCard } from '@/components/HadithCard';
import { HadithDetail } from '@/components/HadithDetail';
import { Button } from '@/components/ui/Button';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const initialPage = parseInt(searchParams.get('page') || '1');
  const initialKitab = searchParams.get('kitab') || '';

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(query);
  const [selectedHadith, setSelectedHadith] = useState<any>(null);

  useEffect(() => {
    fetchResults();
  }, [query, initialPage, initialKitab]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const data = await searchHadis(query, initialPage, 20, initialKitab);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/search?${params.toString()}`);
  };

  const toggleKitab = (kitab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (initialKitab === kitab) {
      params.delete('kitab');
    } else {
      params.set('kitab', kitab);
    }
    params.set('page', '1');
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] px-4 h-16 flex items-center gap-6">
        <div 
          className="text-xl font-bold cursor-pointer text-[var(--foreground)] px-2"
          onClick={() => router.push('/')}
        >
          Takhrij
        </div>
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground)]/20" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--foreground)]/5 border border-[var(--border)] rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:bg-[var(--foreground)]/8 focus:border-[var(--foreground)]/20 transition-all text-[var(--foreground)]"
              placeholder="Cari lagi..."
            />
          </div>
        </form>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-56 shrink-0 space-y-8">
          <div className="space-y-4">
            <h3 className="text-[11px] uppercase tracking-widest text-[var(--foreground-muted)]/40 font-bold px-2">Filter Kitab</h3>
            <div className="flex flex-col gap-1">
              {results?.facets?.kitab && Object.keys(results.facets.kitab).length > 0 ? (
                Object.entries(results.facets.kitab).map(([kitab, count]: [string, any]) => (
                  <button
                    key={kitab}
                    onClick={() => toggleKitab(kitab)}
                    className={`text-left px-3 py-2 rounded-lg text-xs transition-all flex justify-between items-center group ${
                      initialKitab === kitab 
                      ? 'bg-[var(--foreground)]/10 text-[var(--foreground)]' 
                      : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5'
                    }`}
                  >
                    <span className="truncate font-medium">{kitab}</span>
                    <span className="text-[10px] font-mono opacity-30">{count}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-[10px] text-[var(--foreground-muted)] italic">Belum ada filter</div>
              )}
            </div>
          </div>
        </aside>

        {/* Results List */}
        <main className="flex-1 space-y-8">
          <div className="space-y-2">
            <div className="text-xs text-[var(--foreground-muted)] px-1">
              {loading ? "Mencari..." : `Ditemukan ${results?.total || 0} hadis`}
            </div>
            
            {results?.suggestion && (
              <div className="text-sm px-1">
                <span className="text-[var(--foreground-muted)]">Mungkin maksud Anda: </span>
                <button 
                  onClick={() => {
                    setSearchQuery(results.suggestion);
                    router.push(`/search?q=${encodeURIComponent(results.suggestion)}`);
                  }}
                  className="text-white hover:underline font-medium"
                >
                  {results.suggestion}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-40 rounded-xl bg-white/5 animate-pulse" />
              ))
            ) : results?.hits?.length > 0 ? (
              results.hits.map((hit: any) => (
                <HadithCard 
                  key={hit.id} 
                  hadith={hit} 
                  onClick={() => setSelectedHadith(hit)}
                />
              ))
            ) : (
              <div className="py-20 text-center text-white/20 text-sm italic">
                Tidak ada hadis ditemukan.
              </div>
            )}
          </div>

          {/* Numbered Pagination */}
          {results?.total > 20 && (
            <div className="flex items-center gap-2 pt-12">
              <Button
                variant="glass"
                disabled={initialPage === 1}
                onClick={() => changePage(initialPage - 1)}
                className="h-9 w-9 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {/* Page Numbers */}
              {(() => {
                const totalPages = Math.ceil(results.total / 20);
                const pages = [];
                const maxVisible = 5;
                
                let start = Math.max(1, initialPage - Math.floor(maxVisible / 2));
                let end = Math.min(totalPages, start + maxVisible - 1);
                
                if (end - start + 1 < maxVisible) {
                  start = Math.max(1, end - maxVisible + 1);
                }

                if (start > 1) {
                  pages.push(
                    <Button key={1} variant="glass" className="h-9 w-9 p-0 text-xs" onClick={() => changePage(1)}>1</Button>
                  );
                  if (start > 2) pages.push(<span key="sp1" className="text-white/20 px-1">...</span>);
                }

                for (let i = start; i <= end; i++) {
                  pages.push(
                    <Button
                      key={i}
                      variant={initialPage === i ? "primary" : "glass"}
                      className="h-9 w-9 p-0 text-xs"
                      onClick={() => changePage(i)}
                    >
                      {i}
                    </Button>
                  );
                }

                if (end < totalPages) {
                  if (end < totalPages - 1) pages.push(<span key="sp2" className="text-white/20 px-1">...</span>);
                  pages.push(
                    <Button key={totalPages} variant="glass" className="h-9 w-9 p-0 text-xs" onClick={() => changePage(totalPages)}>{totalPages}</Button>
                  );
                }

                return pages;
              })()}

              <Button
                variant="glass"
                disabled={initialPage >= Math.ceil(results.total / 20)}
                onClick={() => changePage(initialPage + 1)}
                className="h-9 w-9 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </main>
      </div>

      <HadithDetail 
        hadith={selectedHadith} 
        isOpen={!!selectedHadith} 
        onClose={() => setSelectedHadith(null)} 
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-white/20" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
