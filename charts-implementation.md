# Dashboard Charts Implementation Plan - The Pioneers High School

This plan outlines the integration of data visualization components to provide clear, actionable insights within the portal dashboards.

## 1. Chart Specifications

### A. Attendance Overview (Bar Chart)
- **Purpose:** Visualize monthly attendance trends for students/teachers.
- **Visuals:** 
    - Bars using the `bg-burgundy-gradient`.
    - Subtle glassmorphism on the chart background.
    - Interactive tooltips with gold/burgundy styling.
- **Context:** Displayed on the main Student and Teacher dashboards.

### B. Grade Trends (Line Chart)
- **Purpose:** Track academic performance over the academic year.
- **Visuals:** 
    - Smooth curve line with a subtle burgundy glow effect.
    - Area fill under the line using a very faint burgundy-to-transparent gradient.
    - Grid lines set to very low opacity for a clean, premium look.
- **Context:** Displayed in the "My Grades" section of the Student Portal.

### C. Fee Clearance / Salary Disbursement (Pie/Donut Chart)
- **Purpose:** Quick visual of financial status.
- **Visuals:** 
    - Elegant donut chart using the school's brand palette (Burgundy, Gold, Slate).
    - Centered percentage text in Playfair Display.

## 2. Technical Implementation Details

### [MODIFY] package.json
- Add `recharts` to dependencies for responsive, React-based charting.

### [NEW] components/portal/dashboard-charts.tsx
- Create a collection of reusable chart components styled specifically for the Pioneers theme.
- Ensure all charts are fully responsive and utilize the `glass-card` utility.

## 3. Files to be Modified / Created
- `package.json`: Add `recharts`.
- `components/portal/dashboard-charts.tsx`: (NEW) Responsive chart library.
- `app/portal/student/page.tsx`: Integrate Attendance and Performance charts.
- `app/portal/teacher/page.tsx`: Integrate Student Performance tracking charts.

---
**Status:** Ready for Implementation.
**Restriction:** Only the above charts will be added. Data will be mocked for visual verification. No external API calls.
