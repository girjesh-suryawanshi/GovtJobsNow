import { UserProfile } from "@/hooks/use-user-profile";
import { Job } from "@/types/job";

export interface EligibilityResult {
  isEligible: boolean;
  reason?: string;
  matchScore: number; // 0 to 100
}

export function checkEligibility(job: Job, profile: UserProfile | null): EligibilityResult {
  if (!profile) {
    return { isEligible: true, matchScore: 0 }; // Default when no profile
  }

  let isEligible = true;
  let reasons: string[] = [];
  let matchScore = 100;

  // 1. Age Calculation
  const birthDate = new Date(profile.dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // Parse Age Limit from job (e.g., "18-27 years" or "Max 30 years")
  const ageLimitStr = job.ageLimit || "";
  const ageMatch = ageLimitStr.match(/(\d+)\s*-\s*(\d+)/);
  const maxAgeMatch = ageLimitStr.match(/max\s*(\d+)/i) || ageLimitStr.match(/upto\s*(\d+)/i) || ageLimitStr.match(/(\d+)\s*years/i);

  if (ageMatch) {
    const min = parseInt(ageMatch[1]);
    const max = parseInt(ageMatch[2]);
    // Apply category relaxation (Simplified: OBC +3, SC/ST +5)
    let dynamicMax = max;
    if (profile.category === "OBC") dynamicMax += 3;
    if (profile.category === "SC" || profile.category === "ST") dynamicMax += 5;

    if (age < min) {
      isEligible = false;
      reasons.push(`Minimum age required is ${min} (You are ${age})`);
      matchScore -= 40;
    } else if (age > dynamicMax) {
      isEligible = false;
      reasons.push(`Maximum age limit is ${dynamicMax} for ${profile.category} (You are ${age})`);
      matchScore -= 40;
    }
  } else if (maxAgeMatch) {
    const max = parseInt(maxAgeMatch[1]);
    let dynamicMax = max;
    if (profile.category === "OBC") dynamicMax += 3;
    if (profile.category === "SC" || profile.category === "ST") dynamicMax += 5;

    if (age > dynamicMax) {
      isEligible = false;
      reasons.push(`Age exceeds limit of ${dynamicMax} for ${profile.category}`);
      matchScore -= 40;
    }
  }

  // 2. Qualification Check (Simplified Keyword Matching)
  const jobQual = (job.qualification || "").toLowerCase();
  const userQual = profile.qualification.toLowerCase();

  // Basic hierarchy: PhD > Post Graduate > Graduate > Diploma > 12th > 10th
  const hierarchy = ["10th", "12th", "diploma", "graduate", "post graduate", "phd"];
  const userIndex = hierarchy.findIndex(h => userQual.includes(h));
  
  // If job specifies a qualification that is higher than user's
  let jobRequiredIndex = -1;
  for (let i = hierarchy.length - 1; i >= 0; i--) {
    if (jobQual.includes(hierarchy[i])) {
      jobRequiredIndex = i;
      break;
    }
  }

  if (jobRequiredIndex > userIndex) {
    isEligible = false;
    reasons.push(`Higher qualification required: ${job.qualification}`);
    matchScore -= 50;
  }

  return {
    isEligible,
    reason: reasons.join(". "),
    matchScore: Math.max(0, matchScore)
  };
}
