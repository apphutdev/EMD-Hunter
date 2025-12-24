# EMD Hunter - Frontend UI Business DNA

> A comprehensive design system document for recreating the EMD Hunter UI in any application.

---

## 1. Brand Identity

### Name & Tagline
- **App Name**: EMD Hunter
- **Tagline**: "Hunt Killer EMD Opportunities"
- **Archetype**: Electric & Neon / Cyberpunk Analyst
- **Emotional Tone**: "You are a hacker finding glitches in the matrix. The tool is your weapon."

### Logo Concept
- Target/crosshair icon inside a rounded square
- Icon color: Primary green (#00FF94)
- Background: Semi-transparent primary with glow effect

---

## 2. Color System

### Core Palette

```css
:root {
  /* Backgrounds */
  --background: #030304;           /* Main app background - near black */
  --surface: #0A0A0B;              /* Card/elevated surfaces */
  --surface-highlight: #121214;    /* Hover states, highlights */
  
  /* Borders */
  --border: #1F1F22;               /* Default borders */
  --border-subtle: rgba(255,255,255,0.08);  /* Subtle separators */
  
  /* Primary - Neon Green */
  --primary: #00FF94;              /* Main accent, CTAs, highlights */
  --primary-dim: rgba(0, 255, 148, 0.1);    /* Primary backgrounds */
  --primary-glow: rgba(0, 255, 148, 0.3);   /* Glow effects */
  
  /* Secondary - Cyan */
  --secondary: #00E0FF;            /* Secondary accent, AI features */
  --secondary-dim: rgba(0, 224, 255, 0.1);
  
  /* Destructive - Hot Pink */
  --destructive: #FF0055;          /* Errors, delete actions */
  
  /* Text */
  --text-main: #EDEDED;            /* Primary text */
  --text-muted: #888888;           /* Secondary text, labels */
  
  /* Kill Score Colors */
  --score-low: #FF0055;            /* 0-39: Challenging */
  --score-medium: #FFD600;         /* 40-69: Good Potential */
  --score-high: #00FF94;           /* 70-100: Excellent */
}
```

### Tailwind CSS Variables

```css
@layer base {
  :root {
    --background: 0 0% 1%;
    --foreground: 0 0% 93%;
    --card: 240 4% 4%;
    --card-foreground: 0 0% 93%;
    --popover: 240 4% 4%;
    --popover-foreground: 0 0% 93%;
    --primary: 155 100% 50%;
    --primary-foreground: 240 4% 4%;
    --secondary: 187 100% 50%;
    --secondary-foreground: 240 4% 4%;
    --muted: 240 4% 10%;
    --muted-foreground: 240 5% 65%;
    --accent: 240 4% 10%;
    --accent-foreground: 0 0% 98%;
    --destructive: 340 100% 50%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 4% 12%;
    --input: 240 4% 12%;
    --ring: 155 100% 50%;
    --radius: 0.375rem;
  }
}
```

---

## 3. Typography System

### Font Stack

```css
/* Headings - Bold, futuristic */
font-family: 'Unbounded', sans-serif;

/* Body text - Clean, readable */
font-family: 'Manrope', sans-serif;

/* Monospace - Data, metrics, code */
font-family: 'JetBrains Mono', monospace;
```

### Google Fonts Import

```html
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;600;700&family=Manrope:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Type Scale

| Element | Class | Usage |
|---------|-------|-------|
| H1 | `text-5xl md:text-7xl font-bold tracking-tighter` | Hero headlines |
| H2 | `text-3xl md:text-5xl font-semibold tracking-tight` | Section titles |
| H3 | `text-2xl font-medium tracking-wide` | Card titles |
| Body | `text-base leading-relaxed text-muted-foreground` | Paragraphs |
| Mono | `text-sm font-mono tracking-tight` | Data, metrics |
| Small | `text-xs text-muted-foreground` | Labels, captions |

### Usage Rules
- **Headings**: Always use `Unbounded` font
- **Data/Metrics**: Always use `JetBrains Mono` (keywords, CPC, volume, scores)
- **Body**: Use `Manrope` for all other text
- **Keywords**: Display in monospace with primary color

---

## 4. Visual Effects

### Neon Glow

```css
.neon-glow {
  box-shadow: 0 0 20px rgba(0, 255, 148, 0.3);
}

.neon-glow-hover:hover {
  box-shadow: 0 0 30px rgba(0, 255, 148, 0.5);
}

.neon-text {
  text-shadow: 0 0 10px rgba(0, 255, 148, 0.5);
}
```

### Glassmorphism

```css
.glass {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
```

### Gradient Border

```css
.gradient-border {
  border: 1px solid transparent;
  background: linear-gradient(#030304, #030304) padding-box,
              linear-gradient(135deg, #00FF94, #00E0FF) border-box;
}
```

### Kill Score Text Classes

```css
.kill-score-low {
  color: #FF0055;
  text-shadow: 0 0 10px rgba(255, 0, 85, 0.5);
}

.kill-score-medium {
  color: #FFD600;
  text-shadow: 0 0 10px rgba(255, 214, 0, 0.5);
}

.kill-score-high {
  color: #00FF94;
  text-shadow: 0 0 10px rgba(0, 255, 148, 0.5);
}
```

---

## 5. Component Patterns

### Buttons

#### Primary CTA
```jsx
<Button className="bg-primary text-black font-bold hover:bg-primary/90 neon-glow-hover transition-all">
  Start Hunting <ArrowRight className="w-4 h-4 ml-2" />
</Button>
```
- Background: Primary green
- Text: Black (for contrast)
- Hover: Neon glow effect
- Always include directional icon for CTAs

#### Secondary Button
```jsx
<Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
  Analyze SERP
</Button>
```

#### Ghost Button
```jsx
<Button variant="ghost" className="text-muted-foreground hover:text-white hover:bg-white/5">
  Login
</Button>
```

### Cards

#### Standard Card
```jsx
<Card className="bg-card border-border/50 hover:border-primary/30 transition-all">
  <CardContent className="p-6">
    {/* Icon with glow on hover */}
    <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:neon-glow">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </CardContent>
</Card>
```

#### Glass Card (for CTAs)
```jsx
<div className="p-12 rounded-2xl glass gradient-border">
  {/* Content */}
</div>
```

### Inputs

```jsx
<Input 
  className="h-12 bg-black/20 border-border focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
  placeholder="Enter keyword..."
/>
```
- Height: 48px minimum (h-12)
- Background: Semi-transparent black
- Focus: Primary border with subtle ring

### Data Tables

```jsx
<table className="w-full">
  <thead>
    <tr className="border-b border-border/50 bg-muted/30">
      <th className="text-left p-4 font-medium text-muted-foreground">Column</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-border/30 hover:bg-muted/20 transition-colors">
      <td className="p-4">
        <span className="font-mono text-sm">{data}</span>
      </td>
    </tr>
  </tbody>
</table>
```
- Strip borders to just row dividers
- Monospace font for all metrics
- Hover state on rows

### Badges

```jsx
// Service Type
<span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">Service</span>

// Directory Warning
<span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">Directory</span>

// Replaceable
<span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">Replaceable</span>

// Strong Competitor
<span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">Strong</span>
```

---

## 6. Page Structures

### Landing Page

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                  │
│ [Logo] EMD Hunter          [Research] [SERP] [Login] [CTA]│
├─────────────────────────────────────────────────────────┤
│ HERO SECTION (with background image overlay)            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Badge] Find EMD opportunities in seconds           │ │
│ │                                                     │ │
│ │ Hunt Killer EMD                                     │ │
│ │ Opportunities                    (background image) │ │
│ │                                                     │ │
│ │ Subheadline text...                                 │ │
│ │                                                     │ │
│ │ [Primary CTA] [Secondary CTA]                       │ │
│ │                                                     │ │
│ │ ┌─────────┐ ┌─────────┐ ┌─────────┐                 │ │
│ │ │ 0-100   │ │ $10-50+ │ │ 200-1200│  (Stats)       │ │
│ │ │Kill Score│ │Target CPC│ │Ideal Vol│               │ │
│ │ └─────────┘ └─────────┘ └─────────┘                 │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ FEATURES SECTION (bg-surface)                           │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│ │ [Icon]   │ │ [Icon]   │ │ [Icon]   │ │ [Icon]   │    │
│ │ Keyword  │ │ SERP     │ │ Kill     │ │ AI       │    │
│ │ Discovery│ │ Analysis │ │ Score    │ │ Analysis │    │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
├─────────────────────────────────────────────────────────┤
│ HOW IT WORKS                                            │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│ │ 01       │ │ 02       │ │ 03       │ │ 04       │    │
│ │ Step 1   │→│ Step 2   │→│ Step 3   │→│ Step 4   │    │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
├─────────────────────────────────────────────────────────┤
│ CTA SECTION (glass card with gradient border)           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │     Ready to find your killer EMD?                  │ │
│ │              [Start Hunting Now]                    │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ FOOTER                                                  │
│ [Logo] EMD Hunter            © 2025 EMD Hunter          │
└─────────────────────────────────────────────────────────┘
```

### Auth Pages (Login/Register)

```
┌─────────────────────────────────────────────────────────┐
│ SPLIT LAYOUT                                            │
│ ┌─────────────────────┐ ┌─────────────────────────────┐ │
│ │ FORM SIDE           │ │ IMAGE SIDE                  │ │
│ │                     │ │                             │ │
│ │ ← Back to home      │ │ (Full height image with    │ │
│ │                     │ │  gradient overlay)          │ │
│ │ [Logo] EMD Hunter   │ │                             │ │
│ │                     │ │ ┌─────────────────────────┐ │ │
│ │ ┌─────────────────┐ │ │ │ Find the chinks in the │ │ │
│ │ │ Welcome back    │ │ │ │ armor                   │ │ │
│ │ │                 │ │ │ │                         │ │ │
│ │ │ [Email input]   │ │ │ │ Our Kill Score...      │ │ │
│ │ │ [Password input]│ │ │ └─────────────────────────┘ │ │
│ │ │                 │ │ │                             │ │
│ │ │ [Sign In]       │ │ │                             │ │
│ │ │                 │ │ │                             │ │
│ │ │ Don't have...   │ │ │                             │ │
│ │ └─────────────────┘ │ │                             │ │
│ └─────────────────────┘ └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Dashboard

```
┌─────────────────────────────────────────────────────────┐
│ STICKY HEADER                                           │
│ [Logo]        [Research] [SERP] [Saved]    [User] [Out] │
├─────────────────────────────────────────────────────────┤
│ WELCOME SECTION                                         │
│ Welcome back, {Name}                                    │
│ Ready to find your next killer EMD opportunity?         │
├─────────────────────────────────────────────────────────┤
│ QUICK ACTIONS (3 columns)                               │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│ │ [Search Icon]│ │ [Chart Icon] │ │ [Book Icon]  │     │
│ │ Keyword      │ │ SERP         │ │ Saved        │     │
│ │ Research     │ │ Analysis     │ │ Opportunities│     │
│ │              │ │              │ │              │     │
│ │ Get started →│ │ Get started →│ │ Get started →│     │
│ └──────────────┘ └──────────────┘ └──────────────┘     │
├─────────────────────────────────────────────────────────┤
│ RECENT OPPORTUNITIES                                    │
│ Recent Opportunities                      View all →    │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                 │
│ │ keyword  │ │ keyword  │ │ keyword  │                 │
│ │ location │ │ location │ │ location │ (Kill Score)   │
│ │ ┌──┬──┬──┐│ │ ┌──┬──┬──┐│ │ ┌──┬──┬──┐│              │
│ │ │Vol│CPC│Comp│ │Vol│CPC│Comp│ │Vol│CPC│Comp│          │
│ │ └──┴──┴──┘│ │ └──┴──┴──┘│ │ └──┴──┴──┘│              │
│ └──────────┘ └──────────┘ └──────────┘                 │
└─────────────────────────────────────────────────────────┘
```

### Keyword Research Page

```
┌─────────────────────────────────────────────────────────┐
│ STICKY HEADER                                           │
├─────────────────────────────────────────────────────────┤
│ PAGE HEADER                                             │
│ Keyword Research                                        │
│ Find money keywords with the right volume...            │
├─────────────────────────────────────────────────────────┤
│ SEARCH CARD                                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [🔍] [Input: seed keyword...    ] [Filters ▼] [Search]│
│ │                                                     │ │
│ │ FILTERS (collapsible)                               │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │ │
│ │ │ Volume Range│ │ Minimum CPC │ │ Results Limit│    │ │
│ │ │ [──●──────] │ │ [──●──────] │ │ [──●──────]  │    │ │
│ │ │ 200 - 1200  │ │ $10         │ │ 50 keywords  │    │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘    │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ RESULTS TABLE                                           │
│ Found 50 opportunities                                  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Keyword    │ Volume │ CPC   │ Type    │ Comp │Action│ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ plumber... │ 1,040  │$29.14 │ Service │ 32%  │[Analyze]│
│ │ plumber... │   931  │$11.35 │ Service │ 43%  │[Analyze]│
│ │ plumber... │   625  │$34.47 │Contractor│ 47% │[Analyze]│
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### SERP Analysis Page

```
┌─────────────────────────────────────────────────────────┐
│ STICKY HEADER                                           │
├─────────────────────────────────────────────────────────┤
│ PAGE HEADER                                             │
│ SERP Analysis                                           │
│ Analyze page one to find replaceable results...         │
├─────────────────────────────────────────────────────────┤
│ SEARCH CARD                                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [🔍] [Input: keyword to analyze...    ] [Analyze SERP]│
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ RESULTS (3-column grid on desktop)                      │
│ ┌────────────────┐ ┌─────────────────────────────────┐ │
│ │ KILL SCORE     │ │ PAGE ONE RESULTS                │ │
│ │ (sticky)       │ │                    6/10 replaceable│
│ │    ┌─────┐     │ │ ┌─────────────────────────────┐ │ │
│ │   /       \    │ │ │ 1 │ ⚠ yellowpages.com [Dir] │ │ │
│ │  │   69    │   │ │ │   │ DA: 76  Links: 312,218  │ │ │
│ │   \ out/100/   │ │ └─────────────────────────────┘ │ │
│ │    └─────┘     │ │ ┌─────────────────────────────┐ │ │
│ │                │ │ │ 2 │ ✗ bestcontractors [Strong]│ │
│ │ Good Potential │ │ │   │ DA: 42  Links: 30       │ │ │
│ │                │ │ └─────────────────────────────┘ │ │
│ │ [✨ Get AI Analysis]│ │ ┌─────────────────────────────┐ │ │
│ │ [📌 Save Opportunity]│ │ │ 3 │ ✓ affordablehvac [Repl]│ │
│ │                │ │ │   │ DA: 25  Links: 112      │ │ │
│ │ AI ANALYSIS    │ │ └─────────────────────────────┘ │ │
│ │ ┌────────────┐ │ │                                 │ │
│ │ │ Claude's   │ │ │                                 │ │
│ │ │ analysis...│ │ │                                 │ │
│ │ └────────────┘ │ │                                 │ │
│ └────────────────┘ └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Kill Score Gauge Component

### Visual Structure
```
        ┌─────────────┐
       /               \
      │                 │
      │       69        │  ← Large number, color-coded
      │    out of 100   │  ← Small label
      │                 │
       \               /
        └─────────────┘
      [ Good Potential ]     ← Badge below gauge
```

### Implementation Logic

```javascript
const getScoreColor = (score) => {
  if (score >= 70) return '#00FF94';  // Green - Excellent
  if (score >= 40) return '#FFD600';  // Yellow - Good
  return '#FF0055';                    // Red - Challenging
};

const getScoreLabel = (score) => {
  if (score >= 70) return 'Excellent Opportunity';
  if (score >= 40) return 'Good Potential';
  return 'Challenging';
};
```

### SVG Structure
- Background circle: `stroke="#1F1F22"` (muted)
- Progress circle: Animated stroke-dashoffset
- Drop shadow filter for glow effect
- `transform: rotate(-90deg)` to start from top

---

## 8. Animation Patterns

### Entrance Animations (Framer Motion)

```jsx
// Page entrance
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}

// Staggered list items
transition={{ delay: i * 0.1 }}

// Table rows
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: i * 0.02 }}
```

### Pulse Animation (CSS)

```css
.animate-pulse-neon {
  animation: pulse-neon 2s ease-in-out infinite;
}

@keyframes pulse-neon {
  0%, 100% {
    box-shadow: 0 0 20px rgba(0, 255, 148, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 255, 148, 0.6);
  }
}
```

### Transition Defaults
- Duration: `300ms` for hovers, `500-600ms` for entrances
- Easing: `ease-out` for entrances, `ease-in-out` for hovers

---

## 9. Layout System

### Container
```jsx
<div className="max-w-7xl mx-auto px-6">
```

### Grid Patterns

```jsx
// Feature cards (4 columns)
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

// Dashboard quick actions (3 columns)
<div className="grid md:grid-cols-3 gap-6">

// SERP results (sidebar + content)
<div className="grid lg:grid-cols-3 gap-6">
  <div className="lg:col-span-1">{/* Sidebar */}</div>
  <div className="lg:col-span-2">{/* Content */}</div>
</div>

// Opportunity cards
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Spacing Scale
- Section padding: `py-24` (96px)
- Card padding: `p-6` (24px)
- Component gaps: `gap-4` to `gap-8`
- Form spacing: `space-y-6`

---

## 10. Icon Library

Using **Lucide React** for all icons:

```jsx
import { 
  Target,        // Logo/brand
  Search,        // Search inputs
  ArrowRight,    // CTAs, navigation
  Zap,           // Features, speed
  TrendingUp,    // Volume, growth
  DollarSign,    // CPC, money
  BarChart3,     // Analytics, competition
  Filter,        // Filter controls
  Bookmark,      // Save/saved
  Sparkles,      // AI features
  Shield,        // Strong competitor
  AlertTriangle, // Directory warning
  CheckCircle,   // Replaceable/success
  ExternalLink,  // External links
  Trash2,        // Delete actions
  LogOut,        // Logout
  User,          // User profile
  Loader2,       // Loading spinner (animate-spin)
} from 'lucide-react';
```

---

## 11. Responsive Breakpoints

Following Tailwind defaults:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Key Responsive Patterns

```jsx
// Typography scaling
className="text-5xl md:text-7xl"

// Grid columns
className="grid md:grid-cols-2 lg:grid-cols-4"

// Hidden on mobile
className="hidden md:flex"

// Flex direction change
className="flex flex-col md:flex-row"
```

---

## 12. Scrollbar Styling

```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #0A0A0B;
}

::-webkit-scrollbar-thumb {
  background: #1F1F22;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #00FF94;
}
```

---

## 13. Selection Styling

```css
::selection {
  background: rgba(0, 255, 148, 0.3);
  color: #EDEDED;
}
```

---

## 14. Toast Notifications

Using **Sonner** with custom styling:

```jsx
<Toaster 
  position="top-right"
  toastOptions={{
    style: {
      background: '#0A0A0B',
      border: '1px solid rgba(255,255,255,0.1)',
      color: '#EDEDED',
    },
  }}
/>
```

---

## 15. Data Test IDs Convention

All interactive elements include `data-testid` attributes:

```
nav-login-btn
nav-signup-btn
hero-cta-btn
login-email-input
login-password-input
login-submit-btn
register-name-input
register-email-input
register-password-input
register-submit-btn
logout-btn
dashboard
keyword-research
seed-keyword-input
search-btn
keywords-table
analyze-{index}
serp-analysis
serp-keyword-input
analyze-serp-btn
ai-analysis-btn
save-opportunity-btn
kill-score-gauge
saved-opportunities
```

---

## 16. Image Assets

### Background Images (Unsplash)

| Usage | URL | Overlay |
|-------|-----|---------|
| Hero Background | `photo-1715614176939-f5c46ae99d04` | `bg-black/80` |
| Auth Right Side | `photo-1706005024051-25bf89ab9d41` | Gradient left |
| Features Section | `photo-1651499833076-4caeb8324708` | None |

### Overlay Patterns

```jsx
// Hero gradient
<div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />

// Auth side gradient
<div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────┐
│ EMD HUNTER DESIGN TOKENS                │
├─────────────────────────────────────────┤
│ Primary:     #00FF94 (Neon Green)       │
│ Secondary:   #00E0FF (Cyan)             │
│ Destructive: #FF0055 (Hot Pink)         │
│ Background:  #030304 (Near Black)       │
│ Surface:     #0A0A0B (Card BG)          │
│ Border:      #1F1F22                    │
│ Text:        #EDEDED                    │
│ Muted:       #888888                    │
├─────────────────────────────────────────┤
│ Heading Font: Unbounded                 │
│ Body Font:    Manrope                   │
│ Mono Font:    JetBrains Mono            │
├─────────────────────────────────────────┤
│ Border Radius: 6px (rounded-md)         │
│ Input Height:  48px (h-12)              │
│ Max Width:     1280px (max-w-7xl)       │
└─────────────────────────────────────────┘
```

---

*This design system document enables consistent recreation of the EMD Hunter UI across any framework or platform.*
