You are designing a modern, visually refined school website with a secure portal interface.

IMPORTANT:
This is FRONTEND ONLY.
Do not implement backend logic, authentication logic, or database connections.
Only design UI layouts and components.
All forms, buttons, and interactions are visual mockups only.

────────────────────────
INSTITUTION
────────────────────────
School Name: The Pioneers High School

Type:
Private K-12 academic institution

Brand Personality:
- Structured
- Academic
- Modern
- Trustworthy
- Progressive but disciplined

────────────────────────
COLOR SYSTEM (MANDATORY)
────────────────────────
Primary Background: White (#FFFFFF)
Primary Brand Color: #800020 (Deep Burgundy)
Secondary Background: #F8F8F8 (Light gray for card contrast)
Border/Divider: #E5E5E5 (Neutral gray)
Text Primary: #1A1A1A (Near-black for body text)
Text Secondary: #6B6B6B (Muted gray for metadata/labels)

Accent Usage: Burgundy only for:
- Buttons
- Active states
- Highlights
- Icons
- Links
- Section dividers
- Progress bars
- KPI emphasis

Avoid overly saturated colors.
The aesthetic should feel premium and academic, not playful.

Color Contrast:
- All text must meet WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Interactive elements must have visible focus indicators
- Never place light text on light backgrounds or dark text on dark backgrounds without sufficient contrast

────────────────────────
TYPOGRAPHY SYSTEM
────────────────────────

Font Families (Consistent Across ALL Devices):

Heading Font: "Playfair Display" (Google Fonts)
- Used for all H1, H2, H3 headings
- Conveys academic authority and elegance
- Weights: 600 (semibold), 700 (bold)

Body Font: "Inter" (Google Fonts)
- Used for body text, UI labels, buttons, navigation, form fields
- Highly legible across all screen sizes
- Weights: 400 (regular), 500 (medium), 600 (semibold)

Font Scale (Desktop):
- H1: 48px / 700 weight / line-height 1.2
- H2: 36px / 600 weight / line-height 1.3
- H3: 24px / 600 weight / line-height 1.4
- Body: 16px / 400 weight / line-height 1.6
- Small/Labels: 13px / 500 weight / uppercase / letter-spacing 0.05em
- Captions/Meta: 14px / 400 weight / line-height 1.5

Font Scale (Tablet - 640px to 1024px):
- H1: 36px
- H2: 28px
- H3: 20px
- Body: 16px
- Small/Labels: 12px
- Captions/Meta: 13px

Font Scale (Mobile - below 640px):
- H1: 28px
- H2: 24px
- H3: 18px
- Body: 15px
- Small/Labels: 11px
- Captions/Meta: 13px

Hierarchy Rule:
Clear distinction between:
H1 - Section headers
H2 - Subsections
H3 - Card titles / sub-subsections
Body - Supporting information
Whitespace must be deliberate and structured.

────────────────────────
RESPONSIVE DESIGN (ALL DEVICES)
────────────────────────

Breakpoints:
- Mobile: < 640px (phones)
- Tablet: 640px - 1024px (iPads, tablets)
- Desktop: > 1024px (laptops, monitors)
- Large Desktop: > 1440px (wide monitors)

Container:
- Max-width: 1280px (centered)
- Padding: 16px (mobile), 24px (tablet), 32px (desktop)

Grid System:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns (depending on content)
- Gutter/gap: 16px (mobile), 24px (tablet/desktop)

Navigation Behavior:
- Desktop: Full horizontal navbar with all links visible
- Tablet: Condensed navbar, some items may collapse into a "More" dropdown
- Mobile: Hamburger menu icon that opens a full-screen or slide-in overlay menu with all navigation links stacked vertically

Sidebar Behavior (Portal Dashboards):
- Desktop: Fixed left sidebar, always visible (240px width)
- Tablet: Collapsible sidebar, toggle with hamburger icon, overlay mode
- Mobile: Hidden by default, full-screen slide-in drawer on toggle

Content Reflow:
- Cards stack vertically on mobile, grid on tablet/desktop
- Tables become horizontally scrollable on mobile with a scroll indicator
- Statistics blocks stack 2x2 on tablet, 1 column on mobile, 4 across on desktop
- Charts resize proportionally and remain legible at all sizes

Touch Targets:
- All interactive elements must be minimum 44x44px on touch devices
- Adequate spacing between tap targets (minimum 8px gap)

────────────────────────
SPACING & LAYOUT SCALE
────────────────────────

Use an 8px base spacing scale consistently:
- 4px (xs)
- 8px (sm)
- 16px (md)
- 24px (lg)
- 32px (xl)
- 48px (2xl)
- 64px (3xl)
- 96px (4xl) - section separators

Card Padding: 24px (desktop), 16px (mobile)
Section Vertical Spacing: 64px (desktop), 48px (tablet), 32px (mobile)
Card Border Radius: 12px
Button Border Radius: 8px
Input Border Radius: 8px

────────────────────────
STRUCTURE
────────────────────────

This project has TWO main areas:

1. PUBLIC WEBSITE (Institutional Frontend)
2. SECURE PORTAL INTERFACE (UI MOCKUP ONLY)

────────────────────────
1. PUBLIC WEBSITE
────────────────────────

Pages:
- Homepage
- About
- Academics
- Admissions
- Contact

Homepage Layout:

Hero Section:
- Large academic headline
- Supporting paragraph
- "Apply for Admission" primary button (burgundy, solid)
- "Login Portal" secondary outlined button
- On mobile: buttons stack vertically, full-width

Section 2:
- Academic Programs overview (Cards layout)
- 3 columns on desktop, 2 on tablet, 1 on mobile
- Subtle hover animation on cards (scale 1.02, shadow elevation)
- Burgundy top border on hover

Section 3:
- Statistics block:
  - Years of excellence
  - Student-teacher ratio
  - Graduation rate
  - University placements
- Animated count-up on scroll into view
- 4 across on desktop, 2x2 on tablet, stacked on mobile

Section 4:
- Campus Life / Co-curricular grid
- Elegant hover reveal animation (overlay with text)
- Masonry or uniform grid, responsive

Footer:
- Structured layout (4 columns desktop, 2 tablet, stacked mobile)
- Burgundy divider lines
- Institutional links
- Contact info
- Social media icons

About Page:
- School history timeline
- Mission and vision statement
- Leadership team cards with photos
- Campus gallery/image grid

Academics Page:
- Program listings by grade level
- Curriculum highlights
- Faculty overview cards

Admissions Page:
- Admission process steps (visual timeline or stepper)
- Inquiry form (visual mockup only, no submission logic)
- Fee structure table
- Important dates section

Contact Page:
- Contact form (visual mockup only)
- School address with embedded map placeholder
- Phone, email, and office hours
- Department-specific contact cards

────────────────────────
FORM DESIGN (ALL FORMS ARE VISUAL MOCKUPS ONLY)
────────────────────────

Login Form:
- Username/email field with icon prefix
- Password field with show/hide toggle icon
- "Remember Me" checkbox
- "Login" primary button (burgundy)
- "Forgot Password?" text link
- Clean centered card layout with school logo above

Input Fields:
- Height: 44px (touch-friendly)
- Border: 1px solid #E5E5E5
- Focus state: Burgundy border (#800020), subtle shadow
- Error state: Red border (#DC2626), error message below in red
- Disabled state: Gray background (#F3F3F3), muted text
- Placeholder text: #9CA3AF

Buttons:
- Primary: Burgundy background, white text, 44px height
- Secondary/Outlined: White background, burgundy border, burgundy text
- Hover: Slightly darker shade
- Active/Pressed: Even darker shade with subtle inset
- Disabled: Gray background, muted text, no pointer
- Loading: Spinner icon replacing text or inline spinner

Contact & Admissions Forms:
- Name, email, phone, message fields
- Dropdown for inquiry type
- All fields show validation states visually (success checkmark, error message)

────────────────────────
2. LOGIN PORTAL UI (FRONTEND MOCKUP)
────────────────────────

Login Page:
- Centered card on a subtle gray background
- School logo and name at top
- Login form (see Form Design section)
- "Back to Website" link below
- Responsive: card takes full-width on mobile with padding

Create three dashboard variations.
Each uses the same base layout but different sidebar items.

Base Layout:
- Top navigation bar:
  - School logo (left)
  - Search bar (center, hidden on mobile)
  - Notification bell icon with badge count
  - Profile avatar with dropdown
- Left vertical sidebar:
  - Burgundy active indicator bar (left edge)
  - Icons + labels
  - Hover: light burgundy background tint
  - Active: burgundy left border + bold label
  - Collapsed state on tablet (icons only, expand on hover)
- Main content area:
  - Card-based layout
  - Clean data presentation
  - Structured grid
  - Breadcrumb navigation at top

Use modern SaaS-inspired dashboard styling.

────────────────────────
STUDENT DASHBOARD UI
────────────────────────

Sidebar Items:
- Dashboard
- My Grades
- Attendance
- Timetable
- Announcements
- Profile

Dashboard Layout:
- Welcome header with student name and date
- Summary cards (4 across desktop, 2x2 tablet, stacked mobile):
  - Overall GPA (with circular progress)
  - Attendance percentage (with progress bar)
  - Upcoming assignments count
  - Pending fees indicator
- Grade overview table (horizontally scrollable on mobile)
- Upcoming events timeline (vertical list)

My Grades Page:
- Subject-wise grade cards or table
- Performance trend line chart
- Semester/term selector tabs

Attendance Page:
- Monthly calendar view with color-coded days (present/absent/late)
- Attendance percentage summary
- Calendar adapts to screen size

Timetable Page:
- Weekly schedule grid
- Color-coded by subject
- Swipeable on mobile (day-by-day view)

Design:
- Burgundy used for progress bars and active states
- Clean tables with alternating row backgrounds
- Soft hover interactions on rows

────────────────────────
TEACHER DASHBOARD UI
────────────────────────

Sidebar Items:
- Dashboard
- My Classes
- Attendance
- Gradebook
- Reports
- Profile

Dashboard Layout:
- Welcome header with teacher name
- Assigned classes overview cards (class name, student count, subject)
- Today's schedule summary
- Quick action buttons (Mark Attendance, Enter Grades)

My Classes Page:
- Class cards with student count and subject
- Click to view class detail (student list table)

Attendance Page:
- Class selector dropdown
- Date picker
- Student list with present/absent toggle UI (visual mockup)
- "Submit" button (non-functional)

Gradebook Page:
- Editable-looking grade table UI (static only)
- Student names, assignment columns, grade cells
- Burgundy highlights for editable cells (visual only)
- "Save" button (non-functional)

Reports Page:
- Class performance summary charts
- Export button (non-functional, styled)

Design:
- Functional and structured
- Slightly more data density than student dashboard
- Burgundy highlights for interactive/editable states (visual only)

────────────────────────
PRINCIPAL / ADMIN DASHBOARD UI
────────────────────────

Sidebar Items:
- Dashboard
- Students
- Teachers
- Classes
- Analytics
- Reports
- User Management

Dashboard Layout:
- Institutional statistics overview cards:
  - Total students
  - Total teachers
  - Attendance rate
  - Performance average
- Clean analytics charts (bar chart for enrollment, line chart for performance trends)
- Teacher performance table with ratings
- Recent updates/activity panel

Students Page:
- Searchable student directory table
- Filters: grade, section, status
- Pagination controls

Teachers Page:
- Teacher directory with department filters
- Performance indicators

Analytics Page:
- Full-width charts section
- Attendance trends, grade distribution, enrollment stats
- Date range selector

Reports Page:
- Report type selector
- Preview area
- Download/Print button (non-functional, styled)

User Management Page:
- User list table with role badges (Student, Teacher, Admin)
- Add/Edit/Delete buttons (non-functional, styled)

Design:
- Elegant executive feel
- Structured grid
- Burgundy used sparingly for KPI emphasis

────────────────────────
COMPONENT STATES & FEEDBACK
────────────────────────

Buttons:
- Default / Hover / Active / Disabled / Loading (spinner)

Cards:
- Default / Hover (subtle elevation + shadow)

Table Rows:
- Default / Hover (light background tint) / Selected (light burgundy tint)

Notifications/Toasts:
- Success: Green accent bar
- Error: Red accent bar
- Info: Burgundy accent bar
- Warning: Amber accent bar
- Auto-dismiss after 5 seconds, with close button

Loading States:
- Skeleton placeholders matching content layout (gray shimmer blocks)
- Used on dashboard cards, tables, and charts while "loading"

Empty States:
- Centered illustration placeholder + message text
- Example: "No announcements yet" with a subtle icon
- Action button if applicable ("Create Announcement")

────────────────────────
DATA VISUALIZATION (VISUAL MOCKUPS ONLY)
────────────────────────

Chart Colors:
- Primary series: #800020 (Burgundy)
- Secondary series: #B8860B (Dark goldenrod)
- Tertiary series: #4A5568 (Gray)
- Background grid: #F0F0F0

Bar Charts:
- Rounded top corners (4px radius)
- Hover: tooltip with value
- Responsive: reduce bar count on mobile or horizontal scroll

Line Charts:
- Smooth curves (not jagged)
- Data point dots on hover
- Area fill with 10% opacity of line color

Pie/Donut Charts:
- Max 5 segments
- Legend below on mobile, beside on desktop

Tables:
- Header row: light gray background, bold text
- Alternating row colors: white / #FAFAFA
- Hover: light burgundy tint (#800020 at 5% opacity)
- Sortable columns: arrow indicators in header
- Row height: 48px minimum

Pagination:
- Page numbers with active state (burgundy background)
- Previous/Next arrows
- "Showing 1-10 of 50" text
- Compact on mobile (prev/next only)

────────────────────────
ICON & IMAGE TREATMENT
────────────────────────

Icon Library: Lucide Icons (consistent with shadcn/ui)
- Sizes: 16px (inline), 20px (buttons/nav), 24px (sidebar/dashboard)
- Color: inherit from parent text color, burgundy for active states
- Stroke width: 1.5px (default)

Images:
- Hero images: 16:9 aspect ratio
- Card thumbnails: 4:3 aspect ratio
- Profile avatars: 1:1 (circle, 40px in nav, 80px in profile)
- All images: 8px or 12px border radius (except avatars which are fully rounded)
- Lazy loading on all images below the fold

────────────────────────
BREADCRUMB & NAVIGATION PATTERNS
────────────────────────

Breadcrumbs (Portal Only):
- Format: Dashboard > My Classes > Class 10A
- Separator: "/" or chevron icon
- Last item: bold, non-clickable
- Previous items: burgundy text links
- Hidden on mobile, replaced with a "Back" button

Navigation:
- Active page indicator: burgundy underline (public site) or sidebar bar (portal)
- Smooth scroll for anchor links on public pages
- Page transitions: subtle fade (200ms)

────────────────────────
ANIMATION GUIDELINES
────────────────────────

All animations must perform smoothly on ALL devices (mobile, tablet, desktop).
Use CSS transforms and opacity for GPU-accelerated animations.
Avoid layout-triggering animations (no animating width, height, top, left).

Use refined motion:
- Subtle fade-in sections on scroll (opacity 0 to 1, translateY 20px to 0)
- Duration: 400-600ms for section reveals
- Easing: cubic-bezier(0.4, 0, 0.2, 1) (ease-out)
- Stagger: 100ms delay between consecutive cards
- Sidebar hover highlighting (150ms transition)
- Soft transition when switching dashboard views (200ms fade)
- Count-up animation on statistics (1.5s duration)
- Card hover: scale(1.02) + shadow elevation (200ms)

Performance Rules:
- Use will-change sparingly (only on actively animating elements)
- Reduce animation complexity on mobile (shorter durations, fewer staggered items)
- Respect prefers-reduced-motion: disable all non-essential animations
- No animation should block interaction or delay content visibility

Avoid:
- Overly dynamic effects
- Neon glows
- Harsh drop shadows
- Cartoon-like UI
- Bounce/elastic easing
- Animations longer than 800ms

────────────────────────
ACCESSIBILITY REQUIREMENTS
────────────────────────

WCAG 2.1 AA Compliance:
- Color contrast: 4.5:1 minimum for normal text, 3:1 for large text
- Focus indicators: visible outline (2px burgundy) on all interactive elements
- Keyboard navigation: all interactive elements reachable via Tab key
- Skip to main content link (hidden until focused)
- Proper heading hierarchy (no skipping levels)
- Alt text on all meaningful images
- ARIA labels on icon-only buttons
- Form labels associated with inputs
- Error messages linked to fields via aria-describedby
- Screen reader announcements for dynamic content changes

────────────────────────
PRINT STYLES
────────────────────────

When printing (report cards, grade tables, attendance reports):
- Remove navigation, sidebar, and footer
- Black and white friendly (burgundy converts to dark gray)
- Tables retain borders and structure
- Charts display with high contrast
- Page breaks between major sections
- School logo and name in print header

────────────────────────
OVERALL EXPERIENCE GOAL
────────────────────────

The website should feel like:

"A modern academic institution with discipline, structure, and digital maturity."

The portal UI should feel comparable to a premium SaaS dashboard:
- Clear
- Organized
- Hierarchy-driven
- Visually engaging
- Not bland
- Not overdesigned

The experience must be seamless across ALL devices:
- Phones (iPhone SE to iPhone Pro Max, Android devices)
- Tablets (iPad Mini, iPad Air, iPad Pro, Android tablets)
- Laptops (13" to 16")
- Desktop monitors (up to 1440p and beyond)

Every interaction, animation, and layout must work flawlessly regardless of device or screen size.

────────────────────────
FINAL REMINDER
────────────────────────

FRONTEND ONLY.
No backend or authentication implementation.
No database connections.
No API calls.
Only UI mockups and layout structure.
All forms, buttons, and actions are visual representations only.
