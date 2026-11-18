/**
 * src/lib/api.ts
 * ──────────────
 * Typed API Client for CaseLens (using in-memory data - no backend required)
 */
import { CourtCase, UserProfile, UserRole, SHAPFactor, SystemStatusTelemetry, Precedent, ModelMetricComparison, FeatureImportance } from "./types";
import { CASES, JUDGMENTS, getModelMetrics, getSystemStatus, DEMO_USERS } from "./data";

const TOKEN_KEY = "caselens_token";

/**
 * Auth: Login with email + password (mock)
 */
export async function loginWithCredentials(
  email: string,
  password: string
): Promise<UserProfile | null> {
  const user = DEMO_USERS.find(u => u.email === email);
  if (user && password === "demo123") {
    setStoredToken("mock-token-" + email);
    return user;
  }
  return null;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearStoredToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export interface HealthStatus {
  status: "ok" | "degraded" | "offline" | "checking";
  db: string;
  index_loaded?: boolean;
  version?: string;
  environment?: string;
  embedding_model?: string;
  embedding_dimension?: number;
}

/**
 * Health check with timeout (using in-memory data)
 */
export async function fetchHealth(): Promise<HealthStatus> {
  return {
    status: "ok",
    db: "in-memory",
    index_loaded: true,
    version: "0.1.0",
    environment: "development",
    embedding_model: "sentence-transformers/all-MiniLM-L6-v2",
    embedding_dimension: 384,
  };
}

/**
 * Auth: Read current authenticated user (mock)
 */
export async function fetchCurrentUser(): Promise<UserProfile | null> {
  return DEMO_USERS[0]; // Return judge by default
}

/**
 * Auth: Switch demo role (mock)
 */
export async function switchDemoRole(role: UserRole): Promise<UserProfile | null> {
  const user = DEMO_USERS.find(u => u.role === role);
  if (user) {
    setStoredToken("mock-token-" + user.email);
    return user;
  }
  return DEMO_USERS[0];
}

/**
 * Convert backend case schema to UI CourtCase
 */
export function mapBackendCaseToCourtCase(c: any): CourtCase {
  let shapFactors: SHAPFactor[] = [];
  if (typeof c.shap_reasons === "string" && c.shap_reasons.trim()) {
    try {
      const parsed = JSON.parse(c.shap_reasons);
      if (Array.isArray(parsed)) {
        shapFactors = parsed.map((item: any) => ({
          feature: item.feature || "Precedent Alignment",
          impact: item.impact || "reduces_delay",
          impactDays: item.impact_days ?? 0,
          plainEnglishReason: item.plain_english_reason || item.reason || "",
        }));
      }
    } catch {
      shapFactors = [];
    }
  }

  // Derive parties from description or defaults
  let petitioner = "Petitioner";
  let respondent = "State of India";
  if (c.description && c.description.toLowerCase().includes("vs")) {
    const parts = c.description.split(/vs\.?|versus/i);
    if (parts.length >= 2) {
      petitioner = parts[0].trim().slice(0, 40);
      respondent = parts[1].trim().slice(0, 40);
    }
  } else if (c.case_no) {
    petitioner = `Petitioner (${c.case_no})`;
    respondent = "Respondent Authority";
  }

  const predDays = Math.round(c.predicted_days || 90);

  return {
    id: c.id,
    caseNo: c.case_no,
    caseType: c.case_type || "CRL.A",
    court: c.court,
    filingDate: c.filing_date,
    hearingsCount: c.hearings_count || 1,
    status: (c.status?.toLowerCase() as any) || "pending",
    bench: c.court.includes("Supreme") ? "Division Bench IV" : "Single Bench (Writ)",
    petitioner,
    respondent,
    actsSections: ["Constitution Art. 21", "CrPC Sec. 439"],
    description: c.description || "Active petition pending registry hearing.",
    top1Similarity: c.top1_similarity ?? 0.75,
    meanTop5Similarity: c.mean_top5_similarity ?? 0.68,
    countAboveThreshold: c.count_above_threshold ?? 2,
    matchedPrecedentIds: ["prec-001", "prec-002"],
    prediction: {
      predictedDays: predDays,
      complexity: (c.complexity as any) || "Medium",
      priorityScore: c.priority_score ?? 70.0,
      confidenceIntervalDays: [Math.max(15, predDays - 25), predDays + 35],
      precedentConfidence: c.top1_similarity ?? 0.8,
      shapFactors: shapFactors.length > 0 ? shapFactors : [
        {
          feature: "Precedent Convergence",
          impact: "reduces_delay",
          impactDays: -30,
          plainEnglishReason: "Settled constitutional authority narrows deliberative scope.",
        },
      ],
    },
  };
}

/**
 * Fetch Cases (using in-memory data)
 */
export async function fetchCases(court?: string): Promise<{ total: number; cases: CourtCase[] }> {
  let filtered = CASES;
  if (court && court !== "all") {
    filtered = CASES.filter(c => c.court.toLowerCase().includes(court.toLowerCase()));
  }
  return { total: filtered.length, cases: filtered };
}

/**
 * Create a new Case (using in-memory data)
 */
export async function registerNewCase(caseIn: {
  caseNo: string;
  caseType: string;
  court: string;
  filingDate: string;
  hearingsCount: number;
  description: string;
}): Promise<CourtCase | null> {
  const newCase: CourtCase = {
    id: `case-${Date.now()}`,
    caseNo: caseIn.caseNo,
    caseType: caseIn.caseType,
    court: caseIn.court,
    filingDate: caseIn.filingDate,
    hearingsCount: caseIn.hearingsCount,
    status: "pending",
    bench: "Admission Court",
    petitioner: "Petitioner",
    respondent: "Respondent",
    actsSections: ["Constitution Art. 226"],
    description: caseIn.description,
    top1Similarity: 0.75,
    meanTop5Similarity: 0.68,
    countAboveThreshold: 2,
    matchedPrecedentIds: ["prec-001"],
    prediction: {
      predictedDays: 120,
      complexity: "Medium",
      priorityScore: 70.0,
      confidenceIntervalDays: [95, 145],
      precedentConfidence: 0.8,
      shapFactors: [
        {
          feature: "Fresh Registration",
          impact: "increases_delay",
          impactDays: 25,
          plainEnglishReason: "Initial docket admission notice required.",
        },
      ],
    },
  };
  
  CASES.unshift(newCase);
  return newCase;
}

/**
 * Fetch System Runtime Status & Corpus Diagnostics (using in-memory data)
 */
export async function fetchSystemStatus(): Promise<SystemStatusTelemetry | null> {
  return getSystemStatus();
}

/**
 * Fetch live caseload count (using in-memory data)
 */
export async function fetchCasesCount(): Promise<number> {
  return CASES.length;
}

/**
 * Fetch benchmark model evaluation metrics (using in-memory data)
 */
export async function fetchModelMetrics(): Promise<{
  metrics: ModelMetricComparison[];
  featureImportance: FeatureImportance[];
} | null> {
  return getModelMetrics();
}

/**
 * Judge: approve (dispose) a pending case (using in-memory data)
 */
export async function approveCase(caseId: string): Promise<{ msg: string; status: string } | null> {
  const caseItem = CASES.find(c => c.id === caseId);
  if (caseItem) {
    caseItem.status = "disposed";
    return { msg: "Case approved and marked disposed", status: "disposed" };
  }
  return null;
}

/**
 * Perform precedent search (using in-memory data)
 */
export async function searchPrecedents(
  query: string,
  method: "hybrid" | "semantic" | "keyword" = "hybrid",
  filters?: { court?: string; case_type?: string }
): Promise<Precedent[]> {
  const queryLower = query.toLowerCase();
  let results = JUDGMENTS.filter(j => {
    const matchTitle = j.title.toLowerCase().includes(queryLower);
    const matchCitation = j.citation.toLowerCase().includes(queryLower);
    const matchCourt = filters?.court ? j.court.toLowerCase().includes(filters.court.toLowerCase()) : true;
    const matchType = filters?.case_type ? j.caseType === filters.case_type : true;
    return (matchTitle || matchCitation) && matchCourt && matchType;
  });
  
  // If no results, return all judgments
  if (results.length === 0) {
    results = JUDGMENTS.slice(0, 20);
  }
  
  return results.slice(0, 20);
}

