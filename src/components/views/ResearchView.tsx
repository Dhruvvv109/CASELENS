import React, { useState, useEffect, useRef } from "react";
import { Precedent } from "@/lib/types";
import {
  SearchIcon,
  FilterIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  BookmarkIcon,
  XIcon,
  FileTextIcon,
  SlidersIcon,
  ScaleIcon,
} from "../icons";

interface ResearchViewProps {
  precedents: Precedent[];
  initialQuery?: string;
  onSelectCaseWithPrecedent?: (precedentId: string) => void;
  isLoading?: boolean;
}

export function ResearchView({
  precedents,
  initialQuery = "",
  onSelectCaseWithPrecedent,
  isLoading = false,
}: ResearchViewProps) {
  const [query, setQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [courtFilter, setCourtFilter] = useState("all");
  const [caseTypeFilter, setCaseTypeFilter] = useState("all");
  const [searchMethod, setSearchMethod] = useState<"hybrid" | "semantic" | "keyword">("hybrid");
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);
  const [viewingJudgment, setViewingJudgment] = useState<Precedent | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Keyboard shortcut: '/' focuses search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered and searched precedents
  const filteredPrecedents = precedents.filter((p) => {
    if (courtFilter !== "all" && !p.court.toLowerCase().includes(courtFilter.toLowerCase())) {
      return false;
    }
    if (caseTypeFilter !== "all" && p.caseType !== caseTypeFilter) {
      return false;
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCite = p.citation.toLowerCase().includes(q);
      const matchText = p.fullText.toLowerCase().includes(q);
      const matchFacts = p.summary.facts.toLowerCase().includes(q);
      return matchTitle || matchCite || matchText || matchFacts;
    }
    return true;
  });

  return (
    <div className="space-y-5 relative">
      {/* Page Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#e2ded6] gap-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#16191c]">
            Judicial Precedent Retrieval
          </h1>
          <p className="text-xs text-[#636a73] font-sans mt-0.5">
            Vector ANN search over Indian judgments with TF-IDF keyword baseline comparison
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#525860]">
          <span className="bg-[#f0ece5] px-2.5 py-1 rounded border border-[#ddd8cc]">
            Indexed Judgments: <strong>{precedents.length}</strong>
          </span>
          <span className="bg-[#f0ece5] px-2.5 py-1 rounded border border-[#ddd8cc]">
            Model: <strong>all-MiniLM-L6-v2 (384d)</strong>
          </span>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-3 bg-[#f0f4f4] border border-[#c0d8d8] rounded px-4 py-3 text-xs font-mono text-[#1c3838]">
          <svg className="w-4 h-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Searching precedent database... please wait
        </div>
      )}

      {/* Main Search Bar & Method Switcher */}
      <div className="bg-[#fcfbf9] border border-[#dedad0] rounded p-4 space-y-3">
        <div className="relative flex items-center">
          <SearchIcon className="w-4 h-4 text-[#757c87] absolute left-3.5 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search judicial precedents by facts, ratio decidendi, citations, or statutory provisions (Press '/' to focus)..."
            className="w-full bg-white border border-[#cfc9be] rounded pl-10 pr-24 py-3 text-sm text-[#16191c] placeholder:text-[#888f99] focus:outline-none focus:border-[#1c3838] focus:ring-1 focus:ring-[#1c3838] font-sans"
          />

          <div className="absolute right-2 flex items-center space-x-1.5">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-2.5 py-1.5 rounded text-xs font-medium border flex items-center space-x-1 transition-colors ${
                showFilters
                  ? "bg-[#1c3838] text-white border-[#1c3838]"
                  : "bg-[#f2efe9] text-[#4a5058] border-[#d8d3c7] hover:bg-[#eae6dd]"
              }`}
            >
              <FilterIcon className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Collapsible Filter Bar */}
        {showFilters && (
          <div className="pt-3 border-t border-[#ede9e1] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-mono text-[11px] text-[#636a73] uppercase tracking-wider mb-1">
                Court Jurisdiction
              </label>
              <select
                value={courtFilter}
                onChange={(e) => setCourtFilter(e.target.value)}
                className="w-full bg-white border border-[#cfc9be] rounded px-2.5 py-1.5 text-xs text-[#16191c] focus:outline-none focus:border-[#1c3838]"
              >
                <option value="all">All Indian Courts</option>
                <option value="supreme court">Supreme Court of India</option>
                <option value="delhi">High Court of Delhi</option>
                <option value="bombay">High Court of Bombay</option>
                <option value="karnataka">High Court of Karnataka</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-[#636a73] uppercase tracking-wider mb-1">
                Case Classification
              </label>
              <select
                value={caseTypeFilter}
                onChange={(e) => setCaseTypeFilter(e.target.value)}
                className="w-full bg-white border border-[#cfc9be] rounded px-2.5 py-1.5 text-xs text-[#16191c] focus:outline-none focus:border-[#1c3838]"
              >
                <option value="all">All Case Types</option>
                <option value="CRL.A">CRL.A (Criminal Appeal)</option>
                <option value="W.P.(C)">W.P.(C) (Civil Writ Petition)</option>
                <option value="SLP(Crl)">SLP(Crl) (Special Leave)</option>
                <option value="CIV.A">CIV.A (Civil Appeal)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-[#636a73] uppercase tracking-wider mb-1">
                Retrieval Algorithm
              </label>
              <div className="flex rounded border border-[#cfc9be] overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setSearchMethod("hybrid")}
                  className={`flex-1 py-1.5 text-[11px] font-mono transition-colors ${
                    searchMethod === "hybrid"
                      ? "bg-[#1c3838] text-white font-medium"
                      : "text-[#555b63] hover:bg-[#f6f4ee]"
                  }`}
                >
                  Hybrid
                </button>
                <button
                  type="button"
                  onClick={() => setSearchMethod("semantic")}
                  className={`flex-1 py-1.5 text-[11px] font-mono transition-colors border-l border-r border-[#cfc9be] ${
                    searchMethod === "semantic"
                      ? "bg-[#1c3838] text-white font-medium"
                      : "text-[#555b63] hover:bg-[#f6f4ee]"
                  }`}
                >
                  FAISS Cosine
                </button>
                <button
                  type="button"
                  onClick={() => setSearchMethod("keyword")}
                  className={`flex-1 py-1.5 text-[11px] font-mono transition-colors ${
                    searchMethod === "keyword"
                      ? "bg-[#1c3838] text-white font-medium"
                      : "text-[#555b63] hover:bg-[#f6f4ee]"
                  }`}
                >
                  TF-IDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#636a73] font-mono px-1">
        <span>
          Showing <strong>{filteredPrecedents.length}</strong> judicial judgments matching criteria
        </span>
        <span className="text-[11px]">Sorted by Semantic Similarity Score</span>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {filteredPrecedents.length === 0 ? (
          <div className="bg-[#fcfbf9] border border-[#dedad0] rounded p-8 text-center text-xs space-y-2">
            <div className="font-mono text-sm font-semibold text-[#16191c]">
              No judicial authorities match the search criteria
            </div>
            <p className="text-[#636a73] max-w-md mx-auto leading-relaxed">
              No judgments in the corpus match &ldquo;{query}&rdquo; under the selected court and case type filters. Try searching by broader legal doctrine (e.g. &ldquo;Article 21 speedy trial&rdquo; or &ldquo;Section 45 PMLA&rdquo;).
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCourtFilter("all");
                setCaseTypeFilter("all");
              }}
              className="mt-2 px-3 py-1 bg-[#1c3838] text-white font-mono rounded text-xs hover:bg-[#142828] transition-colors"
            >
              Reset Filters & View All Precedents
            </button>
          </div>
        ) : (
          filteredPrecedents.map((p) => {
          const isExpanded = expandedSummaryId === p.id;
          const isBookmarked = bookmarkedIds.includes(p.id);

          return (
            <div
              key={p.id}
              className="bg-[#fcfbf9] border border-[#dedad0] rounded hover:border-[#b8b3a7] transition-all overflow-hidden"
            >
              {/* Row Header */}
              <div className="p-4 space-y-2">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <h2
                        onClick={() => setViewingJudgment(p)}
                        className="font-serif text-base font-bold text-[#16191c] hover:text-[#1c3838] cursor-pointer hover:underline"
                      >
                        {p.title}
                      </h2>
                      <button
                        onClick={(e) => toggleBookmark(p.id, e)}
                        className={`text-xs p-1 rounded hover:bg-[#efece5] ${
                          isBookmarked ? "text-[#73202f]" : "text-[#9ca3af]"
                        }`}
                        title="Bookmark precedent"
                      >
                        <BookmarkIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-[#5a616b] flex-wrap font-sans">
                      <span className="font-mono text-xs font-semibold text-[#181a1d] bg-[#f0ece3] px-2 py-0.5 rounded border border-[#ddd7ca]">
                        {p.citation}
                      </span>
                      <span>•</span>
                      <span>{p.court}</span>
                      <span>•</span>
                      <span>Pronounced: {p.judgmentDate}</span>
                      <span>•</span>
                      <span
                        className={`font-mono text-[11px] font-semibold px-1.5 py-0.2 rounded ${
                          p.outcome === "Allowed"
                            ? "bg-[#eaf4ed] text-[#1f5938]"
                            : "bg-[#fbeff1] text-[#73202f]"
                        }`}
                      >
                        {p.outcome}
                      </span>
                    </div>
                  </div>

                  {/* Similarity Metrics Bars */}
                  <div className="flex items-center space-x-4 shrink-0 bg-[#f6f4ee] p-2.5 rounded border border-[#e5e1d7] font-mono text-xs">
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-[#636a73] mb-1">
                        <span>Semantic Match:</span>
                        <span className="font-bold text-[#1c3838] ml-2">
                          {(p.similarityScore * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-32 h-1.5 bg-[#e0dbd1] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1c3838] rounded-full"
                          style={{ width: `${p.similarityScore * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="pl-3 border-l border-[#dedad0]">
                      <div className="text-[10px] text-[#787f8a]">TF-IDF Baseline</div>
                      <div className="font-semibold text-[#5a616b] text-[11px]">
                        {(p.keywordScore * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Brief Summary Excerpt */}
                <p className="text-xs text-[#3f444c] leading-relaxed pt-1">
                  <strong>Ratio Decidendi:</strong> {p.summary.holding}
                </p>

                {/* Snippets match highlight */}
                {p.matchedSnippets && p.matchedSnippets.length > 0 && (
                  <div className="bg-[#f6f4ee] border-l-2 border-[#1c3838] p-2 rounded-r text-[11px] text-[#4a5058] font-mono italic">
                    {p.matchedSnippets[0]}
                  </div>
                )}

                {/* Actions row: Expand Facts / Read Full Judgment */}
                <div className="flex items-center justify-between pt-2 border-t border-[#ede9e1] text-xs">
                  <button
                    onClick={() => setExpandedSummaryId(isExpanded ? null : p.id)}
                    className="text-[#1c3838] font-mono text-[11px] font-semibold hover:underline flex items-center space-x-1"
                  >
                    <span>{isExpanded ? "Collapse Analysis" : "Expand Facts & Issues"}</span>
                    <ChevronDownIcon
                      className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setViewingJudgment(p)}
                      className="text-xs font-mono text-[#525862] hover:text-[#181a1d] flex items-center space-x-1 font-medium bg-[#f0ece4] hover:bg-[#e7e2d7] px-2.5 py-1 rounded border border-[#dcd6c8] transition-colors"
                    >
                      <FileTextIcon className="w-3.5 h-3.5" />
                      <span>Read Full Judgment</span>
                    </button>
                  </div>
                </div>

                {/* Expandable Facts / Issue / Holding Drawer */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#e5e1d7] bg-[#f8f7f2] -mx-4 -mb-4 p-4 space-y-3 text-xs font-sans">
                    <div>
                      <span className="font-mono text-[10px] uppercase font-bold text-[#636a73] block mb-0.5">
                        Factual Matrix
                      </span>
                      <p className="text-[#3b4047] leading-relaxed">{p.summary.facts}</p>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] uppercase font-bold text-[#636a73] block mb-0.5">
                        Legal Question / Issue
                      </span>
                      <p className="text-[#3b4047] leading-relaxed">{p.summary.issue}</p>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] uppercase font-bold text-[#636a73] block mb-0.5">
                        Bench Members
                      </span>
                      <p className="font-mono text-[11px] text-[#4a5058]">{p.bench}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }))}
      </div>

      {/* Slide-over Panel: Read Full Judgment with highlighted passages */}
      {viewingJudgment && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs transition-all">
          <div className="w-full max-w-2xl bg-[#fcfbf9] h-full shadow-2xl border-l border-[#dcd7cb] flex flex-col justify-between animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#e2ded6] bg-[#f6f4ee] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#686f7a] block">
                  Judicial Judgment Reader
                </span>
                <h3 className="font-serif text-lg font-bold text-[#16191c] line-clamp-1">
                  {viewingJudgment.title}
                </h3>
                <span className="font-mono text-xs text-[#1c3838] font-semibold">
                  {viewingJudgment.citation} • {viewingJudgment.court}
                </span>
              </div>

              <button
                onClick={() => setViewingJudgment(null)}
                className="p-1.5 rounded hover:bg-[#eae6dc] text-[#555a62]"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Full Judgment Text with Highlights) */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-[#2c3035] font-serif flex-1">
              <div className="p-3 bg-[#f2efe9] rounded border border-[#dfdad0] font-mono text-[11px] space-y-1 mb-4">
                <div><strong>Bench:</strong> {viewingJudgment.bench}</div>
                <div><strong>Date of Decision:</strong> {viewingJudgment.judgmentDate}</div>
                <div><strong>Disposal:</strong> {viewingJudgment.outcome}</div>
              </div>

              <div className="whitespace-pre-line leading-7 text-[13px]">
                {viewingJudgment.fullText}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-[#e2ded6] bg-[#f6f4ee] flex items-center justify-between text-xs font-mono">
              <span className="text-[#686f7a]">Word Count: {viewingJudgment.wordCount} tokens</span>
              <button
                onClick={() => setViewingJudgment(null)}
                className="px-3 py-1.5 bg-[#1c3838] text-white rounded text-xs font-medium hover:bg-[#142828]"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
