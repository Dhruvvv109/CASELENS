"use client";

import React, { useState, useEffect, useCallback } from "react";
import { UserRole, CourtCase, UserProfile, TableDensity, Precedent, ModelMetricComparison, FeatureImportance } from "@/lib/types";
import {
  fetchCurrentUser,
  switchDemoRole,
  fetchCases,
  registerNewCase,
  clearStoredToken,
  fetchModelMetrics,
  searchPrecedents,
} from "@/lib/api";
import { Header } from "@/components/Header";
import { Sidebar, NavTab } from "@/components/Sidebar";
import { DashboardView } from "@/components/views/DashboardView";
import { ResearchView } from "@/components/views/ResearchView";
import { CasesView } from "@/components/views/CasesView";
import { CaseDetailView } from "@/components/views/CaseDetailView";
import { PriorityQueueView } from "@/components/views/PriorityQueueView";
import { ModelReportView } from "@/components/views/ModelReportView";
// import { LoginView } from "@/components/views/LoginView"; // Removed login view
import { SettingsView } from "@/components/views/SettingsView";

// Default user to bypass all login/signup screens completely
const DEFAULT_USER: UserProfile = {
  id: "user-judge-01",
  email: "justice.sharma@sci.gov.in",
  fullName: "Justice K. Sharma",
  role: "judge",
  isActive: true,
};

export default function CaseLensApp() {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [userRole, setUserRole] = useState<UserRole>("judge");
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USER);
  const [selectedBench, setSelectedBench] = useState<string>("all");
  const [cases, setCases] = useState<CourtCase[]>([]);
  const [precedents, setPrecedents] = useState<Precedent[]>([]);
  const [modelMetrics, setModelMetrics] = useState<ModelMetricComparison[]>([]);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [researchQuery, setResearchQuery] = useState<string>("");
  const [isLoadingCases, setIsLoadingCases] = useState<boolean>(false);
  const [casesError, setCasesError] = useState<string | null>(null);
  const [tableDensity, setTableDensity] = useState<TableDensity>("comfortable");
  const [isLoadingPrecedents, setIsLoadingPrecedents] = useState<boolean>(false);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  // Tab titles
  useEffect(() => {
    const titles: Record<NavTab, string> = {
      dashboard: "CaseLens - Judicial Overview",
      research: "CaseLens - Precedent Research",
      cases: "CaseLens - Pending Cases Register",
      "case-detail": "CaseLens - Case Dossier",
      queue: "CaseLens - Priority Queue",
      "model-report": "CaseLens - Model Benchmark Report",
      settings: "CaseLens - System Settings & Diagnostics",
    };
    document.title = titles[activeTab] || "CaseLens";
  }, [activeTab]);

  // 1. Load initial user profile & check auth session
  useEffect(() => {
    async function initAuth() {
      try {
        const user = await fetchCurrentUser();
        if (user) {
          setCurrentUser(user);
          setUserRole(user.role);
          return;
        }
      } catch (e) {
        // ignore fetch errors
      }
      if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
        const demoUser = { id: 'demo', name: 'Demo User', role: 'judge' } as any;
        setCurrentUser(demoUser);
        setUserRole(demoUser.role);
      }
    }
    initAuth();
  }, []);

  // 2. Load Cases from API route
  const loadCases = useCallback(async (court?: string) => {
    setIsLoadingCases(true);
    setLoadingMessage("Fetching data from database...");
    setCasesError(null);
    try {
      const res = await fetchCases(court);
      setCases(res.cases || []);
      if (res.cases && res.cases.length > 0) {
        setSelectedCaseId((prev) => (prev && res.cases.some((c) => c.id === prev) ? prev : res.cases[0].id));
      } else {
        setSelectedCaseId("");
      }
    } catch (err: any) {
      setCases([]);
      setCasesError(err?.message || "Failed to contact registry backend.");
    } finally {
      setIsLoadingCases(false);
      setLoadingMessage("");
    }
  }, []);

  useEffect(() => {
    loadCases(selectedBench);
  }, [selectedBench, loadCases]);

  // 3. Load Precedents & Model Report metrics from API routes
  useEffect(() => {
    setIsLoadingPrecedents(true);
    setLoadingMessage("Loading precedent index...");
    searchPrecedents("Article 21 bail delay", "hybrid").then((res) => {
      setPrecedents(res);
      setIsLoadingPrecedents(false);
      setLoadingMessage("");
    });

    setIsLoadingMetrics(true);
    fetchModelMetrics().then((res) => {
      if (res) {
        setModelMetrics(res.metrics);
        setFeatureImportance(res.featureImportance);
      }
      setIsLoadingMetrics(false);
    });
  }, []);

  // Handle role switch
  const handleRoleChange = async (role: UserRole) => {
    setLoadingMessage("Switching role, please wait...");
    setUserRole(role);
    const updatedUser = await switchDemoRole(role);
    if (updatedUser) {
      setCurrentUser(updatedUser);
    }
    setLoadingMessage("");
  };

  // Handle logout
  const handleLogout = async () => {
    clearStoredToken();
    setCurrentUser(DEFAULT_USER);
    setUserRole("judge");
  };

  const selectedCase =
    cases.find((c) => c.id === selectedCaseId) || cases[0] || null;

  const urgentCount = cases.filter(
    (c) => c.prediction.priorityScore >= 75
  ).length;

  // Global Keyboard Shortcuts (1-6 for tabs)
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "1") setActiveTab("dashboard");
      else if (e.key === "2") setActiveTab("research");
      else if (e.key === "3") setActiveTab("cases");
      else if (e.key === "4") setActiveTab("case-detail");
      else if (e.key === "5") setActiveTab("queue");
      else if (e.key === "6") setActiveTab("model-report");
      else if (e.key === "7") setActiveTab("settings");
    };

    window.addEventListener("keydown", handleGlobalKeys);
    return () => window.removeEventListener("keydown", handleGlobalKeys);
  }, []);

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab("case-detail");
  };

  const handleNavigateToResearch = (query?: string) => {
    if (query) {
      setResearchQuery(query);
      setIsLoadingPrecedents(true);
      setLoadingMessage("Searching precedent database...");
      searchPrecedents(query, "hybrid").then(res => {
        setPrecedents(res);
        setIsLoadingPrecedents(false);
        setLoadingMessage("");
      });
    }
    setActiveTab("research");
  };

  // Register New Case via API
  const handleAddNewCase = async (newCaseData: Partial<CourtCase>) => {
    setLoadingMessage("Registering case in database...");
    try {
      const created = await registerNewCase({
        caseNo: newCaseData.caseNo || `NEW/${new Date().getFullYear()}`,
        caseType: newCaseData.caseType || "CRL.A",
        court: newCaseData.court || "Supreme Court of India",
        filingDate: newCaseData.filingDate || new Date().toISOString().split("T")[0],
        hearingsCount: newCaseData.hearingsCount || 1,
        description: newCaseData.description || "Fresh filing awaiting hearing.",
      });

      if (created) {
        setCases((prev) => [created, ...prev]);
        setSelectedCaseId(created.id);
        setActiveTab("case-detail");
        setLoadingMessage("");
        return;
      }
    } catch (err) {
      console.warn("Case registration error:", err);
    }

    // Client-side fallback
    setLoadingMessage("");
    const newCase: CourtCase = {
      id: `case-${Date.now()}`,
      caseNo: newCaseData.caseNo || "NEW/2024",
      caseType: newCaseData.caseType || "CRL.A",
      court: newCaseData.court || "Supreme Court of India",
      filingDate: newCaseData.filingDate || new Date().toISOString().split("T")[0],
      hearingsCount: newCaseData.hearingsCount || 1,
      status: newCaseData.status || "pending",
      bench: newCaseData.bench || "Admission Court",
      petitioner: newCaseData.petitioner || "Petitioner",
      respondent: newCaseData.respondent || "Respondent",
      actsSections: newCaseData.actsSections || ["Constitution Art. 226"],
      description: newCaseData.description || "Fresh petition registered.",
      top1Similarity: newCaseData.top1Similarity || 0.75,
      meanTop5Similarity: newCaseData.meanTop5Similarity || 0.68,
      countAboveThreshold: newCaseData.countAboveThreshold || 2,
      matchedPrecedentIds: newCaseData.matchedPrecedentIds || ["prec-001"],
      prediction: newCaseData.prediction || {
        predictedDays: 120,
        complexity: "Medium",
        priorityScore: 70.0,
        confidenceIntervalDays: [95, 145],
        precedentConfidence: 0.8,
        shapFactors: [{ feature: "Fresh Registration", impact: "increases_delay", impactDays: 25, plainEnglishReason: "Initial docket admission notice required." }],
      },
    };
    setCases((prev) => [newCase, ...prev]);
    setSelectedCaseId(newCase.id);
    setActiveTab("case-detail");
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#171a1d] flex flex-col font-sans selection:bg-[#1c3838] selection:text-white">
      {/* Global loading toast */}
      {loadingMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#1c3838] text-white text-xs font-mono px-5 py-3 rounded-lg shadow-xl border border-[#2d5555] animate-pulse">
          <svg className="w-4 h-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {loadingMessage}
        </div>
      )}
      {/* Real Institutional Header */}
      <Header
        currentRole={userRole}
        currentUser={currentUser}
        activeCaseCount={cases.length}
        selectedBench={selectedBench}
        onBenchChange={setSelectedBench}
        onLogout={handleLogout}
        onOpenSettings={() => setActiveTab("settings")}
      />

      {/* Main Container: Sidebar + Active View Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Institutional Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedCaseNo={selectedCase?.caseNo}
          urgentQueueCount={urgentCount}
        />

        {/* Center Workspace Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl">
          {activeTab === "dashboard" && (
            <DashboardView
              cases={cases}
              precedents={precedents}
              onSelectCase={handleSelectCase}
              onNavigateToResearch={handleNavigateToResearch}
              onNavigateToQueue={() => setActiveTab("queue")}
              onNavigateToCases={() => setActiveTab("cases")}
            />
          )}

          {activeTab === "research" && (
            <ResearchView
              precedents={precedents}
              initialQuery={researchQuery}
              onSelectCaseWithPrecedent={handleSelectCase}
              isLoading={isLoadingPrecedents}
            />
          )}

          {activeTab === "cases" && (
            <CasesView
              cases={cases}
              onSelectCase={handleSelectCase}
              onAddNewCase={handleAddNewCase}
              tableDensity={tableDensity}
              isLoading={isLoadingCases}
              error={casesError}
              onRetry={() => loadCases(selectedBench)}
            />
          )}

          {activeTab === "case-detail" && (
            <CaseDetailView
              currentCase={selectedCase}
              precedents={precedents}
              allCases={cases}
              onSelectAnotherCase={setSelectedCaseId}
              onNavigateToResearch={handleNavigateToResearch}
              isLoading={isLoadingCases}
            />
          )}

          {activeTab === "queue" && (
            <PriorityQueueView
              cases={cases}
              onSelectCase={handleSelectCase}
              isLoading={isLoadingCases}
            />
          )}

          {activeTab === "model-report" && (
            <ModelReportView
              metrics={modelMetrics}
              featureImportance={featureImportance}
              isLoading={isLoadingMetrics}
            />
          )}

          {activeTab === "settings" && (
            <SettingsView
              currentUser={currentUser}
              currentRole={userRole}
              onRoleChange={handleRoleChange}
              selectedBench={selectedBench}
              onBenchChange={setSelectedBench}
              tableDensity={tableDensity}
              onDensityChange={setTableDensity}
            />
          )}
        </main>
      </div>

      {/* Institutional Legal Disclaimer Footer */}
      <footer className="border-t border-[#e2ded6] bg-[#f7f5f0] px-6 py-2.5 text-center text-xs text-[#6b7280]">
        CaseLens is a decision-support tool, not legal advice or a judicial determination.
      </footer>
    </div>
  );
}
