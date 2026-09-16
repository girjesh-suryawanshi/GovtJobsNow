/**
 * fix-author-and-excerpts.ts
 *
 * One-time script to:
 * 1. Replace the fabricated "Dr. Rajesh Suryavanshi" author with real "Manali Suryawanshi"
 * 2. Fix boilerplate excerpt text on all 30 blog posts
 * 3. Remove the copy-pasted duplicate "Key Exam & Study Preparation Best Practices" block
 *    from all blog post content bodies
 *
 * Run: npx tsx server/scripts/fix-author-and-excerpts.ts
 */

import "dotenv/config";
import { db } from "../db";
import { blogPosts } from "../../shared/schema";
import { eq, like } from "drizzle-orm";

const REAL_AUTHOR_NAME = "Manali Suryawanshi";
const REAL_AUTHOR_BIO =
  "Manali Suryawanshi is a Government Recruitment Researcher and Senior Content Editor at GovtJobNow. She tracks and verifies official recruitment notifications from SSC, UPSC, Railway Recruitment Boards, State PSCs, and Banking sectors to help Indian job aspirants stay informed and apply confidently.";

// Unique, descriptive excerpts for each post (keyed by slug)
const UNIQUE_EXCERPTS: Record<string, string> = {
  "ssc-cgl-preparation-strategy-2026":
    "A structured subject-wise preparation blueprint for SSC CGL 2026 — covering Tier-1 and Tier-2 exam patterns, a daily study schedule, recommended books, and a proven mock test analysis framework for serious aspirants.",
  "ssc-chsl-typing-test-preparation-guide":
    "Everything you need to know about the SSC CHSL mandatory Skill Test — official WPM and KDPH speed standards for LDC, JSA, and DEO posts, full error vs half error deduction rules, and a 30-minute daily practice routine to cross the qualifying threshold.",
  "upsc-ese-vs-gate-exam-comparison":
    "A detailed side-by-side comparison of UPSC Engineering Services Examination (IES) and GATE for engineering graduates — covering selection stages, pay scales, PSU opportunities, work environments, and which path aligns with your career goals.",
  "rrb-ntpc-vs-group-d-salary-comparison":
    "A comprehensive comparison of RRB NTPC and Railway Group D (Level-1) posts — breaking down educational eligibility, salary structures under the 7th Pay Commission, daily work profiles, physical requirements, and departmental promotion pathways via GDCE.",
  "bank-po-vs-bank-clerk-career-comparison":
    "Understand the real differences between Bank PO and Bank Clerk careers in India — officer scale responsibilities versus clerical work profiles, starting salary figures, promotional timelines, and how to decide which is the better fit for your background.",
  "upsc-civil-services-prelims-strategy-guide":
    "A ground-up preparation strategy for UPSC Civil Services Preliminary Examination — covering the GS Paper-1 and CSAT syllabus breakdown, subject-wise priority allocation, revision techniques, and common mistakes that cause avoidable elimination at Prelims.",
  "nps-vs-ops-vs-ups-pension-comparison":
    "A clear comparison of the three pension regimes available to Indian government employees — National Pension System (NPS), Old Pension Scheme (OPS), and the Unified Pension Scheme (UPS) — including guaranteed payout calculations, corpus risks, and policy status as of 2026.",
  "pay-commission-basic-pay-da-hra-explained":
    "A step-by-step breakdown of how a central government salary slip is calculated under the 7th Pay Commission — explaining basic pay, Dearness Allowance percentage, House Rent Allowance categories (X/Y/Z cities), and Transport Allowance components.",
  "high-paying-govt-jobs-after-12th":
    "A categorised guide to the highest-paying government career opportunities available to 12th-pass candidates — covering SSC CHSL, Railway NTPC 10+2 posts, NDA, Coast Guard Navik, IBPS Office Assistant, and State Police Constable recruitments with salary figures.",
  "10th-pass-govt-jobs-without-exam":
    "An overview of government recruitment opportunities available for 10th-pass candidates including India Post GDS, Railway Group D, SSC MTS, state police constable posts, and departmental apprenticeship schemes — with eligibility criteria and application timelines.",
  "govt-job-document-verification-checklist":
    "A practical document verification checklist for government job candidates — covering the exact certificates, ID proofs, category certificates (OBC/SC/ST/EWS), educational marksheets, age proof documents, and photograph specifications needed at DV rounds.",
  "cbt-exam-time-management-hacks":
    "Proven time management techniques for Computer-Based Test (CBT) format examinations — including the 3-round attempt method, subject sequencing strategy, negative marking avoidance discipline, and how to handle difficult questions without losing momentum.",
  "how-to-challenge-exam-answer-keys-refund-guide":
    "A step-by-step guide to filing an official objection against provisional answer keys in SSC, UPSC, RRB, IBPS, and State exam boards — including fee payment rules, acceptable evidence formats, refund conditions for accepted challenges, and important deadlines.",
  "score-45-plus-english-competitive-exams":
    "Targeted preparation strategies for scoring 45+ marks in the English Language section of competitive government exams — covering grammar rules priority list, vocabulary building techniques, reading comprehension approach, and spotting error practice drills.",
  "ex-servicemen-esm-govt-job-reservation-rules":
    "A complete guide to the government job reservation and age relaxation benefits available to Ex-Servicemen (ESM) in India — covering horizontal reservation percentages by post category, computation of military service deduction for age, and priority sectors with dedicated ESM quotas.",
  "top-psu-recruitment-gate-non-gate":
    "A sector-wise overview of PSU Executive Trainee recruitments in India — covering Maharatna and Navratna companies that recruit via GATE score, non-GATE direct recruitment drives, typical GATE cut-off ranges, CTC packages, and the application process.",
  "rrb-alp-cbt-2-technical-paper-strategy":
    "A subject-wise strategy guide for RRB ALP CBT-2 — covering the Part-A common paper and the Part-B trade-specific technical paper, important topics by trade (Electrician, Fitter, Electronics), standard reference books, and how to manage exam time effectively.",
  "current-affairs-preparation-strategy":
    "A realistic daily current affairs preparation routine for competitive government exam aspirants — explaining which sources to follow, how to filter relevant information from noise, monthly revision techniques, and how to connect current events with static GK for General Awareness sections.",
  "govt-job-interview-preparation-tips":
    "Practical advice for central and state government job interviews (SSC CGL, UPSC, Bank PO, PSU GD-PI) — covering personal introduction structure, how to answer 'Why government service?', commonly asked technical and situational questions, and grooming and document checklist.",
  "govt-job-medical-examination-eye-sight-rules":
    "A complete guide to the medical fitness and vision standards required for various central government jobs — covering colour blindness rules, distant and near vision thresholds (6/6, 6/9, 6/12), hearing norms, height and chest standards for police and defence posts.",
  "sbi-po-vs-sbi-clerk-career-guide":
    "A detailed comparison of SBI Probationary Officer and SBI Clerk career tracks — covering IBPS-style selection stages, probation periods, starting CTC, posting flexibility, promotional prospects via JMGS-I to TEGS-VI grades, and which role suits which candidate profile.",
  "state-psc-vs-upsc-which-is-better":
    "A practical guide for aspirants deciding between State PSC (like MPPSC, UPPSC, BPSC, TNPSC) and UPSC Civil Services — covering exam difficulty comparison, job location control, language medium options, promotional ceilings, and how to dual-prepare efficiently.",
  "ibps-rrb-po-clerk-eligibility-guide":
    "A comprehensive eligibility guide for IBPS RRB (Regional Rural Bank) PO and Office Assistant (Multipurpose) recruitment — covering graduate qualification requirements, age limits, language proficiency conditions, selection stages (Preliminary + Mains), and interview norms.",
  "agniveer-army-navy-airforce-comparison":
    "A structured comparison of the Agnipath scheme recruitment across the Indian Army (Agniveer), Indian Navy (Agniveer Vayu), and Indian Air Force (Agniveer) — covering physical standards, training periods, pay structure, Seva Nidhi corpus, and post-service employment opportunities.",
  "isro-scientist-engineer-recruitment-guide":
    "A step-by-step guide to ISRO Scientist/Engineer 'SC' recruitment — covering the GATE-based shortlisting process, interview round weightage, posting locations, Pay Level-10 salary with perks, research divisions, and how to align your engineering specialization with ISRO's active recruitment streams.",
  "drdo-scientist-b-recruitment-process":
    "An end-to-end guide to DRDO Scientist 'B' recruitment via CEPTAM and direct notification — covering educational qualifications, the written test pattern (DRDO Tier-1 and Tier-2), interview process, posting to DRDO labs across India, and Pay Level-10 salary breakdown.",
  "india-post-gds-recruitment-complete-guide":
    "A complete guide to India Post Gramin Dak Sevak (GDS) recruitment — covering merit-based selection without any written exam, qualification norms (10th pass), Dak Sevak category types (BPM, ABPM, MD), remuneration structure, and the official online application process.",
  "central-armed-police-bsf-cisf-crpf-guide":
    "A recruitment overview for Central Armed Police Forces (CAPFs) — covering SSC CPO-based Sub-Inspector recruitment, Constable GD recruitment cycles for BSF, CISF, CRPF, SSB, and ITBP, physical standards, pay scales, posting conditions, and promotional pathways.",
  "neet-ug-alternative-govt-careers-after-pcb":
    "A practical guide to government career alternatives for PCB (Physics, Chemistry, Biology) students who do not qualify NEET — covering ESIC Paramedical, AIIMS nursing officer, Army Medical Corps, state health department recruitment, DRDO life sciences, and research assistant pathways.",
  "forest-guard-environment-ministry-jobs":
    "A guide to government career opportunities in forestry and the environment sector — covering Forest Guard and Forester recruitment by State Forest Departments, SSC Junior Geologist, MoEFCC recruitment, ICFRE scientist positions, and physical fitness requirements for field posts.",
};

// The duplicate block that must be removed from all blog post content
const DUPLICATE_BLOCK_PATTERNS = [
  /\<h2\>Key Exam \&amp; Study Preparation Best Practices\<\/h2\>[\s\S]*?\<\/ul\>/g,
  /\<h2\>Key Exam &amp; Study Preparation Best Practices\<\/h2\>[\s\S]*?\<\/ul\>/g,
  /<h2>Key Exam &amp; Study Preparation Best Practices<\/h2>[\s\S]*?<\/ul>/g,
  /<h2>Key Exam \&amp; Study Preparation Best Practices<\/h2>[\s\S]*?<\/ul>/g,
];

async function fixBlogPosts() {
  console.log("🔧 Starting blog post author and content fix...\n");

  // Get all blog posts
  const posts = await db.select().from(blogPosts);
  console.log(`Found ${posts.length} blog posts to update.\n`);

  let updatedCount = 0;
  let skippedCount = 0;

  for (const post of posts) {
    const updates: Record<string, any> = {};

    // Fix 1: Author name
    if (
      post.authorName?.includes("Dr. Rajesh Suryavanshi") ||
      post.authorName?.includes("Rajesh")
    ) {
      updates.authorName = REAL_AUTHOR_NAME;
      console.log(`  ✅ Author fixed for: "${post.title}"`);
    }

    // Fix 2: Author bio
    if (
      post.authorBio?.includes("Former Central Secretariat") ||
      post.authorBio?.includes("Rajesh")
    ) {
      updates.authorBio = REAL_AUTHOR_BIO;
    }

    // Fix 3: Boilerplate excerpt
    const uniqueExcerpt = post.slug ? UNIQUE_EXCERPTS[post.slug] : null;
    if (
      uniqueExcerpt &&
      post.excerpt?.startsWith("Easy-to-read, step-by-step practical guide on")
    ) {
      updates.excerpt = uniqueExcerpt;
      console.log(`  ✅ Excerpt fixed for: "${post.slug}"`);
    }

    // Fix 4: Remove duplicate "Key Exam Best Practices" section from content
    if (post.content && post.content.includes("Key Exam")) {
      let cleanedContent = post.content;

      // Remove the duplicate block (the entire h2 + ul section)
      // Strategy: find the h2 heading and remove from there to end of the enclosing ul
      const keyExamH2Regex =
        /<h2[^>]*>\s*Key Exam(?:[^<]|<(?!\/h2>))*<\/h2>\s*<p[^>]*>[\s\S]*?<\/ul>/;
      const alternateRegex =
        /<h2>\s*Key Exam &amp; Study Preparation Best Practices\s*<\/h2>[\s\S]*?<\/ul>/;

      if (keyExamH2Regex.test(cleanedContent)) {
        cleanedContent = cleanedContent.replace(keyExamH2Regex, "");
        updates.content = cleanedContent;
        console.log(`  ✅ Duplicate block removed for: "${post.slug}"`);
      } else if (alternateRegex.test(cleanedContent)) {
        cleanedContent = cleanedContent.replace(alternateRegex, "");
        updates.content = cleanedContent;
        console.log(`  ✅ Duplicate block removed (alt pattern) for: "${post.slug}"`);
      }
    }

    // Apply updates if any
    if (Object.keys(updates).length > 0) {
      updates.updatedAt = new Date();
      await db.update(blogPosts).set(updates).where(eq(blogPosts.id, post.id));
      updatedCount++;
    } else {
      skippedCount++;
      console.log(`  ⏭️  No changes needed for: "${post.slug}"`);
    }
  }

  console.log(`\n✅ Done! Updated: ${updatedCount} posts | Skipped: ${skippedCount} posts`);
  console.log(
    "\n🔔 IMPORTANT: Re-seed the database or rebuild Docker to push these changes to production."
  );
  process.exit(0);
}

fixBlogPosts().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
