"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search, ArrowRight, History } from "lucide-react";

export default function LandingPage() {
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("takhrij_history");
    if (saved) setHistory(JSON.parse(saved).slice(0, 5));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    const newHistory = [search, ...history.filter(h => h !== search)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("takhrij_history", JSON.stringify(newHistory));
    
    window.location.href = `/search?q=${encodeURIComponent(search)}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Simple Branding */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)] mb-2">Takhrij</h1>
          <p className="text-[var(--foreground-muted)] text-sm">Pencarian Hadis Tercepat</p>
        </div>

        {/* Standard Search Bar */}
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-[var(--foreground-muted)]">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari hadis..."
              className="w-full h-14 bg-[var(--foreground)]/5 border border-[var(--border)] rounded-2xl pl-12 pr-16 text-lg outline-none focus:bg-[var(--foreground)]/8 focus:border-[var(--foreground)]/20 transition-all text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]"
            />
            <div className="absolute right-2">
              <Button 
                type="submit" 
                variant="primary"
                className="h-10 px-4"
              >
                Cari
              </Button>
            </div>
          </div>
        </form>

        {/* History Pills */}
        {history.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {history.map((item, i) => (
              <button
                key={i}
                onClick={() => setSearch(item)}
                className="px-3 py-1.5 rounded-full bg-[var(--foreground)]/5 border border-[var(--border)] text-xs text-[var(--foreground-muted)] hover:bg-[var(--foreground)]/10 hover:text-[var(--foreground)] transition-all"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Simple Footer */}
      <div className="absolute bottom-8 text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]/20">
        Takhrij Hadith Search Engine
      </div>
    </div>
  );
}
