import { NextResponse } from "next/server";
import { getModelMetrics } from "@/lib/data";

export async function GET() {
  const { metrics, featureImportance } = getModelMetrics();
  return NextResponse.json({
    comparison: metrics.map(m => ({
      metric: m.metric,
      metadata_only: m.metadataOnly,
      with_precedents: m.withPrecedents,
      improvement_pct: m.improvementPct,
      unit: m.unit,
    })),
    feature_importance: featureImportance.map(f => ({
      rank: f.rank,
      feature_name: f.featureName,
      importance_score: f.meanShap,
      category: f.category,
      direction: f.direction,
    })),
  });
}
