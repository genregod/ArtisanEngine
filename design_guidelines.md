# SmartArt AIO Design Guidelines

## Design Framework
Modern Productivity System balancing creative aesthetics with workflow efficiency. Principles: clarity over decoration, visual hierarchy for task prioritization, seamless workflow transitions, celebratory achievement moments.

---

## Color System

### Primary Palette
- **Royal Purple** `#6B46C1` - Primary actions, active states, brand
- **Light Purple** `#A855F7` - Secondary actions, hover states  
- **Pink Accent** `#EC4899` - Success, notifications, CTAs, engagement metrics

### Neutrals
- Background: `#F8FAFC` | Cards: `#FFFFFF`
- Text Primary: `#1E293B` | Secondary: `#64748B`
- Borders: `#E2E8F0`

### Semantic
Success `#10B981` | Warning `#F59E0B` | Error `#EF4444` | Info `#3B82F6`

### Dark Mode
BG `#0F172A` | Cards `#1E293B` | Text `#F1F5F9` | Borders `#334155` (maintain accent colors)

---

## Typography

**Fonts:** Inter (UI), Poppins (Display/Headings), JetBrains Mono (Code/Captions)

### Scale
- Hero: Poppins 48px/56px (32px/40px mobile)
- H1: 32px/40px | H2: 24px/32px | H3: 20px/28px
- Body Large: Inter 16px/24px | Body: 14px/20px
- Small: 12px/16px | Tiny: 11px/16px

**Weights:** 400 (body), 500 (emphasis), 600 (subheads), 700 (headlines)

---

## Layout

### Spacing (Tailwind)
2, 4, 8, 12, 16, 24, 32 units
- Micro: `p-2` (icons) | Small: `p-4` (buttons, fields) 
- Medium: `p-8` (sections) | Large: `p-12` (breaks) | XL: `p-16/24` (page margins)

### Grid
- Dashboard: 12-col (desktop) → 1-col (mobile)
- Calendar: 7-col (days) with flexible rows
- Content Cards: 3-col (lg) → 2-col (md) → 1-col (mobile)
- Sidebar: 280px desktop, slide-over mobile

### Containers
App: `max-w-screen-2xl` (1536px) | Content: `max-w-7xl` (1280px) | Forms: `max-w-2xl` | Text: `max-w-prose`

---

## Components

### Navigation
**Top Bar:** 64px height, white, logo left, quick actions center, user/notifications right
**Sidebar:** 280px (72px collapsed), purple left border + light purple bg for active state

### Cards
**Standard:** White, `rounded-xl`, `shadow-sm`, `p-6`, hover `shadow-md`
**Social Post:** Platform badge, 16:9 image, truncated caption, schedule footer, colored status dot
**Task:** Large checkbox left, priority flag, relative due date, assignee avatar

### Forms
**Inputs:** 44px height, `rounded-lg`, 1px border, 2px purple focus ring
**Text Areas:** 120px min-height, character counter, platform preview, monospace
**Dropdowns:** Headless UI styled, purple checkmark, search for long lists
**Date Picker:** Calendar popover, time slots, timezone indicator
**Upload:** Dashed border, 200px min-height, drag-drop animation, preview thumbnails

### Calendar
**Monthly:** 7-col grid, 120px min-height cells, posts as colored pills, drag-drop with ghost preview, purple ring for today
**Weekly/Daily:** Hourly Y-axis, platform color coding, inline editing

### Buttons
**Primary:** Purple bg, white text, `px-6 py-3`, `rounded-lg`, hover darker + lift
**Secondary:** Purple outline, hover light purple bg
**Ghost:** Purple text, hover light purple bg
**Icon:** 40x40px, `rounded-full`, gray bg, hover purple bg

### Data Visualization
**Stat Cards:** Large number (Poppins bold), label, trend arrow + %
**Charts:** Purple/pink gradients, clean grid, smooth line curves, stacked bars for platform comparison

### Modals & Feedback
**Modal:** 600px max, `rounded-xl`, 50% black blur backdrop, header with close, right-aligned actions
**Toasts:** Bottom-right, slide up, color-coded (green/red), 5s auto-dismiss
**Tooltips:** Dark bg, white text, arrow, 300ms delay, 200px max-width

---

## Interactions

### Transitions
200ms micro-interactions, 300ms major changes, `ease-in-out` (respect `prefers-reduced-motion`)

### Animations
- Calendar drag: 150ms smooth with ghost
- Card hover: `translateY(-2px)` + shadow
- Loading: Purple spinner, skeleton screens
- Success: Optional confetti on publish
- Page: 200ms fade
- Checkbox: Fill + checkmark draw
- Toggle: 200ms slide
- Dropdown: Scale + fade from anchor

---

## Responsive

**Breakpoints:** Mobile <768px | Tablet 768-1024px | Desktop >1024px

### Mobile Adaptations
- Bottom tab bar (Calendar, Content, Tasks, Profile)
- Full-screen sidebar drawer
- Full-width cards, 48px min touch targets
- Calendar → list view with date picker
- Full-screen modals
- Stacked form labels
- Fixed bottom buttons with safe area padding

---

## Platform Features

### Content Previews
**Simulators:** Instagram (square + UI), TikTok (9:16 + UI), Facebook (1:1/16:9), YouTube Shorts (vertical)
**Preview Toggle:** Platform icon tabs, live caption updates, per-platform character limits

### AI Tools
**Caption Generator:** Theme input + tone selector → 3-5 card variations → copy/edit/save actions, A/B badges
**Video Analyzer:** Upload + progress → AI processing timer → timeline with cut markers → platform-specific export

---

## Accessibility (WCAG AA)

- 4.5:1 minimum contrast
- Full keyboard navigation (tab order, escape, arrow keys in calendar)
- Screen reader labels on all interactive elements
- 2px purple focus ring
- `prefers-reduced-motion` support
- Icons + text (not color alone)
- 44x44px minimum touch targets (mobile)

---

## Visual Assets

### Empty States
- Dashboard: Purple gradient musical waveform (240px height)
- Calendar: Minimalist calendar icon + message
- Library: Upload cloud + encouraging copy
- Analytics: Chart icon + "Publish to see insights"

### Icons
Heroicons (outlined default, solid for active), 20px standard (24px emphasis, 16px compact), purple for primary actions

### Platform Logos
Official brand colors (Instagram gradient, TikTok cyan/pink, Facebook blue, YouTube red), 24x24px badges, 40x40px previews

---

**Implementation Priority:** Navigation → Cards → Forms → Calendar → Analytics → AI Tools