/**
 * Academic constants for assessment periods and year ranges.
 * This is the centralized source of truth for the school's assessment patterns.
 */

// 1. Year Range Generation (2026 - 2075)
export const ACADEMIC_YEARS = Array.from({ length: 50 }, (_, i) => (2026 + i).toString());

// 2. Assessment Period Definitions
// Each month is included for monthly grade and attendance assessments.
// July and December are marked with their term status.
export const ASSESSMENT_MONTHS = [
  { value: "march", label: "March" },
  { value: "april", label: "April" },
  { value: "may", label: "May" },
  { value: "june", label: "June" },
  { value: "july", label: "July (Mid-term)", isMidTerm: true },
  { value: "august", label: "August" },
  { value: "september", label: "September" },
  { value: "october", label: "October" },
  { value: "november", label: "November" },
  { value: "december", label: "December (Final-term)", isFinalTerm: true },
  { value: "january", label: "January" },
  { value: "february", label: "February" },
];

/**
 * Groups months into Terms as per requirements:
 * Term 1: March - July (Mid-term)
 * Term 2: August - December (Final-term)
 */
export const ACADEMIC_TERMS = [
  {
    name: "Term 1 (March - July)",
    slug: "term-1",
    months: ASSESSMENT_MONTHS.slice(0, 5),
    milestone: "mid-term"
  },
  {
    name: "Term 2 (August - December)",
    slug: "term-2",
    months: ASSESSMENT_MONTHS.slice(5, 10),
    milestone: "final-term"
  }
];

// Unified list for Select dropdowns across portals
export const ASSESSMENT_PERIOD_OPTIONS = [
  ...ASSESSMENT_MONTHS.map(m => ({
    value: m.value,
    label: m.label
  })),
  { value: "mid-term", label: "Mid-Term Examination" },
  { value: "final-term", label: "Final Examination" }
];

/**
 * Helper to get the display label for a term value/slug.
 */
export function getTermDisplayLabel(slug: string): string {
  if (!slug) return "N/A";

  // 1. Check if it's a month from ASSESSMENT_MONTHS
  const month = ASSESSMENT_MONTHS.find(m => m.value === slug.toLowerCase());
  if (month) return month.label;

  // 2. Check explicitly for mid-term/final-term
  if (slug.toLowerCase() === "mid-term") return "Mid-Term Examination";
  if (slug.toLowerCase() === "final-term") return "Final Examination";

  // 3. Fallback to title case if not found
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
