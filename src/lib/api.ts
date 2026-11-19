/**
 * src/lib/api.ts
 * ──────────────
 * All API calls go through Next.js route handlers in /src/app/api/
 * No direct data imports — frontend never touches data.ts directly.
 */
import {
  CourtCase,
  UserProfile,
  UserRole,
  SystemStatusTelemetry,
  Precedent,
  ModelMetricComparison,
  FeatureImportance,
} from "./types";

const TOKEN_KEY = "caselens_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setStoredToken(token: string): void {
  if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
}
export function clearStoredToken(): void {
  if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  const t = getStoredToken();
  if (t) h["Authorization"] = `Bearer ${t}`;
  return h;
}

// ── Auth ───────────────────────────────────────────────────────────────────

export async function loginWithCredentials(
  email: string,
  password: string
): Promise<UserProfile | null> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.access_token) setStoredToken(data.access_token);
  return data.user ?? null;
}

export async function fetchCurrentUser(): Promise<UserProfile | null> {
  try {
    const res = await fetch("/api/auth/me", { headers: authHeaders() });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function switchDemoRole(role: UserRole): Promise<UserProfile | null> {
  try {
    const res = await fetch(`/api/auth/demo-switch/${role}`, {
      method: "POST",
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.access_token) setStoredToken(data.access_token);
    return data.user ?? null;
  } catch {
    return null;
  }
}

// ── Health ─────────────────────────────────────────────────────────────────

export interface HealthStatus {
  status: "ok" | "degraded" | "offline" | "checking";
  db: string;
  index_loaded?: boolean;
  version?: string;
  environment?: string;
  embedding_model?: string;
  embedding_dimension?: number;
}

export async function fetchHealth(): Promise<HealthStatus> {
  try {
    const res = await fetch("/api/health");
    if (!res.ok) return { status: "offline", db: "error" };
    return await res.json();
  } catch {
    return { status: "offline", db: "unreachable" };
  }
}

// ── Cases ──────────────────────────────────────────────────────────────────

export async function fetchCases(
  court?: string,
  status?: string,
  complexity?: string,
  limit = 500,
  offset = 0
): Promise<{ total: number; cases: CourtCase[] }> {
  const url = new URL("/api/cases", typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  if (court && court !== "all") url.searchParams.set("court", court);
  if (status) url.searchParams.set("status", status);
  if (complexity) url.searchParams.set("complexity", complexity);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));

  const res = await fetch(url.toString(), { headers: authHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch cases: ${res.status}`);
  return res.json();
}

export async function fetchCasesCount(): Promise<number> {
  try {
    const res = await fetch("/api/cases/count", { headers: authHeaders() });
    if (!res.ok) return 0;
    const d = await res.json();
    return d.count ?? 0;
  } catch {
    return 0;
  }
}

export async function registerNewCase(caseIn: {
  caseNo: string;
  caseType: string;
  court: string;
  filingDate: string;
  hearingsCount: number;
  description: string;
}): Promise<CourtCase | null> {
  const res = await fetch("/api/cases", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      caseNo: caseIn.caseNo,
      caseType: caseIn.caseType,
      court: caseIn.court,
      filingDate: caseIn.filingDate,
      hearingsCount: caseIn.hearingsCount,
      description: caseIn.description,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Registration failed");
  }
  return res.json();
}

export async function approveCase(
  caseId: string
): Promise<{ msg: string; status: string } | null> {
  try {
    const res = await fetch(`/api/judge/approve/${caseId}`, {
      method: "POST",
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Search ─────────────────────────────────────────────────────────────────

export async function searchPrecedents(
  query: string,
  method: "hybrid" | "semantic" | "keyword" = "hybrid",
  filters?: { court?: string; case_type?: string }
): Promise<Precedent[]> {
  try {
    const res = await fetch("/api/search", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ query, method, top_k: 20, filters: filters ?? {} }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}

// ── System ─────────────────────────────────────────────────────────────────

export async function fetchSystemStatus(): Promise<SystemStatusTelemetry | null> {
  try {
    const res = await fetch("/api/system/status");
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Model Metrics ──────────────────────────────────────────────────────────

export async function fetchModelMetrics(): Promise<{
  metrics: ModelMetricComparison[];
  featureImportance: FeatureImportance[];
} | null> {
  try {
    const res = await fetch("/api/model/metrics", { headers: authHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    const metrics: ModelMetricComparison[] = (data.comparison ?? []).map((r: any) => ({
      metric: r.metric,
      metadataOnly: r.metadata_only,
      withPrecedents: r.with_precedents,
      improvementPct: r.improvement_pct,
      unit: r.unit,
    }));
    const featureImportance: FeatureImportance[] = (data.feature_importance ?? []).map((f: any) => ({
      rank: f.rank,
      featureName: f.feature_name,
      category: f.category ?? "Precedent Intelligence",
      meanShap: f.importance_score,
      direction: f.direction ?? "Reduces delay variance",
      description: `SHAP weight: ${f.importance_score}`,
    }));
    return { metrics, featureImportance };
  } catch {
    return null;
  }
}
