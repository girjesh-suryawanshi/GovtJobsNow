import { db } from "../db";
import { jobs } from "@shared/schema";
import { eq } from "drizzle-orm";

interface RichJobSeed {
  title: string;
  slug: string;
  department: string;
  recruitingOrganization: string;
  jobCategory: string;
  location: string;
  qualification: string;
  positions: string;
  salary: string;
  ageLimit: string;
  applicationFee: string;
  deadline: string;
  postedOn: string;
  sourceUrl: string;
  applyLink: string;
  selectionProcess: string;
  description: string;
  isFeatured?: boolean;
}

const richJobs: RichJobSeed[] = [
  {
    title: "SSC CGL Recruitment 2026 Notification (17,727 Vacancies)",
    slug: "ssc-cgl-recruitment-2026",
    department: "Staff Selection Commission (SSC)",
    recruitingOrganization: "Staff Selection Commission, Govt of India",
    jobCategory: "Central Govt",
    location: "All India",
    qualification: "Graduate Degree in any discipline",
    positions: "17727",
    salary: "Rs. 25,500 - Rs. 1,42,400/- (Pay Level 4 to Level 8)",
    ageLimit: "18-30 Years (Age relaxation as per govt rules)",
    applicationFee: "UR/OBC: Rs. 100 | SC/ST/PwD/Women: Exempted",
    deadline: "2026-10-31",
    postedOn: "2026-09-01",
    sourceUrl: "https://ssc.gov.in",
    applyLink: "https://ssc.gov.in/apply",
    selectionProcess: "Tier-1 CBT, Tier-2 CBT, Document Verification & Medical Exam",
    isFeatured: true,
    description: `### SSC CGL 2026 Recruitment Overview
Staff Selection Commission (SSC) has released the official employment notification for the Combined Graduate Level Examination (CGL) 2026. This mega recruitment drive aims to fill **17,727 vacancies** across Group 'B' and Group 'C' non-technical posts in Ministries, Departments, and Organizations of the Government of India.

### Key Vacancy & Post Details
- **Assistant Section Officer (ASO):** Central Secretariat Service (CSS), MEA, IB, and AFHQ.
- **Inspector of Income Tax:** Central Board of Direct Taxes (CBDT).
- **Central Excise Inspector / Examiner:** Central Board of Indirect Taxes and Customs (CBIC).
- **Assistant Enforcement Officer (AEO):** Directorate of Enforcement (ED).
- **Executive Assistant & Divisional Accountant:** CAG and Offices under CGDA.

### Eligibility Criteria
1. **Nationality:** Must be a Citizen of India, Subject of Nepal/Bhutan.
2. **Educational Qualification:** Bachelor's Degree in any discipline from a recognized University or equivalent institute. For Junior Statistical Officer (JSO), 60% in Mathematics at 12th standard or Bachelor's Degree with Statistics is mandatory.
3. **Age Limit:** 18 to 30 years as of qualifying date. Standard age relaxations apply (OBC: 3 years, SC/ST: 5 years, PwBD: 10 years).

### Salary Structure & Pay Scales
- **Pay Level 8 (Rs. 47,600 to 1,51,100):** Assistant Audit Officer / Assistant Accounts Officer.
- **Pay Level 7 (Rs. 44,900 to 1,42,400):** ASO, Inspector Income Tax, Central Excise Inspector.
- **Pay Level 6 (Rs. 35,400 to 1,12,400):** Executive Assistant, Research Assistant, Divisional Accountant.
- **Pay Level 5 & 4 (Rs. 25,500 to 81,100):** Auditor, Senior Secretariat Assistant, Tax Assistant.

### Selection Process
1. **Tier-1 Computer Based Examination:** Qualifying computer-based test covering Reasoning, General Awareness, Quantitative Aptitude, and English Language (200 Marks).
2. **Tier-2 Computer Based Examination:** Comprehensive merit examination featuring Mathematical Abilities, Reasoning, English Language, General Awareness, and Data Entry Speed Test (DEST).
3. **Document Verification & Medical Evaluation:** Certificate authentication at designated SSC regional headquarters.`
  },
  {
    title: "RRB NTPC Recruitment 2026 (11,558 Graduate & Under-Graduate Posts)",
    slug: "rrb-ntpc-recruitment-2026",
    department: "Indian Railways (RRB)",
    recruitingOrganization: "Railway Recruitment Boards",
    jobCategory: "Railway",
    location: "Pan India (All 21 RRB Zones)",
    qualification: "12th Pass / Graduate in any discipline",
    positions: "11558",
    salary: "Rs. 19,900 - Rs. 35,400/- per month (Level 2 to Level 5)",
    ageLimit: "18-33 Years",
    applicationFee: "UR/OBC: Rs. 500 (Rs. 400 refunded after CBT-1) | SC/ST/Ex-Servicemen: Rs. 250 (Fully refunded)",
    deadline: "2026-09-30",
    postedOn: "2026-09-02",
    sourceUrl: "https://indianrailways.gov.in",
    applyLink: "https://indianrailways.gov.in",
    selectionProcess: "1st Stage CBT, 2nd Stage CBT, Computer Based Aptitude Test (CBAT) / Typing Test, Document Verification",
    isFeatured: true,
    description: `### Railway RRB NTPC Recruitment 2026
Railway Recruitment Boards (RRBs) have officially invited online applications for 11,558 Non-Technical Popular Categories (NTPC) vacancies. Opportunities are available across 21 Railway Recruitment zones for both 12th Pass (Undergraduate) and Degree holders (Graduate candidates).

### Post Breakdown & Vacancies
- **Goods Train Manager (Guard):** 3,144 Posts (Level 5)
- **Senior Clerk cum Typist:** 1,507 Posts (Level 5)
- **Junior Account Assistant cum Typist:** 1,194 Posts (Level 5)
- **Commercial cum Ticket Clerk:** 2,022 Posts (Level 3)
- **Junior Clerk cum Typist & Train Clerk:** 3,691 Posts (Level 2)

### Educational Eligibility & Age Limits
- **Graduate Posts:** Bachelor's Degree from a recognized University. Age: 18 to 36 years.
- **Undergraduate Posts:** 12th (+2 Stage) or equivalent examination with at least 50% marks in aggregate. Age: 18 to 33 years.

### Examination & Selection Pattern
1. **1st Stage CBT (Common for all posts):** 100 Questions (General Awareness: 40, Mathematics: 30, General Intelligence & Reasoning: 30) - 90 Minutes. Negative marking of 1/3rd.
2. **2nd Stage CBT:** 120 Questions tailored per pay level.
3. **Skill Test:** Typing Skill Test (30 wpm in English / 25 wpm in Hindi) or CBAT for Station Master/Traffic Assistant posts.
4. **Document Verification & Medical Test:** Strict Railway medical standards (A-2, A-3, B-2 vision standards).`
  },
  {
    title: "UPSC Civil Services Examination (CSE) 2026 Notification",
    slug: "upsc-civil-services-2026",
    department: "Union Public Service Commission (UPSC)",
    recruitingOrganization: "Union Public Service Commission",
    jobCategory: "UPSC",
    location: "All India",
    qualification: "Bachelor Degree in any discipline",
    positions: "1056",
    salary: "Rs. 56,100/- Basic Pay + DA, HRA, TA (Pay Level 10)",
    ageLimit: "21-32 Years as of 1st August 2026",
    applicationFee: "General/OBC: Rs. 100 | Female/SC/ST/PwBD: Exempted",
    deadline: "2026-11-15",
    postedOn: "2026-08-28",
    sourceUrl: "https://upsc.gov.in",
    applyLink: "https://upsconline.nic.in",
    selectionProcess: "Preliminary Examination (Objective), Mains Examination (Written Descriptive), Personality Test (Interview)",
    isFeatured: true,
    description: `### UPSC IAS / IPS / IFS Notification 2026
Union Public Service Commission (UPSC) has announced the nationwide recruitment notification for Civil Services Examination 2026. This prestigious examination recruits top administrative leaders for IAS, IPS, IFS, IRS, and Central Group A/B Services.

### Services Recruited Through UPSC CSE
- **Indian Administrative Service (IAS)**
- **Indian Police Service (IPS)**
- **Indian Foreign Service (IFS)**
- **Indian Revenue Service (IRS IT & Custom)**
- **Indian Audit and Accounts Service (IA&AS)**
- **Armed Forces Headquarters Civil Service (AFHQ)**

### Detailed Eligibility Standards
- **Educational Qualification:** Candidate must hold a Graduation degree from any recognized university incorporated by an Act of Parliament or State Legislature. Candidates awaiting final semester results are also eligible to apply for Prelims.
- **Age Bounds:** 21 to 32 years. Attempts limit: General: 6 attempts, OBC: 9 attempts, SC/ST: Unlimited attempts up to upper age limit.

### Three-Stage Selection Process
1. **Civil Services Prelims Exam:** GS Paper 1 (200 Marks) + CSAT Paper 2 (200 Marks, qualifying with 33%).
2. **Civil Services Mains Exam:** 9 Written Descriptive Papers totaling 1750 Marks (Essay, GS 1-4, Optional Subject Papers 1-2, and Language papers).
3. **Personality Test (Interview):** 275 Marks interview conducted at Dholpur House, New Delhi.`
  },
  {
    title: "SBI Probationary Officer (PO) Recruitment 2026 (2000 Posts)",
    slug: "sbi-po-recruitment-2026",
    department: "State Bank of India (SBI)",
    recruitingOrganization: "State Bank of India Central Office, Mumbai",
    jobCategory: "Bank",
    location: "Pan India Branches",
    qualification: "Graduation in any discipline",
    positions: "2000",
    salary: "Rs. 41,960 - Rs. 63,840/- per month + Allowances & Benefits",
    ageLimit: "21-30 Years",
    applicationFee: "General/EWS/OBC: Rs. 750 | SC/ST/PwBD: Nil",
    deadline: "2026-10-15",
    postedOn: "2026-09-04",
    sourceUrl: "https://sbi.co.in",
    applyLink: "https://bank.sbi/careers",
    selectionProcess: "Phase-I Preliminary Exam, Phase-II Main Exam (Objective + Descriptive), Phase-III Psychometric Test & Interview",
    isFeatured: true,
    description: `### SBI PO Recruitment 2026 Notification
State Bank of India (SBI), India's largest commercial bank, invites online applications for Probationary Officers (PO). Selected candidates undergo a two-year probation period before confirmation as Scale-I Officers.

### Eligibility & Qualification
- **Educational Qualification:** Graduation degree in any discipline from a recognized University or equivalent qualification recognized by the Central Government.
- **Final Year Students:** Candidates in their final year/semester of graduation can apply provisionally, provided they produce proof of passing the graduation exam on or before the document verification date.

### Selection Scheme
1. **Phase-I: Preliminary Exam:** 100 Marks objective test (English Language: 30, Quantitative Aptitude: 35, Reasoning Ability: 35) - Duration 1 Hour.
2. **Phase-II: Main Exam:** Objective Test (200 Marks) + Descriptive Test (50 Marks - Essay & Letter Writing).
3. **Phase-III: Psychometric & Interview:** Group Exercise (20 Marks) + Interview (30 Marks).`
  },
  {
    title: "ISRO Scientist/Engineer 'SC' Recruitment 2026",
    slug: "isro-scientist-engineer-2026",
    department: "Indian Space Research Organisation (ISRO)",
    recruitingOrganization: "ISRO Centralised Recruitment Board (ICRB)",
    jobCategory: "Central Govt",
    location: "Bengaluru, Sriharikota, Trivandrum, Ahmedabad",
    qualification: "B.E./B.Tech in Mechanical / Electrical / Electronics / Computer Science",
    positions: "320",
    salary: "Rs. 56,100/- Basic Pay (Level 10) + Gross Emoluments ~Rs. 95,000/month",
    ageLimit: "18-28 Years",
    applicationFee: "Rs. 250 | All Female/SC/ST/PwBD: Exempted",
    deadline: "2026-10-20",
    postedOn: "2026-09-03",
    sourceUrl: "https://isro.gov.in",
    applyLink: "https://www.isro.gov.in/careers",
    selectionProcess: "Written Screening Test (GATE pattern) & Personal Interview",
    isFeatured: true,
    description: `### ISRO Scientist Engineer 'SC' Notification 2026
Indian Space Research Organisation (ISRO) under the Department of Space invites premier engineering talent for Scientist/Engineer 'SC' positions in Mechanical, Electronics, Electrical, and Computer Science disciplines.

### Eligibility Criteria
- **Educational Qualification:** B.E / B.Tech or equivalent qualification in First Class with an aggregate minimum of 65% marks or CGPA 6.84/10.
- **Age Limit:** Upper age limit is 28 years as of closing date of online application. Relaxations applicable for ex-servicemen and PwBD candidates.`
  },
  {
    title: "DRDO CEPTAM 11 Recruitment 2026 (Senior Technical Assistant & Technician)",
    slug: "drdo-ceptam-11-recruitment-2026",
    department: "Defence Research and Development Organisation (DRDO)",
    recruitingOrganization: "DRDO CEPTAM",
    jobCategory: "Defence",
    location: "DRDO Labs Across India",
    qualification: "10th Pass + ITI / Diploma in Engineering / B.Sc",
    positions: "1900",
    salary: "Rs. 19,900 - Rs. 1,12,400/- per month (Level 2 to Level 6)",
    ageLimit: "18-28 Years",
    applicationFee: "UR/OBC: Rs. 100 | SC/ST/PwBD/Women: Nil",
    deadline: "2026-11-05",
    postedOn: "2026-09-05",
    sourceUrl: "https://drdo.gov.in",
    applyLink: "https://drdo.gov.in/drdo/ceptam-notices",
    selectionProcess: "Tier-1 CBT (Screening/Selection) & Tier-2 Trade Test / Skill Test",
    isFeatured: true,
    description: `### DRDO CEPTAM-11 Recruitment 2026
Centre for Personnel Talent Management (CEPTAM) of DRDO invites online applications for Senior Technical Assistant-B (STA-B) and Technician-A (Tech-A) cadres across premier defence laboratories.

### Cadre Wise Qualification
- **STA-B (Level 6):** Diploma in Engineering or B.Sc Degree in relevant subject area (Computer Science, Electronics, Mechanical, Chemistry, Physics).
- **Tech-A (Level 2):** 10th Pass (Matriculation) + ITI Certificate in relevant trade (Fitter, Electrician, Machinist, Turner, Welder, COPA).`
  },
  {
    title: "Indian Post GDS Recruitment 2026 (Gramin Dak Sevak 44,228 Posts)",
    slug: "indian-post-gds-recruitment-2026",
    department: "Department of Posts (India Post)",
    recruitingOrganization: "Ministry of Communications, Govt of India",
    jobCategory: "Central Govt",
    location: "All 23 Postal Circles (Pan India)",
    qualification: "10th Pass (Matriculation) with Mathematics & English",
    positions: "44228",
    salary: "BPM: Rs. 12,000 - 29,380/- | ABPM/Dak Sevak: Rs. 10,000 - 24,470/-",
    ageLimit: "18-40 Years",
    applicationFee: "General/OBC: Rs. 100 | Female/SC/ST/Transgender/PwD: Nil",
    deadline: "2026-10-10",
    postedOn: "2026-09-01",
    sourceUrl: "https://indiapostgdsonline.gov.in",
    applyLink: "https://indiapostgdsonline.gov.in",
    selectionProcess: "Direct Merit List based on 10th Standard Marks (No Examination)",
    isFeatured: true,
    description: `### India Post Gramin Dak Sevak (GDS) Notification 2026
Department of Posts releases the notification for Branch Postmaster (BPM), Assistant Branch Postmaster (ABPM), and Dak Sevaks across all postal circles in India.

### Key Highlights
- **Direct Merit Selection:** Candidates are selected automatically based on 10th class marks. No written exam or interview.
- **Local Language Proficiency:** Candidate must have studied the local language of the respective postal circle up to 10th standard.
- **Computer Knowledge:** Basic computer training certificate of minimum 60 days required.`
  },
  {
    title: "SSC GD Constable Recruitment 2026 (39,481 Posts in CAPFs, SSF, Rifleman)",
    slug: "ssc-gd-constable-recruitment-2026",
    department: "Staff Selection Commission & MHA",
    recruitingOrganization: "Staff Selection Commission",
    jobCategory: "Defence",
    location: "All India",
    qualification: "10th Pass (Matriculation) from recognized Board",
    positions: "39481",
    salary: "Rs. 21,700 - Rs. 69,100/- per month (Pay Level 3)",
    ageLimit: "18-23 Years",
    applicationFee: "UR/OBC: Rs. 100 | Women/SC/ST/Ex-Servicemen: Exempted",
    deadline: "2026-10-25",
    postedOn: "2026-09-02",
    sourceUrl: "https://ssc.gov.in",
    applyLink: "https://ssc.gov.in",
    selectionProcess: "Computer Based Examination (CBE), Physical Efficiency Test (PET), Physical Standard Test (PST) & Medical Exam",
    isFeatured: true,
    description: `### SSC GD Constable Recruitment 2026
Staff Selection Commission conducts the open competitive examination for recruitment of Constables (General Duty) in BSF, CISF, CRPF, SSB, ITBP, AR, and SSF.

### Eligibility Criteria
- **Educational Qualification:** 10th Class pass from a recognized Board/University.
- **Physical Standards:** Height: Male 170 cm, Female 157 cm. Chest (Male): 80 cm (+5 cm expansion).
- **NCC Certificate Bonus:** NCC 'C' (5% extra marks), NCC 'B' (3%), NCC 'A' (2%).`
  },
  {
    title: "Indian Railway Apprentice Recruitment 2026 (5,600+ Vacancies)",
    slug: "railway-apprentice-recruitment-2026",
    department: "Indian Railways (RRC)",
    recruitingOrganization: "Railway Recruitment Cell (RRC)",
    jobCategory: "Railway",
    location: "Western, Eastern, Southern & Northern Railway Divisions",
    qualification: "10th Pass (Min 50% Marks) + ITI NCVT/SCVT Certificate",
    positions: "5600",
    salary: "Stipend Rs. 7,000 - Rs. 9,600/- per month during 1 Year Training",
    ageLimit: "15-24 Years",
    applicationFee: "Rs. 100 | SC/ST/PWD/Female: Nil",
    deadline: "2026-10-05",
    postedOn: "2026-09-03",
    sourceUrl: "https://indianrailways.gov.in",
    applyLink: "https://indianrailways.gov.in",
    selectionProcess: "Merit List based on Average of 10th Marks & ITI Percentage (No Written Exam)",
    isFeatured: false,
    description: `### Railway RRC Act Apprentice Recruitment 2026
Indian Railways invites applications for Trade Apprentice training under Act Apprentice Rules. Candidates completing Railway Apprenticeship receive 20% reservation in Group D (Level 1) recruitment.`
  },
  {
    title: "IBPS PO Recruitment 2026 (3,955 Vacancies in Participating Banks)",
    slug: "ibps-po-recruitment-2026",
    department: "Institute of Banking Personnel Selection (IBPS)",
    recruitingOrganization: "IBPS & 11 Participating Public Sector Banks",
    jobCategory: "Bank",
    location: "Pan India",
    qualification: "Graduation in any discipline",
    positions: "3955",
    salary: "Rs. 36,000 - Rs. 63,840/- per month + HRA, DA, CCA",
    ageLimit: "20-30 Years",
    applicationFee: "General/OBC: Rs. 850 | SC/ST/PWD: Rs. 175",
    deadline: "2026-09-28",
    postedOn: "2026-08-30",
    sourceUrl: "https://ibps.in",
    applyLink: "https://ibps.in",
    selectionProcess: "Preliminary Examination, Main Examination & Common Interview",
    isFeatured: false,
    description: `### IBPS PO/MT CRP XIV Notification 2026
IBPS conducts the common recruitment process for Probationary Officers/Management Trainees across Bank of Baroda, Canara Bank, Punjab National Bank, Union Bank, and 7 other public sector banks.`
  }
];

async function seedRichJobs() {
  console.log("🌱 Starting rich government job seeding...");
  let count = 0;

  for (const job of richJobs) {
    try {
      const existing = await db.select().from(jobs).where(eq(jobs.slug, job.slug));
      if (existing.length === 0) {
        await db.insert(jobs).values({
          ...job,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`  ✅ Inserted job: ${job.title}`);
        count++;
      } else {
        await db.update(jobs).set({
          ...job,
          updatedAt: new Date()
        }).where(eq(jobs.slug, job.slug));
        console.log(`  🔄 Updated job: ${job.title}`);
        count++;
      }
    } catch (err) {
      console.error(`  ❌ Failed to seed job ${job.slug}:`, err);
    }
  }

  console.log(`✨ Seeding finished! Total jobs processed: ${count}`);
}

seedRichJobs().catch((err) => {
  console.error("❌ Fatal error seeding rich jobs:", err);
  process.exit(1);
});
