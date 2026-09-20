/**
 * seed-batch3-blogs.ts
 *
 * Phase 2 Blog Content: 4 Railway cluster posts + 3 Banking cluster posts
 * Author: Manali Suryawanshi (Government Recruitment Researcher, GovtJobNow)
 * Standard: 1,000–1,400 words each | Unique excerpts | 3-5 FAQs | Internal links
 *
 * Run: npx tsx server/scripts/seed-batch3-blogs.ts
 */

import "dotenv/config";
import { db } from "../db";
import { blogPosts } from "../../shared/schema";
import { eq } from "drizzle-orm";

const AUTHOR_NAME = "Manali Suryawanshi";
const AUTHOR_BIO =
  "Manali Suryawanshi is a Government Recruitment Researcher and Senior Content Editor at GovtJobNow. She tracks and verifies official recruitment notifications from SSC, UPSC, Railway Recruitment Boards, ISRO, DRDO, State PSCs, and Banking sectors to help Indian job aspirants stay informed and apply confidently.";

const BATCH3_POSTS = [
  // ═══════════════════════════════════════════════════════════
  // RAILWAY CLUSTER — POST 1
  // ═══════════════════════════════════════════════════════════
  {
    title: "RRB NTPC 2026 Selection Process: Stage 1 & 2 CBT Exam Pattern, Syllabus and Level 2–6 Salary",
    slug: "rrb-ntpc-2026-selection-process-syllabus-exam-pattern-salary",
    excerpt:
      "A complete guide to RRB NTPC (Non-Technical Popular Categories) 2026 recruitment — covering the 2-stage CBT exam pattern, post-wise qualification requirements for Level 2, 3, 4, 5, and 6, Computer Based Aptitude Test (CBAT) rules, typing skill tests, and 7th Pay Commission salary breakdown.",
    category: "Railway Exam Strategy",
    tags: ["RRB NTPC", "Railway Jobs", "CBT-1 Pattern", "CBT-2 Syllabus", "RRB 2026"],
    coverImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Indian Railways train representing RRB NTPC recruitment",
    coverImageCaption: "RRB NTPC is one of the largest recruitment exams in Indian Railways for graduate and undergraduate candidates.",
    authorName: AUTHOR_NAME,
    authorBio: AUTHOR_BIO,
    readingTime: 13,
    status: "published",
    publishedAt: new Date("2026-09-15T08:00:00Z"),
    seoTitle: "RRB NTPC 2026 Selection Process: CBT-1, CBT-2 Syllabus, Exam Pattern & Salary",
    seoDescription: "Complete RRB NTPC 2026 guide — CBT-1 and CBT-2 syllabus breakdown, post-wise Level 2 to Level 6 qualifications, Typing Test/CBAT rules, and 7th CPC salary structure.",
    seoKeywords: "RRB NTPC 2026, RRB NTPC syllabus, RRB NTPC exam pattern, RRB NTPC salary, Railway NTPC selection process, RRB NTPC eligibility",
    schemaType: "HowTo",
    faq: [
      {
        question: "Is CBT-1 marks counted in the final merit list for RRB NTPC?",
        answer: "No. CBT-1 is a screening test used to shortlist candidates for CBT-2 at a ratio of approximately 1:20 against vacancies. Your score in CBT-1 is normalized, but it only determines whether you qualify for CBT-2. Final merit ranking is based on CBT-2 performance (plus CBAT/Typing test marks where applicable)."
      },
      {
        question: "What is the negative marking penalty in RRB NTPC CBT-1 and CBT-2?",
        answer: "There is 1/3rd (0.33) negative marking for every incorrect answer in both CBT-1 and CBT-2. Unattempted questions carry zero penalty. Speed with accuracy is essential in both stages."
      },
      {
        question: "Which RRB NTPC posts require the Computer Based Aptitude Test (CBAT)?",
        answer: "CBAT (Psychology/Battery Test) is mandatory only for Station Master (Level 6) and Traffic Assistant (Level 4) posts. Candidates must score a minimum T-score of 42 in each battery module to qualify. There is no negative marking in CBAT."
      },
      {
        question: "What is the starting in-hand salary for RRB NTPC Station Master (Level 6)?",
        answer: "Station Master falls under Level-6 with a basic pay of Rs. 35,400. Including DA (currently 46%+), HRA (27% for X cities), Transport Allowance, and Night Duty/Running Allowance, the gross starting salary ranges between Rs. 58,000 and Rs. 65,000 per month."
      }
    ],
    content: `
<p>
  The Railway Recruitment Board Non-Technical Popular Categories (RRB NTPC) examination is one of India's premier government recruitment drives. It fills crucial non-technical roles in Indian Railways ranging from Junior Clerk Cum Typist (Level 2) up to Station Master and Commercial Apprentice (Level 6). Explore active <a href="/category/railway" title="Railway Recruitment Notifications on GovtJobNow"><strong>Railway Recruitment Notifications</strong></a> on GovtJobNow.
</p>
<p>
  With millions of applicants competing across 21 Railway Recruitment Boards, understanding the exact 2-stage CBT format, post-level progression, skill tests, and medical standards is vital for structured preparation.
</p>

<h2>RRB NTPC 2026 Post Classification &amp; Educational Qualification</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Pay Level</th><th>Post Name</th><th>Educational Qualification</th><th>Initial Basic Pay</th></tr></thead>
    <tbody>
      <tr><td>Level 2</td><td>Junior Clerk cum Typist, Accounts Clerk cum Typist, Junior Time Keeper, Train Clerk</td><td>10+2 (Intermediate) Pass (50% aggregate for UR)</td><td>Rs. 19,900</td></tr>
      <tr><td>Level 3</td><td>Commercial cum Ticket Clerk</td><td>10+2 (Intermediate) Pass (50% aggregate for UR)</td><td>Rs. 21,700</td></tr>
      <tr><td>Level 4</td><td>Traffic Assistant</td><td>University Degree (Graduation)</td><td>Rs. 25,500</td></tr>
      <tr><td>Level 5</td><td>Goods Guard, Senior Commercial cum Ticket Clerk, Senior Clerk cum Typist, Junior Accounts Assistant cum Typist</td><td>University Degree (Graduation)</td><td>Rs. 29,200</td></tr>
      <tr><td>Level 6</td><td>Station Master, Commercial Apprentice</td><td>University Degree (Graduation)</td><td>Rs. 35,400</td></tr>
    </tbody>
  </table>
</div>

<h2>RRB NTPC CBT-1 Exam Pattern (Screening Stage)</h2>

<p>
  CBT-1 is a single-stage online examination of 90 minutes duration (120 minutes for eligible PwBD candidates). It contains 100 multiple-choice questions carrying 100 marks.
</p>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Subject Section</th><th>Number of Questions</th><th>Total Marks</th><th>Duration</th></tr></thead>
    <tbody>
      <tr><td>General Awareness</td><td>40</td><td>40</td><td rowspan="3">90 Minutes</td></tr>
      <tr><td>Mathematics (Quantitative)</td><td>30</td><td>30</td></tr>
      <tr><td>General Intelligence &amp; Reasoning</td><td>30</td><td>30</td></tr>
      <tr><td><strong>Total</strong></td><td><strong>100</strong></td><td><strong>100</strong></td></tr>
    </tbody>
  </table>
</div>

<p>
  <em>Negative Marking: 1/3rd mark (0.33) deducted for each incorrect answer. Normalisation is applied to raw scores across multiple exam shifts.</em>
</p>

<h2>RRB NTPC CBT-2 Exam Pattern (Merit Decider)</h2>

<p>
  Candidates shortlisted from CBT-1 appear for CBT-2 separate for each Pay Level (Level 2, 3, 4, 5, 6). CBT-2 has 120 questions to be solved in 90 minutes.
</p>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Subject Section</th><th>Number of Questions</th><th>Total Marks</th><th>Time Allocated</th></tr></thead>
    <tbody>
      <tr><td>General Awareness</td><td>50</td><td>50</td><td rowspan="3">90 Minutes</td></tr>
      <tr><td>Mathematics</td><td>35</td><td>35</td></tr>
      <tr><td>General Intelligence &amp; Reasoning</td><td>35</td><td>35</td></tr>
      <tr><td><strong>Total</strong></td><td><strong>120</strong></td><td><strong>120</strong></td></tr>
    </tbody>
  </table>
</div>

<h2>Subject-Wise Detailed Syllabus Breakdown</h2>

<h3>1. General Awareness (40 Marks in CBT-1, 50 Marks in CBT-2)</h3>
<p>
  The General Awareness section forms the largest chunk of marks in both stages. Focus area distribution based on PYQs:
</p>
<ul>
  <li><strong>Indian Railways History &amp; Facts:</strong> Zones, headquarters, famous trains, budget highlights, rail technology projects (Vande Bharat, Bullet Train).</li>
  <li><strong>Current Affairs (Past 10–12 Months):</strong> National awards, sports events, government schemes, international summits.</li>
  <li><strong>General Science (Class 9-10 Level):</strong> Physics (laws of motion, optics, electricity), Chemistry (periodic table, chemical reactions), Biology (human physiology, diseases, botany).</li>
  <li><strong>Static GK &amp; Indian Heritage:</strong> Indian National Movement, Constitution &amp; Polity, Physical Geography, Art &amp; Culture.</li>
</ul>

<h3>2. Mathematics (30 Marks in CBT-1, 35 Marks in CBT-2)</h3>
<p>
  Topics: Number System, Decimals, Fractions, LCM &amp; HCF, Ratio and Proportion, Percentages, Mensuration (2D/3D), Time and Work, Distance and Speed, Simple and Compound Interest, Profit and Loss, Elementary Algebra, Geometry and Trigonometry, Elementary Statistics. For formula practice, consult our <a href="/blog/cbt-exam-time-management-hacks" title="CBT Speed & Accuracy Hacks"><strong>CBT Speed and Accuracy Guide</strong></a>.
</p>

<h3>3. General Intelligence &amp; Reasoning (30 Marks in CBT-1, 35 Marks in CBT-2)</h3>
<p>
  Topics: Analogies, Completion of Number and Alphabetical Series, Coding and Decoding, Mathematical Operations, Similarities and Differences, Relationships, Analytical Reasoning, Syllogism, Jumbling, Venn Diagrams, Puzzle, Data Sufficiency, Statement- Conclusion, Statement- Courses of Action, Decision Making, Maps, Interpretation of Graphs.
</p>

<h2>Stage 3: Typing Skill Test &amp; CBAT Rules</h2>

<ul>
  <li><strong>Computer Based Typing Skill Test (TST):</strong> Mandatory for Senior Clerk cum Typist, Junior Accounts Assistant cum Typist, Junior Clerk cum Typist, Accounts Clerk cum Typist. Candidates must type at least 30 WPM in English or 25 WPM in Hindi without spell-check or formatting aids. It is qualifying in nature.</li>
  <li><strong>Computer Based Aptitude Test (CBAT):</strong> Mandatory for Station Master and Traffic Assistant. Consists of 5 battery tests (Intelligence, Selective Attention, Spatial Scanning, Information Ordering, Personality). Must secure minimum T-Score of 42 in each battery module. Weightage: 70% CBT-2 score + 30% CBAT score for final merit list.</li>
</ul>

<h2>7th Pay Commission Salary Breakdown for RRB NTPC</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Post Level</th><th>Basic Pay</th><th>Dearness Allowance (46%)</th><th>HRA (X City - 27%)</th><th>Gross Starting Salary (Approx)</th></tr></thead>
    <tbody>
      <tr><td>Level 2 (Clerks/Typists)</td><td>Rs. 19,900</td><td>Rs. 9,154</td><td>Rs. 5,373</td><td>~Rs. 37,000 - 41,000</td></tr>
      <tr><td>Level 3 (Commercial Clerk)</td><td>Rs. 21,700</td><td>Rs. 9,982</td><td>Rs. 5,859</td><td>~Rs. 40,000 - 44,000</td></tr>
      <tr><td>Level 5 (Goods Guard/Sr Clerk)</td><td>Rs. 29,200</td><td>Rs. 13,432</td><td>Rs. 7,884</td><td>~Rs. 53,000 - 59,000</td></tr>
      <tr><td>Level 6 (Station Master)</td><td>Rs. 35,400</td><td>Rs. 16,284</td><td>Rs. 9,558</td><td>~Rs. 64,000 - 72,000 (Incl. Running Allow.)</td></tr>
    </tbody>
  </table>
</div>

<h2>Official Verification &amp; Notifications</h2>
<p>
  Notification details, online application dates, and zone-wise vacancy tables are published by the 21 official Railway Recruitment Boards. Visit the official portal <a href="https://rrbcdg.gov.in" target="_blank" rel="noopener noreferrer"><strong>rrbcdg.gov.in</strong></a> for authentic circulars. Check active job alerts on <a href="/category/railway" title="GovtJobNow Railway Notifications"><strong>GovtJobNow Railway Section</strong></a>.
</p>

<div class="important-note">
  <p><strong>Disclaimer:</strong> Examination schedules, post eligibility, medical standards, and zone vacancies are determined by the Ministry of Railways (Railway Board). Candidates should consult the official Employment News advertisement or individual RRB websites before submitting applications.</p>
</div>
`,
  },

  // ═══════════════════════════════════════════════════════════
  // RAILWAY CLUSTER — POST 2
  // ═══════════════════════════════════════════════════════════
  {
    title: "RRB Group D 2026: Educational Qualification, Age Limit, PET Standards, Syllabus & Normalisation",
    slug: "rrb-group-d-2026-eligibility-pet-standards-syllabus-salary",
    excerpt:
      "Complete guide to RRB Group D (Level-1 Track Maintainer, Assistant, Helper) 2026 recruitment — 10th Pass/NAC eligibility criteria, male & female Physical Efficiency Test (PET) weight carrying and running standards, CBT syllabus, score normalisation formula, and 7th CPC salary structure.",
    category: "Railway Exam Strategy",
    tags: ["RRB Group D", "Level 1 Jobs", "PET Test", "10th Pass Railway Jobs", "RRB 2026"],
    coverImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Railway track maintenance worker representing RRB Group D Level 1 jobs",
    coverImageCaption: "RRB Group D Level-1 posts provide entry-level employment opportunities in Indian Railways.",
    authorName: AUTHOR_NAME,
    authorBio: AUTHOR_BIO,
    readingTime: 12,
    status: "published",
    publishedAt: new Date("2026-09-16T08:00:00Z"),
    seoTitle: "RRB Group D 2026: Eligibility, PET Test Standards, Syllabus, Normalisation & Salary",
    seoDescription: "Full RRB Group D 2026 guide — 10th pass/NAC eligibility, age limit, physical endurance test (weight carrying & 1000m running), CBT exam pattern, normalisation formula, and Level-1 pay.",
    seoKeywords: "RRB Group D 2026, RRB Group D eligibility, RRB Group D PET standards, Group D syllabus 2026, Railway Level 1 salary, RRB Group D physical test",
    schemaType: "HowTo",
    faq: [
      {
        question: "Is ITI mandatory for all RRB Group D posts in 2026?",
        answer: "As per the latest Railway Board policy guidelines, 10th pass (Matriculation) from a recognized Board OR National Apprenticeship Certificate (NAC) granted by NCVT OR ITI in relevant trades is accepted for Group D (Level 1) posts. Candidates must verify post-specific technical requirements in the official notification."
      },
      {
        question: "What is the weight carrying test in RRB Group D PET for male candidates?",
        answer: "Male candidates must lift and carry 35 kg of weight for a distance of 100 metres in 2 minutes in a single attempt without putting the weight down on the ground."
      },
      {
        question: "What is the running standard for female candidates in RRB Group D PET?",
        answer: "Female candidates must carry 20 kg weight for 100 metres in 2 minutes (single attempt) AND run 1000 metres (1 km) in 5 minutes 40 seconds in a single attempt."
      },
      {
        question: "How does score normalisation work in RRB Group D CBT?",
        answer: "Since the Computer Based Test is conducted across multiple shifts over several weeks, RRB applies a percentile-based normalisation formula. Raw marks are converted into normalized percentiles so candidates who faced harder shifts are evaluated fairly."
      }
    ],
    content: `
<p>
  RRB Group D (RRC Level-1) is one of the largest mass recruitments conducted by the Indian Railways, filling thousands of posts such as Track Maintainer Grade IV, Helper/Assistant in various technical departments (Electrical, Mechanical, S&amp;T), and Pointsman. Check latest <a href="/category/railway" title="Railway Level 1 Recruitment Notifications"><strong>Railway Level-1 Recruitment Alerts</strong></a> on GovtJobNow.
</p>
<p>
  Because Group D exams involve millions of applicants, clearing both the Computer-Based Test (CBT) and the grueling Physical Efficiency Test (PET) requires systematic preparation.
</p>

<h2>RRB Group D 2026 Eligibility Criteria</h2>

<h3>1. Educational Qualification</h3>
<ul>
  <li><strong>General Posts:</strong> 10th Pass (Matriculation) from a recognized Board OR National Apprenticeship Certificate (NAC) granted by NCVT.</li>
  <li><strong>Technical Department Posts:</strong> 10th Pass plus ITI from NCVT/SCVT in specified engineering trades (Fitter, Electrician, Welder, Machinist, Turner, etc.) or NAC.</li>
</ul>

<h3>2. Age Limit (with 7th CPC relaxations)</h3>
<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Category</th><th>Minimum Age</th><th>Maximum Age (General)</th><th>Age Relaxation</th></tr></thead>
    <tbody>
      <tr><td>Unreserved (UR) / EWS</td><td>18 Years</td><td>33 Years</td><td>Nil</td></tr>
      <tr><td>OBC (Non-Creamy Layer)</td><td>18 Years</td><td>36 Years</td><td>3 Years</td></tr>
      <tr><td>SC / ST</td><td>18 Years</td><td>38 Years</td><td>5 Years</td></tr>
      <tr><td>PwBD (UR)</td><td>18 Years</td><td>43 Years</td><td>10 Years</td></tr>
    </tbody>
  </table>
</div>

<h2>RRB Group D CBT Exam Pattern</h2>

<p>
  The CBT consists of 100 multiple-choice questions to be answered in 90 minutes (120 minutes for PwBD). Negative marking of 1/3rd (0.33) mark applies for wrong answers.
</p>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Section</th><th>Number of Questions</th><th>Marks</th></tr></thead>
    <tbody>
      <tr><td>General Science (Physics, Chem, Bio - Class 10 Level)</td><td>25</td><td>25</td></tr>
      <tr><td>Mathematics</td><td>25</td><td>25</td></tr>
      <tr><td>General Intelligence &amp; Reasoning</td><td>30</td><td>30</td></tr>
      <tr><td>General Awareness &amp; Current Affairs</td><td>20</td><td>20</td></tr>
      <tr><td><strong>Total</strong></td><td><strong>100</strong></td><td><strong>100</strong></td></tr>
    </tbody>
  </table>
</div>

<h2>Physical Efficiency Test (PET) — Exact Standards</h2>

<p>
  Passing PET is mandatory for all candidates except PwBD category. PET is qualifying in nature — marks are not added to the final merit list.
</p>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Gender</th><th>Event 1: Weight Lifting &amp; Carrying</th><th>Event 2: Running Distance &amp; Time</th></tr></thead>
    <tbody>
      <tr><td><strong>Male Candidates</strong></td><td>Lift &amp; carry <strong>35 kg weight</strong> for 100 metres in 2 minutes (1 attempt, without putting down)</td><td>Run <strong>1000 metres (1 km)</strong> in 4 minutes 15 seconds (1 attempt)</td></tr>
      <tr><td><strong>Female Candidates</strong></td><td>Lift &amp; carry <strong>20 kg weight</strong> for 100 metres in 2 minutes (1 attempt, without putting down)</td><td>Run <strong>1000 metres (1 km)</strong> in 5 minutes 40 seconds (1 attempt)</td></tr>
    </tbody>
  </table>
</div>

<h2>Syllabus &amp; Preparation Strategy</h2>

<h3>1. General Science (25 Marks)</h3>
<p>
  The General Science section tests Class 9 and Class 10 NCERT Physics, Chemistry, and Biology. Unlike general SSC exams, Railway Group D includes numerical problems in Physics (Ohm's Law V=IR, Kinetic Energy E=½mv², Work done W=Fd, Lens formula 1/f=1/v-1/u). Master NCERT back-of-chapter numericals.
</p>

<h3>2. Mathematics (25 Marks)</h3>
<p>
  Key topics: Number system, BODMAS, Decimals, Fractions, LCM/HCF, Ratio &amp; Proportion, Percentages, Mensuration, Time &amp; Work, Time &amp; Distance, Simple &amp; Compound Interest, Profit &amp; Loss, Algebra, Geometry, Trigonometry, Elementary Statistics, Square Root, Age Calculations, Calendar &amp; Clock, Pipes &amp; Cistern. Review our <a href="/blog/cbt-exam-time-management-hacks" title="CBT Maths Speed Tactics"><strong>CBT Maths Speed Tactics</strong></a> for practice hacks.
</p>

<h3>3. General Intelligence &amp; Reasoning (30 Marks)</h3>
<p>
  Topics: Analogies, Alphabetical &amp; Number Series, Coding-Decoding, Mathematical Operations, Relationships, Syllogism, Jumbling, Venn Diagrams, Data Interpretation, Conclusions &amp; Decision Making, Classification, Statement-Arguments &amp; Assumptions.
</p>

<h2>RRB Group D Level-1 Salary Breakdown (7th Pay Commission)</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Salary Component</th><th>Amount (X-City)</th><th>Amount (Y-City)</th><th>Amount (Z-City)</th></tr></thead>
    <tbody>
      <tr><td>Basic Pay (Level-1)</td><td>Rs. 18,000</td><td>Rs. 18,000</td><td>Rs. 18,000</td></tr>
      <tr><td>Dearness Allowance (DA 46%)</td><td>Rs. 8,280</td><td>Rs. 8,280</td><td>Rs. 8,280</td></tr>
      <tr><td>House Rent Allowance (HRA)</td><td>Rs. 4,860 (27%)</td><td>Rs. 3,240 (18%)</td><td>Rs. 1,620 (9%)</td></tr>
      <tr><td>Transport Allowance + DA</td><td>Rs. 1,971</td><td>Rs. 1,314</td><td>Rs. 1,314</td></tr>
      <tr><td>Risk &amp; Hardship Allowance (Trackmen)</td><td>Rs. 2,700</td><td>Rs. 2,700</td><td>Rs. 2,700</td></tr>
      <tr><td><strong>Estimated Gross Salary</strong></td><td><strong>~Rs. 33,000 - 36,000</strong></td><td><strong>~Rs. 31,000 - 33,000</strong></td><td><strong>~Rs. 28,000 - 30,000</strong></td></tr>
    </tbody>
  </table>
</div>

<div class="important-note">
  <p><strong>Disclaimer:</strong> Physical test criteria, educational qualifications, and vacancy tables are subject to Railway Recruitment Cell (RRC) official notifications published at rrbcdg.gov.in. Always refer to official government notices for final confirmation.</p>
</div>
`,
  },

  // ═══════════════════════════════════════════════════════════
  // RAILWAY CLUSTER — POST 3
  // ═══════════════════════════════════════════════════════════
  {
    title: "RRB ALP & Technician 2026: CBT-1, CBT-2 Part A & B Trade Test, CBAT & Medical Standards",
    slug: "rrb-alp-technician-2026-cbt-trade-test-psychology-medical-standards",
    excerpt:
      "A deep dive into RRB Assistant Loco Pilot (ALP) and Technician recruitment 2026 — covering CBT-1 screening, CBT-2 Part A merit syllabus, Part B qualifying Trade Test (ITI/Diploma/B.Tech), CBAT Psychology Battery test, and strict A-1 Medical vision standards.",
    category: "Railway Exam Strategy",
    tags: ["RRB ALP", "Loco Pilot", "Technician Jobs", "Trade Test", "CBAT Psychology"],
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Locomotive engine driver cockpit representing Assistant Loco Pilot career",
    coverImageCaption: "RRB Assistant Loco Pilot (ALP) requires strict physical and vision standards alongside technical excellence.",
    authorName: AUTHOR_NAME,
    authorBio: AUTHOR_BIO,
    readingTime: 14,
    status: "published",
    publishedAt: new Date("2026-09-17T08:00:00Z"),
    seoTitle: "RRB ALP & Technician 2026: CBT-1, CBT-2 Trade Test, CBAT & Medical Standards",
    seoDescription: "Complete RRB ALP & Technician 2026 guide — CBT-1 screening, CBT-2 Part A & Part B Trade Test syllabus, CBAT Psychology test, and strict A-1 medical vision requirements.",
    seoKeywords: "RRB ALP 2026, Assistant Loco Pilot recruitment, RRB Technician syllabus, ALP trade test syllabus, CBAT psychology test ALP, A-1 medical vision standard railway",
    schemaType: "HowTo",
    faq: [
      {
        question: "What is the pass percentage required in CBT-2 Part B Trade Test?",
        answer: "Candidates must score a minimum of 35% marks in CBT-2 Part B (Qualifying Trade Test) to be eligible for further evaluation. This applies to all candidate categories (UR, OBC, SC, ST, EWS). If you fail Part B, your Part A score will not be considered regardless of how high it is."
      },
      {
        question: "What is the Medical Vision Standard for Assistant Loco Pilot (ALP)?",
        answer: "ALP requires the strict A-1 Medical Standard. Distance Vision must be 6/6, 6/6 without glasses (no fogging test allowed). Near Vision: Sn 0.6, 0.6 without glasses. Candidates who have undergone Lasik surgery or have color blindness are strictly ineligible for ALP posts."
      },
      {
        question: "Can Engineering Diploma and B.Tech degree holders apply for RRB ALP?",
        answer: "Yes! Candidates holding 3-year Diplomas or 4-year B.Tech degrees in Mechanical, Electrical, Electronics, or Automobile Engineering are eligible to apply for Assistant Loco Pilot (ALP) posts."
      },
      {
        question: "How is final merit calculated for Assistant Loco Pilot (ALP)?",
        answer: "For ALP, final merit is calculated by giving 70% weightage to CBT-2 Part A marks and 30% weightage to CBAT (Computer Based Aptitude Test) T-scores. Part B is qualifying only."
      }
    ],
    content: `
<p>
  The Railway Recruitment Board Assistant Loco Pilot (ALP) and Technician examination recruits key technical personnel who operate and maintain the vast fleet of Indian Railways locomotives and rolling stock. View current <a href="/category/railway" title="Technical Railway Recruitment Alerts on GovtJobNow"><strong>Technical Railway Job Alerts</strong></a> on GovtJobNow.
</p>
<p>
  Because ALP involves direct train driving responsibility, the selection procedure includes stringent multi-stage examinations, specialized trade testing, psychological aptitude evaluations, and mandatory A-1 Medical fitness tests.
</p>

<h2>RRB ALP &amp; Technician Selection Stages Overview</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Stage</th><th>Exam Name</th><th>Nature</th><th>Key Purpose</th></tr></thead>
    <tbody>
      <tr><td>Stage 1</td><td>CBT-1</td><td>Screening (Qualifying)</td><td>Shortlist 15x candidates for CBT-2</td></tr>
      <tr><td>Stage 2</td><td>CBT-2 (Part A)</td><td>Merit (70% weightage for ALP)</td><td>Determines core rank in subject knowledge</td></tr>
      <tr><td>Stage 2</td><td>CBT-2 (Part B)</td><td>Qualifying (35% mandatory)</td><td>Tests relevant ITI / Engineering Trade knowledge</td></tr>
      <tr><td>Stage 3</td><td>CBAT (ALP only)</td><td>Merit (30% weightage for ALP)</td><td>Psychology Battery test measuring reactions &amp; memory</td></tr>
      <tr><td>Stage 4</td><td>Document Verification &amp; Medical</td><td>Qualifying (Strict A-1 for ALP)</td><td>Vision, physical fitness &amp; certificate check</td></tr>
    </tbody>
  </table>
</div>

<h2>Stage 1: CBT-1 Exam Pattern</h2>
<p>
  75 Questions | 60 Minutes Duration | 1/3rd Negative Marking.
</p>
<ul>
  <li><strong>Mathematics (20 Questions):</strong> Number system, Ratio, Percentages, Time &amp; Work, Algebra, Geometry, Trigonometry.</li>
  <li><strong>General Intelligence &amp; Reasoning (25 Questions):</strong> Analogies, Series, Coding-Decoding, Syllogisms, Venn Diagrams.</li>
  <li><strong>General Science (20 Questions):</strong> Physics, Chemistry, Life Sciences up to Class 10 NCERT standard.</li>
  <li><strong>General Awareness on Current Affairs (10 Questions):</strong> Science &amp; tech, sports, culture, personalities, economics, politics.</li>
</ul>

<h2>Stage 2: CBT-2 (Part A + Part B) Exam Pattern</h2>

<p>
  CBT-2 is conducted in a single sitting lasting 2 Hours 30 Minutes containing two parts:
</p>

<h3>Part A (100 Questions, 90 Minutes) — Merit Score</h3>
<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Subject Section</th><th>Questions</th><th>Key Topics</th></tr></thead>
    <tbody>
      <tr><td>Mathematics</td><td>25</td><td>Advanced Arithmetic, Algebra, Geometry, Mensuration, Statistics</td></tr>
      <tr><td>General Intelligence &amp; Reasoning</td><td>25</td><td>Logical Reasoning, Statements, Matrices, Coding, Puzzles</td></tr>
      <tr><td>Basic Science &amp; Engineering</td><td>40</td><td>Engineering Drawing, Units, Mass/Weight/Density, Work/Power/Energy, Speed/Velocity, Heat/Temp, Basic Electricity, Levers/Simple Machines, Occupational Safety</td></tr>
      <tr><td>General Awareness</td><td>10</td><td>National Events, Railway Affairs, Technology Updates</td></tr>
    </tbody>
  </table>
</div>

<h3>Part B (75 Questions, 60 Minutes) — Qualifying Trade Test</h3>
<p>
  Part B tests the trade syllabus prescribed by DGT (Directorate General of Training). Candidates choose their trade based on their ITI trade or engineering diploma discipline:
</p>
<ul>
  <li><strong>Electrical Engineering Branch:</strong> Electrician, Wireman, Winder, Refrigeration &amp; AC Mechanic.</li>
  <li><strong>Mechanical Engineering Branch:</strong> Fitter, Turner, Machinist, Motor Vehicle Mechanic, Diesel Mechanic, Welder, Tractor Mechanic.</li>
  <li><strong>Electronics Engineering Branch:</strong> Electronics Mechanic, Mechanic Radio &amp; TV.</li>
  <li><strong>Automobile Engineering Branch:</strong> Motor Vehicle Mechanic, Auto Electrical &amp; Electronics.</li>
  <li><strong>HSC (10+2 with Physics &amp; Maths):</strong> Physics and Mathematics trade option.</li>
</ul>

<h2>Stage 3: Computer Based Aptitude Test (CBAT) for ALP</h2>

<p>
  Candidates equal to 8 times the ALP vacancies are called for CBAT. The test consists of 5 battery modules:
</p>
<ol>
  <li><strong>Memory Test:</strong> Memorising building/house maps and locating them on blank grids.</li>
  <li><strong>Direction Test (Table Test):</strong> Quick grid navigation following compass instructions.</li>
  <li><strong>Depth Perception Test:</strong> Identifying stacked bricks contact points.</li>
  <li><strong>Concentration Test:</strong> Comparing number digits rapidly for identity matching.</li>
  <li><strong>Speed Test (Perceptual Speed):</strong> Matching identical figures in high-speed timed sets.</li>
</ol>
<p>
  <em>Requirement: Candidate must score a minimum T-score of 42 in EACH of the 5 battery tests to qualify.</em>
</p>

<h2>Stage 4: Medical Vision Standards (A-1 vs Below)</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Medical Standard</th><th>Posts Applicable</th><th>Distance Vision Requirement</th><th>Near Vision Requirement</th></tr></thead>
    <tbody>
      <tr><td><strong>A-1 Standard</strong></td><td>Assistant Loco Pilot (ALP)</td><td>6/6, 6/6 without glasses (No Lasik permitted)</td><td>Sn: 0.6, 0.6 without glasses</td></tr>
      <tr><td><strong>B-1 Standard</strong></td><td>Technician Grade III (Workshop/Track)</td><td>6/9, 6/12 with or without glasses (Power &lt; 4D)</td><td>Sn: 0.6, 0.6 with/without glasses</td></tr>
      <tr><td><strong>B-2 Standard</strong></td><td>Technician Signal &amp; Telecom</td><td>6/9, 6/12 with or without glasses</td><td>Sn: 0.6, 0.6 with/without glasses</td></tr>
    </tbody>
  </table>
</div>

<h2>Salary &amp; Pay Scale (7th CPC)</h2>
<p>
  ALP is recruited at <strong>Level-2 (Basic Pay Rs. 19,900)</strong>. However, due to Running Mileage Allowance (KMA - Kilometre Allowance for train driving duties), the actual monthly in-hand salary for an operational Loco Pilot ranges between <strong>Rs. 45,000 and Rs. 58,000 per month</strong>. Technicians are placed in Level-2 (Rs. 19,900 basic) with average gross in-hand pay between Rs. 32,000 and Rs. 38,000 per month.
</p>

<div class="important-note">
  <p><strong>Disclaimer:</strong> Trade specifications, medical vision rules, and examination dates are governed by the Railway Recruitment Boards (RRB). Candidates should read the official notification PDF on regional RRB websites prior to submitting applications.</p>
</div>
`,
  },

  // ═══════════════════════════════════════════════════════════
  // RAILWAY CLUSTER — POST 4
  // ═══════════════════════════════════════════════════════════
  {
    title: "RRB Zone-Wise Vacancy & Cut-Off Strategy: How to Choose the Right RRB Zone for Higher Selection Chances",
    slug: "rrb-zone-wise-vacancy-cut-off-strategy-how-to-choose-rrb-zone",
    excerpt:
      "A strategic guide on how to choose the best RRB Zone (out of 21 Railway Recruitment Boards) for NTPC, Group D, and ALP exams — analysing historical cut-off variations between high-competition zones (Allahabad, Patna, Chandigarh) vs moderate zones (Mumbai, Chennai, Secunderabad, Malda), home state posting preferences, and vacancy-to-candidate ratios.",
    category: "Railway Exam Strategy",
    tags: ["RRB Zones", "Cut-off Strategy", "RRB NTPC", "RRB Group D", "RRB Selection"],
    coverImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "India railway map representing 21 Railway Recruitment Board zones",
    coverImageCaption: "Selecting the right RRB zone can mean a 10–15 mark difference in final qualifying cut-offs.",
    authorName: AUTHOR_NAME,
    authorBio: AUTHOR_BIO,
    readingTime: 11,
    status: "published",
    publishedAt: new Date("2026-09-18T08:00:00Z"),
    seoTitle: "RRB Zone-Wise Vacancy & Cut-Off Strategy: How to Choose the Right RRB Zone",
    seoDescription: "Learn how to choose the right RRB zone for Railway exams (NTPC, Group D, ALP). Analyze historical cut-off data, high vs low competition zones, local language rules, and job transfer policies.",
    seoKeywords: "RRB zone cut off comparison, best RRB zone to apply, lowest cut off RRB zone, RRB NTPC zone wise cut off, RRB Group D zone selection strategy",
    schemaType: "Article",
    faq: [
      {
        question: "Can I apply to multiple RRB zones in the same recruitment notification?",
        answer: "No. Candidates can submit an online application to ONLY ONE Railway Recruitment Board (RRB) for a given central notification (CEN). Submitting multiple applications across different RRB zones leads to rejection of all applications."
      },
      {
        question: "Which RRB zones historically record the highest cut-off marks?",
        answer: "RRB Allahabad (Prayagraj), RRB Patna, RRB Ranchi, RRB Chandigarh, and RRB Ajmer consistently record some of the highest cut-off marks across NTPC, Group D, and ALP exams due to intense regional candidate concentration."
      },
      {
        question: "Can I transfer to my home state after getting selected in a distant RRB zone?",
        answer: "Inter-Railway Zone transfer rules require completing a minimum period of service (typically 5 years) in the initial posting zone, subject to No Objection Certificates (NOC) from both donor and recipient zones. Mutual transfers are faster if you find a matching candidate in your home zone."
      }
    ],
    content: `
<p>
  When applying for major Railway Recruitment Board (RRB) examinations—such as NTPC, Group D, or ALP—candidates face a critical decision before even attempting a single question: <strong>Which RRB zone should I apply for?</strong> Compare current alerts on <a href="/category/railway" title="Zone-Wise Railway Job Notifications"><strong>GovtJobNow Railway Section</strong></a>.
</p>
<p>
  Because candidates can choose only ONE zone out of the 21 regional RRBs, historical data shows that final cut-off scores for identical posts can vary by as much as 10 to 18 marks between high-competition and moderate-competition zones. This guide breaks down the data-driven framework to select your optimal zone.
</p>

<h2>List of 21 Railway Recruitment Boards (RRBs) Across India</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>RRB Zone</th><th>Railway Headquarters Covered</th><th>General Competition Tier</th></tr></thead>
    <tbody>
      <tr><td>RRB Allahabad (Prayagraj)</td><td>North Central Railway (NCR)</td><td>🔴 Tier-1 (Extremely High)</td></tr>
      <tr><td>RRB Patna</td><td>East Central Railway (ECR)</td><td>🔴 Tier-1 (Extremely High)</td></tr>
      <tr><td>RRB Chandigarh</td><td>Northern Railway (NR)</td><td>🔴 Tier-1 (Extremely High)</td></tr>
      <tr><td>RRB Ranchi</td><td>South Eastern Railway (SER)</td><td>🔴 Tier-1 (Extremely High)</td></tr>
      <tr><td>RRB Ajmer</td><td>North Western Railway (NWR)</td><td>🔴 Tier-1 (Extremely High)</td></tr>
      <tr><td>RRB Kolkata</td><td>Eastern Railway (ER) / Metro</td><td>🟠 Tier-2 (High)</td></tr>
      <tr><td>RRB Bhopal</td><td>West Central Railway (WCR)</td><td>🟠 Tier-2 (High)</td></tr>
      <tr><td>RRB Gorakhpur</td><td>North Eastern Railway (NER)</td><td>🟠 Tier-2 (High)</td></tr>
      <tr><td>RRB Muzaffarpur</td><td>East Central Railway (ECR)</td><td>🟠 Tier-2 (High)</td></tr>
      <tr><td>RRB Mumbai</td><td>Western Railway (WR) / Central Railway (CR)</td><td>🟡 Tier-3 (Moderate)</td></tr>
      <tr><td>RRB Chennai</td><td>Southern Railway (SR)</td><td>🟡 Tier-3 (Moderate)</td></tr>
      <tr><td>RRB Secunderabad</td><td>South Central Railway (SCR)</td><td>🟡 Tier-3 (Moderate)</td></tr>
      <tr><td>RRB Bilaspur</td><td>South East Central Railway (SECR)</td><td>🟡 Tier-3 (Moderate)</td></tr>
      <tr><td>RRB Ahmedabad</td><td>Western Railway (WR)</td><td>🟡 Tier-3 (Moderate)</td></tr>
      <tr><td>RRB Bangalore</td><td>South Western Railway (SWR)</td><td>🟡 Tier-3 (Moderate)</td></tr>
      <tr><td>RRB Bhubaneswar</td><td>East Coast Railway (ECoR)</td><td>🟡 Tier-3 (Moderate)</td></tr>
      <tr><td>RRB Guwahati</td><td>Northeast Frontier Railway (NFR)</td><td>🟢 Tier-4 (Lower/Moderate)</td></tr>
      <tr><td>RRB Malda</td><td>Eastern Railway (ER)</td><td>🟢 Tier-4 (Lower/Moderate)</td></tr>
      <tr><td>RRB Siliguri</td><td>Northeast Frontier Railway (NFR)</td><td>🟢 Tier-4 (Lower/Moderate)</td></tr>
      <tr><td>RRB Jammu-Srinagar</td><td>Northern Railway (NR)</td><td>🟢 Tier-4 (Lower/Moderate)</td></tr>
      <tr><td>RRB Thiruvananthapuram</td><td>Southern Railway (SR)</td><td>🟢 Tier-4 (Lower/Moderate)</td></tr>
    </tbody>
  </table>
</div>

<h2>4-Factor Framework for Choosing Your RRB Zone</h2>

<h3>1. Historical Cut-Off Score Analysis</h3>
<p>
  In previous RRB NTPC CBT-1 exams, the UR normalized cut-off for Station Master in RRB Patna hit 77+, whereas in RRB Malda and RRB Muzaffarpur, the corresponding cut-off was around 62–64. That 13-mark difference is often greater than the margin between passing and failing. Always examine 3-cycle historical cut-off tables before submitting your application.
</p>

<h3>2. Post-Wise Vacancy Density</h3>
<p>
  Do not look only at the total vacancies in a zone — look at the vacancy breakdown for YOUR specific post and category (UR, OBC, SC, ST, EWS). A zone with 2,000 total vacancies might have only 20 seats for your specific category and trade, while a zone with 1,200 total vacancies might have 250 seats for your category.
</p>

<h3>3. Language Proficiency &amp; Local Posting Realities</h3>
<p>
  While CBT exams are conducted in 15 official regional languages, daily operations (especially for Station Master, Ticket Collector, Track Maintainer, and Pointsman) require communication in the local regional language of the posting railway division. If you are posted in Southern Railway (RRB Chennai/Thiruvananthapuram) or South Western Railway (RRB Bangalore), basic Tamil, Malayalam, or Kannada communication will be required during official duties.
</p>

<h3>4. Transfer &amp; Seniority Rules</h3>
<p>
  Inter-zone transfers under Indian Railways require completing mandatory service years, plus mutual consent or NOC approval. Getting selected in a distant zone means accepting that you will spend at least 5 to 8 years away from your home state. Balance selection probability with your willingness to relocate long-term.
</p>

<h2>Step-by-Step Decision Matrix</h3>
<ol>
  <li><strong>High Mock Test Scorers (85%+ accuracy):</strong> Choose your home RRB zone or adjacent preferred zone. You can clear even Tier-1 high cut-off benchmarks.</li>
  <li><strong>Moderate Mock Test Scorers (65%–80% range):</strong> Select Tier-3 moderate competition zones (Mumbai, Secunderabad, Chennai, Bilaspur) where high vacancy volume balances out candidate density.</li>
  <li><strong>Borderline Scorers (Focusing on selection above all):</strong> Consider Tier-4 zones (Guwahati, Malda, Siliguri, Jammu) after carefully reviewing local living conditions and transfer norms.</li>
</ol>

<p>
  Combine your zone selection with our <a href="/blog/cbt-exam-time-management-hacks" title="CBT Preparation Hacks"><strong>CBT Exam Preparation Guide</strong></a> to maximize your qualifying score regardless of zone choice.
</p>

<div class="important-note">
  <p><strong>Disclaimer:</strong> Cut-off trends fluctuate in every recruitment cycle depending on shift difficulty, total applicant volume, and revised vacancy numbers. Candidates must verify official zone vacancy tables in the notification on rrbcdg.gov.in before applying.</p>
</div>
`,
  },

  // ═══════════════════════════════════════════════════════════
  // BANKING CLUSTER — POST 5
  // ═══════════════════════════════════════════════════════════
  {
    title: "IBPS PO vs SBI PO 2026: Exam Pattern, Selection Stages, Cut-Offs & In-Hand Salary Comparison",
    slug: "ibps-po-vs-sbi-po-2026-exam-pattern-salary-comparison",
    excerpt:
      "A comprehensive head-to-head comparison between IBPS PO and SBI PO 2026 — covering Prelims & Mains exam patterns, SBI PO Psychometric Test rules, Mains Descriptive paper differences, historical category cut-offs, 4 advance increments salary advantage in SBI, and career growth trajectories.",
    category: "Banking Exam Strategy",
    tags: ["IBPS PO", "SBI PO", "Bank Jobs", "Banking Comparison", "Bank PO Salary"],
    coverImage: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Modern banking hall representing Probationary Officer career in SBI and Public Sector Banks",
    coverImageCaption: "SBI PO and IBPS PO are the two most sought-after officer grade recruitment exams in Indian banking.",
    authorName: AUTHOR_NAME,
    authorBio: AUTHOR_BIO,
    readingTime: 13,
    status: "published",
    publishedAt: new Date("2026-09-19T08:00:00Z"),
    seoTitle: "IBPS PO vs SBI PO 2026: Exam Pattern, Cut-Offs & Salary Comparison",
    seoDescription: "Compare IBPS PO vs SBI PO 2026 — Prelims and Mains patterns, Psychometric test rules, 4 advance increments in SBI salary, category cut-offs, and career progression.",
    seoKeywords: "IBPS PO vs SBI PO 2026, SBI PO salary vs IBPS PO, bank PO exam comparison, SBI PO psychometric test, IBPS PO selection process",
    schemaType: "Article",
    faq: [
      {
        question: "Does SBI PO offer higher basic pay than IBPS PO?",
        answer: "Yes! SBI PO offers 4 advance increments at starting joining time. The starting basic pay of SBI PO is Rs. 41,960 (with 4 advance increments), compared to Rs. 36,000 basic pay for IBPS PO officers under the 11th Bipartite Settlement."
      },
      {
        question: "Is there sectional cut-off in SBI PO Prelims exam?",
        answer: "No. SBI PO removed sectional cut-offs in both Prelims and Mains exams a few years ago. Candidates must clear only the overall total cut-off score. In contrast, IBPS PO enforces BOTH sectional cut-offs in each subject AND an overall total cut-off."
      },
      {
        question: "What is the SBI PO Psychometric Test introduced in selection Phase III?",
        answer: "SBI conducts a mandatory Psychometric Test for candidates shortlisted for Group Exercise & Interview (Phase III). It evaluates personality traits, emotional intelligence, leadership behavior, and job-fit. The test results are shared with the interview panel as a profile report."
      },
      {
        question: "How many attempts are allowed for SBI PO for General category candidates?",
        answer: "General / EWS category candidates are allowed a maximum of 4 attempts for SBI PO Prelims/Mains. OBC candidates get 7 attempts. SC/ST candidates have no limit on number of attempts. IBPS PO has no cap on number of attempts as long as age eligibility is met."
      }
    ],
    content: `
<p>
  Probationary Officer (PO) positions in Public Sector Banks represent the gold standard of financial sector careers in India. The two premier PO exams conducted annually are the <strong>SBI PO</strong> (State Bank of India Probationary Officer) and <strong>IBPS PO</strong> (Institute of Banking Personnel Selection for 11 participating public sector banks). Explore active <a href="/category/banking" title="Bank Recruitment Notifications on GovtJobNow"><strong>Bank Job Notifications</strong></a> on GovtJobNow.
</p>
<p>
  While both roles lead to Assistant Manager (Scale-I) officer cadres, significant differences exist in their exam structures, cut-off criteria, salary packages, and career progression speeds.
</p>

<h2>Head-to-Head Comparison Table</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Feature</th><th>IBPS PO 2026</th><th>SBI PO 2026</th></tr></thead>
    <tbody>
      <tr><td>Conducting Body</td><td>IBPS (For 11 Public Sector Banks)</td><td>State Bank of India (Internal)</td></tr>
      <tr><td>Selection Stages</td><td>Phase-I Prelims, Phase-II Mains + Descriptive, Phase-III Interview</td><td>Phase-I Prelims, Phase-II Mains + Descriptive, Phase-III Psychometric Test + GE + Interview</td></tr>
      <tr><td>Sectional Cut-offs</td><td>✅ Mandatory in both Prelims &amp; Mains</td><td>❌ No Sectional Cut-off (Overall total only)</td></tr>
      <tr><td>Attempt Limits (UR)</td><td>No cap (Subject to age limit 20–30 yrs)</td><td>Maximum 4 attempts</td></tr>
      <tr><td>Starting Basic Pay</td><td>Rs. 36,000</td><td>Rs. 41,960 (Includes 4 Advance Increments)</td></tr>
      <tr><td>Gross In-Hand Salary (X-City)</td><td>~Rs. 54,000 - 58,000 / month</td><td>~Rs. 65,000 - 72,000 / month</td></tr>
      <tr><td>Leased Accommodation Facility</td><td>Rs. 10,000 - 18,000 / month</td><td>Rs. 14,000 - 29,500 / month (Highest in banking)</td></tr>
    </tbody>
  </table>
</div>

<h2>Phase-I: Prelims Exam Pattern Comparison</h2>

<p>
  Both exams conduct a 100-mark, 60-minute online screening test with sectional timing of 20 minutes per subject. Negative marking: 0.25 marks per wrong answer.
</p>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Section</th><th>Questions</th><th>Marks</th><th>Sectional Time</th><th>IBPS vs SBI Difference</th></tr></thead>
    <tbody>
      <tr><td>English Language</td><td>30</td><td>30</td><td>20 Mins</td><td>Identical pattern; SBI focuses more on contextual vocabulary &amp; complex passage inferences.</td></tr>
      <tr><td>Quantitative Aptitude</td><td>35</td><td>35</td><td>20 Mins</td><td>SBI DI is calculation-heavy; IBPS mixes DI with speed maths (quadratic, approximation).</td></tr>
      <tr><td>Reasoning Ability</td><td>35</td><td>35</td><td>20 Mins</td><td>SBI tests multi-variable floor/box puzzles; IBPS puzzles are moderately structured.</td></tr>
      <tr><td><strong>Total</strong></td><td><strong>100</strong></td><td><strong>100</strong></td><td><strong>60 Mins</strong></td><td><strong>SBI has NO sectional cut-off; IBPS enforces sectional pass marks.</strong></td></tr>
    </tbody>
  </table>
</div>

<h2>Phase-II: Mains Exam Pattern Breakdown</h2>

<p>
  Both Mains exams combine Objective Tests with a computer-typed Descriptive Paper (Letter Writing &amp; Essay).
</p>

<h3>Mains Objective Sections Comparison</h3>
<ul>
  <li><strong>Reasoning &amp; Computer Aptitude:</strong> IBPS (45 Qs, 60 Marks, 60 Mins) vs SBI (40 Qs, 50 Marks, 50 Mins).</li>
  <li><strong>Data Analysis &amp; Interpretation:</strong> IBPS (35 Qs, 60 Marks, 45 Mins) vs SBI (30 Qs, 50 Marks, 45 Mins). SBI DI strictly focuses on Data Analysis without straightforward calculation questions.</li>
  <li><strong>General/ Economy/ Banking Awareness:</strong> IBPS (40 Qs, 40 Marks, 35 Mins) vs SBI (50 Qs, 60 Marks, 45 Mins). SBI weighs Banking &amp; Financial Awareness heavily.</li>
  <li><strong>English Language:</strong> IBPS (35 Qs, 40 Marks, 40 Mins) vs SBI (35 Qs, 40 Marks, 50 Mins).</li>
</ul>

<h3>Descriptive Test (Both IBPS &amp; SBI)</h3>
<p>
  Duration: 30 Minutes | Marks: 25 Marks | Format: Typed on Computer Keyboard (1 Essay + 1 Formal/Informal Letter). Must qualify to evaluate objective score in both exams.
</p>

<h2>Phase-III: Interview &amp; Psychometric Evaluation</h2>

<ul>
  <li><strong>IBPS PO Phase-III:</strong> Personal Interview carrying 100 marks (Weightage 80% Mains + 20% Interview for final merit ranking).</li>
  <li><strong>SBI PO Phase-III:</strong> Psychometric Test (Qualifying personality assessment) followed by Group Exercise (20 Marks) and Personal Interview (30 Marks) = 50 Marks total (Weightage 75% Mains + 25% Phase-III for final merit).</li>
</ul>

<h2>Salary &amp; Perks Breakdown (7th CPC / Bipartite Settlement)</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Salary &amp; Allowance Component</th><th>IBPS PO (Participating PSBs)</th><th>SBI PO (State Bank of India)</th></tr></thead>
    <tbody>
      <tr><td>Basic Pay</td><td>Rs. 36,000</td><td>Rs. 41,960 (Initial 4 increments added)</td></tr>
      <tr><td>Dearness Allowance (DA)</td><td>Varies (Quarterly Revision)</td><td>Varies (Quarterly Revision)</td></tr>
      <tr><td>Special Allowance + DA</td><td>~Rs. 8,000 - 10,000</td><td>~Rs. 10,500 - 13,000</td></tr>
      <tr><td>House Rent Allowance (HRA)</td><td>7% - 9% of basic</td><td>7% - 9% or Leased Housing</td></tr>
      <tr><td>Leased Accommodation (Max X-City)</td><td>~Rs. 18,000 / month</td><td>~Rs. 29,500 / month (Direct Landlord payment)</td></tr>
      <tr><td>Medical Benefit</td><td>100% for self, 75% for dependents</td><td>100% self &amp; family + SBI Medical Scheme</td></tr>
      <tr><td>Gross Monthly Salary</td><td>~Rs. 56,000 - 60,000</td><td>~Rs. 68,000 - 75,000</td></tr>
    </tbody>
  </table>
</div>

<p>
  Start your preparation using our strategy guides on <a href="/blog/bank-po-clerk-quantitative-aptitude-data-interpretation-speed-hacks" title="Bank PO Quant Speed Strategy"><strong>Bank PO Quant &amp; DI Speed Strategy</strong></a> and <a href="/blog/score-45-plus-english-competitive-exams" title="English Preparation Hacks"><strong>English Grammar &amp; Vocabulary Strategy</strong></a>.
</p>

<div class="important-note">
  <p><strong>Disclaimer:</strong> Examination structures, scoring methodologies, and pay structures are updated by IBPS and SBI in official advertisements. Candidates should verify the latest notification PDFs on ibps.in and sbi.co.in prior to applying.</p>
</div>
`,
  },

  // ═══════════════════════════════════════════════════════════
  // BANKING CLUSTER — POST 6
  // ═══════════════════════════════════════════════════════════
  {
    title: "SBI Clerk 2026: Prelims & Mains Syllabus, Speed Building Strategy, State-Wise Cut-Off & LPT Rules",
    slug: "sbi-clerk-2026-syllabus-speed-building-state-wise-cutoff-lpt",
    excerpt:
      "Complete preparation guide for SBI Clerk (Junior Associate) 2026 — covering 100-question Prelims & 190-question Mains patterns, speed building drills, state-wise cut-off variations, Language Proficiency Test (LPT) rules, and 7th CPC salary breakdown.",
    category: "Banking Exam Strategy",
    tags: ["SBI Clerk", "Junior Associate", "Bank Clerk Syllabus", "LPT Test", "Speed Building"],
    coverImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Bank customer service representative representing SBI Clerk Junior Associate role",
    coverImageCaption: "SBI Clerk (Junior Associate) is the primary entry-level clerical examination in State Bank of India.",
    authorName: AUTHOR_NAME,
    authorBio: AUTHOR_BIO,
    readingTime: 12,
    status: "published",
    publishedAt: new Date("2026-09-20T08:00:00Z"),
    seoTitle: "SBI Clerk 2026: Prelims & Mains Syllabus, Speed Building, State Cut-Off & LPT",
    seoDescription: "Full SBI Clerk 2026 guide — Prelims (100 Qs) and Mains (190 Qs) syllabus breakdown, speed building hacks, state-wise cut-off dynamics, Language Test (LPT) rules, and salary.",
    seoKeywords: "SBI Clerk 2026, SBI Junior Associate syllabus, SBI Clerk cut off state wise, SBI Clerk prelims pattern, Language Proficiency Test SBI clerk, SBI clerk salary 2026",
    schemaType: "HowTo",
    faq: [
      {
        question: "Is there an Interview round for SBI Clerk selection?",
        answer: "No! There is NO interview for clerical posts in Indian public sector banks including SBI. Selection is based 100% on your score in the Phase-II Mains Examination, subject to passing the Language Proficiency Test (LPT) and medical fitness."
      },
      {
        question: "What happens if a candidate fails the Language Proficiency Test (LPT) in SBI Clerk?",
        answer: "If a candidate is not proficient in the specified local language of the applied state (and did not study the language in 10th or 12th standard), they must appear for the LPT test before joining. Failing the LPT leads to disqualification regardless of Mains score."
      },
      {
        question: "Are there sectional cut-offs in SBI Clerk Prelims or Mains?",
        answer: "No. SBI Clerk has NO sectional cut-off marks in either Prelims or Mains examinations. Candidates must score above the aggregate total cut-off for their applied state and category."
      },
      {
        question: "Can I apply for SBI Clerk from a state other than my home state?",
        answer: "Yes, you can apply from any state. However, you must be fluent in reading, writing, speaking, and understanding the specified official local language of that state. If your 10th/12th mark sheet does not show that language, you will have to clear the LPT test."
      }
    ],
    content: `
<p>
  SBI Clerk (officially designated as Junior Associate Customer Support &amp; Sales) is one of the most widely attempted banking examinations in India. Offering nationwide postings, clear promotion avenues to Officer Scale-I within 3 years, and attractive pay benefits, it attracts over 15 lakh applicants annually. Explore active <a href="/category/banking" title="SBI Recruitment Alerts on GovtJobNow"><strong>SBI Job Alerts</strong></a> on GovtJobNow.
</p>
<p>
  Because clerical recruitment is state-specific and features no interview stage, your final score in the Mains exam determines your selection. This guide explains how to master both Prelims and Mains while navigating state-wise cut-offs and language requirements.
</p>

<h2>SBI Clerk 2026 Selection Process Overview</h2>
<ol>
  <li><strong>Phase-I: Preliminary Examination (100 Marks - Screening):</strong> Qualifies candidates for Mains at approximately 10x the vacancy count.</li>
  <li><strong>Phase-II: Main Examination (200 Marks - Final Merit):</strong> Marks obtained in Mains decide final selection and state merit ranks.</li>
  <li><strong>Specified Local Language Test (LPT):</strong> Mandatory verification of local language proficiency for candidates who did not study the state language in 10th/12th standard.</li>
</ol>

<h2>Phase-I: Prelims Exam Pattern (60 Minutes)</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Section</th><th>Questions</th><th>Marks</th><th>Sectional Timing</th></tr></thead>
    <tbody>
      <tr><td>English Language</td><td>30</td><td>30</td><td>20 Minutes</td></tr>
      <tr><td>Numerical Ability (Quantitative)</td><td>35</td><td>35</td><td>20 Minutes</td></tr>
      <tr><td>Reasoning Ability</td><td>35</td><td>35</td><td>20 Minutes</td></tr>
      <tr><td><strong>Total</strong></td><td><strong>100</strong></td><td><strong>100</strong></td><td><strong>60 Minutes</strong></td></tr>
    </tbody>
  </table>
</div>
<p><em>Negative Marking: 0.25 (1/4th) mark per wrong answer. NO sectional cut-off applies.</em></p>

<h2>Phase-II: Mains Exam Pattern (2 Hours 40 Minutes)</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Section</th><th>Questions</th><th>Marks</th><th>Sectional Timing</th></tr></thead>
    <tbody>
      <tr><td>General / Financial Awareness</td><td>50</td><td>50</td><td>35 Minutes</td></tr>
      <tr><td>General English</td><td>40</td><td>40</td><td>35 Minutes</td></tr>
      <tr><td>Quantitative Aptitude</td><td>50</td><td>50</td><td>45 Minutes</td></tr>
      <tr><td>Reasoning Ability &amp; Computer Aptitude</td><td>50</td><td>60</td><td>45 Minutes</td></tr>
      <tr><td><strong>Total</strong></td><td><strong>190</strong></td><td><strong>200</strong></td><td><strong>160 Minutes</strong></td></tr>
    </tbody>
  </table>
</div>

<h2>Speed Building Strategy for 75+ Score in Prelims</h2>

<p>
  In SBI Clerk Prelims, speed is king. Safe qualifying cut-offs for general category candidates in high-competition states (UP, Bihar, Rajasthan, Delhi, MP) often touch **75 to 80 marks out of 100**. To reach 80+ attempts with 90%+ accuracy:
</p>

<h3>1. Numerical Ability — The 15-Mark Speed Foundation</h3>
<p>
  Spend 0 seconds contemplating: master 15 questions of Speed Maths (Simplification, Approximation, Quadratic Equations, Number Series) within the first 6–7 minutes of the section. Practice 50 simplification questions daily. See techniques in our <a href="/blog/bank-po-clerk-quantitative-aptitude-data-interpretation-speed-hacks" title="Bank Quant DI Speed Hacks"><strong>Bank Quant Speed Hacks Guide</strong></a>.
</p>

<h3>2. Reasoning — High-Yield Puzzles vs Miscellaneous</h3>
<p>
  Attempt Miscellaneous questions first (Inequalities, Syllogisms, Coding-Decoding, Blood Relations, Direction) in 7–8 minutes to lock in 15–18 marks. Then devote the remaining 12 minutes to 3 sets of Puzzles/Seating Arrangements.
</p>

<h3>3. English Language — Accuracy Control</h3>
<p>
  Attempt Error Spotting, Cloze Test, and Sentence Improvement first. Save Reading Comprehension for the last 8 minutes. Avoid wild guessing — negative marking severely impacts tight state cut-offs.
</p>

<h2>Language Proficiency Test (LPT) Rules</h2>
<ul>
  <li>If your 10th or 12th standard mark sheet/certificate shows you studied the official local language of the state applied for, you are **EXEMPT** from LPT.</li>
  <li>If not, SBI conducts an official LPT after Mains results. Candidates are asked to read a passage, write a short paragraph, and converse in the local language.</li>
  <li>Failing LPT results in immediate cancellation of candidature without reassignment to another state.</li>
</ul>

<h2>SBI Clerk Salary Structure (7th CPC / Bipartite Settlement)</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Component</th><th>Amount (X-Metro City)</th><th>Amount (Y/Z City)</th></tr></thead>
    <tbody>
      <tr><td>Starting Basic Pay</td><td>Rs. 19,900 (Includes 2 advance increments for graduates)</td><td>Rs. 19,900</td></tr>
      <tr><td>Dearness Allowance (DA)</td><td>Rs. 9,154</td><td>Rs. 9,154</td></tr>
      <tr><td>House Rent Allowance (HRA)</td><td>Rs. 2,091 (10.5%)</td><td>Rs. 1,600 (8%)</td></tr>
      <tr><td>Transport &amp; Special Allowance</td><td>Rs. 4,100</td><td>Rs. 3,500</td></tr>
      <tr><td><strong>Gross Starting In-Hand Salary</strong></td><td><strong>~Rs. 35,000 - 38,000 / month</strong></td><td><strong>~Rs. 31,000 - 34,000 / month</strong></td></tr>
    </tbody>
  </table>
</div>

<div class="important-note">
  <p><strong>Disclaimer:</strong> State-wise vacancies, language lists, and exam schedules are governed by State Bank of India central recruitment notifications. Verify details directly on sbi.co.in/careers before applying.</p>
</div>
`,
  },

  // ═══════════════════════════════════════════════════════════
  // BANKING CLUSTER — POST 7
  // ═══════════════════════════════════════════════════════════
  {
    title: "How to Crack Bank PO & Clerk Quantitative Aptitude: Data Interpretation & Speed Maths Hacks",
    slug: "bank-po-clerk-quantitative-aptitude-data-interpretation-speed-hacks",
    excerpt:
      "A comprehensive masterclass on cracking Quantitative Aptitude for IBPS PO, SBI PO, IBPS Clerk, and SBI Clerk — covering speed calculation shortcuts for mental arithmetic, 5 core Data Interpretation types (Pie, Bar, Line, Table, Caselet), quadratic equation tricks, and a 50-day practice strategy.",
    category: "Banking Exam Strategy",
    tags: ["Quantitative Aptitude", "Data Interpretation", "Speed Maths", "Bank PO", "Bank Clerk"],
    coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Financial charts and calculations representing Data Interpretation for bank exams",
    coverImageCaption: "Data Interpretation and Speed Maths form 70% of Quantitative Aptitude in banking exams.",
    authorName: AUTHOR_NAME,
    authorBio: AUTHOR_BIO,
    readingTime: 13,
    status: "published",
    publishedAt: new Date("2026-09-21T08:00:00Z"),
    seoTitle: "How to Crack Bank PO & Clerk Quantitative Aptitude: DI & Speed Maths Hacks",
    seoDescription: "Master Quantitative Aptitude for IBPS PO, SBI PO & Clerk. Calculation tricks for Vedic maths, 5 Data Interpretation types (Pie, Bar, Line, Caselet), quadratic equation shortcuts & 50-day plan.",
    seoKeywords: "bank quant strategy, data interpretation for bank po, speed maths calculation tricks, ibps po quant syllabus, sbi clerk quantitative aptitude preparation",
    schemaType: "HowTo",
    faq: [
      {
        question: "How can I increase calculation speed in Bank Quant without using a calculator?",
        answer: "Master three daily foundation habits: (1) Memorise tables up to 30, squares up to 50, and cubes up to 25; (2) Memorise fraction-to-percentage conversions from 1/2 to 1/20; (3) Practice 15 minutes of mental addition/subtraction drills daily using Vedic maths techniques like split and add."
      },
      {
        question: "What is a Caselet DI and how should I approach it in Mains exams?",
        answer: "A Caselet DI presents data in paragraph text format rather than a visual chart. The key to solving Caselet DI is reading the text carefully once and converting it immediately into a structured Venn diagram or tabular matrix before attempting any of the questions."
      },
      {
        question: "Which topics carry the highest weightage in Bank PO Mains Quant section?",
        answer: "In Bank PO Mains (IBPS PO & SBI PO), Data Analysis & Interpretation accounts for 80% to 100% of the Quantitative Aptitude section. High-level Arithmetic-based DIs (Profit & Loss DI, Time & Work DI, Probability DI) and Missing Data DIs dominate."
      }
    ],
    content: `
<p>
  Quantitative Aptitude is widely regarded as the decisive section in competitive banking examinations (IBPS PO, SBI PO, IBPS Clerk, SBI Clerk, and RRB Officer Scale-I). With strict 20-minute sectional timers in Prelims and complex Data Analysis in Mains, success depends on two pillars: **Speed Maths in Prelims** and **Data Interpretation (DI) in Mains**. Compare active opportunities on <a href="/category/banking" title="Banking Job Alerts on GovtJobNow"><strong>GovtJobNow Banking Section</strong></a>.
</p>
<p>
  This guide breaks down proven calculation hacks, systematic approaches to all five major DI chart types, and a 50-day daily practice blueprint.
</p>

<h2>The 4 Pillars of Bank Quantitative Aptitude</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Pillar</th><th>Prelims Weightage</th><th>Mains Weightage</th><th>Primary Goal</th></tr></thead>
    <tbody>
      <tr><td>1. Speed Maths (Simplification/Approximation)</td><td>10–15 Marks</td><td>0–5 Marks</td><td>Max speed (15 Qs in 6 Mins)</td></tr>
      <tr><td>2. Quadratic Equations &amp; Number Series</td><td>5–10 Marks</td><td>5 Marks</td><td>Pattern recognition in &lt;30 secs</td></tr>
      <tr><td>3. Data Interpretation (DI)</td><td>10–15 Marks</td><td>25–35 Marks</td><td>Data extraction &amp; ratio calculation</td></tr>
      <tr><td>4. Arithmetic Word Problems</td><td>10 Marks</td><td>10–15 Marks</td><td>Concept clarity across 8 core chapters</td></tr>
    </tbody>
  </table>
</div>

<h2>Pillar 1: Speed Maths Calculation Hacks</h2>

<h3>1. Fraction to Percentage Table (Memorise 1/2 to 1/20)</h3>
<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Fraction</th><th>Percentage</th><th>Fraction</th><th>Percentage</th></tr></thead>
    <tbody>
      <tr><td>1/6</td><td>16.66%</td><td>1/12</td><td>8.33%</td></tr>
      <tr><td>1/7</td><td>14.28%</td><td>1/13</td><td>7.69%</td></tr>
      <tr><td>1/8</td><td>12.50%</td><td>1/14</td><td>7.14%</td></tr>
      <tr><td>1/9</td><td>11.11%</td><td>1/15</td><td>6.66%</td></tr>
      <tr><td>1/11</td><td>9.09%</td><td>1/16</td><td>6.25%</td></tr>
    </tbody>
  </table>
</div>

<h3>2. Multiplication by 11 Shortcut</h3>
<p>
  To multiply any 2-digit number by 11: Add the two digits together and place the sum in the middle.
  <br>Example: 45 × 11 → (4) [4+5=9] (5) = <strong>495</strong>.
  <br>Example: 78 × 11 → (7) [7+8=15] (8) → Carry 1 to 7 = <strong>858</strong>.
</p>

<h3>3. Squaring Numbers Ending in 5</h3>
<p>
  Multiply the first digit by (first digit + 1) and append '25'.
  <br>Example: 65² → (6 × 7 = 42) + 25 = <strong>4225</strong>.
  <br>Example: 105² → (10 × 11 = 110) + 25 = <strong>11025</strong>.
</p>

<h2>Pillar 2: Quadratic Equations — 30-Second Sign Table Technique</h2>

<p>
  Standard quadratic equation form: <em>ax² + bx + c = 0</em>. Determine the signs of roots instantly using this table:
</p>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Equation Sign (+bx, +c)</th><th>Signs of Roots (x₁, x₂)</th><th>Quick Deduction Rule</th></tr></thead>
    <tbody>
      <tr><td>+b and +c (+ +)</td><td>( - , - )</td><td>Both roots negative</td></tr>
      <tr><td>-b and +c (- +)</td><td>( + , + )</td><td>Both roots positive</td></tr>
      <tr><td>+b and -c (+ -)</td><td>( - , + )</td><td>Larger root negative, smaller positive</td></tr>
      <tr><td>-b and -c (- -)</td><td>( + , - )</td><td>Larger root positive, smaller negative</td></tr>
    </tbody>
  </table>
</div>

<p>
  <em>Shortcut Tip: If both equations have constant terms with negative signs (-c), the relationship between x and y can NEVER be established (CND) without solving! This saves 45 seconds instantly on exam day.</em>
</p>

<h2>Pillar 3: The 5 Core Data Interpretation (DI) Types</h2>

<ol>
  <li><strong>Pie Chart DI:</strong> Total degree = 360° = 100%. Convert degrees to percentage quickly by dividing degrees by 3.6 (e.g., 54° = 54/3.6 = 15%).</li>
  <li><strong>Bar &amp; Line Graph DI:</strong> Focus on calculating ratio of change, percentage increase/decrease: <em>[(New - Old) / Old] × 100</em>.</li>
  <li><strong>Tabular DI:</strong> Always read header footnotes carefully. Check whether values represent absolute numbers, percentages, or ratios.</li>
  <li><strong>Caselet DI (Paragraph Format):</strong> Read text once, construct a empty 3x3 table or Venn diagram, fill in given values, calculate missing fields, then solve questions.</li>
  <li><strong>Arithmetic DI (Mains Level):</strong> DI sets based on Profit &amp; Loss, Time &amp; Work, Simple/Compound Interest, or Probability. Requires deep conceptual mastery of the underlying topic.</li>
</ol>

<h2>50-Day Practice Blueprint</h2>

<div class="table-container my-6">
  <table class="w-full text-left border-collapse my-4">
    <thead><tr><th>Days</th><th>Focus Area</th><th>Daily Target</th></tr></thead>
    <tbody>
      <tr><td>Days 1–10</td><td>Speed Maths Foundation &amp; Mental Calculations</td><td>30 Simplification + 15 Quadratic Eqns daily</td></tr>
      <tr><td>Days 11–20</td><td>Core Arithmetic: Percentage, Ratio, P&amp;L, SI/CI</td><td>20 PYQs per chapter + formula notes</td></tr>
      <tr><td>Days 21–30</td><td>Core Arithmetic: Time &amp; Work, Speed-Distance, Ages, Mixtures</td><td>20 PYQs per chapter</td></tr>
      <tr><td>Days 31–40</td><td>Prelims DI Mastery (Pie, Bar, Line, Table)</td><td>4 DI sets daily under 4-minute timer</td></tr>
      <tr><td>Days 41–50</td><td>Mains Caselet &amp; Arithmetic DI + Full Mock Practice</td><td>2 Mains DI sets + 1 sectional test daily</td></tr>
    </tbody>
  </table>
</div>

<p>
  Pair this practice blueprint with our comparison guide on <a href="/blog/ibps-po-vs-sbi-po-2026-exam-pattern-salary-comparison" title="IBPS PO vs SBI PO Strategy"><strong>IBPS PO vs SBI PO Exam Strategy</strong></a> and our <a href="/blog/cbt-exam-time-management-hacks" title="CBT Speed & Accuracy Hacks"><strong>CBT Speed Hacks</strong></a>.
</p>

<div class="important-note">
  <p><strong>Disclaimer:</strong> Examination trends, section marks, and topic weightages are based on past paper patterns published by IBPS and SBI. Candidates should verify official notification PDFs on ibps.in for recent pattern updates.</p>
</div>
`,
  },
];

async function seedBatch3() {
  console.log("🌱 Starting Phase 2 Blog Content Seeding (4 Railway + 3 Banking)...");

  for (const postData of BATCH3_POSTS) {
    const existing = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, postData.slug));

    if (existing.length > 0) {
      console.log(`🔄 Updating existing blog post: ${postData.title}`);
      await db
        .update(blogPosts)
        .set(postData)
        .where(eq(blogPosts.slug, postData.slug));
    } else {
      console.log(`✨ Inserting new blog post: ${postData.title}`);
      await db.insert(blogPosts).values(postData);
    }
  }

  console.log("✅ Phase 2 Blog Content Seeding Completed Successfully! (7 Posts Added/Updated)");
  process.exit(0);
}

seedBatch3().catch((err) => {
  console.error("❌ Error seeding Phase 2 blog posts:", err);
  process.exit(1);
});
