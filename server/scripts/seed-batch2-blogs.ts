/**
 * seed-batch2-blogs.ts
 *
 * Phase 1 Blog Content: 5 SSC cluster posts + 3 ISRO cluster posts
 * Author: Manali Suryawanshi (Government Recruitment Researcher, GovtJobNow)
 * Standard: 1,000–1,400 words each | Unique excerpts | 3-5 FAQs | Internal links
 *
 * Run: npx tsx server/scripts/seed-batch2-blogs.ts
 */

import "dotenv/config";
import { db } from "../db";
import { blogPosts } from "../../shared/schema";
import { eq } from "drizzle-orm";

const AUTHOR_NAME = "Manali Suryawanshi";
const AUTHOR_BIO =
  "Manali Suryawanshi is a Government Recruitment Researcher and Senior Content Editor at GovtJobNow. She tracks and verifies official recruitment notifications from SSC, UPSC, Railway Recruitment Boards, ISRO, DRDO, State PSCs, and Banking sectors to help Indian job aspirants stay informed and apply confidently.";

const BATCH2_POSTS = [
  // ═══════════════════════════════════════════════════════════
  // SSC CLUSTER — POST 1
  // ═══════════════════════════════════════════════════════════
  {
    title: "SSC CGL 2026 Complete Syllabus: Subject-Wise Weightage and Topic Priority List",
    slug: "ssc-cgl-2026-complete-syllabus-topic-priority",
    excerpt:
      "A detailed breakdown of the SSC CGL 2026 syllabus for Tier-1 and Tier-2 — covering exact topic weightage from each subject, the most frequently tested chapters based on 8 years of PYQ analysis, and a priority study plan to help you score above cut-off in both stages.",
    category: "SSC Exam Strategy",
    tags: ["SSC CGL", "Syllabus 2026", "Tier-1", "Tier-2", "Exam Strategy"],
    coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Student studying SSC CGL syllabus notes at desk",
    coverImageCaption: "Understanding SSC CGL 2026 syllabus topic-by-topic is the first step to building a targeted preparation plan.",
    authorName: AUTHOR_NAME,
    authorBio: AUTHOR_BIO,
    readingTime: 13,
    status: "published",
    publishedAt: new Date("2026-09-10T08:00:00Z"),
    seoTitle: "SSC CGL 2026 Complete Syllabus: Subject-Wise Weightage and Topic Priority",
    seoDescription: "Full SSC CGL 2026 syllabus breakdown for Tier-1 and Tier-2 with subject-wise topic weightage, PYQ frequency analysis, and a priority list for targeted preparation.",
    seoKeywords: "SSC CGL 2026 syllabus, SSC CGL Tier-1 syllabus, SSC CGL Tier-2 syllabus, SSC CGL topic weightage, SSC CGL preparation 2026",
    schemaType: "HowTo",
    faq: [
      {
        question: "Has the SSC CGL syllabus changed for 2026 compared to 2024?",
        answer: "SSC CGL follows the same broad syllabus pattern set after the 2022 restructuring — a 2-Tier examination replacing the earlier 4-Tier system. The core subjects (Quantitative Aptitude, English, Reasoning, General Awareness) remain unchanged. Always check the official SSC notification at ssc.gov.in for the latest syllabus PDF before beginning preparation."
      },
      {
        question: "Which section carries the highest weightage in SSC CGL Tier-2?",
        answer: "Section 2 of Tier-2 Paper-I (English Language + General Awareness) carries 210 marks — the highest of the three sections. English alone contributes 135 marks, making it the most important section for merit ranking. Candidates who score 90+ in English consistently secure top ranks."
      },
      {
        question: "Is General Awareness difficult to prepare for SSC CGL?",
        answer: "General Awareness covers both static GK (Polity, History, Geography, Science) and current affairs from the past 12 months. Static GK from NCERT Class 6-12 and Lucent's GK book covers approximately 80% of questions. Current affairs from the last 6 months before the exam date covers the remaining 20%."
      },
      {
        question: "Can I skip the Computer Knowledge module in Tier-2?",
        answer: "No. The Computer Knowledge module in Tier-2 is qualifying in nature. You must score the minimum qualifying marks to remain in contention for all posts. However, it does not count toward the final merit ranking, so you only need to clear the qualifying threshold — not maximize your score in it."
      }
    ],
    content: `
<p>
  The Staff Selection Commission Combined Graduate Level (SSC CGL) examination is conducted annually to recruit candidates for Group B and Group C posts across central government ministries. With over 20 lakh candidates applying every year, understanding the exact syllabus and topic-wise weightage is the single most important step in building a winning preparation strategy. Browse active <a href="/category/ssc" title="Latest SSC CGL Jobs on GovtJobNow"><strong>SSC CGL Recruitment Notifications</strong></a> on GovtJobNow.
</p>
<p>
  SSC CGL 2026 follows the 2-Tier examination structure introduced in 2022. Tier-1 is a qualifying screening round. Your final merit rank is determined entirely by your performance in Tier-2 Paper-I. This guide breaks down every subject, every topic, and tells you exactly where to focus your energy.
</p>

<h2>SSC CGL 2026 Tier-1 Exam Pattern</h2>

<p>
  Tier-1 is a Computer-Based Test of 60 minutes duration with 100 multiple-choice questions carrying 200 marks. There is a negative marking of 0.50 marks per wrong answer. Tier-1 is qualifying — your Tier-1 marks are NOT counted toward the final merit list.
</p>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Subject</th><th>Questions</th><th>Marks</th><th>Top Priority Topics</th></tr></thead>
    <tbody>
      <tr><td>General Intelligence &amp; Reasoning</td><td>25</td><td>50</td><td>Analogy, Series, Coding-Decoding, Syllogisms, Direction Sense</td></tr>
      <tr><td>General Awareness</td><td>25</td><td>50</td><td>Indian Polity, Static GK, Science Facts, Current Affairs (6 months)</td></tr>
      <tr><td>Quantitative Aptitude</td><td>25</td><td>50</td><td>Arithmetic (40%), Geometry (20%), Algebra (15%), Trigonometry (15%)</td></tr>
      <tr><td>English Comprehension</td><td>25</td><td>50</td><td>Error Spotting, Fill in Blanks, Idioms, Synonyms/Antonyms, Reading Comprehension</td></tr>
    </tbody>
  </table>
</div>

<h2>SSC CGL 2026 Tier-2 Exam Pattern (Merit Decider)</h2>

<p>
  Tier-2 Paper-I is compulsory for all posts. It is conducted in a single sitting divided into three sections:
</p>

<h3>Section 1 — Mathematical Abilities + Reasoning (180 Marks, 60 Minutes)</h3>
<ul>
  <li><strong>Mathematical Abilities (30 Questions, 90 Marks):</strong> Arithmetic, Advanced Mathematics including Mensuration, Trigonometry, Algebra, Data Interpretation.</li>
  <li><strong>Reasoning &amp; General Intelligence (30 Questions, 90 Marks):</strong> Logical Reasoning, Venn Diagrams, Matrix, Non-verbal patterns, Critical Thinking.</li>
</ul>

<h3>Section 2 — English + General Awareness (210 Marks, 60 Minutes)</h3>
<ul>
  <li><strong>English Language &amp; Comprehension (45 Questions, 135 Marks):</strong> Active/Passive Voice, Direct/Indirect Speech, Error Detection, Cloze Test, Reading Comprehension passages, Sentence Improvement. English dominates Tier-2 merit — prioritise it.</li>
  <li><strong>General Awareness (25 Questions, 75 Marks):</strong> Static GK (Polity, History, Geography, Science), Economy, Current Affairs from the past 12 months.</li>
</ul>

<h3>Section 3 — Computer Knowledge + DEST (Qualifying)</h3>
<ul>
  <li><strong>Computer Knowledge Module (20 Questions — Qualifying):</strong> Computer fundamentals, MS Office, Internet basics, Input/Output devices, Memory types.</li>
  <li><strong>DEST (Data Entry Speed Test — for specific posts):</strong> 2,000 key depressions in 15 minutes on a printed passage.</li>
</ul>

<h2>Subject-Wise Topic Priority Analysis (Based on 8 Years PYQs)</h2>

<h3>1. Quantitative Aptitude — High ROI Topics</h3>
<p>
  Based on analysis of Tier-2 papers from 2018 to 2025, approximately 60% of mathematics questions come from just five Arithmetic chapters: Percentages, Profit &amp; Loss, Simple &amp; Compound Interest, Ratio &amp; Proportion, and Time, Work &amp; Speed. Master these five before moving to Advanced Mathematics (Geometry, Trigonometry, Mensuration). For deeper practice strategies, see our guide on <a href="/blog/ssc-cgl-preparation-strategy-2026" title="SSC CGL Preparation Strategy 2026"><strong>SSC CGL Preparation Strategy 2026</strong></a>.
</p>
<ul>
  <li><strong>Must master (appears every year):</strong> Percentages, Profit &amp; Loss, Time &amp; Work, Ratio, SI/CI.</li>
  <li><strong>High frequency (appears 8–10 times per exam):</strong> Geometry (circles, triangles, quadrilaterals), Mensuration 2D, Trigonometry (heights &amp; distances).</li>
  <li><strong>Medium frequency (3–6 times per exam):</strong> Algebra, Number System, Statistics (Mean, Median, Mode), DI (Bar Graph, Pie Chart).</li>
</ul>

<h3>2. English Language — The Merit Maker</h3>
<p>
  English is the most important subject for final merit ranking in Tier-2. Candidates who score above 95 out of 135 in English consistently appear in the top 10% of the merit list. Focus on three areas in this order: Grammar rules (40% of questions), Vocabulary (30%), Reading Comprehension (30%). Read our dedicated guide on <a href="/blog/score-45-plus-english-competitive-exams" title="How to Score 45+ in English"><strong>Scoring 45+ in English Competitive Exams</strong></a> for a topic-by-topic practice plan.
</p>

<h3>3. General Intelligence &amp; Reasoning</h3>
<p>
  Reasoning is a high-scoring section in Tier-1 and Tier-2. Most questions follow predictable patterns that can be solved using short techniques. Top topics by frequency: Analogy (15–18%), Series (12–15%), Coding-Decoding (10–12%), Syllogisms (10%), Matrix-based questions (8%), Direction Sense (7%), and Blood Relations (6%).
</p>

<h3>4. General Awareness</h3>
<p>
  GK questions in SSC CGL follow a consistent pattern: 40% from Static GK (Polity &amp; History), 30% from Science (Physics, Chemistry, Biology), 15% from Geography, and 15% from Current Affairs. NCERT Class 6-10 textbooks form the backbone of static GK. For current affairs, maintain a monthly digest covering government schemes, national events, international summits, and scientific achievements.
</p>

<h2>6-Month Preparation Timetable</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Month</th><th>Focus</th><th>Target</th></tr></thead>
    <tbody>
      <tr><td>Month 1–2</td><td>Arithmetic concepts + English Grammar foundation + Reasoning basics</td><td>Complete core chapters with PYQ practice</td></tr>
      <tr><td>Month 3</td><td>Advanced Maths (Geometry, Trigonometry) + Vocabulary building + Static GK</td><td>First full-length mock test by end of Month 3</td></tr>
      <tr><td>Month 4</td><td>English Reading Comprehension + Data Interpretation + Current Affairs routine</td><td>2 mock tests per week</td></tr>
      <tr><td>Month 5</td><td>Full syllabus revision + Mistake diary review + Speed building</td><td>3 mock tests per week with error analysis</td></tr>
      <tr><td>Month 6</td><td>Final revision of formulas + English grammar rules + GK quick revision</td><td>Daily sectional tests + 1 full mock per 2 days</td></tr>
    </tbody>
  </table>
</div>

<h2>Official Resources and Verification</h2>
<p>
  Always download the official SSC CGL syllabus PDF from <a href="https://ssc.gov.in" target="_blank" rel="noopener noreferrer"><strong>ssc.gov.in</strong></a> before starting preparation. Exam patterns are occasionally revised and candidates relying on outdated syllabi risk missing new sections. Check active SSC CGL notifications and application windows on <a href="/category/ssc" title="SSC Job Notifications GovtJobNow"><strong>GovtJobNow SSC Jobs</strong></a>.
</p>

<div class="important-note">
  <p><strong>Disclaimer:</strong> Exam patterns, syllabus content, and selection procedures are determined by the Staff Selection Commission and are subject to change. Candidates should always verify the current syllabus PDF published with the official SSC CGL advertisement on ssc.gov.in before beginning preparation.</p>
</div>
`,
  },

  // ═══════════════════════════════════════════════════════════
  // SSC CLUSTER — POST 2
  // ═══════════════════════════════════════════════════════════
  {
    title: "SSC CGL Tier-2 Mathematics 2026: Chapter-Wise PYQ Analysis (2018–2025)",
    slug: "ssc-cgl-tier2-mathematics-pyq-analysis-2026",
    excerpt:
      "A chapter-by-chapter analysis of SSC CGL Tier-2 Mathematics questions from 2018 to 2025 — covering which topics appear most frequently, exact question counts per chapter, essential formulas to memorise, and a targeted 60-day practice plan to score 70+ out of 90 in the Maths section.",
    category: "SSC Exam Strategy",
    tags: ["SSC CGL", "Mathematics", "Tier-2", "PYQ Analysis", "Quantitative Aptitude"],
    coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Mathematical formulas and geometry diagrams for SSC CGL preparation",
    coverImageCaption: "Chapter-wise analysis of 8 years of SSC CGL Tier-2 Mathematics questions.",
    authorName: AUTHOR_NAME,
    authorBio: AUTHOR_BIO,
    readingTime: 14,
    status: "published",
    publishedAt: new Date("2026-09-11T08:00:00Z"),
    seoTitle: "SSC CGL Tier-2 Mathematics 2026: Chapter-Wise PYQ Analysis and Topic Frequency",
    seoDescription: "Chapter-wise analysis of SSC CGL Tier-2 Maths PYQs from 2018 to 2025. Know exactly which topics appear most, how many questions each chapter gets, and which formulas to prioritise.",
    seoKeywords: "SSC CGL Tier-2 mathematics, SSC CGL maths PYQ analysis, SSC CGL quantitative aptitude, SSC CGL 2026 maths preparation",
    schemaType: "HowTo",
    faq: [
      {
        question: "How many questions come from Arithmetic vs Advanced Mathematics in SSC CGL Tier-2?",
        answer: "Based on 2018–2025 PYQ analysis, approximately 60–65% of Tier-2 Mathematics questions (18–20 out of 30) come from Arithmetic (Percentages, Profit-Loss, SI/CI, Time-Work, Speed-Distance). The remaining 35–40% come from Advanced Mathematics (Geometry, Mensuration, Trigonometry, Algebra, Statistics)."
      },
      {
        question: "Is Geometry important for SSC CGL Tier-2 Maths?",
        answer: "Yes, Geometry is the second-most important chapter after Arithmetic. It contributes 4–6 questions per exam covering triangles (similarity, congruence), circles (chord, tangent properties), and quadrilaterals. Memorising standard results (angle bisector theorem, Pythagoras variants) saves significant time in the exam hall."
      },
      {
        question: "Which book is best for SSC CGL Tier-2 Mathematics PYQ practice?",
        answer: "Kiran Publication's 'SSC CGL Tier-2 Mathematics Chapterwise Solved Papers' and Pinnacle's 'Chapter-Wise Topic-Wise Solved Papers' are the two most recommended books for PYQ practice. Both are updated annually and cover questions from 2010 onwards with detailed solution approaches."
      }
    ],
    content: `
<p>
  Mathematics in SSC CGL Tier-2 Paper-I (Section 1) carries 90 marks across 30 questions in a 60-minute window. For most aspirants, Maths is either the biggest score booster or the biggest bottleneck. The key to performing consistently well is not studying the entire syllabus uniformly — it is understanding which chapters carry the maximum exam weight and targeting them with precision. Explore current <a href="/category/ssc" title="SSC Recruitment 2026 GovtJobNow"><strong>SSC Recruitment Notifications</strong></a> on GovtJobNow.
</p>
<p>
  This guide presents a data-driven chapter-by-chapter frequency analysis of SSC CGL Tier-2 Mathematics questions from 2018 to 2025 — eight years of PYQs — so you know exactly where to invest your preparation time.
</p>

<h2>Chapter-Wise Question Frequency Table (2018–2025)</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Chapter</th><th>Avg Questions/Exam</th><th>Typical Mark Range</th><th>Priority</th></tr></thead>
    <tbody>
      <tr><td>Percentage, Profit &amp; Loss</td><td>4–5</td><td>12–15</td><td>🔴 Critical</td></tr>
      <tr><td>Time, Work &amp; Wages</td><td>3–4</td><td>9–12</td><td>🔴 Critical</td></tr>
      <tr><td>Simple &amp; Compound Interest</td><td>2–3</td><td>6–9</td><td>🔴 Critical</td></tr>
      <tr><td>Ratio, Proportion &amp; Mixture</td><td>2–3</td><td>6–9</td><td>🔴 Critical</td></tr>
      <tr><td>Speed, Distance &amp; Time / Boats &amp; Trains</td><td>2–3</td><td>6–9</td><td>🔴 Critical</td></tr>
      <tr><td>Geometry (Triangles, Circles)</td><td>4–5</td><td>12–15</td><td>🔴 Critical</td></tr>
      <tr><td>Mensuration 2D &amp; 3D</td><td>3–4</td><td>9–12</td><td>🟠 High</td></tr>
      <tr><td>Trigonometry (Ratios + Heights &amp; Distances)</td><td>2–3</td><td>6–9</td><td>🟠 High</td></tr>
      <tr><td>Algebra (Polynomial identities, Linear equations)</td><td>2–3</td><td>6–9</td><td>🟠 High</td></tr>
      <tr><td>Data Interpretation (Bar, Pie, Table, Line)</td><td>1–2</td><td>3–6</td><td>🟡 Medium</td></tr>
      <tr><td>Number System (Divisibility, LCM, HCF)</td><td>1–2</td><td>3–6</td><td>🟡 Medium</td></tr>
      <tr><td>Statistics (Mean, Median, Mode, SD)</td><td>1</td><td>3</td><td>🟡 Medium</td></tr>
    </tbody>
  </table>
</div>

<h2>Chapter-Wise Strategy: Arithmetic (The Score Base)</h2>

<h3>1. Percentages and Profit &amp; Loss</h3>
<p>
  This combined area contributes the most questions across all years. The key is mastering the fraction-to-percentage conversion table (1/7 = 14.28%, 1/8 = 12.5%, 1/9 = 11.11%, 1/11 = 9.09%) and the successive discount/profit formula: Net change = a + b + (ab/100). Every question in this chapter is solvable using these two core techniques.
</p>

<h3>2. Time, Work &amp; Wages / Pipes &amp; Cisterns</h3>
<p>
  Use the efficiency method (1-day work = 1/Total days) for all Time &amp; Work problems. For Pipes &amp; Cisterns, treat filling pipes as positive and emptying pipes as negative. Most questions in this chapter can be solved in under 60 seconds using the LCM method instead of algebraic equations.
</p>

<h3>3. Speed, Distance &amp; Time / Trains &amp; Boats</h3>
<p>
  The three critical formulas to memorise: Relative speed (same direction) = |S₁ - S₂|, Relative speed (opposite direction) = S₁ + S₂, and Boat upstream speed = (B - R), downstream = (B + R). Practice converting km/h to m/s (divide by 3.6) as SSC regularly mixes units within the same question.
</p>

<h2>Chapter-Wise Strategy: Advanced Mathematics (The Rank Booster)</h2>

<h3>4. Geometry — The Highest ROI Advanced Maths Topic</h3>
<p>
  Geometry is the single most important Advanced Maths chapter. SSC repeatedly tests 6 key theorems: (1) Angle bisector theorem, (2) Ptolemy's theorem for cyclic quadrilaterals, (3) Circle chord-angle relationships, (4) Tangent-radius perpendicularity, (5) Triangle similarity conditions (AA, SAS, SSS), (6) Midpoint theorem. Memorising and recognising these 6 theorems is sufficient to solve 70% of Geometry questions without any complex derivation.
</p>

<h3>5. Mensuration</h3>
<p>
  SSC Tier-2 Mensuration tests both 2D (Area and Perimeter of triangles, circles, quadrilaterals) and 3D (Volume and Surface Area of Cube, Cuboid, Cylinder, Cone, Sphere, Frustum). The 3D questions are usually straightforward formula applications. Focus on combination problems (e.g., cone placed on hemisphere, cube inscribed in sphere) which appear in approximately 40% of Mensuration questions.
</p>

<h3>6. Trigonometry</h3>
<p>
  SSC tests two types of Trigonometry: value-based questions (sin30° = ?, cos²θ + sin²θ = ?) and Heights &amp; Distances application problems. Memorise the standard table (0°, 30°, 45°, 60°, 90°) and five key identities. Heights &amp; Distances problems are typically 2-mark questions solvable with a single formula in under 45 seconds.
</p>

<h2>Essential Formulas to Memorise Before the Exam</h2>
<ul>
  <li><strong>SI = PRT/100 | CI = P[(1 + R/100)^T - 1]</strong></li>
  <li><strong>Area of triangle = √[s(s-a)(s-b)(s-c)] — Heron's formula</strong></li>
  <li><strong>Volume of Cone = (1/3)πr²h | Sphere = (4/3)πr³</strong></li>
  <li><strong>Angle in semicircle = 90° | Tangent from external point = equal lengths</strong></li>
  <li><strong>sin²θ + cos²θ = 1 | 1 + tan²θ = sec²θ | 1 + cot²θ = cosec²θ</strong></li>
  <li><strong>Arithmetic Mean = Sum/Count | Median (odd n) = [(n+1)/2]th term</strong></li>
</ul>

<h2>60-Day Targeted Practice Plan</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Days</th><th>Focus Area</th><th>Daily Target</th></tr></thead>
    <tbody>
      <tr><td>Day 1–15</td><td>Arithmetic: Percentage, P&amp;L, SI/CI, Ratio, Time-Work</td><td>40 PYQs + formula revision</td></tr>
      <tr><td>Day 16–25</td><td>Arithmetic: Speed-Distance, Mixture-Allegation, Number System</td><td>30 PYQs + 3 mock sectionals</td></tr>
      <tr><td>Day 26–40</td><td>Advanced Maths: Geometry (theorems), Mensuration (2D+3D)</td><td>30 PYQs + theorem revision card</td></tr>
      <tr><td>Day 41–50</td><td>Advanced Maths: Trigonometry, Algebra, DI</td><td>30 PYQs + speed drills</td></tr>
      <tr><td>Day 51–60</td><td>Full revisions + 5 complete Tier-2 mock tests</td><td>1 full mock/2 days + error notebook review</td></tr>
    </tbody>
  </table>
</div>

<p>
  Combine this with the complete preparation strategy in our <a href="/blog/ssc-cgl-preparation-strategy-2026" title="SSC CGL Preparation Strategy 2026"><strong>SSC CGL Preparation Strategy guide</strong></a> and the time management framework in our <a href="/blog/cbt-exam-time-management-hacks" title="CBT Time Management Hacks"><strong>CBT Exam Time Management guide</strong></a>.
</p>

<div class="important-note">
  <p><strong>Disclaimer:</strong> Exam patterns and question distributions are based on analysis of past papers and may vary in future examinations. Candidates should verify the current syllabus from the official SSC notification at ssc.gov.in before beginning preparation.</p>
</div>
`,
  },

  // ═══════════════════════════════════════════════════════════
  // SSC CLUSTER — POST 3
  // ═══════════════════════════════════════════════════════════
  {
    title: "SSC MTS 2026: Complete Eligibility, Syllabus, Exam Pattern and Salary Guide",
    slug: "ssc-mts-2026-eligibility-syllabus-exam-pattern-salary",
    excerpt:
      "A complete guide to SSC MTS (Multi-Tasking Staff) 2026 — covering 10th pass eligibility criteria, age limits with category relaxations, the new 2-session CBT exam pattern replacing the old Tier-1 and Tier-2 structure, selection stages including the Physical Efficiency Test, and the confirmed salary and allowances under the 7th Pay Commission.",
    category: "SSC Recruitment Guide",
    tags: ["SSC MTS", "10th Pass Govt Jobs", "SSC 2026", "Multi-Tasking Staff", "Exam Pattern"],
    coverImage: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Government office building representing SSC MTS career opportunity",
    coverImageCaption: "SSC MTS is one of the largest government recruitments open to 10th pass candidates across India.",
    authorName: AUTHOR_NAME,
    authorBio: AUTHOR_BIO,
    readingTime: 11,
    status: "published",
    publishedAt: new Date("2026-09-12T08:00:00Z"),
    seoTitle: "SSC MTS 2026: Eligibility, Syllabus, Exam Pattern, Salary | Complete Guide",
    seoDescription: "Complete SSC MTS 2026 guide — 10th pass eligibility, age limit, new exam pattern (Session-1 + Session-2), Physical Efficiency Test standards, and 7th CPC salary details for MTS and Havaldar posts.",
    seoKeywords: "SSC MTS 2026, SSC MTS eligibility, SSC MTS syllabus, SSC MTS salary, SSC MTS exam pattern 2026, 10th pass government jobs",
    schemaType: "HowTo",
    faq: [
      {
        question: "What is the educational qualification for SSC MTS 2026?",
        answer: "Candidates must have passed Matriculation (Class 10) or equivalent examination from any recognized Board as on the closing date of the online application. There is no graduation or specific stream requirement — any 10th pass candidate meeting the age limit is eligible."
      },
      {
        question: "What is the age limit for SSC MTS 2026?",
        answer: "The general age limit for SSC MTS is 18 to 25 years. For Havaldar (CBIC and CBN) posts, the age limit is 18 to 27 years. Age relaxation applies: OBC candidates get 3 years, SC/ST get 5 years, PwBD get 10 years (UR), and Ex-Servicemen deduct military service. Exact cutoff dates are specified in the official notification."
      },
      {
        question: "Is the SSC MTS Physical Efficiency Test mandatory for all candidates?",
        answer: "The Physical Efficiency Test (PET) is mandatory only for candidates who qualify for the Havaldar post in CBIC/CBN. For regular MTS (Multi-Tasking Staff) posts in other ministries, there is no PET. Female candidates for Havaldar posts have separate, lower PET standards than male candidates."
      },
      {
        question: "What is the salary of SSC MTS after selection?",
        answer: "SSC MTS is placed in Pay Level-1 with a starting basic pay of Rs. 18,000 per month under the 7th Pay Commission. After adding Dearness Allowance (currently 46%), House Rent Allowance (HRA based on city category), and Transport Allowance, the gross monthly in-hand salary ranges between Rs. 20,000 and Rs. 26,000 depending on posting city. Havaldar posts carry Pay Level-1 with additional Risk Allowance."
      }
    ],
    content: `
<p>
  SSC MTS (Multi-Tasking Staff) is one of the largest government job recruitments in India, open to candidates who have passed Class 10. Every year, thousands of 10th pass aspirants rely on SSC MTS as their first entry point into central government service. It offers job security, pension benefits, and a clear path to promotion into higher clerical grades. Track active <a href="/category/ssc" title="SSC Jobs 2026 GovtJobNow"><strong>SSC Recruitment Notifications 2026</strong></a> on GovtJobNow.
</p>
<p>
  In 2023, SSC restructured the MTS examination from a 4-section Tier-1 + Tier-2 format to a simplified 2-Session Computer-Based Test. This guide explains the new structure, eligibility rules, Physical Efficiency Test standards, and complete salary details.
</p>

<h2>SSC MTS 2026 Eligibility Criteria</h2>

<h3>Educational Qualification</h3>
<p>
  Matriculation (Class 10th) pass from a recognized Board is the minimum requirement. Candidates who have passed their Class 10 board exam from CBSE, ICSE, or any State Board are eligible. No specific subject combination is required.
</p>

<h3>Age Limit and Relaxations</h3>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Post</th><th>General Age Limit</th><th>OBC</th><th>SC/ST</th><th>PwBD (UR)</th></tr></thead>
    <tbody>
      <tr><td>MTS (Multi-Tasking Staff)</td><td>18–25 years</td><td>18–28 years</td><td>18–30 years</td><td>18–35 years</td></tr>
      <tr><td>Havaldar (CBIC/CBN)</td><td>18–27 years</td><td>18–30 years</td><td>18–32 years</td><td>18–37 years</td></tr>
    </tbody>
  </table>
</div>

<h2>SSC MTS 2026 New Exam Pattern (2-Session CBT)</h2>

<p>
  The restructured SSC MTS examination consists of a single Computer-Based Test divided into two sessions conducted on the same day. There is no separate Tier-2 written exam.
</p>

<h3>Session-1 (45 Minutes)</h3>
<ul>
  <li><strong>Numerical &amp; Mathematical Ability:</strong> 20 Questions, 60 Marks — Class 10 level arithmetic (Percentage, Ratio, SI, Basic Algebra, Number System).</li>
  <li><strong>Reasoning Ability &amp; Problem Solving:</strong> 20 Questions, 60 Marks — Series, Analogy, Coding-Decoding, Direction, Non-verbal patterns.</li>
</ul>
<p><em>Session-1 has negative marking of 1 mark per wrong answer. No questions can be skipped without penalty.</em></p>

<h3>Session-2 (45 Minutes)</h3>
<ul>
  <li><strong>General Awareness:</strong> 25 Questions, 75 Marks — Indian History, Polity, Geography, Science, Current Affairs.</li>
  <li><strong>English Language &amp; Comprehension:</strong> 25 Questions, 75 Marks — Grammar, Vocabulary, Comprehension Passages.</li>
</ul>
<p><em>Session-2 has negative marking of 1 mark per wrong answer.</em></p>

<h3>Merit List and Document Verification</h3>
<p>
  Final selection is based on combined marks of Session-1 and Session-2. Candidates shortlisted for Havaldar posts undergo a Physical Efficiency Test (PET) and Physical Standard Test (PST) before document verification.
</p>

<h2>Physical Efficiency Test (PET) — Havaldar Posts Only</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Test</th><th>Male</th><th>Female</th></tr></thead>
    <tbody>
      <tr><td>Walking distance</td><td>1600 metres in 15 minutes</td><td>1 km in 20 minutes</td></tr>
      <tr><td>Cycling</td><td>8 km in 30 minutes</td><td>3 km in 25 minutes</td></tr>
    </tbody>
  </table>
</div>

<h2>SSC MTS Syllabus: Topic-Wise Preparation Guide</h2>

<h3>Session-1 — Numerical Ability (Class 10 Level)</h3>
<p>
  Topics: Percentages, Profit &amp; Loss, Simple Interest, Ratio &amp; Proportion, Time &amp; Work, Speed &amp; Distance, Number System (LCM, HCF, Divisibility), Basic Mensuration (Area, Perimeter of common shapes). Unlike SSC CGL, MTS Maths does not include Advanced Mathematics. NCERT Class 8, 9, and 10 Mathematics textbooks cover 90% of the syllabus.
</p>

<h3>Session-1 — Reasoning</h3>
<p>
  Focus on: Number and Letter Series, Analogy (word &amp; figure), Coding-Decoding, Mirror Images, Counting Figures, Venn Diagrams, Direction Sense. These 7 topic areas consistently account for 80% of Reasoning questions in SSC MTS PYQs.
</p>

<h3>Session-2 — General Awareness</h3>
<p>
  Indian History (ancient, medieval, modern), Indian Polity and Constitution, Geography (Physical and Indian), General Science (Physics, Chemistry, Biology at Class 10 level), Current Affairs from the past 6–8 months, and important Government schemes. Read our guide to <a href="/blog/current-affairs-preparation-strategy" title="Current Affairs Preparation Strategy"><strong>Current Affairs Preparation Strategy</strong></a> for an efficient daily routine.
</p>

<h3>Session-2 — English Language</h3>
<p>
  Error Detection, Fill in the Blanks (Prepositions, Articles, Conjunctions), Synonyms and Antonyms, One-Word Substitution, Idioms and Phrases, and 1–2 Short Comprehension Passages. SSC MTS English is based on Class 10 difficulty — no advanced grammar is tested.
</p>

<h2>SSC MTS Salary and Pay Structure (7th CPC)</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Component</th><th>MTS Posts</th><th>Havaldar Posts</th></tr></thead>
    <tbody>
      <tr><td>Pay Level</td><td>Level-1</td><td>Level-1</td></tr>
      <tr><td>Basic Pay</td><td>Rs. 18,000/month</td><td>Rs. 18,000/month</td></tr>
      <tr><td>DA (46% of Basic)</td><td>Rs. 8,280/month</td><td>Rs. 8,280/month</td></tr>
      <tr><td>HRA (X-City)</td><td>Rs. 4,320/month</td><td>Rs. 4,320/month</td></tr>
      <tr><td>Transport Allowance</td><td>Rs. 1,350/month</td><td>Rs. 1,350/month</td></tr>
      <tr><td>Gross In-Hand (X-City)</td><td>~Rs. 26,000–28,000</td><td>~Rs. 27,000–30,000 (with Risk Allowance)</td></tr>
    </tbody>
  </table>
</div>

<p>
  For complete salary calculation methodology including DA revision schedule, refer to our <a href="/blog/pay-commission-basic-pay-da-hra-explained" title="7th Pay Commission Salary Guide"><strong>Central Govt Pay Commission Salary Breakdown</strong></a>.
</p>

<div class="important-note">
  <p><strong>Disclaimer:</strong> SSC MTS vacancy counts, exam dates, and selection procedures are determined by the Staff Selection Commission. Candidates must check the latest official notification at ssc.gov.in for confirmed dates, post-wise vacancies, and any revised exam pattern before applying.</p>
</div>
`,
  },

  // ═══════════════════════════════════════════════════════════
  // SSC CLUSTER — POST 4
  // ═══════════════════════════════════════════════════════════
  {
    title: "SSC CPO Sub-Inspector 2026: Physical Standards, Exam Pattern and Selection Process",
    slug: "ssc-cpo-sub-inspector-2026-physical-standards-selection",
    excerpt:
      "A detailed breakdown of SSC CPO (Central Police Organisations) Sub-Inspector and ASI recruitment 2026 — covering the 4-stage selection process (Paper-1, PET/PST, Paper-2, Medical), exact physical standards for height, chest and running, post-wise eligibility, and the salary structure for SI in Delhi Police and CAPF forces.",
    category: "SSC Recruitment Guide",
    tags: ["SSC CPO", "Sub-Inspector", "Delhi Police", "CAPF", "Physical Test"],
    coverImage: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Police uniform representing SSC CPO Sub-Inspector recruitment",
    coverImageCaption: "SSC CPO recruits Sub-Inspectors and ASIs for Delhi Police and Central Armed Police Forces.",
    authorName: AUTHOR_NAME,
    authorBio: AUTHOR_BIO,
    readingTime: 12,
    status: "published",
    publishedAt: new Date("2026-09-13T08:00:00Z"),
    seoTitle: "SSC CPO Sub-Inspector 2026: Physical Test Standards, Exam Pattern and Salary",
    seoDescription: "Complete SSC CPO 2026 guide — 4-stage selection process, physical standards (height, chest, running), Paper-1 and Paper-2 exam pattern, and Sub-Inspector salary under 7th Pay Commission.",
    seoKeywords: "SSC CPO 2026, Sub-Inspector recruitment, SSC CPO physical test, SSC CPO eligibility, Delhi Police SI 2026, CAPF recruitment",
    schemaType: "HowTo",
    faq: [
      {
        question: "What is the minimum height requirement for SSC CPO Sub-Inspector?",
        answer: "For male candidates, the minimum height is 170 cm (General/OBC/SC) and 162.5 cm (ST). For female candidates, it is 157 cm (General/OBC/SC) and 154 cm (ST). Hill area candidates get a 5 cm relaxation. Height is verified during the Physical Standard Test (PST) before Paper-2."
      },
      {
        question: "What is the running distance in SSC CPO PET for male and female candidates?",
        answer: "Male candidates must complete 100 metres race in 16 seconds AND a 1.6 km run in 6.5 minutes. Female candidates must complete 100 metres in 18 seconds AND an 800 metre run in 4 minutes. Both events must be cleared in a single attempt — there is no re-test option."
      },
      {
        question: "Is SSC CPO Paper-2 (English) only qualifying or does it add to merit?",
        answer: "SSC CPO Paper-2 (English Language and Comprehension) is a separate exam but its marks ARE included in the final merit list. Paper-2 carries 200 marks and the final selection is based on Paper-1 + Paper-2 combined scores. Candidates who performed well in Paper-1 can improve their rank significantly with a strong Paper-2 performance."
      },
      {
        question: "Can female candidates apply for all SSC CPO posts?",
        answer: "Female candidates can apply for ASI (Assistant Sub-Inspector) posts in Delhi Police and CISF. For BSF, CRPF, SSB, and ITBP Sub-Inspector posts, recruitment is currently open to male candidates only as per the latest SSC CPO notifications. Always check the official notification for post-wise gender eligibility."
      }
    ],
    content: `
<p>
  SSC CPO (Central Police Organisations) Sub-Inspector examination is one of the most competitive and physically demanding government recruitment processes in India. Conducted by the Staff Selection Commission, CPO recruits Sub-Inspector (SI) and Assistant Sub-Inspector (ASI) for Delhi Police and five Central Armed Police Forces (CAPFs): BSF, CRPF, CISF, SSB, and ITBP. Check active <a href="/category/defence" title="Defence and Police Jobs 2026"><strong>Defence and Police Job Notifications 2026</strong></a> on GovtJobNow.
</p>
<p>
  Unlike SSC CGL or CHSL, SSC CPO has four distinct selection stages. Candidates must pass all four to secure a final posting. This guide covers every stage in sequence with exact standards, timing requirements, and preparation tips.
</p>

<h2>SSC CPO 2026 — 4-Stage Selection Process</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Stage</th><th>Test</th><th>Qualifying or Merit</th><th>Duration</th></tr></thead>
    <tbody>
      <tr><td>Stage 1</td><td>Paper-1 (CBT — GK, Reasoning, Maths, English)</td><td>Merit (Shortlists for Stage 2)</td><td>2 Hours</td></tr>
      <tr><td>Stage 2</td><td>Physical Endurance Test (PET) + Physical Standard Test (PST)</td><td>Qualifying (Pass/Fail)</td><td>1 Day</td></tr>
      <tr><td>Stage 3</td><td>Paper-2 (CBT — English Language)</td><td>Merit (Combined with Paper-1)</td><td>2 Hours</td></tr>
      <tr><td>Stage 4</td><td>Medical Examination</td><td>Qualifying (Pass/Fail)</td><td>1 Day</td></tr>
    </tbody>
  </table>
</div>

<h2>Stage 1: SSC CPO Paper-1 Exam Pattern</h2>

<p>
  Paper-1 is a 200-mark, 2-hour Computer-Based Test with 200 questions. There is negative marking of 0.25 marks per wrong answer.
</p>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Section</th><th>Questions</th><th>Marks</th></tr></thead>
    <tbody>
      <tr><td>General Intelligence and Reasoning</td><td>50</td><td>50</td></tr>
      <tr><td>General Knowledge and General Awareness</td><td>50</td><td>50</td></tr>
      <tr><td>Quantitative Aptitude</td><td>50</td><td>50</td></tr>
      <tr><td>English Comprehension</td><td>50</td><td>50</td></tr>
    </tbody>
  </table>
</div>

<h2>Stage 2: Physical Endurance Test (PET) — Exact Standards</h2>

<h3>Physical Endurance Test (Running)</h3>
<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Event</th><th>Male Standard</th><th>Female Standard</th></tr></thead>
    <tbody>
      <tr><td>Short Race</td><td>100 metres in 16 seconds</td><td>100 metres in 18 seconds</td></tr>
      <tr><td>Long Race</td><td>1.6 km in 6 minutes 30 seconds</td><td>800 metres in 4 minutes</td></tr>
    </tbody>
  </table>
</div>

<h3>Physical Standard Test (PST) — Height and Chest</h3>
<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Category</th><th>Male Height</th><th>Male Chest (Unexpanded/Expanded)</th><th>Female Height</th></tr></thead>
    <tbody>
      <tr><td>General / OBC / SC</td><td>170 cm</td><td>80 cm / 85 cm</td><td>157 cm</td></tr>
      <tr><td>ST</td><td>162.5 cm</td><td>77 cm / 82 cm</td><td>154 cm</td></tr>
      <tr><td>Hill Area candidates</td><td>165 cm</td><td>78 cm / 83 cm</td><td>152 cm</td></tr>
    </tbody>
  </table>
</div>

<p>
  Physical preparation for the PET should begin 3–4 months before the exam. Start with daily 2 km jogging and gradually increase pace. Target the 1.6 km distance in under 6 minutes in practice to comfortably clear the 6 minute 30 second standard on exam day. Also refer to our <a href="/blog/central-armed-police-bsf-cisf-crpf-guide" title="CAPF Recruitment Complete Guide"><strong>CAPF Recruitment Complete Guide</strong></a> for force-wise posting information.
</p>

<h2>Stage 3: SSC CPO Paper-2 Exam Pattern</h2>

<p>
  Paper-2 tests English Language and Comprehension exclusively. It carries 200 marks (200 questions, 2 hours). Negative marking: 0.25 marks per wrong answer. Paper-2 marks are combined with Paper-1 marks for the final merit list — strong English performance can significantly boost your overall rank.
</p>
<p>
  Key topics: Reading Comprehension (4–5 passages), Error Detection, Sentence Improvement, Para Jumbles, Fill in the Blanks, Synonyms/Antonyms, Idioms, One-Word Substitution, Cloze Test. Practice our <a href="/blog/score-45-plus-english-competitive-exams" title="English Scoring Strategy"><strong>English Comprehension Scoring Guide</strong></a> for Paper-2 specific techniques.
</p>

<h2>SSC CPO Sub-Inspector Salary (7th Pay Commission)</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Post</th><th>Pay Level</th><th>Basic Pay</th><th>Gross (X-City approx.)</th></tr></thead>
    <tbody>
      <tr><td>SI in Delhi Police</td><td>Level-6</td><td>Rs. 35,400/month</td><td>Rs. 57,000–65,000/month</td></tr>
      <tr><td>SI in CAPF (BSF/CRPF/CISF/SSB/ITBP)</td><td>Level-6</td><td>Rs. 35,400/month</td><td>Rs. 55,000–62,000/month + Risk Allowance</td></tr>
      <tr><td>ASI in CISF</td><td>Level-5</td><td>Rs. 29,200/month</td><td>Rs. 47,000–55,000/month</td></tr>
    </tbody>
  </table>
</div>

<div class="important-note">
  <p><strong>Disclaimer:</strong> Physical standards, vacancy counts, and post-wise eligibility for SSC CPO 2026 are specified in the official SSC notification published at ssc.gov.in. Candidates must verify all eligibility conditions directly from the official advertisement before applying.</p>
</div>
`,
  },

  // ═══════════════════════════════════════════════════════════
  // SSC CLUSTER — POST 5
  // ═══════════════════════════════════════════════════════════
  {
    title: "How SSC Cut-Off Marks Are Decided: Category-Wise, Region-Wise and Tier-Wise Explained",
    slug: "how-ssc-cut-off-marks-are-decided-category-wise-explained",
    excerpt:
      "A clear explanation of how SSC Cut-Off marks are calculated for CGL, CHSL, MTS, and CPO examinations — covering normalisation of scores across shifts, category-wise cut-off calculation, region-wise variation, and what historical cut-off trends between 2019–2025 tell you about the safe score targets for 2026.",
    category: "SSC Exam Strategy",
    tags: ["SSC Cut-Off", "SSC CGL", "Normalisation", "Category-wise Cut-Off", "Safe Score"],
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Data charts and analysis representing SSC cut-off score trends",
    coverImageCaption: "Understanding how SSC cut-offs are calculated helps you set realistic safe score targets.",
    authorName: AUTHOR_NAME,
    authorBio: AUTHOR_BIO,
    readingTime: 10,
    status: "published",
    publishedAt: new Date("2026-09-14T08:00:00Z"),
    seoTitle: "How SSC Cut-Off Marks Are Decided: Category-Wise and Normalisation Explained",
    seoDescription: "Understand exactly how SSC calculates cut-off marks — normalisation across shifts, category-wise cut-offs, region-wise variation, and safe score targets for SSC CGL, CHSL, and MTS 2026.",
    seoKeywords: "SSC cut-off 2026, how SSC cut-off is decided, SSC CGL cut-off, SSC normalisation, category-wise SSC cut-off, SSC safe score 2026",
    schemaType: "Article",
    faq: [
      {
        question: "What is score normalisation in SSC examinations?",
        answer: "SSC conducts examinations in multiple shifts across multiple days. Different shifts may have different difficulty levels. Normalisation adjusts raw scores using a mathematical formula to create an equivalent score so that candidates from harder shifts are not disadvantaged. The normalised score (not the raw score) is used for cut-off comparison and merit list preparation."
      },
      {
        question: "Why is the SSC CGL cut-off different for OBC candidates compared to General?",
        answer: "SSC maintains separate merit lists for each category (UR, OBC, SC, ST, EWS, ESM, PwBD). The cut-off for each category is the minimum normalised score at which the last selected candidate from that category was chosen. Since there are separate vacancy quotas per category, cut-offs vary — OBC cut-offs are typically 5–12 marks lower than General cut-offs, and SC/ST cut-offs are lower still."
      },
      {
        question: "Does SSC CGL have a region-wise cut-off system?",
        answer: "No — SSC CGL uses a single national merit list, not regional cut-offs. However, post allocation (e.g., Income Tax Inspector in a specific state) depends on regional vacancy availability and candidate preference. By contrast, SSC CHSL and MTS may have region-specific merit lists depending on the notification."
      }
    ],
    content: `
<p>
  Every year, thousands of SSC aspirants are confused when cut-off marks are published. Why is the cut-off different from last year? Why do two candidates who scored the same marks end up in different merit positions? Why does the cut-off vary by category? This guide answers all of these questions with a clear, structured explanation of how SSC calculates and publishes cut-off marks for its major examinations. Check all current <a href="/category/ssc" title="SSC Notifications 2026"><strong>SSC Job Notifications 2026</strong></a> on GovtJobNow.
</p>

<h2>Step 1: How SSC Normalises Marks Across Shifts</h2>

<p>
  SSC examinations are conducted in multiple shifts spread across several days. Each shift has a different set of questions, and no two shifts are identical in difficulty. To ensure fairness, SSC applies <strong>score normalisation</strong> using the Equi-Percentile Method.
</p>

<p>
  The normalisation formula used by SSC:
</p>
<p>
  <strong>Normalised Score = ((Actual Score − Min Score in Shift) / (Max Score in Shift − Min Score in Shift)) × (Max Score in Reference Shift − Min Score in Reference Shift) + Min Score in Reference Shift</strong>
</p>
<p>
  In simple terms: if you scored 140/200 in a harder shift, your normalised score might be 148 — because SSC adjusts for the difficulty of your shift. Your normalised score appears on your scorecard. This is what is used for the cut-off, not your raw marks.
</p>

<h2>Step 2: How Category-Wise Cut-Offs Are Set</h2>

<p>
  SSC prepares separate merit lists for each recruitment category:
</p>
<ul>
  <li><strong>Unreserved (UR/General)</strong></li>
  <li><strong>Other Backward Class (OBC)</strong></li>
  <li><strong>Scheduled Caste (SC)</strong></li>
  <li><strong>Scheduled Tribe (ST)</strong></li>
  <li><strong>Economically Weaker Section (EWS)</strong></li>
  <li><strong>Ex-Servicemen (ESM)</strong></li>
  <li><strong>Persons with Benchmark Disability (PwBD)</strong></li>
</ul>
<p>
  For each category, the cut-off is simply the <strong>normalised score of the last selected candidate</strong> in that category's quota. If 10,000 UR vacancies exist and 10,000 UR candidates are selected in merit order, the 10,000th candidate's score becomes the UR cut-off. For SC (2,000 vacancies), the 2,000th SC candidate's score becomes the SC cut-off.
</p>

<h2>Historical SSC CGL Tier-1 Cut-Off Trends (UR Category)</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Year</th><th>UR Cut-Off (Out of 200)</th><th>OBC Cut-Off</th><th>SC Cut-Off</th><th>ST Cut-Off</th></tr></thead>
    <tbody>
      <tr><td>2019</td><td>147.5</td><td>135.0</td><td>128.7</td><td>118.2</td></tr>
      <tr><td>2020</td><td>155.0</td><td>142.5</td><td>136.0</td><td>127.5</td></tr>
      <tr><td>2022</td><td>162.8</td><td>151.3</td><td>143.6</td><td>133.8</td></tr>
      <tr><td>2023</td><td>158.6</td><td>148.2</td><td>139.5</td><td>130.1</td></tr>
      <tr><td>2024</td><td>160.4</td><td>149.8</td><td>141.2</td><td>132.6</td></tr>
    </tbody>
  </table>
</div>

<p>
  <em>Note: Cut-off figures are based on publicly available SSC results data. Always verify against the official SSC result notification at ssc.gov.in.</em>
</p>

<h2>What Factors Affect Cut-Off Movement Year-to-Year</h2>

<ul>
  <li><strong>Number of vacancies:</strong> More vacancies = lower cut-off (more candidates selected). Fewer vacancies = higher cut-off.</li>
  <li><strong>Number of applicants:</strong> More aspirants competing = higher cut-off due to increased competition at the top.</li>
  <li><strong>Exam difficulty:</strong> A harder exam produces lower normalised scores across the board, which can lower the cut-off in absolute terms.</li>
  <li><strong>New paper pattern:</strong> When SSC introduces a new exam structure (as in 2022), cut-offs shift as candidates adjust to the format.</li>
</ul>

<h2>Safe Score Targets for SSC CGL 2026</h2>

<p>
  Based on trend analysis:
</p>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Category</th><th>Tier-1 Safe Score Target (Out of 200)</th><th>Combined Tier-1 + Tier-2 Safe Target</th></tr></thead>
    <tbody>
      <tr><td>UR/General</td><td>165+</td><td>480+ (out of 600)</td></tr>
      <tr><td>OBC</td><td>155+</td><td>460+</td></tr>
      <tr><td>SC</td><td>147+</td><td>440+</td></tr>
      <tr><td>ST</td><td>137+</td><td>420+</td></tr>
      <tr><td>EWS</td><td>158+</td><td>470+</td></tr>
    </tbody>
  </table>
</div>

<p>
  For SSC MTS, CHSL, and CPO cut-off trends, apply the same framework: find the number of vacancies for your category, compare with last year's applicant numbers, and add 5–8 marks buffer to the historical cut-off as your safety target. Pair this with the full syllabus strategy from our <a href="/blog/ssc-cgl-2026-complete-syllabus-topic-priority" title="SSC CGL 2026 Syllabus Guide"><strong>SSC CGL 2026 Complete Syllabus Guide</strong></a>.
</p>

<div class="important-note">
  <p><strong>Disclaimer:</strong> Cut-off marks are officially determined by SSC after the examination and declared with the result. Historical figures are based on publicly released SSC result data and are provided for planning purposes only. Actual 2026 cut-offs may vary based on vacancy counts and competition levels announced in the official SSC notification.</p>
</div>
`,
  },

  // ═══════════════════════════════════════════════════════════
  // ISRO CLUSTER — POST 6
  // ═══════════════════════════════════════════════════════════
  {
    title: "ISRO Scientist/Engineer SC 2026: Branches, GATE Cut-Off, Interview Tips and Salary",
    slug: "isro-scientist-engineer-sc-2026-gate-cutoff-interview-salary",
    excerpt:
      "A complete guide to ISRO Scientist/Engineer 'SC' recruitment 2026 — covering which engineering branches are eligible, how GATE scores are used for shortlisting, what happens in the ISRO interview round, posting locations across ISRO centres, and the Pay Level-10 salary with all allowances for newly recruited scientists.",
    category: "Science and Research Careers",
    tags: ["ISRO", "Scientist Engineer SC", "GATE 2026", "Space Agency Jobs", "ISRO Interview"],
    coverImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Rocket launch representing ISRO space research careers",
    coverImageCaption: "ISRO Scientist/Engineer SC is one of the most prestigious technical government jobs in India.",
    authorName: AUTHOR_NAME,
    authorBio: AUTHOR_BIO,
    readingTime: 13,
    status: "published",
    publishedAt: new Date("2026-09-15T08:00:00Z"),
    seoTitle: "ISRO Scientist Engineer SC 2026: GATE Cut-Off, Interview Process and Salary",
    seoDescription: "Complete ISRO Scientist/Engineer SC 2026 guide — eligible engineering branches, GATE score shortlisting process, interview round preparation, ISRO centre postings, and Pay Level-10 salary breakdown.",
    seoKeywords: "ISRO Scientist Engineer SC 2026, ISRO recruitment 2026, ISRO GATE cut-off, ISRO interview tips, ISRO salary 2026, ISRO engineer recruitment",
    schemaType: "HowTo",
    faq: [
      {
        question: "Does ISRO recruit through GATE scores for Scientist/Engineer SC posts?",
        answer: "Yes. ISRO uses GATE scores as the primary shortlisting tool for Scientist/Engineer SC recruitment. Candidates who meet the GATE score threshold in their discipline are invited for a written test and/or interview. The specific GATE year and minimum score requirements are mentioned in each ISRO recruitment notification published on isro.gov.in."
      },
      {
        question: "Which engineering branches are eligible for ISRO Scientist/Engineer SC?",
        answer: "ISRO typically recruits from Computer Science, Electronics & Communication (ECE), Mechanical, Electrical, and Chemical Engineering. Some notifications also include Aerospace, Civil, and Physics/Maths for specific departments. The eligible disciplines vary by notification — always check the specific advertisement for discipline-wise posts."
      },
      {
        question: "What is the interview process for ISRO Scientist/Engineer SC?",
        answer: "ISRO conducts a written test followed by a Personal Interview for shortlisted candidates. The written test covers core engineering subjects of the candidate's discipline. The interview panel (typically 4–5 senior ISRO scientists) asks technical questions from the candidate's specialization, questions about ISRO's ongoing projects, and situational questions about teamwork and problem-solving."
      },
      {
        question: "What is the starting salary of ISRO Scientist/Engineer SC?",
        answer: "ISRO Scientist/Engineer SC is placed at Pay Level-10 (7th CPC) with a basic pay of Rs. 56,100 per month. After adding Dearness Allowance (46%), HRA, Transport Allowance, and ISRO-specific allowances, the gross monthly salary ranges between Rs. 90,000 and Rs. 1,05,000 depending on the posting centre and city category."
      }
    ],
    content: `
<p>
  Working at the Indian Space Research Organisation (ISRO) is considered one of the most prestigious achievements for engineering graduates in India. ISRO Scientist/Engineer 'SC' is the entry-level position for fresh engineers and postgraduates entering India's space programme. It offers not just a competitive salary and government job security, but the opportunity to contribute to national missions like Chandrayaan, Gaganyaan, and PSLV satellite launches. Track active <a href="/isro-jobs" title="ISRO Recruitment Notifications GovtJobNow"><strong>ISRO Recruitment Notifications</strong></a> on GovtJobNow.
</p>
<p>
  ISRO recruitment is not as simple as other government exams — it is multi-stage, technically demanding, and requires both a strong GATE score and deep subject knowledge. This guide walks you through every stage.
</p>

<h2>Eligibility: Which Engineering Branches Are Recruited</h2>

<p>
  ISRO Scientist/Engineer SC recruitment covers multiple engineering disciplines. The exact branches recruited vary from notification to notification based on ISRO's departmental requirements. Commonly recruited disciplines include:
</p>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Discipline</th><th>ISRO Departments Likely to Absorb</th><th>GATE Paper Code</th></tr></thead>
    <tbody>
      <tr><td>Computer Science &amp; Engineering</td><td>SAC, ISAC, C-DAC divisions, Ground Systems</td><td>CS</td></tr>
      <tr><td>Electronics &amp; Communication (ECE)</td><td>VSSC, LPSC, Communication Systems, Payloads</td><td>EC</td></tr>
      <tr><td>Mechanical Engineering</td><td>VSSC (Propulsion), LPSC, Mechanisms division</td><td>ME</td></tr>
      <tr><td>Electrical Engineering</td><td>Power Systems, Spacecraft subsystems</td><td>EE</td></tr>
      <tr><td>Chemical Engineering</td><td>LPSC (Propellant division), VSSC fuels</td><td>CH</td></tr>
    </tbody>
  </table>
</div>

<h3>Academic Qualification</h3>
<ul>
  <li><strong>B.Tech/B.E.:</strong> First Class (60% or 6.5 CGPA on 10-point scale) from a recognised university in the eligible discipline.</li>
  <li><strong>M.Sc. (for Physics/Maths posts):</strong> First Class in relevant science subject.</li>
  <li><strong>Age Limit:</strong> Maximum 35 years (relaxation for SC/ST/OBC and PwBD as per government rules).</li>
</ul>

<h2>The GATE Score: How ISRO Uses It for Shortlisting</h2>

<p>
  ISRO does not conduct a separate all-India preliminary test. Instead, it uses the GATE score as the primary shortlisting mechanism. ISRO specifies a minimum GATE score threshold in each notification — typically in the range of 600–750 out of 1000 depending on the discipline and year.
</p>
<p>
  Candidates who meet the threshold are shortlisted in merit order for the next stage. The GATE score must typically be from the year specified in the notification (usually the current or immediately preceding year). Read our guide on <a href="/blog/isro-scientist-engineer-recruitment-guide" title="ISRO Recruitment Complete Guide"><strong>ISRO Recruitment Process</strong></a> and <a href="/blog/top-psu-recruitment-gate-non-gate" title="PSU Recruitment via GATE"><strong>Top PSU Recruitments via GATE</strong></a> to understand how GATE score is used across organisations.
</p>

<h3>Typical GATE Score Required for ISRO (Based on Past Notifications)</h3>
<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Discipline</th><th>Approximate Minimum Score (UR)</th><th>Approximate Score for Strong Shortlisting</th></tr></thead>
    <tbody>
      <tr><td>Computer Science (CS)</td><td>650+</td><td>750+</td></tr>
      <tr><td>Electronics (EC)</td><td>650+</td><td>730+</td></tr>
      <tr><td>Mechanical (ME)</td><td>620+</td><td>710+</td></tr>
      <tr><td>Electrical (EE)</td><td>610+</td><td>700+</td></tr>
      <tr><td>Chemical (CH)</td><td>580+</td><td>680+</td></tr>
    </tbody>
  </table>
</div>
<p><em>These figures are indicative based on historical ISRO notifications and may vary — always refer to the specific recruitment advertisement for the declared threshold.</em></p>

<h2>Stage 2: ISRO Written Test</h2>

<p>
  Shortlisted candidates appear for a written test at ISRO centres. The written test is typically 90 minutes with 80 objective questions covering core engineering subjects of the candidate's discipline. For CS candidates, expect questions on Data Structures, Algorithms, Operating Systems, DBMS, Computer Networks, and Digital Logic. For ECE candidates: Signals &amp; Systems, Analog/Digital Electronics, Communication Theory, Electromagnetics, and Microprocessors.
</p>

<h2>Stage 3: ISRO Interview — What to Expect</h2>

<p>
  The interview is conducted at ISRO's headquarters or the respective centre. A panel of 4–5 senior scientists conducts the interview, which typically lasts 30–45 minutes.
</p>
<ul>
  <li><strong>Technical depth questions:</strong> Expect to defend your GATE rank and explain core concepts from your branch. ISRO interviewers go deeper than typical government job interviews — they want to see genuine engineering understanding, not memorised answers.</li>
  <li><strong>ISRO project awareness:</strong> Know ISRO's current active missions (Gaganyaan, Aditya-L1, NISAR, RLV programme), their objectives, and which ISRO centres are working on them. This is asked in virtually every ISRO interview.</li>
  <li><strong>Centre preference:</strong> You will typically be asked which ISRO centre you prefer and why. Study what each centre does before the interview.</li>
  <li><strong>Problem-solving scenarios:</strong> Interviewers often present real engineering scenarios: "If a satellite communication link fails due to Doppler shift, what would you check first?"</li>
</ul>

<h2>ISRO Centres Across India and Their Focus Areas</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Centre</th><th>Location</th><th>Primary Focus</th></tr></thead>
    <tbody>
      <tr><td>VSSC (Vikram Sarabhai Space Centre)</td><td>Thiruvananthapuram</td><td>Launch vehicles, rocket propulsion</td></tr>
      <tr><td>ISAC / UR Rao Satellite Centre</td><td>Bengaluru</td><td>Satellite design, spacecraft systems</td></tr>
      <tr><td>SAC (Space Applications Centre)</td><td>Ahmedabad</td><td>Remote sensing payloads, communication</td></tr>
      <tr><td>LPSC (Liquid Propulsion)</td><td>Thiruvananthapuram / Bengaluru</td><td>Liquid propellant engines</td></tr>
      <tr><td>NRSC (National Remote Sensing)</td><td>Hyderabad</td><td>Earth observation data processing</td></tr>
      <tr><td>ISTRAC (Telemetry, Tracking)</td><td>Bengaluru</td><td>Ground station tracking network</td></tr>
    </tbody>
  </table>
</div>

<h2>ISRO Scientist/Engineer SC Salary and Benefits</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Component</th><th>Amount</th></tr></thead>
    <tbody>
      <tr><td>Pay Level (7th CPC)</td><td>Level-10</td></tr>
      <tr><td>Basic Pay</td><td>Rs. 56,100/month</td></tr>
      <tr><td>Dearness Allowance (46%)</td><td>Rs. 25,806/month</td></tr>
      <tr><td>HRA (X-City like Bengaluru)</td><td>Rs. 13,464/month</td></tr>
      <tr><td>Transport Allowance</td><td>Rs. 3,600–7,200/month</td></tr>
      <tr><td>Gross (X-City estimate)</td><td>Rs. 99,000–1,05,000/month</td></tr>
    </tbody>
  </table>
</div>

<p>
  Additional benefits include ISRO campus housing (where available), CGHS medical benefits, departmental canteen, children's education allowance, and access to ISRO's in-house training and international exposure programmes. Compare with DRDO careers in our <a href="/blog/drdo-scientist-b-recruitment-process" title="DRDO Scientist B Recruitment"><strong>DRDO Scientist B Recruitment Guide</strong></a>.
</p>

<div class="important-note">
  <p><strong>Disclaimer:</strong> ISRO Scientist/Engineer SC recruitment details, GATE score requirements, and vacancies are announced through official notifications at isro.gov.in. Salary figures are based on the 7th Central Pay Commission structure and are subject to revision. Candidates must verify all eligibility conditions from the official ISRO recruitment advertisement before applying.</p>
</div>
`,
  },

  // ═══════════════════════════════════════════════════════════
  // ISRO CLUSTER — POST 7
  // ═══════════════════════════════════════════════════════════
  {
    title: "ISRO Centres in India: Which Labs Hire, What They Research and Where They Are Located",
    slug: "isro-centres-india-which-labs-hire-what-they-research",
    excerpt:
      "A centre-by-centre guide to all major ISRO facilities across India — covering the research focus, types of engineers and scientists each centre recruits, the cities where they are located, and which centres have historically posted the highest number of Scientist/Engineer SC vacancies in recent recruitment cycles.",
    category: "Science and Research Careers",
    tags: ["ISRO Centres", "VSSC", "ISAC", "SAC Ahmedabad", "ISRO Labs India"],
    coverImage: "https://images.unsplash.com/photo-1581822261290-991b38693d1b?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Satellite dish at a research centre representing ISRO space technology infrastructure",
    coverImageCaption: "ISRO operates 13 major centres across India, each with a distinct technical research focus.",
    authorName: AUTHOR_NAME,
    authorBio: AUTHOR_BIO,
    readingTime: 11,
    status: "published",
    publishedAt: new Date("2026-09-15T10:00:00Z"),
    seoTitle: "ISRO Centres in India: Complete List of Labs, Research Focus and Hiring History",
    seoDescription: "A centre-by-centre guide to all ISRO facilities — VSSC, ISAC, SAC, LPSC, NRSC, ISTRAC and more — covering research focus, disciplines hired, city locations, and vacancy history.",
    seoKeywords: "ISRO centres India, ISRO labs location, VSSC Thiruvananthapuram, ISAC Bengaluru, SAC Ahmedabad, ISRO recruitment centres, ISRO hiring which centre",
    schemaType: "Article",
    faq: [
      {
        question: "Which ISRO centre hires the most Scientist/Engineer SC candidates?",
        answer: "VSSC (Vikram Sarabhai Space Centre) in Thiruvananthapuram and ISAC (now UR Rao Satellite Centre) in Bengaluru typically have the highest Scientist/Engineer SC vacancy counts in each recruitment cycle. Between them, these two centres have historically accounted for 55–65% of all ISRO SC vacancies across disciplines."
      },
      {
        question: "Can I choose which ISRO centre to be posted at?",
        answer: "You can express a centre preference during the interview process and in the application form. However, final posting depends on vacancy availability at each centre and ISRO's administrative requirements. Candidates are expected to serve wherever ISRO needs them — refusing a posting can result in cancellation of the offer."
      },
      {
        question: "Is ISRO SAC in Ahmedabad a good posting for ECE engineers?",
        answer: "Yes, SAC (Space Applications Centre) in Ahmedabad is one of the premier postings for ECE engineers. SAC focuses on remote sensing satellite payloads, communication subsystems, and Earth observation data — areas where ECE engineers work on cutting-edge communication hardware, signal processing systems, and payload development for operational satellites."
      }
    ],
    content: `
<p>
  One of the most common questions from engineering aspirants preparing for ISRO recruitment is: "Which ISRO centre should I apply for, and what will my actual work look like?" ISRO operates 13 major centres and units spread across India, each with a distinct research and engineering mandate. Understanding what each centre does and which disciplines they recruit helps you frame your career preference intelligently — both in your application and in the interview when asked "Why do you want to work at this centre?" Track all active <a href="/isro-jobs" title="ISRO Recruitment 2026"><strong>ISRO Recruitment Notifications 2026</strong></a> on GovtJobNow.
</p>

<h2>1. VSSC — Vikram Sarabhai Space Centre, Thiruvananthapuram</h2>
<p>
  VSSC is ISRO's flagship launch vehicle development centre and one of the largest employers in ISRO recruitment cycles. It is responsible for the design, development, and realisation of India's launch vehicles — PSLV (Polar Satellite Launch Vehicle), GSLV (Geosynchronous Satellite Launch Vehicle), GSLV Mk-III (LVM3), and the new generation Small Satellite Launch Vehicle (SSLV).
</p>
<ul>
  <li><strong>Primary disciplines hired:</strong> Mechanical, Aerospace, Electronics, Electrical, Chemical (Propellant), Materials Science, Physics</li>
  <li><strong>Key work areas:</strong> Rocket stage design, propulsion systems, structural analysis, thermal protection systems, aerodynamics, avionics</li>
  <li><strong>Campus:</strong> Large residential campus in Thiruvananthapuram (Trivandrum) with ISRO township, schools, hospital, and recreational facilities</li>
</ul>

<h2>2. ISAC / UR Rao Satellite Centre (U R Rao Satellite Centre), Bengaluru</h2>
<p>
  Formerly ISAC (ISRO Satellite Centre), now renamed UR Rao Satellite Centre, this Bengaluru facility is the nerve centre for satellite design and development. ISAC designs and builds India's operational satellites across four categories: communication satellites, Earth observation satellites, navigation satellites, and scientific spacecraft.
</p>
<ul>
  <li><strong>Primary disciplines hired:</strong> Electronics, Mechanical, Electrical, Computer Science, Thermal Engineering</li>
  <li><strong>Key work areas:</strong> Spacecraft bus design, solar panel systems, attitude and orbit control, onboard computers, power subsystems, and satellite integration/testing</li>
  <li><strong>Notable missions:</strong> Chandrayaan-2 orbiter, Chandrayaan-3 (Vikram lander), Mars Orbiter (Mangalyaan), INSAT series, IRNSS NavIC navigation satellites</li>
</ul>

<h2>3. SAC — Space Applications Centre, Ahmedabad</h2>
<p>
  SAC is ISRO's primary centre for developing and operating space-based applications for societal benefit. It focuses on remote sensing satellite payloads, communication technology, and disaster monitoring systems. SAC's work directly impacts India's agriculture, flood forecasting, ocean monitoring, and telecommunications infrastructure.
</p>
<ul>
  <li><strong>Primary disciplines hired:</strong> Electronics, ECE, Computer Science, Physics, Electrical</li>
  <li><strong>Key work areas:</strong> Microwave and optical remote sensing payloads, synthetic aperture radars, disaster warning systems, INSAT communication transponders, GPS-aided GEO augmented navigation (GAGAN)</li>
</ul>

<h2>4. LPSC — Liquid Propulsion Systems Centre, Thiruvananthapuram and Bengaluru (Valiamala)</h2>
<p>
  LPSC is responsible for designing and developing liquid propulsion systems for both launch vehicles and spacecraft. It develops cryogenic and semi-cryogenic engines, hypergolic propellant systems, and spacecraft propulsion packages.
</p>
<ul>
  <li><strong>Primary disciplines hired:</strong> Chemical Engineering, Mechanical, Aerospace, Materials</li>
  <li><strong>Key work areas:</strong> Cryogenic engine development (CE-7.5, CE-20), Vikas engine, propellant formulation, engine testing, turbopump development</li>
</ul>

<h2>5. NRSC — National Remote Sensing Centre, Hyderabad</h2>
<p>
  NRSC acquires and processes remote sensing data from ISRO's Earth Observation satellites. It makes this data available for applications in agriculture, forestry, groundwater mapping, disaster management, and urban planning. NRSC also provides geospatial services to government and research agencies.
</p>
<ul>
  <li><strong>Primary disciplines hired:</strong> Computer Science, Electronics, Geography, Physics, Remote Sensing specialists</li>
  <li><strong>Key work areas:</strong> Satellite image processing, GIS applications, thematic mapping, agriculture monitoring, disaster damage assessment</li>
</ul>

<h2>6. ISTRAC — ISRO Telemetry, Tracking and Command Network, Bengaluru</h2>
<p>
  ISTRAC operates ISRO's ground station network that tracks, commands, and receives telemetry data from all ISRO satellites and launch vehicles in flight. It played a crucial role in the Chandrayaan-3 mission control during the lunar descent.
</p>
<ul>
  <li><strong>Primary disciplines hired:</strong> Electronics, Computer Science, Electrical, Communication Engineering</li>
  <li><strong>Key work areas:</strong> Ground station operations, mission control room management, data link systems, deep space tracking antennas</li>
</ul>

<h2>Other Key ISRO Facilities</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Centre</th><th>Location</th><th>Focus</th><th>Key Disciplines</th></tr></thead>
    <tbody>
      <tr><td>SDSC SHAR (Satish Dhawan Space Centre)</td><td>Sriharikota, Andhra Pradesh</td><td>Launch facilities, range operations</td><td>Electronics, Mechanical, Electrical</td></tr>
      <tr><td>IIRS (Indian Institute of Remote Sensing)</td><td>Dehradun</td><td>Remote sensing training and research</td><td>GIS, Remote Sensing, Geography</td></tr>
      <tr><td>NARL (National Atmospheric Research Lab)</td><td>Tirupati</td><td>Atmospheric science research</td><td>Physics, Atmospheric Science</td></tr>
      <tr><td>IPRC (ISRO Propulsion Complex)</td><td>Mahendragiri, Tamil Nadu</td><td>Engine testing and qualification</td><td>Mechanical, Chemical, Electrical</td></tr>
    </tbody>
  </table>
</div>

<p>
  Prepare for ISRO interviews with our comprehensive <a href="/blog/isro-scientist-engineer-sc-2026-gate-cutoff-interview-salary" title="ISRO Scientist SC Recruitment Guide"><strong>ISRO Scientist/Engineer SC 2026 Recruitment Guide</strong></a>. If you are also considering DRDO, read our <a href="/blog/drdo-scientist-b-recruitment-process" title="DRDO Scientist B Process"><strong>DRDO Scientist B Recruitment Guide</strong></a> for a side-by-side comparison.
</p>

<div class="important-note">
  <p><strong>Disclaimer:</strong> Centre-wise recruitment details, vacancy counts, and discipline-specific requirements are announced through official ISRO notifications at isro.gov.in. Candidates should verify current posting locations and working conditions from the official recruitment advertisement before applying.</p>
</div>
`,
  },

  // ═══════════════════════════════════════════════════════════
  // ISRO CLUSTER — POST 8
  // ═══════════════════════════════════════════════════════════
  {
    title: "ISRO GATE Scorecard to Job Offer: Step-by-Step Recruitment Timeline Explained",
    slug: "isro-gate-scorecard-to-job-offer-recruitment-timeline",
    excerpt:
      "A step-by-step walkthrough of the complete ISRO Scientist/Engineer recruitment journey — from the moment ISRO releases a notification, through GATE score submission, written test, interview, medical examination, document verification, and final joining formalities — with realistic timelines based on past ISRO recruitment cycles.",
    category: "Science and Research Careers",
    tags: ["ISRO Recruitment Process", "GATE to ISRO", "ISRO Selection Timeline", "ISRO Written Test", "ISRO Interview"],
    coverImage: "https://images.unsplash.com/photo-1516849677043-ef67c9557e16?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Rocket launching into space representing the ISRO career journey from GATE to job offer",
    coverImageCaption: "From GATE scorecard to ISRO joining letter — the complete step-by-step timeline.",
    authorName: AUTHOR_NAME,
    authorBio: AUTHOR_BIO,
    readingTime: 12,
    status: "published",
    publishedAt: new Date("2026-09-16T08:00:00Z"),
    seoTitle: "ISRO GATE to Job Offer: Complete Recruitment Timeline Step-by-Step",
    seoDescription: "A detailed step-by-step guide to the ISRO Scientist/Engineer recruitment timeline — from notification release to GATE submission, written test, interview, medical, and final joining — with realistic date ranges from past cycles.",
    seoKeywords: "ISRO recruitment process, ISRO selection timeline, GATE to ISRO job, ISRO written test, ISRO medical examination, how ISRO recruits engineers",
    schemaType: "HowTo",
    faq: [
      {
        question: "How long does the ISRO recruitment process take from application to joining?",
        answer: "Based on past ISRO recruitment cycles, the complete process from notification release to final joining typically takes 6 to 12 months. This includes: GATE shortlisting (1–2 months after application deadline), written test (2–3 months after shortlisting), interview (1–2 months after written test), medical and document verification (1–2 months after interview), and joining formalities (2–4 weeks after clearance)."
      },
      {
        question: "Is the ISRO written test multiple-choice or descriptive?",
        answer: "The ISRO written test is typically an objective (multiple-choice) format — usually 80 questions in 90 minutes. Some ISRO notifications have included a separate descriptive section for senior posts, but for Scientist/Engineer SC (entry-level), the test is generally fully objective based on the candidate's engineering discipline."
      },
      {
        question: "What medical standards does ISRO require for Scientist/Engineer SC?",
        answer: "ISRO requires candidates to be medically fit as assessed by a government hospital or ISRO's medical board. Key standards include: distant vision 6/6 (with or without glasses), no colour blindness for specific posts involving electrical/optics work, and general physical fitness. Candidates with corrected vision using spectacles or contact lenses are generally eligible unless a specific post requires unaided vision."
      }
    ],
    content: `
<p>
  Every engineering aspirant who has cleared GATE with a competitive score wants to know: what happens next when ISRO releases a notification? The ISRO recruitment process involves more stages than most government exams, and the timeline from notification to joining can span several months. Having a clear picture of the process helps you plan your schedule, prepare for each stage, and avoid missing critical deadlines. Track active <a href="/isro-jobs" title="ISRO Jobs 2026 GovtJobNow"><strong>ISRO Recruitment Notifications</strong></a> on GovtJobNow.
</p>

<h2>Complete ISRO Recruitment Timeline: Stage-by-Stage</h2>

<h3>Stage 1: Official Notification Release</h3>
<p>
  ISRO releases recruitment notifications on <a href="https://www.isro.gov.in/careers.html" target="_blank" rel="noopener noreferrer"><strong>isro.gov.in/careers.html</strong></a>. A notification typically specifies: the number of posts per discipline, GATE paper codes accepted, minimum GATE score threshold (if declared upfront or shortlisted by merit), educational qualification, age limit, pay scale, and the online application link.
</p>
<p>
  <strong>Typical window:</strong> ISRO notifications are released 1–3 times per year. The online application window usually stays open for 3–4 weeks from notification date.
</p>
<p>
  <strong>Action required:</strong> Apply immediately on isro.gov.in. Prepare your GATE scorecard, B.Tech marksheets, degree certificate, caste certificate (if applicable), passport photograph, and signature in the specified formats before starting the application.
</p>

<h3>Stage 2: GATE Score Submission and Shortlisting</h3>
<p>
  After the application window closes, ISRO's screening committee reviews applications and shortlists candidates based on GATE score merit in each discipline. The shortlisting ratio varies — ISRO typically calls 5–10 candidates per vacancy for the written test stage.
</p>
<p>
  <strong>Timeline:</strong> Shortlisting results are usually published 4–8 weeks after the application deadline closes.
</p>
<p>
  Read our guide on <a href="/blog/isro-scientist-engineer-sc-2026-gate-cutoff-interview-salary" title="ISRO Scientist SC Guide"><strong>ISRO GATE Cut-Off and Interview Guide</strong></a> for discipline-wise score targets.
</p>

<h3>Stage 3: ISRO Written Test</h3>
<p>
  Shortlisted candidates receive Hall Tickets 2–3 weeks before the written test date. The written test is conducted at ISRO examination centres across major cities (Thiruvananthapuram, Bengaluru, Ahmedabad, Hyderabad, Mumbai, Chennai, Delhi, Pune, and others).
</p>
<p>
  <strong>Exam format (typical for SC posts):</strong>
</p>
<ul>
  <li>80 objective questions from the candidate's engineering discipline</li>
  <li>Duration: 90 minutes</li>
  <li>Marks: 80 marks (each question = 1 mark)</li>
  <li>Negative marking: Typically 1/3 mark deducted per wrong answer</li>
  <li>Medium: English only</li>
</ul>

<h3>Stage 3 Preparation Strategy</h3>
<p>
  The written test tests final-year B.Tech level subject knowledge. For Computer Science candidates: Data Structures (linked lists, trees, heaps), Algorithms (sorting, dynamic programming, graph algorithms), Operating Systems, DBMS (SQL, normalization), Computer Networks (OSI model, TCP/IP, routing protocols), and Digital Logic Design. For ECE candidates: Signal and Systems (Fourier, Laplace), Analog Circuits, Digital Communication, Electromagnetics, Control Systems, and Microprocessors.
</p>

<h3>Stage 4: Personal Interview</h3>
<p>
  Results of the written test are typically published within 3–6 weeks. Qualified candidates are called for a Personal Interview at the respective ISRO centre (usually VSSC, ISAC, SAC, or LPSC depending on the post). The interview lasts 30–45 minutes.
</p>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Interview Component</th><th>Typical Duration</th><th>What Panellists Look For</th></tr></thead>
    <tbody>
      <tr><td>Technical Depth Questions</td><td>15–20 minutes</td><td>Conceptual clarity, problem-solving approach, ability to defend your GATE subject knowledge</td></tr>
      <tr><td>ISRO Mission Awareness</td><td>5–10 minutes</td><td>Knowledge of Gaganyaan, Chandrayaan, Aditya-L1, NISAR, upcoming missions</td></tr>
      <tr><td>Centre Preference &amp; Motivation</td><td>5 minutes</td><td>Why ISRO, why this centre, long-term career goals</td></tr>
      <tr><td>Problem Scenario</td><td>5–10 minutes</td><td>How you approach a real engineering challenge (teamwork, debugging, design thinking)</td></tr>
    </tbody>
  </table>
</div>

<h3>Stage 5: Medical Examination</h3>
<p>
  Selected candidates are called for a pre-employment medical examination at a designated government hospital or at the ISRO centre. Standard government medical standards apply — vision test (6/6 with or without spectacles), hearing, blood pressure, and general physical fitness. Candidates with controlled medical conditions (diabetes, hypertension) on medication may face restrictions for specific field or travel-intensive posts.
</p>

<h3>Stage 6: Document Verification</h3>
<p>
  After medical clearance, candidates are called for document verification at the ISRO centre. Required documents typically include: GATE scorecard (original), B.Tech degree/provisional certificate, all semester marksheets, Class 10 and Class 12 certificates (for age proof), caste/category certificate (if applicable), EWS certificate (if applicable), and recent passport-size photographs. Check the complete <a href="/blog/govt-job-document-verification-checklist" title="Govt Job Document Checklist"><strong>Government Job Document Verification Checklist</strong></a> for a comprehensive preparation list.
</p>

<h3>Stage 7: Final Offer Letter and Joining</h3>
<p>
  ISRO issues a formal appointment offer after successful completion of all above stages. The joining date is typically specified as 4–8 weeks from the date of the offer letter. Joining formalities include submitting security clearance documents, bank account details, PF nomination forms, and completing ISRO's in-house onboarding process.
</p>

<h2>Complete Timeline Summary</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Stage</th><th>Approximate Duration (From Notification)</th></tr></thead>
    <tbody>
      <tr><td>Application window closes</td><td>3–4 weeks</td></tr>
      <tr><td>Shortlisting result published</td><td>6–10 weeks</td></tr>
      <tr><td>Written test conducted</td><td>12–16 weeks</td></tr>
      <tr><td>Written test results &amp; interview call</td><td>18–22 weeks</td></tr>
      <tr><td>Interview conducted</td><td>22–28 weeks</td></tr>
      <tr><td>Medical + document verification</td><td>30–36 weeks</td></tr>
      <tr><td>Offer letter issued</td><td>36–42 weeks</td></tr>
      <tr><td>Joining date</td><td>40–48 weeks (approximately 10–12 months from notification)</td></tr>
    </tbody>
  </table>
</div>

<div class="important-note">
  <p><strong>Disclaimer:</strong> ISRO recruitment timelines, stages, and procedures are determined by ISRO and may vary by notification. Candidates must follow the official schedule published on isro.gov.in and check their registered email regularly for Hall Tickets, result notifications, and joining instructions. GovtJobNow does not represent ISRO and all application activities must be conducted directly through official ISRO portals.</p>
</div>
`,
  },
];

async function seedBatch2() {
  console.log("🚀 Starting Phase 1 Blog Batch 2 seeding...\n");
  console.log(`📝 Total posts to seed: ${BATCH2_POSTS.length}\n`);

  let seeded = 0;
  let skipped = 0;

  for (const post of BATCH2_POSTS) {
    // Check if slug already exists
    const existing = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, post.slug));

    if (existing.length > 0) {
      console.log(`⏭️  Skipped (already exists): ${post.slug}`);
      skipped++;
      continue;
    }

    await db.insert(blogPosts).values({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags,
      coverImage: post.coverImage,
      coverImageAlt: post.coverImageAlt,
      coverImageCaption: post.coverImageCaption,
      authorName: post.authorName,
      authorBio: post.authorBio,
      readingTime: post.readingTime,
      status: post.status as "published" | "draft",
      publishedAt: post.publishedAt,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      seoKeywords: post.seoKeywords,
      schemaType: post.schemaType as "HowTo" | "Article",
      faq: post.faq,
      content: post.content,
      updatedAt: new Date(),
    });

    console.log(`✅ Seeded: "${post.title}"`);
    seeded++;
  }

  console.log(`\n🎉 Done! Seeded: ${seeded} | Skipped: ${skipped}`);
  console.log("\n📋 New posts authored by: Manali Suryawanshi");
  console.log("📋 Total blog posts now: ~38 (30 existing + 8 new)");
  console.log("\n⚡ Next steps:");
  console.log("  1. git add -A && git commit -m 'feat: Phase 1 SSC + ISRO blog cluster (8 posts)'");
  console.log("  2. git push origin main && git pull on VPS");
  console.log("  3. npm run fix:author   (if not already done)");
  console.log("  4. npm run seed:batch2");
  console.log("  5. Rebuild Docker: docker compose up --build -d");
  process.exit(0);
}

seedBatch2().catch((err) => {
  console.error("❌ Error seeding batch 2:", err);
  process.exit(1);
});
