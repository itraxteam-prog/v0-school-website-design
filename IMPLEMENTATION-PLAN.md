# The Pioneers High School - Implementation Plan

> This document maps every section and page to its file location, describes what each file does,
> and outlines what future edits are needed for each area. Use this as a reference when making changes.

---

## PROJECT STRUCTURE OVERVIEW

```
app/
  layout.tsx                          # Root layout: fonts (Playfair Display + Inter), metadata, viewport
  globals.css                         # Theme tokens, responsive typography scale, animation utilities
  page.tsx                            # Homepage (assembles hero, programs, stats, campus life)
  about/page.tsx                      # About page
  academics/page.tsx                  # Academics page
  admissions/page.tsx                 # Admissions page
  contact/page.tsx                    # Contact page
  portal/
    login/page.tsx                    # Login portal (role selector + form mockup)
    student/
      page.tsx                        # Student dashboard overview
      grades/page.tsx                 # Student grades/report card
      attendance/page.tsx             # Student attendance calendar
      timetable/page.tsx              # Student weekly timetable
      announcements/page.tsx          # Student announcements feed
      profile/page.tsx                # Student profile
    teacher/
      page.tsx                        # Teacher dashboard overview
      classes/page.tsx                # Teacher class management
      attendance/page.tsx             # Teacher attendance marking
      gradebook/page.tsx              # Teacher gradebook
      reports/page.tsx                # Teacher reports
      profile/page.tsx                # Teacher profile
    admin/
      page.tsx                        # Admin dashboard overview
      students/page.tsx               # Admin student directory
      teachers/page.tsx               # Admin teacher directory
      classes/page.tsx                # Admin class management
      analytics/page.tsx              # Admin analytics charts
      reports/page.tsx                # Admin report generation
      users/page.tsx                  # Admin user management

components/
  public/
    navbar.tsx                        # Public site top navigation (responsive + mobile hamburger)
    footer.tsx                        # Public site footer (4-col grid, responsive)
    hero-section.tsx                  # Homepage hero banner
    programs-section.tsx              # Homepage academic programs cards
    stats-section.tsx                 # Homepage animated statistics counters
    campus-life-section.tsx           # Homepage campus life image grid
    count-up.tsx                      # Animated number counter component
  portal/
    dashboard-layout.tsx              # Shared portal layout (sidebar + topbar + main area)
  ui/                                 # shadcn/ui primitives (do not modify)

hooks/
  use-scroll-animation.ts            # IntersectionObserver hook for scroll-triggered animations

public/
  images/
    logo.jpeg                         # School logo
    hero-campus.jpg                   # Hero section background
    campus-life.jpg                   # Campus life section
    library.jpg                       # Library image
    sports.jpg                        # Sports image
```

---

## SECTION 1: GLOBAL THEME & CONFIGURATION

### Files:
- `app/layout.tsx` - Root layout with font loading
- `app/globals.css` - CSS custom properties (design tokens), responsive type scale, animation classes
- `tailwind.config.ts` - Extended theme (font families, custom keyframes/animations)

### Current State:
- Playfair Display (headings) + Inter (body) loaded via next/font/google
- Burgundy (#800020) primary color mapped to HSL token `--primary: 345 100% 25%`
- Responsive heading utilities (.heading-1, .heading-2, .heading-3) with breakpoint scaling
- Scroll animation class (.animate-on-scroll) with prefers-reduced-motion support
- Custom keyframes: fade-in-up, count-up

### Future Edit Guide:
- **To change colors**: Edit `--primary` and related HSL values in `globals.css` `:root`
- **To change fonts**: Update imports in `layout.tsx`, update `--font-*` variables, update `tailwind.config.ts` fontFamily
- **To add new animations**: Add keyframes in `tailwind.config.ts`, add corresponding classes in `globals.css`
- **To add dark mode**: Add `.dark` class selector block in `globals.css` with inverted tokens

---

## SECTION 2: PUBLIC WEBSITE

### 2A. Navbar (`components/public/navbar.tsx`)
- Sticky top navbar with logo, navigation links, and CTA buttons
- Mobile: hamburger icon toggles full-screen overlay menu
- Links: Home, About, Academics, Admissions, Contact, Login Portal

**Future Edits:**
- To add/remove nav links: edit the `navLinks` array
- To change mobile menu style: modify the mobile overlay div
- To add dropdowns: wrap link items in shadcn DropdownMenu
- To add search: insert search input in the desktop navbar center area

### 2B. Footer (`components/public/footer.tsx`)
- 4-column grid (desktop), 2-column (tablet), stacked (mobile)
- School info, quick links, academics links, contact info
- Burgundy divider and bottom copyright bar

**Future Edits:**
- To update links: edit the link arrays in each column
- To add social media icons: add icon buttons in the contact column
- To update contact info: edit the address/phone/email text

### 2C. Homepage (`app/page.tsx`)
- Assembles: HeroSection, ProgramsSection, StatsSection, CampusLifeSection
- Wrapped in Navbar + Footer

**Future Edits:**
- To add sections: create new component in `components/public/`, import in `page.tsx`
- To reorder sections: change the order of components in the JSX
- To add testimonials: create `testimonials-section.tsx`, add between stats and campus life

### 2D. Hero Section (`components/public/hero-section.tsx`)
- Full-width banner with headline, description, two CTA buttons
- Background image placeholder (currently uses hero-campus.jpg)

**Future Edits:**
- To change hero text: edit the h1 and p elements
- To change background: update the Image src or use a CSS background
- To add video hero: replace the Image with a video element
- To add carousel: wrap in a slider component with multiple slides

### 2E. Programs Section (`components/public/programs-section.tsx`)
- 3-column card grid showing academic programs (Primary, Middle, Senior)
- Each card: icon, title, description, feature list
- Hover effect: scale + shadow

**Future Edits:**
- To add programs: add entries to the `programs` array
- To change card layout: modify the Card component structure
- To add links: wrap each card in a Next.js Link

### 2F. Stats Section (`components/public/stats-section.tsx`)
- 4 statistics with animated count-up on scroll
- Uses `CountUp` component and `useScrollAnimation` hook

**Future Edits:**
- To change stats: edit the `stats` array
- To change animation timing: modify CountUp component duration
- To add new counters: add entries to the array

### 2G. Campus Life Section (`components/public/campus-life-section.tsx`)
- Image grid showcasing school life areas
- Hover overlay with title and description

**Future Edits:**
- To change images: update the image placeholders in the `activities` array
- To add activities: add new entries to the array
- To change grid layout: modify the grid classes

### 2H. About Page (`app/about/page.tsx`)
- Mission/Vision cards, school history timeline, leadership team cards

**Future Edits:**
- To update mission/vision: edit the text in the mission/vision cards
- To add leadership members: add entries to the leadership array
- To add gallery: create an image gallery section below leadership

### 2I. Academics Page (`app/academics/page.tsx`)
- Grade-level program cards (Primary, Middle, Secondary)
- Faculty overview cards

**Future Edits:**
- To add subjects: update the curriculum lists in each program card
- To add faculty: add entries to the faculty array
- To add department pages: create sub-routes under /academics/

### 2J. Admissions Page (`app/admissions/page.tsx`)
- Step-by-step admission process (visual stepper)
- Fee structure table
- Important dates
- Inquiry form (visual mockup)

**Future Edits:**
- To update steps: edit the `steps` array
- To update fees: edit the fee table data
- To update dates: edit the dates section
- To make form functional: add form state and API call (backend required)

### 2K. Contact Page (`app/contact/page.tsx`)
- Contact form (visual mockup)
- Contact info cards (address, phone, email, hours)
- Map placeholder
- Department contact list

**Future Edits:**
- To update contact info: edit the info card contents
- To add real map: replace placeholder with Google Maps embed or Mapbox
- To make form functional: add form state and API endpoint (backend required)

---

## SECTION 3: PORTAL LOGIN

### File: `app/portal/login/page.tsx`
- Role selector tabs (Student, Teacher, Admin)
- Login form with email, password, show/hide toggle, remember me
- School logo and branding
- All interactions are visual mockups

**Future Edits:**
- To connect auth: add form submission handler, call auth API, redirect on success
- To add forgot password flow: create `/portal/forgot-password/page.tsx`
- To add registration: create `/portal/register/page.tsx`
- To add OAuth: add social login buttons below the form

---

## SECTION 4: SHARED PORTAL LAYOUT

### File: `components/portal/dashboard-layout.tsx`
- Accepts: sidebarItems, userName, userRole
- Left sidebar with icon + label navigation, burgundy active indicator
- Top bar with logo, search (desktop), notification bell, user avatar dropdown
- Mobile: hamburger toggle for sidebar drawer
- Responsive: sidebar icons-only on tablet, full on desktop, drawer on mobile

**Future Edits:**
- To add notifications panel: create dropdown content for the bell icon
- To add user menu actions: add items to the avatar dropdown
- To add breadcrumbs: insert breadcrumb component above main content
- To add global search: implement search functionality in the top bar
- To change sidebar width: modify the `w-60` class and related responsive classes

---

## SECTION 5: STUDENT DASHBOARD

### 5A. Dashboard (`app/portal/student/page.tsx`)
- Welcome header, 4 summary cards (GPA, Attendance, Assignments, Fees)
- Grade overview table
- Upcoming events list

**Future Edits:**
- To connect real data: replace static arrays with API fetches or props
- To add charts: import Recharts and add performance trend chart
- To add quick actions: add action buttons below summary cards

### 5B. Grades (`app/portal/student/grades/page.tsx`)
- Term selector tabs
- Subject-wise grade table with grades and percentages
- Performance chart placeholder

**Future Edits:**
- To add real charts: replace placeholder with Recharts LineChart
- To add grade history: add semester comparison view
- To export grades: add print/PDF button

### 5C. Attendance (`app/portal/student/attendance/page.tsx`)
- Monthly calendar grid with color-coded days (present/absent/late)
- Summary cards (present count, late count, absent count)
- Legend

**Future Edits:**
- To add month navigation: add prev/next month buttons and state
- To connect real data: replace static calendar array with API data
- To add details: show attendance detail on day click (modal)

### 5D. Timetable (`app/portal/student/timetable/page.tsx`)
- Weekly schedule grid (6 days x time periods)
- Color-coded by subject
- Mobile: shows day tabs for day-by-day view

**Future Edits:**
- To change schedule: edit the `schedule` data object
- To add period details: show teacher name and room on click
- To add week navigation: add prev/next week controls

### 5E. Announcements (`app/portal/student/announcements/page.tsx`)
- Announcement cards with date, title, description, category badges

**Future Edits:**
- To add categories filter: add filter tabs/buttons at top
- To add search: add search input for announcements
- To add pagination: add load more or page controls

### 5F. Profile (`app/portal/student/profile/page.tsx`)
- Student info card (avatar, name, class, roll number)
- Personal details, academic info, guardian info sections

**Future Edits:**
- To add edit mode: add "Edit" button that toggles form inputs
- To add photo upload: add file input for avatar
- To add password change: add password change section

---

## SECTION 6: TEACHER DASHBOARD

### 6A. Dashboard (`app/portal/teacher/page.tsx`)
- Welcome header, assigned classes cards
- Today's schedule, quick action buttons

**Future Edits:**
- To connect real data: replace static arrays with API data
- To add notifications: add recent notification panel
- To add calendar integration: embed mini calendar widget

### 6B. Classes (`app/portal/teacher/classes/page.tsx`)
- Class cards grid with student count and subject
- Expandable student list table per class

**Future Edits:**
- To add class detail page: create `/portal/teacher/classes/[id]/page.tsx`
- To add student profiles: link student names to their profiles
- To add grade entry: add inline grade input in student rows

### 6C. Attendance (`app/portal/teacher/attendance/page.tsx`)
- Class selector, date display
- Student list with present/absent/late toggle buttons
- Submit button (non-functional)

**Future Edits:**
- To make functional: add state management for toggles and API submission
- To add bulk actions: add "Mark All Present" button
- To add history: add link to view past attendance records

### 6D. Gradebook (`app/portal/teacher/gradebook/page.tsx`)
- Editable-style grade table (visual only)
- Student rows x assignment columns
- Save button (non-functional)

**Future Edits:**
- To make editable: add input state for each cell, add save handler
- To add assignment management: add column for new assignments
- To add grade calculations: auto-calculate averages and totals

### 6E. Reports (`app/portal/teacher/reports/page.tsx`)
- Class performance summary with chart placeholders
- Export button (non-functional)

**Future Edits:**
- To add real charts: import Recharts and render actual data
- To add export: implement PDF/CSV generation
- To add filters: add date range and class selectors

### 6F. Profile (`app/portal/teacher/profile/page.tsx`)
- Teacher info card, personal details, teaching info, qualifications

**Future Edits:**
- Same as student profile (edit mode, photo upload, password change)

---

## SECTION 7: ADMIN / PRINCIPAL DASHBOARD

### 7A. Dashboard (`app/portal/admin/page.tsx`)
- KPI cards (total students, teachers, attendance rate, performance)
- Chart placeholders (enrollment, performance trends)
- Teacher performance table
- Recent activity feed

**Future Edits:**
- To add real charts: import Recharts for bar/line charts
- To connect real data: replace static data with API calls
- To add date range filter: add filter controls above charts
- To add export: add dashboard PDF export button

### 7B. Students (`app/portal/admin/students/page.tsx`)
- Searchable student directory table
- Grade/section/status filters
- Pagination controls

**Future Edits:**
- To add student detail: create `/portal/admin/students/[id]/page.tsx`
- To add bulk actions: add select all + bulk action dropdown
- To add export: add CSV/Excel export button
- To connect real data: replace mock data with API

### 7C. Teachers (`app/portal/admin/teachers/page.tsx`)
- Teacher directory table with department filters
- Performance indicators

**Future Edits:**
- Same pattern as students (detail page, bulk actions, export)

### 7D. Classes (`app/portal/admin/classes/page.tsx`)
- Class overview cards with teacher, student count, room

**Future Edits:**
- To add class management: add create/edit class modals
- To add scheduling: add timetable assignment interface

### 7E. Analytics (`app/portal/admin/analytics/page.tsx`)
- Chart placeholder sections for attendance trends, grade distribution, enrollment
- Date range selector

**Future Edits:**
- To add real charts: implement with Recharts (BarChart, LineChart, PieChart)
- To add drill-down: click charts to see detailed breakdowns
- To add comparison: add year-over-year comparison toggle

### 7F. Reports (`app/portal/admin/reports/page.tsx`)
- Report type selector
- Preview area
- Download/Print buttons (non-functional)

**Future Edits:**
- To generate real reports: implement server-side report generation
- To add templates: create report template system
- To add scheduling: add automated report generation

### 7G. User Management (`app/portal/admin/users/page.tsx`)
- User list table with role badges (Student, Teacher, Admin)
- Add/Edit/Delete buttons (non-functional)

**Future Edits:**
- To make functional: add modal forms for add/edit, confirmation for delete
- To add role management: add role assignment/change functionality
- To add audit log: track user management actions

---

## SHARED UTILITIES

### `hooks/use-scroll-animation.ts`
- IntersectionObserver-based hook, adds `.visible` class on scroll into view
- Used by stats section and other scroll-animated elements

### `components/public/count-up.tsx`
- Animated number counter using requestAnimationFrame
- Triggers when element scrolls into view
- Props: end, duration, suffix

---

## IMPLEMENTATION PRIORITY FOR BACKEND INTEGRATION

When ready to add backend functionality, follow this order:

1. **Authentication** - Connect login form to auth provider (Supabase, custom JWT)
2. **Database Schema** - Create tables for students, teachers, classes, grades, attendance
3. **API Routes** - Create Next.js API routes for CRUD operations
4. **Dashboard Data** - Replace static mock data with real database queries
5. **Form Submissions** - Connect contact, admissions, and portal forms
6. **Real-time Updates** - Add WebSocket/SSE for notifications and live data
7. **File Uploads** - Profile photos, documents, report cards
8. **Reports/Export** - PDF generation for report cards, attendance records
