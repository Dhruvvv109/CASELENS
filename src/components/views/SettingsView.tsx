"use client";

import React, { useState, useEffect, useRef } from "react";
import { UserProfile, UserRole, TableDensity } from "@/lib/types";
import { fetchSystemStatus } from "@/lib/api";
import {
  ShieldIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  SlidersIcon,
  ScaleIcon,
  FileTextIcon,
} from "../icons";

interface SettingsViewProps {
  currentUser: UserProfile | null;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedBench: string;
  onBenchChange: (bench: string) => void;
  tableDensity: TableDensity;
  onDensityChange: (density: TableDensity) => void;
}

export function SettingsView({
  currentUser,
  currentRole,
  onRoleChange,
  tableDensity,
  onDensityChange,
}: SettingsViewProps) {
  // ── System status (3-second timeout, no auto-refresh) ─────────────────────
  const [backendStatus, setBackendStatus] = useState<"loading" | "online" | "offline">("loading");
  const [judgmentsCount, setJudgmentsCount] = useState<number | null>(null);
  const [modelLoaded, setModelLoaded] = useState<boolean | null>(null);
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const timeout = setTimeout(() => {
      setBackendStatus("offline");
    }, 3000);

    fetchSystemStatus()
      .then((data) => {
        clearTimeout(timeout);
        if (data) {
          setBackendStatus("online");
          setJudgmentsCount(data.db_judgments_count ?? null);
          setModelLoaded(data.faiss_index_exists ?? false);
        } else {
          setBackendStatus("offline");
        }
      })
      .catch(() => {
        clearTimeout(timeout);
        setBackendStatus("offline");
      });

    return () => clearTimeout(timeout);
  }, []);

  const roleLabel: Record<UserRole, string> = {
    judge: "Judge",
    clerk: "Clerk",
    researcher: "Researcher",
  };

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── Title ─────────────────────────────────────────────────────────────── */}
      <div className="pb-3 border-b border-[#e2ded6]">
        <h1 className="font-serif text-2xl font-bold text-[#16191c]">
          Platform Settings
        </h1>
        <p className="text-xs text-[#636a73] font-sans mt-0.5">
          Basic preferences and system status
        </p>
      </div>

      {/* ── 4 cards ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Card 1 — Profile ─────────────────────────────────────────────────── */}
        <div className="bg-[#fcfbf9] border border-[#dedad0] rounded p-4 space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-[#ede9e1]">
            <ShieldIcon className="w-4 h-4 text-[#1c3838]" />
            <h2 className="font-serif text-base font-bold text-[#16191c]">Profile</h2>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#686f7a]">Name</span>
              <span className="font-medium text-[#181a1d]">Demo User</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#686f7a]">Role</span>
              <span className="font-mono uppercase text-[10px] px-2 py-0.5 rounded bg-[#eaf4ed] text-[#1f5938] font-bold">
                {roleLabel[currentRole] ?? currentRole}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2 — Preferences ─────────────────────────────────────────────── */}
        <div className="bg-[#fcfbf9] border border-[#dedad0] rounded p-4 space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-[#ede9e1]">
            <SlidersIcon className="w-4 h-4 text-[#1c3838]" />
            <h2 className="font-serif text-base font-bold text-[#16191c]">Preferences</h2>
          </div>
          <div className="space-y-2">
            <label className="block text-[11px] font-mono uppercase text-[#686f7a] mb-1">
              Table density
            </label>
            <div className="flex rounded border border-[#cfc9be] overflow-hidden bg-white text-xs font-mono">
              <button
                type="button"
                onClick={() => onDensityChange("compact")}
                className={`flex-1 py-1.5 text-center transition-colors ${
                  tableDensity === "compact"
                    ? "bg-[#1c3838] text-white font-bold"
                    : "text-[#555a62] hover:bg-[#f5f3ec]"
                }`}
              >
                Compact
              </button>
              <button
                type="button"
                onClick={() => onDensityChange("comfortable")}
                className={`flex-1 py-1.5 text-center border-l border-[#cfc9be] transition-colors ${
                  tableDensity === "comfortable"
                    ? "bg-[#1c3838] text-white font-bold"
                    : "text-[#555a62] hover:bg-[#f5f3ec]"
                }`}
              >
                Comfortable
              </button>
            </div>
          </div>
        </div>

        {/* Card 3 — System Status ───────────────────────────────────────────── */}
        <div className="bg-[#fcfbf9] border border-[#dedad0] rounded p-4 space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-[#ede9e1]">
            <CheckCircleIcon className="w-4 h-4 text-[#1c3838]" />
            <h2 className="font-serif text-base font-bold text-[#16191c]">System Status</h2>
          </div>

          {backendStatus === "loading" ? (
            <p className="text-xs font-mono text-[#787f8a] animate-pulse py-2">
              Loading status...
            </p>
          ) : (
            <div className="space-y-2 text-xs">
              {/* Row: Backend */}
              <div className="flex items-center justify-between">
                <span className="text-[#686f7a]">Backend</span>
                <span
                  className={`flex items-center gap-1.5 font-mono font-semibold ${
                    backendStatus === "online" ? "text-[#1f5938]" : "text-[#c93b53]"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      backendStatus === "online" ? "bg-[#1f5938]" : "bg-[#c93b53]"
                    }`}
                  />
                  {backendStatus === "online" ? "Online" : "Offline / unavailable"}
                </span>
              </div>

              {/* Row: Judgments indexed */}
              <div className="flex items-center justify-between">
                <span className="text-[#686f7a]">Judgments indexed</span>
                <span className="font-mono font-semibold text-[#181a1d]">
                  {backendStatus === "offline"
                    ? "Offline / unavailable"
                    : judgmentsCount !== null
                    ? judgmentsCount.toLocaleString()
                    : "—"}
                </span>
              </div>

              {/* Row: Prediction model */}
              <div className="flex items-center justify-between">
                <span className="text-[#686f7a]">Prediction model</span>
                <span
                  className={`font-mono font-semibold ${
                    backendStatus === "offline"
                      ? "text-[#c93b53]"
                      : modelLoaded
                      ? "text-[#1f5938]"
                      : "text-[#c93b53]"
                  }`}
                >
                  {backendStatus === "offline"
                    ? "Offline / unavailable"
                    : modelLoaded
                    ? "Loaded"
                    : "Not loaded"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Card 4 — About ───────────────────────────────────────────────────── */}
        <div className="bg-[#fcfbf9] border border-[#dedad0] rounded p-4 space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-[#ede9e1]">
            <ScaleIcon className="w-4 h-4 text-[#1c3838]" />
            <h2 className="font-serif text-base font-bold text-[#16191c]">About</h2>
          </div>
          <ul className="space-y-2 text-xs text-[#3b4047] font-sans">
            <li>
              <span className="font-semibold text-[#181a1d]">Search:</span>{" "}
              semantic (FAISS) + keyword (BM25)
            </li>
            <li>
              <span className="font-semibold text-[#181a1d]">Prediction:</span>{" "}
              Gradient Boosting Regressor on case metadata + precedent features
            </li>
            <li>
              <span className="font-semibold text-[#181a1d]">Data:</span>{" "}
              public Indian court judgments + simulated case metadata
            </li>
          </ul>
        </div>
      </div>

      {/* ── Demo role switcher ────────────────────────────────────────────────── */}
      <div className="bg-[#fdf9f4] border border-[#d9822b]/40 rounded p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <AlertCircleIcon className="w-4 h-4 text-[#8c6218]" />
          <h2 className="font-serif text-sm font-bold text-[#16191c]">
            Switch demo role
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["judge", "clerk", "researcher"] as UserRole[]).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => onRoleChange(role)}
              className={`px-3 py-1.5 rounded font-mono text-xs font-semibold transition-all capitalize ${
                currentRole === role
                  ? "bg-[#1c3838] text-white"
                  : "bg-white text-[#4a5058] border border-[#cfc9be] hover:bg-[#ede9df]"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* ── Footer disclaimer ─────────────────────────────────────────────────── */}
      <p className="text-[11px] text-[#636a73] font-sans">
        CaseLens gives decision support only. Final decisions rest with the judge.
      </p>

    </div>
  );
}
