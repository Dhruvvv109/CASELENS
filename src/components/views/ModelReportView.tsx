"use client";

import React from "react";
import { ModelMetricComparison, FeatureImportance } from "@/lib/types";
import { BarChartIcon } from "../icons";

// ── Single source of truth for all numbers on this page ───────────────────────
// These values come from getModelMetrics() in src/lib/data.ts.
const NUMBERS = {
  mae:  { baseline: 42.3, withPrec: 28.7, unit: "days" },
  r2:   { baseline: 0.45, withPrec: 0.72, unit: "" },
  maeDrop: (42.3 - 28.7).toFixed(1), // "13.6"
  model: "Gradient Boosting Regressor",
};

interface ModelReportViewProps {
  metrics: ModelMetricComparison[];
  featureImportance: FeatureImportance[];
  isLoading?: boolean;
}

export function ModelReportView({ featureImportance, isLoading }: ModelReportViewProps) {
  // ── Loading skeleton ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-[#edeae3] rounded w-1/3" />
        <div className="h-16 bg-[#edeae3] rounded" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-28 bg-[#edeae3] rounded" />
          <div className="h-28 bg-[#edeae3] rounded" />
        </div>
        <div className="h-32 bg-[#edeae3] rounded" />
        <div className="h-48 bg-[#edeae3] rounded" />
      </div>
    );
  }

  // ── Feature bar chart data (uses existing feature names from data.ts) ────────
  const features = featureImportance.length > 0
    ? featureImportance
    : [
        { rank: 1, featureName: "top1_similarity",      category: "Precedent Intelligence" as const, meanShap: 0.32, direction: "", description: "" },
        { rank: 2, featureName: "hearings_count",        category: "Procedural"             as const, meanShap: 0.24, direction: "", description: "" },
        { rank: 3, featureName: "mean_top5_similarity",  category: "Precedent Intelligence" as const, meanShap: 0.18, direction: "", description: "" },
        { rank: 4, featureName: "outcome_agreement",     category: "Precedent Intelligence" as const, meanShap: 0.14, direction: "", description: "" },
        { rank: 5, featureName: "precedent_age_mean",    category: "Precedent Intelligence" as const, meanShap: 0.12, direction: "", description: "" },
      ];

  const maxShap = Math.max(...features.map(f => f.meanShap));

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── Title ──────────────────────────────────────────────────────────────── */}
      <div className="pb-3 border-b border-[#e2ded6]">
        <h1 className="font-serif text-2xl font-bold text-[#16191c]">
          Model Benchmark Report
        </h1>
        <p className="text-xs text-[#636a73] font-sans mt-0.5">
          Does adding precedent features improve time-to-resolution prediction?
        </p>
      </div>

      {/* ── Disclosure banner ──────────────────────────────────────────────────── */}
      <div className="bg-[#fef9ee] border border-[#e8d5a3] rounded px-4 py-3 text-xs text-[#7a5400] font-sans">
        <span className="font-semibold">Note:</span> Metadata is simulated. These figures
        show the method, not accuracy on real court data.
      </div>

      {/* ── Core finding ───────────────────────────────────────────────────────── */}
      <p className="text-sm font-sans text-[#3d434b]">
        Adding precedent-strength features reduces prediction error.
      </p>

      {/* ── Side-by-side model cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Card 1 — Metadata only */}
        <div className="bg-[#fcfbf9] border border-[#dedad0] rounded p-4 space-y-3">
          <h3 className="font-serif text-sm font-bold text-[#16191c]">Metadata only</h3>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[#636a73]">MAE</span>
              <span className="font-bold text-[#181a1d]">{NUMBERS.mae.baseline} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636a73]">R²</span>
              <span className="font-bold text-[#181a1d]">{NUMBERS.r2.baseline}</span>
            </div>
          </div>
        </div>

        {/* Card 2 — Metadata + Precedent */}
        <div className="bg-[#f0f6f4] border border-[#b8d4cc] rounded p-4 space-y-3">
          <h3 className="font-serif text-sm font-bold text-[#16191c]">
            Metadata + Precedent features
          </h3>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[#636a73]">MAE</span>
              <span className="font-bold text-[#1f5938]">{NUMBERS.mae.withPrec} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636a73]">R²</span>
              <span className="font-bold text-[#1f5938]">{NUMBERS.r2.withPrec}</span>
            </div>
          </div>
          <p className="text-[11px] font-sans text-[#1f5938] border-t border-[#b8d4cc] pt-2">
            MAE lower by {NUMBERS.maeDrop} days
          </p>
        </div>
      </div>

      {/* ── Comparison table (MAE and R² only) ────────────────────────────────── */}
      <div className="space-y-2">
        <h3 className="font-serif text-base font-bold text-[#16191c]">
          Comparison
        </h3>
        <div className="border border-[#dedad0] rounded bg-[#fcfbf9] overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f4f2ec] border-b border-[#dedad0] font-mono text-[11px] text-[#555b63] uppercase tracking-wider">
                <th className="py-2.5 px-3">Metric</th>
                <th className="py-2.5 px-3 text-right">Metadata only</th>
                <th className="py-2.5 px-3 text-right bg-[#edeae1]">Metadata + Precedent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ede9e1] font-sans">
              <tr className="hover:bg-[#f6f4ee]">
                <td className="py-3 px-3 font-medium text-[#181a1d]">MAE (days)</td>
                <td className="py-3 px-3 font-mono text-right text-[#555a62]">{NUMBERS.mae.baseline}</td>
                <td className="py-3 px-3 font-mono text-right font-bold text-[#1f5938] bg-[#f7f5ef]">{NUMBERS.mae.withPrec}</td>
              </tr>
              <tr className="hover:bg-[#f6f4ee]">
                <td className="py-3 px-3 font-medium text-[#181a1d]">R²</td>
                <td className="py-3 px-3 font-mono text-right text-[#555a62]">{NUMBERS.r2.baseline}</td>
                <td className="py-3 px-3 font-mono text-right font-bold text-[#1f5938] bg-[#f7f5ef]">{NUMBERS.r2.withPrec}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Feature importance bars ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <h3 className="font-serif text-base font-bold text-[#16191c]">Feature importance</h3>
        <p className="text-xs text-[#636a73] font-sans">
          Relative importance of each input feature in the {NUMBERS.model}.
        </p>

        <div className="space-y-2.5">
          {features.map((f) => {
            const pct = Math.round((f.meanShap / maxShap) * 100);
            const isPrecedent = f.category === "Precedent Intelligence";
            return (
              <div key={f.rank} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-[#16191c] truncate">{f.featureName}</span>
                    <span
                      className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded border font-semibold uppercase ${
                        isPrecedent
                          ? "bg-[#e7f0ee] text-[#1c3838] border-[#c0d4d0]"
                          : "bg-[#f4f2ec] text-[#555a62] border-[#dedad0]"
                      }`}
                    >
                      {isPrecedent ? "Precedent" : "Metadata"}
                    </span>
                  </div>
                  <span className="text-[#636a73] ml-3 shrink-0">{f.meanShap.toFixed(2)}</span>
                </div>
                <div className="h-2 bg-[#edeae3] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isPrecedent ? "bg-[#1c3838]" : "bg-[#8a919c]"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
