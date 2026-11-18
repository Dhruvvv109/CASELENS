/**
 * src/lib/data.ts
 * ────────────────
 * Comprehensive in-memory data for CaseLens (10x more data)
 */

import { CourtCase, UserProfile, Precedent, ModelMetricComparison, FeatureImportance, SystemStatusTelemetry } from "./types";

// Demo Users
export const DEMO_USERS: UserProfile[] = [
  { id: "user-judge-01", email: "justice.sharma@sci.gov.in", fullName: "Justice K. Sharma", role: "judge", isActive: true },
  { id: "user-clerk-01", email: "rajesh.verma@ecourts.gov.in", fullName: "Rajesh Verma (Court Clerk)", role: "clerk", isActive: true },
  { id: "user-researcher-01", email: "pooja.iyer@ecourts.gov.in", fullName: "Pooja Iyer (Law Researcher)", role: "researcher", isActive: true },
];

// Generate 150+ court cases (10x more than before)
function generateCases(): CourtCase[] {
  const courts = [
    "Supreme Court of India",
    "High Court of Delhi",
    "High Court of Bombay",
    "High Court of Calcutta",
    "High Court of Madras",
    "High Court of Karnataka",
    "High Court of Gujarat",
    "High Court of Kerala",
    "High Court of Punjab & Haryana",
    "High Court of Andhra Pradesh",
  ];

  const caseTypes = ["CRL.A", "WP", "SLP", "CIV.A", "ARB", "COM", "TAX", "MAT", "AWA", "Crl.M.C"];
  
  const outcomes = ["Allowed", "Dismissed", "Pending", "Disposed", "Allowed in part", "Remanded"];
  
  const petitionerNames = [
    "Union of India", "State of Maharashtra", "Union of India through CBI", 
    "Manish Sisodia", "Vijay Madanlal Choudhary", "Kiran Mazumdar",
    "Dr. B. R. Ambedkar Foundation", "Uday Umesh Lalit", "Nirav Modi",
    "Chetan Singh", "Ramesh Kumar", "Anil Kumar", "Priya Sharma",
    "Bharat Petroleum Corp", "Reliance Industries Ltd", "Tata Sons Pvt Ltd",
    "National Legal Services Authority", "Supreme Court Women Lawyers Association",
    "Madhya Pradesh State", "Karnataka State", "Tamil Nadu State"
  ];

  const respondentNames = [
    "Directorate of Enforcement", "Union of India", "State of Delhi",
    "Central Bureau of Investigation", "National Investigation Agency",
    " Income Tax Department", "Reserve Bank of India", "Securities Exchange Board of India",
    "Board of Control for Cricket India", "University Grants Commission",
    "State Election Commission", " Election Commission of India",
    "Union of India through Ministry of Home Affairs", "Attorney General of India",
    "Bar Council of India", "Medical Council of India", "University of Delhi"
  ];

  const descriptions = [
    "Bail petition concerning Section 45 PMLA twin conditions vs Article 21 speedy trial rights.",
    "Anticipatory bail plea in commercial cheating under Section 420/406 IPC.",
    "Writ petition challenging retrospective statutory amendment affecting tender awards.",
    "Section 34 challenge to arbitral award on grounds of patent illegality and public policy.",
    "Quashing petition under Section 482 CrPC for settlement between matrimonial parties.",
    "Regular civil appeal regarding title dispute and adverse possession over ancestral estate.",
    "Appeal against conviction under Section 302/34 IPC relying on circumstantial chain evidence.",
    "Habeas corpus petition alleging non-compliance with Section 41A CrPC procedural guidelines.",
    "Commercial dispute concerning bank guarantee invocation amidst corporate insolvency.",
    "Special leave petition regarding jurisdiction of tribunal under consumer protection provisions.",
    "Revision petition against discharge order in disproportionate assets prosecution.",
    "Income tax reassessment notice validity challenged beyond limitation window.",
    "Revisional challenge against interim injunction in trademark infringement suit.",
    "Criminal appeal regarding NDPS conscious possession and search warrant procedural defects.",
    "Environmental clearance dispute regarding urban coastal road infrastructure project.",
    "Challenge to constitutional validity of article 35A and provisions of J&K Reorganization Act.",
    "Petition regarding reservation in promotions for SC/ST employees under Article 16(4).",
    "Public interest litigation seeking implementation of Swachh Bharat Mission guidelines.",
    "PIL for construction of flyover to decongest traffic in metropolitan city.",
    "Matter concerning medical admission through NEET under constitutional validity challenge.",
    "Election petition challenging validity of assembly elections due to alleged malpractices.",
    "Contempt petition for non-compliance with earlier Supreme Court directions.",
    "Petition regarding pension benefits for ex-servicemen and their families.",
    "Challenge to GST rates on certain goods under constitutional provisions.",
    "SLP against High Court order regarding maintainability of consumer complaint.",
    "Matter concerning bond period compulsory service for medical graduates.",
    "Petition regarding regularization of contractual workers in government departments.",
    "Writ seeking direction for establishment of fast-track courts for trial of rape cases.",
    "Challenge to constitutional validity of sedition law under Section 124A IPC.",
    "Petition for enforcement of fundamental right to clean environment under Article 21.",
    "Appeal against conviction for murder under Section 302 IPC with challenge to evidence admissibility.",
    "Matter concerning bail conditions imposition restricting travel abroad.",
    "Petition regarding regularization of unauthorized colonies and basic amenities.",
    "Challenge to electoral bond scheme and anonymous political funding.",
    "Writ for implementation of National Education Policy 2020 in letter and spirit.",
    "Petition seeking protection of privacy rights in Aadhaar identification system.",
    "Matter concerning digital divide and equal access to online education.",
    "PIL for safety measures in construction industry and compensation for workers.",
    "Challenge to validity of sedition law and its compatibility with free speech.",
    "Petition regarding debt relief for farmers and agricultural loan waiver scheme.",
    "Matter concerning wildlife protection and eco-sensitive zones declaration.",
    "Writ for immediate release of detained foreign nationals in prison.",
    "Appeal challenging sentence enhancement in murder case by High Court.",
    "Petition regarding mental health resources and suicide prevention mechanisms.",
    "Challenge to constitutional amendment affecting federal structure of governance.",
    "Matter concerning right to die with dignity and passive euthanasia guidelines.",
    "PIL for proper implementation of food security scheme and public distribution system.",
  ];

  const cases: CourtCase[] = [];
  
  for (let i = 1; i <= 150; i++) {
    const courtIdx = Math.floor(Math.random() * courts.length);
    const caseTypeIdx = Math.floor(Math.random() * caseTypes.length);
    const petIdx = Math.floor(Math.random() * petitionerNames.length);
    const resIdx = Math.floor(Math.random() * respondentNames.length);
    const descIdx = Math.floor(Math.random() * descriptions.length);
    
    const hearings = Math.floor(Math.random() * 30) + 1;
    const topSim = 0.65 + (Math.random() * 0.3);
    const meanSim = topSim - (Math.random() * 0.1);
    const hearingsFactor = hearings * 15;
    const similarityFactor = topSim * 160;
    const predictedDays = Math.max(30, 180 + hearingsFactor - similarityFactor + (Math.random() * 60 - 30));
    const priority = Math.min(98, Math.max(45, 50 + (topSim * 35) + (hearings * 0.8)));
    
    const complexity = hearings > 20 ? "High" : hearings > 10 ? "Medium" : "Low";
    const statusOptions = ["pending", "hearing", "reserved", "disposed"];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

    const caseNo = `${caseTypes[caseTypeIdx]}. ${100 + i}/202${Math.floor(Math.random() * 4) + 1}`;
    const year = 2020 + Math.floor(Math.random() * 5);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

    cases.push({
      id: `case-${i.toString().padStart(4, '0')}`,
      caseNo,
      caseType: caseTypes[caseTypeIdx],
      court: courts[courtIdx],
      filingDate: `${year}-${month}-${day}`,
      hearingsCount: hearings,
      status,
      bench: courts[courtIdx].includes("Supreme") ? "Division Bench III" : "Single Bench",
      petitioner: petitionerNames[petIdx],
      respondent: respondentNames[resIdx],
      actsSections: ["Constitution Art. 21", `IPC Section 302`],
      description: descriptions[descIdx],
      top1Similarity: Number(topSim.toFixed(3)),
      meanTop5Similarity: Number(meanSim.toFixed(3)),
      countAboveThreshold: Math.floor(Math.random() * 4) + 1,
      similaritySpread: 0.06,
      precedentAgeMean: 2.5 + Math.random() * 3,
      outcomeAgreement: 0.7 + Math.random() * 0.25,
      matchedPrecedentIds: [`prec-${Math.floor(Math.random() * 20) + 1}`, `prec-${Math.floor(Math.random() * 20) + 1}`],
      prediction: {
        predictedDays: Math.round(predictedDays),
        complexity,
        priorityScore: Number(priority.toFixed(1)),
        confidenceIntervalDays: [Math.round(predictedDays - 30), Math.round(predictedDays + 40)],
        precedentConfidence: Number(topSim.toFixed(2)),
        shapFactors: [
          {
            feature: "Precedent Similarity",
            impact: topSim > 0.7 ? "reduces_delay" : "increases_delay",
            impactDays: Math.round(-25 * topSim),
            plainEnglishReason: `Top precedent matches core legal doctrine at ${(topSim * 100).toFixed(0)}% similarity.`
          },
          {
            feature: "Hearing Trajectory",
            impact: hearings > 15 ? "increases_delay" : "reduces_delay",
            impactDays: Math.round(hearings * 4.2),
            plainEnglishReason: `Accumulated ${hearings} docket hearings.`
          },
          {
            feature: "Court Tier Factor",
            impact: courts[courtIdx].includes("Supreme") ? "increases_delay" : "reduces_delay",
            impactDays: courts[courtIdx].includes("Supreme") ? 45 : -15,
            plainEnglishReason: `${courts[courtIdx]} has different case clearance rate.`
          }
        ]
      }
    });
  }

  return cases;
}

// Generate 200+ judgments/precedents
function generateJudgments(): Precedent[] {
  const judgments: Precedent[] = [
    {
      id: "prec-001",
      title: "Vijay Madanlal Choudhary & Ors vs Union of India & Ors",
      citation: "(2022) 10 SCC 1",
      court: "Supreme Court of India",
      caseType: "CRL.A",
      judgmentDate: "2022-07-27",
      outcome: "Dismissed",
      bench: "A.M. Khanwilkar, Dinesh Maheshwari, C.T. Ravikumar, JJ.",
      similarityScore: 0.92,
      keywordScore: 0.85,
      wordCount: 18450,
      summary: {
        facts: "Challenge to constitutional validity of Prevention of Money Laundering Act provisions, specifically twin conditions under Section 45.",
        issue: "Whether Section 45 of PMLA satisfies test of proportionality under Article 21?",
        holding: "Section 45 satisfies test of proportionality and is constitutional and valid.",
        outcomeText: "Petition dismissed."
      },
      matchedSnippets: ["The seminal question involved is regarding constitutional validity of PMLA provisions."],
      fullText: "IN THE SUPREME COURT OF INDIA... The twin conditions under Section 45 are constitutional..."
    },
    {
      id: "prec-002",
      title: "Manish Sisodia vs Directorate of Enforcement",
      citation: "2024 INSC 595",
      court: "Supreme Court of India",
      caseType: "CRL.A",
      judgmentDate: "2024-08-09",
      outcome: "Allowed",
      bench: "B.R. Gavai, K.V. Viswanathan, JJ.",
      similarityScore: 0.88,
      keywordScore: 0.80,
      wordCount: 9240,
      summary: {
        facts: "Bail plea by former Delhi Deputy Chief Minister in PMLA case after 17 months incarceration.",
        issue: "Whether prolonged incarceration without trial infringes fundamental right under Article 21?",
        holding: "Prolonged incarceration without trial infringes Article 21. Section 45 PMLA cannot extinguish constitutional protections.",
        outcomeText: "Bail granted with conditions."
      },
      matchedSnippets: ["The appellant has been incarcerated for a period of 17 months with 493 witnesses."],
      fullText: "Prolonged incarceration without trial infringes the fundamental right under Article 21..."
    },
    {
      id: "prec-003",
      title: "K.S. Puttaswamy vs Union of India",
      citation: "(2017) 10 SCC 1",
      court: "Supreme Court of India",
      caseType: "WP",
      judgmentDate: "2017-08-24",
      outcome: "Allowed",
      bench: "J.S. Khehar, S.A. Bobde, JJ.",
      similarityScore: 0.95,
      keywordScore: 0.90,
      wordCount: 24500,
      summary: {
        facts: "Constitutional validity of Aadhaar scheme and its integration with welfare schemes.",
        issue: "Whether Aadhaar violates right to privacy under Article 21?",
        holding: "Right to privacy is a fundamental right under Article 21. Aadhaar scheme upheld with modifications.",
        outcomeText: "Petition allowed with directions."
      },
      matchedSnippets: ["Right to privacy is an intrinsic part of right to life and personal liberty."],
      fullText: "The Constitution of India guarantees fundamental rights..."
    },
    {
      id: "prec-004",
      title: "Navtej Singh Johar vs Union of India",
      citation: "(2018) 10 SCC 1",
      court: "Supreme Court of India",
      caseType: "WP",
      judgmentDate: "2018-09-06",
      outcome: "Allowed",
      bench: "D.Y. Chandrachud, Indu Malhotra, JJ.",
      similarityScore: 0.91,
      keywordScore: 0.88,
      wordCount: 18200,
      summary: {
        facts: "Challenge to Section 377 IPC criminalizing consensual adult same-sex relations.",
        issue: "Whether Section 377 IPC violates constitutional rights?",
        holding: "Section 377 IPC unconstitutional as it violates dignity and equality rights.",
        outcomeText: "Decriminalized consensual adult homosexuality."
      },
      matchedSnippets: ["Sexual orientation is an essential attribute of privacy."],
      fullText: "The Constitution protects individual autonomy..."
    },
    {
      id: "prec-005",
      title: "Justice K.S. Puttaswamy (Retd) vs Union of India",
      citation: "(2019) 1 SCC 1",
      court: "Supreme Court of India",
      caseType: "WP",
      judgmentDate: "2019-01-10",
      outcome: "Allowed",
      bench: "A.M. Khanwilkar, D.Y. Chandrachud, JJ.",
      similarityScore: 0.89,
      keywordScore: 0.82,
      wordCount: 31200,
      summary: {
        facts: "Challenge to Aadhaar Act validity after previous Bench referred matter to larger bench.",
        issue: "Constitutional validity of Aadhaar (Targeted Delivery of Financial and other Subsidies) Act, 2016.",
        holding: "Aadhaar Act valid but certain provisions struck down as unconstitutional.",
        outcomeText: "Petition partly allowed."
      },
      matchedSnippets: ["Aadhaar number is necessary for delivering subsidies."],
      fullText: "The Parliament has power to make laws for giving effect to Directive Principles."
    },
  ];

  // Generate 195 more precedents
  const additionalPrecedents = [
    { title: "Arnesh Kumar vs State of Bihar", citation: "(2014) 8 SCC 273", court: "Supreme Court of India", outcome: "Allowed" },
    { title: "Lalita Kumari vs Govt of UP", citation: "(2014) 2 SCC 1", court: "Supreme Court of India", outcome: "Allowed" },
    { title: "Shayara Bano vs Union of India", citation: "(2017) 9 SCC 1", court: "Supreme Court of India", outcome: "Allowed" },
    { title: "Joseph Shine vs Union of India", citation: "(2018) 3 SCC 1", court: "Supreme Court of India", outcome: "Allowed" },
    { title: "Madhya Pradesh State vs Bhagat Singh", citation: "2023 INSC 45", court: "Supreme Court of India", outcome: "Dismissed" },
    { title: "Karnataka State vs Karnataka Industrial Areas", citation: "2023 INSC 78", court: "Supreme Court of India", outcome: "Allowed" },
    { title: "Reliance Industries Ltd vs Union of India", citation: "(2020) 7 SCC 209", court: "Supreme Court of India", outcome: "Dismissed" },
    { title: "Coca Cola India Pvt Ltd vs State of UP", citation: "2022 INSC 123", court: "Supreme Court of India", outcome: "Allowed" },
    { title: "Tata Sons Pvt Ltd vs Register of Companies", citation: "2021 INSC 234", court: "Supreme Court of India", outcome: "Allowed" },
    { title: "Amazon.com vs Future Retail Ltd", citation: "2022 INSC 345", court: "Supreme Court of India", outcome: "Allowed" },
    { title: "Vijay Mallya vs Directorate of Enforcement", citation: "2021 INSC 456", court: "Supreme Court of India", outcome: "Dismissed" },
    { title: "Nirav Modi vs Union of India", citation: "2022 INSC 567", court: "Supreme Court of India", outcome: "Dismissed" },
    { title: "Anil Ambani vs Union of India", citation: "2023 INSC 678", court: "Supreme Court of India", outcome: "Pending" },
    { title: "CBI vs Chetan Singh", citation: "2020 SCC 890", court: "Supreme Court of India", outcome: "Allowed" },
    { title: "Lakshmi Vilas Singh vs State of UP", citation: "2021 INSC 789", court: "Supreme Court of India", outcome: "Allowed" },
    { title: "Paramjit Kaur vs State of Punjab", citation: "2019 SCC 456", court: "Supreme Court of India", outcome: "Allowed" },
    { title: "Selvi vs State of Karnataka", citation: "(2010) 7 SCC 263", court: "Supreme Court of India", outcome: "Allowed" },
    { title: "Mithun Chakraborty vs State of WB", citation: "2022 INSC 890", court: "Supreme Court of India", outcome: "Pending" },
    { title: "Sanjay Singh vs Election Commission", citation: "2023 INSC 901", court: "Supreme Court of India", outcome: "Allowed" },
    { title: "Prashant Bhushan vs Supreme Court", citation: "2020 INSC 567", court: "Supreme Court of India", outcome: "Dismissed" },
  ];

  const benchNames = [
    "Division Bench III", "Single Bench", "Chief Justice's Bench", "Constitutional Bench",
    "A.M. Khanwilkar, Dinesh Maheshwari, JJ.", "B.R. Gavai, K.V. Viswanathan, JJ.",
    "D.Y. Chandrachud, Indu Malhotra, JJ.", "J.S. Khehar, S.A. Bobde, JJ."
  ];

  const issueTemplates = [
    "Constitutional validity of statutory provision under Article 21.",
    "Whether fundamental rights are violated by executive action.",
    "Challenge to jurisdictional competence of tribunal.",
    "Interpretation of ambiguous statutory language.",
    "Validity of administrative order affecting fundamental rights.",
    "Proper procedure followed in investigation.",
    "Admissibility of evidence obtained through search.",
    "Maintainability of petition under Article 32.",
  ];

  const holdingTemplates = [
    "The petition is allowed with directions to the concerned authorities.",
    "The petition is dismissed as maintainability is not made out.",
    "Issue of notice returnable in four weeks.",
    "The matter requires detailed examination, listed for final hearing.",
    "The impugned order is set aside as arbitrary.",
    "Relief denied - no violation of constitutional rights made out.",
    "Matter referred to larger bench for authoritative pronouncement.",
    "Directions issued to frame appropriate guidelines.",
  ];

  for (let i = 0; i < 195; i++) {
    const base = additionalPrecedents[i % additionalPrecedents.length];
    const year = 2015 + Math.floor(Math.random() * 10);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    
    judgments.push({
      id: `prec-${(i + 6).toString().padStart(3, '0')}`,
      title: base.title,
      citation: base.citation || `AIR ${year} SC ${100 + i}`,
      court: base.court,
      caseType: ["CRL.A", "WP", "CIV.A", "SLP", "ARB"][Math.floor(Math.random() * 5)],
      judgmentDate: `${year}-${month}-${day}`,
      outcome: base.outcome,
      bench: benchNames[Math.floor(Math.random() * benchNames.length)],
      similarityScore: Number((0.65 + Math.random() * 0.3).toFixed(2)),
      keywordScore: Number((0.55 + Math.random() * 0.35).toFixed(2)),
      wordCount: 5000 + Math.floor(Math.random() * 20000),
      summary: {
        facts: base.title + " - matter concerning legal interpretation and constitutional rights.",
        issue: issueTemplates[Math.floor(Math.random() * issueTemplates.length)],
        holding: holdingTemplates[Math.floor(Math.random() * holdingTemplates.length)],
        outcomeText: base.outcome,
      },
      matchedSnippets: [`Relevant legal principles from ${base.title} support the instant petition.`],
      fullText: `Full judgment text for ${base.title}... legal analysis and findings...`
    });
  }

  return judgments;
}

// Generate model metrics
export function getModelMetrics(): { metrics: ModelMetricComparison[]; featureImportance: FeatureImportance[] } {
  return {
    metrics: [
      { metric: "MAE (days)", metadataOnly: 42.3, withPrecedents: 28.7, improvementPct: 32.2, unit: "days" },
      { metric: "RMSE (days)", metadataOnly: 58.1, withPrecedents: 39.5, improvementPct: 32.0, unit: "days" },
      { metric: "R² Score", metadataOnly: 0.45, withPrecedents: 0.72, improvementPct: 60.0, unit: "score" },
      { metric: "MAPE (%)", metadataOnly: 38.2, withPrecedents: 22.1, improvementPct: 42.1, unit: "percent" },
      { metric: "Coverage (%)", metadataOnly: 89.0, withPrecedents: 94.5, improvementPct: 6.2, unit: "percent" },
    ],
    featureImportance: [
      { rank: 1, featureName: "top1_similarity", category: "Precedent Intelligence", meanShap: 0.32, direction: "Reduces delay variance" },
      { rank: 2, featureName: "hearings_count", category: "Case Trajectory", meanShap: 0.24, direction: "Increases delay" },
      { rank: 3, featureName: "mean_top5_similarity", category: "Precedent Intelligence", meanShap: 0.18, direction: "Reduces delay variance" },
      { rank: 4, featureName: "outcome_agreement", category: "Precedent Intelligence", meanShap: 0.14, direction: "Reduces delay variance" },
      { rank: 5, featureName: "precedent_age_mean", category: "Precedent Intelligence", meanShap: 0.12, direction: "Increases delay" },
    ],
  };
}

// Generate system status
export function getSystemStatus(): SystemStatusTelemetry {
  return {
    backend: "ok",
    database: "in-memory",
    db_judgments_count: 200,
    db_pending_cases_count: 150,
    faiss_index_exists: true,
    faiss_vector_count: 200,
    embedding_model: "sentence-transformers/all-MiniLM-L6-v2",
    embedding_dimension: 384,
    distance_metric: "Inner Product (Cosine Similarity)",
    gemini_api_configured: false,
    summarizer_mode: "Extractive TextRank Fallback",
    version: "0.1.0",
    environment: "development",
  };
}

// Export data
export const CASES = generateCases();
export const JUDGMENTS = generateJudgments();