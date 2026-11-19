/**
 * src/lib/data.ts
 * ────────────────
 * Authoritative in-memory data store — consumed ONLY by /src/app/api/ route handlers.
 * Frontend code must never import from this file directly.
 *
 * Dataset: ~1 200 cases, ~400 precedents (8× original).
 */

import {
  CourtCase,
  UserProfile,
  Precedent,
  ModelMetricComparison,
  FeatureImportance,
  SystemStatusTelemetry,
} from "./types";

// ── Demo users ────────────────────────────────────────────────────────────────
export const DEMO_USERS: UserProfile[] = [
  { id: "user-judge-01",      email: "justice.sharma@sci.gov.in",       fullName: "Justice K. Sharma (Presiding Judge)",  role: "judge",      isActive: true },
  { id: "user-clerk-01",      email: "rajesh.verma@ecourts.gov.in",     fullName: "Rajesh Verma (Court Clerk)",           role: "clerk",      isActive: true },
  { id: "user-researcher-01", email: "pooja.iyer@ecourts.gov.in",       fullName: "Pooja Iyer (Law Researcher)",          role: "researcher", isActive: true },
];

// ── Static lookup tables ───────────────────────────────────────────────────────
const COURTS = [
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
  "High Court of Rajasthan",
  "High Court of Allahabad",
  "High Court of Patna",
  "High Court of Jharkhand",
  "High Court of Chhattisgarh",
];

const CASE_TYPES = ["CRL.A", "WP", "SLP", "CIV.A", "ARB", "COM", "TAX", "MAT", "AWA", "CRL.M.C", "REV", "FA", "OSA", "ELP", "CONTEMPT"];

const PETITIONERS = [
  "Union of India", "State of Maharashtra", "State of Delhi",
  "Ramesh Kumar Gupta", "Priya Sharma", "Anjali Verma",
  "M/s Tata Sons Pvt Ltd", "M/s Reliance Industries Ltd", "M/s Infosys Ltd",
  "Dr. Suresh Patel", "Prof. Meena Iyer", "Adv. Vikram Singh",
  "National Legal Services Authority", "People's Union for Civil Liberties",
  "Centre for Public Interest Litigation", "Common Cause",
  "M/s Bharat Petroleum Corp Ltd", "M/s ONGC Ltd",
  "Sunil Mehra", "Kavita Nair", "Deepak Sharma", "Sunita Joshi",
  "M/s HDFC Bank Ltd", "M/s SBI", "M/s ICICI Bank Ltd",
  "Municipal Corporation of Delhi", "Delhi Development Authority",
  "Jyoti Prakash", "Rohit Malhotra", "Anil Kumar Singh",
  "Indian Railways", "BSNL Ltd", "Air India Ltd",
  "State of UP", "State of Tamil Nadu", "State of Karnataka",
  "M/s Amazon India Pvt Ltd", "M/s Flipkart Pvt Ltd", "M/s Zomato Ltd",
  "Harish Chandra", "Leela Sharma", "Mohan Das",
];

const RESPONDENTS = [
  "Union of India", "Directorate of Enforcement",
  "Central Bureau of Investigation", "Income Tax Department",
  "Securities Exchange Board of India", "Reserve Bank of India",
  "State of Maharashtra", "State of Delhi", "State of UP",
  "National Investigation Agency", "Customs Department",
  "Election Commission of India", "Bar Council of India",
  "Medical Council of India", "University Grants Commission",
  "Ministry of Home Affairs", "Ministry of Finance",
  "M/s Future Retail Ltd", "M/s Byju's Think & Learn Pvt Ltd",
  "SEBI", "CCI", "TRAI", "IRDAI",
  "Ram Prasad Sharma", "Sita Devi", "Mohan Lal",
  "Delhi Police", "Maharashtra Police", "Karnataka Police",
  "Registrar of Companies", "NCLT", "NCLAT",
  "RERA Authority", "Food Safety Authority",
  "Competition Commission of India", "Appellate Tribunal",
  "Municipal Corporation", "Development Authority",
  "Central Vigilance Commission", "Lokpal",
  "High Court Registry", "Sessions Court",
];

const ACTS_POOL = [
  ["Constitution Art. 21", "CrPC Sec. 439"],
  ["Constitution Art. 226", "IPC Sec. 302"],
  ["PMLA Sec. 45", "Constitution Art. 21"],
  ["IPC Sec. 420", "IPC Sec. 406"],
  ["Constitution Art. 32", "Constitution Art. 14"],
  ["NDPS Act Sec. 37", "CrPC Sec. 439"],
  ["Arbitration Act Sec. 34", "Arbitration Act Sec. 37"],
  ["Income Tax Act Sec. 148", "Income Tax Act Sec. 263"],
  ["Companies Act Sec. 241", "NCLT Rules"],
  ["Consumer Protection Act Sec. 35", "Consumer Protection Act Sec. 58"],
  ["CrPC Sec. 482", "IPC Sec. 498A"],
  ["Hindu Marriage Act Sec. 13", "CPC Order 7 Rule 11"],
  ["Contempt of Courts Act Sec. 2", "Constitution Art. 215"],
  ["RTI Act Sec. 19", "RTI Act Sec. 20"],
  ["Environment Protection Act Sec. 15", "Water Act Sec. 25"],
  ["IPC Sec. 124A", "Constitution Art. 19"],
];

const BENCHES = [
  "Division Bench I", "Division Bench II", "Division Bench III", "Division Bench IV",
  "Single Bench (Writ)", "Single Bench (Criminal)", "Full Bench",
  "Constitution Bench", "Three-Judge Bench",
];

const DESCRIPTIONS = [
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
  "Challenge to constitutional validity of article 35A and provisions of Reorganization Act.",
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
  "Writ seeking direction for establishment of fast-track courts for rape cases.",
  "Challenge to constitutional validity of sedition law under Section 124A IPC.",
  "Petition for enforcement of fundamental right to clean environment under Article 21.",
  "Appeal against conviction for murder under Section 302 IPC challenging evidence admissibility.",
  "Matter concerning bail conditions restricting international travel.",
  "Petition regarding regularization of unauthorized colonies and basic amenities.",
  "Challenge to electoral bond scheme and anonymous political funding.",
  "Writ for implementation of National Education Policy 2020.",
  "Petition seeking protection of privacy rights in Aadhaar identification system.",
  "Matter concerning digital divide and equal access to online education.",
  "PIL for safety measures in construction industry and workers' compensation.",
  "Petition challenging detention order under National Security Act.",
  "Petition regarding debt relief for farmers and agricultural loan waiver.",
  "Matter concerning wildlife protection and eco-sensitive zones declaration.",
  "Writ for immediate release of undertrial prisoners held beyond prescribed period.",
  "Appeal challenging enhanced sentence in murder case by High Court.",
  "Petition regarding mental health resources and suicide prevention.",
  "Challenge to constitutional amendment affecting federal structure.",
  "Matter concerning right to die with dignity and passive euthanasia.",
  "PIL for proper implementation of food security scheme.",
  "Petition against forced eviction and displacement of tribal communities.",
  "Challenge to validity of demonetization and its implementation.",
  "SLP challenging High Court's refusal to grant bail in economic offences case.",
  "Writ petition against arbitrary transfer orders by state government.",
  "Matter regarding compensation for victims of industrial disaster.",
  "Challenge to media censorship orders affecting freedom of press.",
  "PIL for appointment of Lokpal and anti-corruption measures.",
  "Petition for release of classified government documents under RTI Act.",
  "Challenge to dismissal from government service without following natural justice.",
  "Criminal appeal in POCSO case challenging concurrent conviction.",
  "Writ for timely disposal of pension revision cases by tribunals.",
  "Matter regarding rights of prisoners and prison conditions.",
  "Challenge to land acquisition without adequate compensation.",
  "Petition against amendment to forest rights act affecting tribal communities.",
];

const STATUSES: Array<"pending" | "hearing" | "reserved" | "disposed"> =
  ["pending", "hearing", "reserved", "disposed"];

// ── Deterministic pseudo-random generator ────────────────────────────────────
function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ── Case generator ────────────────────────────────────────────────────────────
function generateCases(): CourtCase[] {
  const cases: CourtCase[] = [];
  const rand = seededRand(42);

  for (let i = 1; i <= 1200; i++) {
    const r = () => rand();

    const courtIdx      = Math.floor(r() * COURTS.length);
    const caseTypeIdx   = Math.floor(r() * CASE_TYPES.length);
    const petIdx        = Math.floor(r() * PETITIONERS.length);
    const resIdx        = Math.floor(r() * RESPONDENTS.length);
    const descIdx       = Math.floor(r() * DESCRIPTIONS.length);
    const actsIdx       = Math.floor(r() * ACTS_POOL.length);
    const benchIdx      = Math.floor(r() * BENCHES.length);
    const statusIdx     = Math.floor(r() * STATUSES.length);

    const hearings     = Math.floor(r() * 32) + 1;
    const topSim       = 0.60 + r() * 0.35;
    const meanSim      = topSim - r() * 0.08;
    const predictedDays = Math.max(30, Math.round(180 + hearings * 15 - topSim * 160 + (r() * 60 - 30)));
    const priority     = Math.min(98, Math.max(45, 50 + topSim * 35 + hearings * 0.8));
    const complexity: "Low" | "Medium" | "High" =
      hearings > 22 ? "High" : hearings > 11 ? "Medium" : "Low";

    const year  = 2018 + Math.floor(r() * 7);
    const month = String(Math.floor(r() * 12) + 1).padStart(2, "0");
    const day   = String(Math.floor(r() * 28) + 1).padStart(2, "0");

    const court = COURTS[courtIdx];
    const isSupreme = court.includes("Supreme");

    cases.push({
      id: `case-${String(i).padStart(4, "0")}`,
      caseNo: `${CASE_TYPES[caseTypeIdx]}. ${100 + i}/${year}`,
      caseType: CASE_TYPES[caseTypeIdx],
      court,
      filingDate: `${year}-${month}-${day}`,
      hearingsCount: hearings,
      status: STATUSES[statusIdx],
      bench: isSupreme ? BENCHES[benchIdx] : "Single Bench",
      petitioner: PETITIONERS[petIdx],
      respondent: RESPONDENTS[resIdx],
      actsSections: ACTS_POOL[actsIdx],
      description: DESCRIPTIONS[descIdx],
      top1Similarity: Number(topSim.toFixed(3)),
      meanTop5Similarity: Number(meanSim.toFixed(3)),
      countAboveThreshold: Math.floor(r() * 5) + 1,
      matchedPrecedentIds: [
        `prec-${String(Math.floor(r() * 50) + 1).padStart(3, "0")}`,
        `prec-${String(Math.floor(r() * 50) + 1).padStart(3, "0")}`,
      ],
      prediction: {
        predictedDays,
        complexity,
        priorityScore: Number(priority.toFixed(1)),
        confidenceIntervalDays: [
          Math.max(10, predictedDays - 30),
          predictedDays + 45,
        ],
        precedentConfidence: Number(topSim.toFixed(2)),
        shapFactors: [
          {
            feature: "Precedent Similarity",
            impact: topSim > 0.70 ? "reduces_delay" : "increases_delay",
            impactDays: Math.round(-25 * topSim),
            plainEnglishReason: `Top precedent matches core legal doctrine at ${(topSim * 100).toFixed(0)}% similarity.`,
          },
          {
            feature: "Hearing Trajectory",
            impact: hearings > 15 ? "increases_delay" : "reduces_delay",
            impactDays: Math.round(hearings * 4.2),
            plainEnglishReason: `Accumulated ${hearings} docket hearings indicating ${hearings > 15 ? "complex" : "manageable"} matter.`,
          },
          {
            feature: "Court Tier Factor",
            impact: isSupreme ? "increases_delay" : "reduces_delay",
            impactDays: isSupreme ? 45 : -15,
            plainEnglishReason: `${court} has ${isSupreme ? "higher" : "lower"} average disposal time.`,
          },
        ],
      },
    });
  }

  return cases;
}

// ── Landmark judgments (hardcoded with full data) ─────────────────────────────
const LANDMARK_JUDGMENTS: Precedent[] = [
  {
    id: "prec-001",
    title: "Vijay Madanlal Choudhary & Ors vs Union of India & Ors",
    citation: "(2022) 10 SCC 1",
    court: "Supreme Court of India",
    caseType: "CRL.A",
    judgmentDate: "2022-07-27",
    outcome: "Dismissed",
    bench: "A.M. Khanwilkar, Dinesh Maheshwari, C.T. Ravikumar, JJ.",
    similarityScore: 0.95,
    keywordScore: 0.90,
    wordCount: 18450,
    summary: { facts: "Constitutional validity challenge to PMLA Section 45 twin conditions.", issue: "Whether Section 45 PMLA satisfies proportionality test under Article 21?", holding: "Section 45 satisfies proportionality and is constitutional and valid.", outcomeText: "Petition dismissed." },
    matchedSnippets: ["The seminal question is regarding constitutional validity of PMLA Section 45."],
    fullText: "IN THE SUPREME COURT OF INDIA... The twin conditions are constitutional...",
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
    similarityScore: 0.93,
    keywordScore: 0.88,
    wordCount: 9240,
    summary: { facts: "Bail plea after 17 months incarceration in PMLA case with 493 witnesses.", issue: "Whether prolonged incarceration without trial infringes Article 21?", holding: "Article 21 cannot be extinguished by PMLA Section 45. Bail granted.", outcomeText: "Appeal allowed. Bail granted with conditions." },
    matchedSnippets: ["Prolonged incarceration without trial infringes the fundamental right under Article 21."],
    fullText: "The appellant has been incarcerated for 17 months...",
  },
  {
    id: "prec-003",
    title: "K.S. Puttaswamy (Retd.) vs Union of India",
    citation: "(2017) 10 SCC 1",
    court: "Supreme Court of India",
    caseType: "WP",
    judgmentDate: "2017-08-24",
    outcome: "Allowed",
    bench: "D.Y. Chandrachud, S.A. Bobde, J.S. Khehar, JJ.",
    similarityScore: 0.91,
    keywordScore: 0.87,
    wordCount: 24500,
    summary: { facts: "Constitutional validity of Aadhaar scheme and right to privacy.", issue: "Is right to privacy a fundamental right under Part III?", holding: "Right to privacy is a fundamental right under Article 21.", outcomeText: "Privacy declared fundamental right. Aadhaar upheld with modifications." },
    matchedSnippets: ["Right to privacy is an intrinsic part of right to life and personal liberty."],
    fullText: "The Constitution guarantees fundamental rights...",
  },
  {
    id: "prec-004",
    title: "Navtej Singh Johar vs Union of India",
    citation: "(2018) 10 SCC 1",
    court: "Supreme Court of India",
    caseType: "WP",
    judgmentDate: "2018-09-06",
    outcome: "Allowed",
    bench: "D.Y. Chandrachud, Indu Malhotra, R.F. Nariman, JJ.",
    similarityScore: 0.89,
    keywordScore: 0.85,
    wordCount: 18200,
    summary: { facts: "Challenge to Section 377 IPC criminalizing consensual adult same-sex relations.", issue: "Whether Section 377 IPC violates Articles 14, 19, 21?", holding: "Section 377 IPC unconstitutional insofar as it penalises consensual adult relations.", outcomeText: "Section 377 partially struck down." },
    matchedSnippets: ["Sexual orientation is an essential attribute of privacy."],
    fullText: "The Constitution protects individual autonomy...",
  },
  {
    id: "prec-005",
    title: "Arnesh Kumar vs State of Bihar",
    citation: "(2014) 8 SCC 273",
    court: "Supreme Court of India",
    caseType: "CRL.A",
    judgmentDate: "2014-07-02",
    outcome: "Allowed",
    bench: "Chandramauli Kr. Prasad, Pinaki Chandra Ghose, JJ.",
    similarityScore: 0.88,
    keywordScore: 0.82,
    wordCount: 6400,
    summary: { facts: "Arbitrary arrest under Section 498A IPC without following Section 41A CrPC.", issue: "Whether police can arrest without following CrPC Section 41A guidelines?", holding: "Section 41A CrPC must be followed mandatorily before arresting for offences up to 7 years.", outcomeText: "Guidelines issued for Section 41A compliance." },
    matchedSnippets: ["Arrest must be justified, not made as a matter of course."],
    fullText: "No arrest should be made just because it is lawful...",
  },
  {
    id: "prec-006",
    title: "Shayara Bano vs Union of India",
    citation: "(2017) 9 SCC 1",
    court: "Supreme Court of India",
    caseType: "WP",
    judgmentDate: "2017-08-22",
    outcome: "Allowed",
    bench: "J.S. Khehar, Kurian Joseph, R.F. Nariman, JJ.",
    similarityScore: 0.87,
    keywordScore: 0.80,
    wordCount: 15300,
    summary: { facts: "Constitutional validity of practice of triple talaq (talaq-e-biddat) challenged.", issue: "Whether triple talaq violates constitutional rights of Muslim women?", holding: "Triple talaq is unconstitutional as it is manifestly arbitrary.", outcomeText: "Triple talaq held unconstitutional 3:2." },
    matchedSnippets: ["Triple talaq is manifestly arbitrary and violates Article 14."],
    fullText: "The practice of triple talaq is not an essential religious practice...",
  },
  {
    id: "prec-007",
    title: "Joseph Shine vs Union of India",
    citation: "(2018) 3 SCC 1",
    court: "Supreme Court of India",
    caseType: "WP",
    judgmentDate: "2018-09-27",
    outcome: "Allowed",
    bench: "D.Y. Chandrachud, R.F. Nariman, Indu Malhotra, JJ.",
    similarityScore: 0.86,
    keywordScore: 0.79,
    wordCount: 12500,
    summary: { facts: "Constitutional challenge to Section 497 IPC (adultery).", issue: "Whether Section 497 IPC treating women as property violates constitutional rights?", holding: "Section 497 IPC struck down — it is unconstitutional and treats women as chattel.", outcomeText: "Adultery decriminalized." },
    matchedSnippets: ["Section 497 is an anachronistic provision that must be struck down."],
    fullText: "The concept of adultery as a crime is inconsistent with the Constitution...",
  },
  {
    id: "prec-008",
    title: "Lalita Kumari vs Govt of UP",
    citation: "(2014) 2 SCC 1",
    court: "Supreme Court of India",
    caseType: "WP",
    judgmentDate: "2013-11-12",
    outcome: "Allowed",
    bench: "P. Sathasivam, B.S. Chauhan, Ranjana Prakash Desai, JJ.",
    similarityScore: 0.85,
    keywordScore: 0.78,
    wordCount: 8900,
    summary: { facts: "FIR not registered despite cognizable offence being reported to police.", issue: "Is registration of FIR mandatory when cognizable offence is disclosed?", holding: "Registration of FIR is mandatory when cognizable offence is disclosed. No preliminary inquiry permitted.", outcomeText: "Mandatory FIR registration directed." },
    matchedSnippets: ["If information discloses a cognizable offence, registration of FIR is mandatory."],
    fullText: "The police officer cannot go into the genuineness of the complaint...",
  },
  {
    id: "prec-009",
    title: "Selvi vs State of Karnataka",
    citation: "(2010) 7 SCC 263",
    court: "Supreme Court of India",
    caseType: "CRL.A",
    judgmentDate: "2010-05-05",
    outcome: "Allowed",
    bench: "K.G. Balakrishnan, R.V. Raveendran, J.M. Panchal, JJ.",
    similarityScore: 0.84,
    keywordScore: 0.77,
    wordCount: 22000,
    summary: { facts: "Involuntary narcoanalysis, polygraph and brain mapping tests on accused.", issue: "Whether involuntary administration of these tests violates fundamental rights?", holding: "Involuntary tests violate right against self-incrimination and right to privacy.", outcomeText: "Involuntary tests held unconstitutional." },
    matchedSnippets: ["The right against self-incrimination is a testimonial immunity."],
    fullText: "The compelling of a person to submit to narcoanalysis violates Article 20(3)...",
  },
  {
    id: "prec-010",
    title: "Pawan Kumar Gupta vs State of NCT of Delhi",
    citation: "2020 SCC OnLine SC 453",
    court: "Supreme Court of India",
    caseType: "CRL.A",
    judgmentDate: "2020-02-28",
    outcome: "Dismissed",
    bench: "Arun Mishra, Indira Banerjee, MR Shah, JJ.",
    similarityScore: 0.83,
    keywordScore: 0.76,
    wordCount: 7100,
    summary: { facts: "One of four convicts in the Nirbhaya gang rape case seeking stay of execution.", issue: "Whether execution warrants can be issued and carried out?", holding: "Execution warrant upheld. Curative petition rejected.", outcomeText: "Petition dismissed. Execution upheld." },
    matchedSnippets: ["The crime shocks the conscience of the society."],
    fullText: "The criminal law recognises the right to protection of life...",
  },
];

// ── Procedurally generated additional precedents ──────────────────────────────
const ADDITIONAL_CASE_NAMES = [
  ["Nirav Modi", "Union of India"],
  ["Vijay Mallya", "Directorate of Enforcement"],
  ["P. Chidambaram", "CBI"],
  ["M/s Future Retail", "Amazon.com NV Investment Holdings LLC"],
  ["M/s Byju's Think & Learn", "BCCI"],
  ["M/s Go First Airlines", "DGCA"],
  ["Arvind Kejriwal", "Directorate of Enforcement"],
  ["Hemant Soren", "State of Jharkhand"],
  ["Sidhant Chaturvedi", "Board of Trustees, Mumbai Port"],
  ["M/s Adani Enterprises", "SEBI"],
  ["M/s Vedanta Ltd", "Ministry of Environment"],
  ["Bilkis Bano", "Union of India"],
  ["M/s Jaypee Infratech", "IDBI Bank"],
  ["State of Himachal Pradesh", "Union of India"],
  ["Prashant Bhushan", "In re Contempt"],
  ["Teesta Setalvad", "State of Gujarat"],
  ["Siddique Kappan", "State of UP"],
  ["Umar Khalid", "State of Delhi"],
  ["Sudha Bharadwaj", "NIA"],
  ["Disha Ravi", "State of Delhi"],
  ["Sachin Vaze", "NIA"],
  ["Sukesh Chandrashekhar", "State of Delhi"],
  ["Mukhtar Ansari", "State of UP"],
  ["Atiq Ahmed", "CBI"],
  ["M/s VIVO Mobile India", "Directorate of Enforcement"],
  ["M/s Xiaomi Technology India", "Directorate of Enforcement"],
  ["M/s Paytm Payments Bank", "RBI"],
  ["M/s Zee Entertainment", "Invesco"],
  ["M/s NDTV", "SEBI"],
  ["M/s Yes Bank", "RBI Administrator"],
  ["Sanjay Raut", "Directorate of Enforcement"],
  ["Nawab Malik", "Directorate of Enforcement"],
  ["Anil Deshmukh", "CBI"],
  ["Param Bir Singh", "State of Maharashtra"],
  ["Sameer Wankhede", "NCB"],
  ["Rhea Chakraborty", "NCB"],
  ["Aryan Khan", "NCB"],
  ["Raj Kundra", "Mumbai Police"],
  ["M/s IL&FS Ltd", "SFIO"],
  ["M/s DHFL", "NCLT"],
];

const OUTCOMES: Array<"Allowed" | "Dismissed" | "Disposed" | "Remanded" | "Pending"> =
  ["Allowed", "Dismissed", "Allowed", "Remanded", "Dismissed", "Disposed", "Pending"];
const HOLDINGS = [
  "The petition is allowed and impugned order set aside.",
  "The petition is dismissed for lack of merit.",
  "Matter remanded to the trial court for fresh consideration.",
  "Directions issued with liberty to file fresh petition.",
  "Parties directed to maintain status quo until further orders.",
  "The appeal is allowed and sentence modified.",
  "High Court order affirmed. No interference warranted.",
  "The fundamental right has been violated. Compensation directed.",
];
const ISSUES = [
  "Constitutional validity of impugned statutory provision.",
  "Whether executive action is arbitrary and violates Article 14?",
  "Jurisdictional competence of the impugned tribunal.",
  "Admissibility of electronic evidence in criminal proceedings.",
  "Maintainability of petition under Article 32.",
  "Validity of search and seizure under applicable laws.",
  "Whether bail conditions are reasonable and proportionate?",
  "Interpretation of contractual obligations and arbitration clause.",
];

function generateJudgments(): Precedent[] {
  const result: Precedent[] = [...LANDMARK_JUDGMENTS];
  const rand = seededRand(99);
  const r = () => rand();

  for (let i = 0; i < 390; i++) {
    const nameIdx = Math.floor(r() * ADDITIONAL_CASE_NAMES.length);
    const [pet, res] = ADDITIONAL_CASE_NAMES[nameIdx];
    const year = 2010 + Math.floor(r() * 15);
    const month = String(Math.floor(r() * 12) + 1).padStart(2, "0");
    const day = String(Math.floor(r() * 28) + 1).padStart(2, "0");
    const courtIdx = Math.floor(r() * COURTS.length);
    const sim = 0.60 + r() * 0.35;

    result.push({
      id: `prec-${String(i + 11).padStart(3, "0")}`,
      title: `${pet} vs ${res}`,
      citation: `${year} SCC OnLine SC ${100 + i * 3}`,
      court: COURTS[courtIdx],
      caseType: CASE_TYPES[Math.floor(r() * 10)],
      judgmentDate: `${year}-${month}-${day}`,
      outcome: OUTCOMES[Math.floor(r() * OUTCOMES.length)],
      bench: BENCHES[Math.floor(r() * BENCHES.length)],
      similarityScore: Number(sim.toFixed(2)),
      keywordScore: Number((sim - 0.05 + r() * 0.1).toFixed(2)),
      wordCount: 4000 + Math.floor(r() * 20000),
      summary: {
        facts: `${pet} filed petition against ${res} concerning ${DESCRIPTIONS[Math.floor(r() * DESCRIPTIONS.length)]}`,
        issue: ISSUES[Math.floor(r() * ISSUES.length)],
        holding: HOLDINGS[Math.floor(r() * HOLDINGS.length)],
        outcomeText: OUTCOMES[Math.floor(r() * OUTCOMES.length)],
      },
      matchedSnippets: [`Relevant legal principles apply from ${pet} vs ${res}.`],
      fullText: `Judgment in ${pet} vs ${res}. ${HOLDINGS[Math.floor(r() * HOLDINGS.length)]}`,
    });
  }

  return result;
}

// ── Model metrics ─────────────────────────────────────────────────────────────
export function getModelMetrics(): {
  metrics: ModelMetricComparison[];
  featureImportance: FeatureImportance[];
} {
  return {
    metrics: [
      { metric: "MAE (days)",    metadataOnly: 42.3, withPrecedents: 28.7, improvementPct: 32.2, unit: "days" },
      { metric: "RMSE (days)",   metadataOnly: 58.1, withPrecedents: 39.5, improvementPct: 32.0, unit: "days" },
      { metric: "R² Score",      metadataOnly: 0.45, withPrecedents: 0.72, improvementPct: 60.0, unit: "score" },
      { metric: "MAPE (%)",      metadataOnly: 38.2, withPrecedents: 22.1, improvementPct: 42.1, unit: "percent" },
      { metric: "Coverage (%)",  metadataOnly: 89.0, withPrecedents: 94.5, improvementPct: 6.2,  unit: "percent" },
    ],
    featureImportance: [
      { rank: 1, featureName: "top1_similarity",       category: "Precedent Intelligence", meanShap: 0.32, direction: "Reduces delay variance",  description: "Cosine similarity to nearest precedent" },
      { rank: 2, featureName: "hearings_count",         category: "Procedural",             meanShap: 0.24, direction: "Increases delay",          description: "Total hearings held so far" },
      { rank: 3, featureName: "mean_top5_similarity",  category: "Precedent Intelligence", meanShap: 0.18, direction: "Reduces delay variance",  description: "Mean similarity of top-5 precedents" },
      { rank: 4, featureName: "outcome_agreement",     category: "Precedent Intelligence", meanShap: 0.14, direction: "Reduces delay variance",  description: "Fraction of precedents with same outcome" },
      { rank: 5, featureName: "precedent_age_mean",    category: "Precedent Intelligence", meanShap: 0.12, direction: "Increases delay",          description: "Average age of top-5 precedents in years" },
    ],
  };
}

// ── System status ─────────────────────────────────────────────────────────────
export function getSystemStatus(): SystemStatusTelemetry {
  return {
    backend:               "ok",
    database:              "in-memory",
    db_judgments_count:    400,
    db_pending_cases_count: 1200,
    faiss_index_exists:    true,
    faiss_vector_count:    400,
    embedding_model:       "sentence-transformers/all-MiniLM-L6-v2",
    embedding_dimension:   384,
    distance_metric:       "Inner Product (Cosine Similarity via L2-norm)",
    gemini_api_configured: false,
    summarizer_mode:       "Extractive TextRank Fallback",
    version:               "1.0.0",
    environment:           "development",
  };
}

// ── Exported singletons (mutable for POST/PATCH/DELETE) ───────────────────────
export const CASES: CourtCase[]      = generateCases();
export const JUDGMENTS: Precedent[]  = generateJudgments();
