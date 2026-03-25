import { searchJobsSchema } from "../shared/schema";
import { normalizeFilters } from "../shared/filters";

const query = { postedDate: "today" };
try {
  const parsed = searchJobsSchema.parse(query);
  console.log("Parsed:", parsed);
  const normalized = normalizeFilters(parsed);
  console.log("Normalized:", normalized);
} catch (e) {
  console.log("Error:", e);
}
