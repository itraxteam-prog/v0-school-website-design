/**
 * Academic utility functions to ensure consistent grading and promotion logic
 * across all portals (Admin, Teacher, Student, Parent).
 */

export interface GradeBadge {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    color?: string;
}

/**
 * Calculates a letter grade or GPA based on the marks and the institution's grading system setting.
 */
export function calculateGrade(marks: number, system: string = "percentage"): string {
    if (system === "gpa") {
        if (marks >= 90) return "4.0";
        if (marks >= 80) return "3.5";
        if (marks >= 70) return "3.0";
        if (marks >= 60) return "2.5";
        if (marks >= 50) return "2.0";
        if (marks >= 40) return "1.0";
        return "0.0";
    }

    // Default: Percentage-based Letter Grades
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 40) return "D";
    return "F";
}

/**
 * Returns badge configuration for a given mark.
 */
export function getGradeBadge(marks: number): GradeBadge {
    if (marks >= 80) return { label: calculateGrade(marks), variant: "default" };
    if (marks >= 60) return { label: calculateGrade(marks), variant: "secondary" };
    if (marks >= 40) return { label: calculateGrade(marks), variant: "outline" };
    return { label: calculateGrade(marks), variant: "destructive" };
}

/**
 * Determines if a student is eligible for promotion based on the institutional threshold.
 */
export function isEligibleForPromotion(averageMarks: number, threshold: number = 40): boolean {
    return averageMarks >= threshold;
}

/**
 * Maps term structure setting values to human-readable names.
 */
export function getTermStructureLabel(value: string): string {
    switch (value) {
        case "2": return "Semester System";
        case "3": return "Trimester System";
        case "12": return "Monthly Assessment";
        default: return "Standard System";
    }
}
