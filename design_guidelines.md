# Design Guidelines: Academic Search Website

## Design Approach

**Selected Approach:** Design System (Utility-Focused)
**Rationale:** Academic search tools prioritize clarity, credibility, and information density over visual flair. Users expect efficiency and trust, not marketing aesthetics.

**Design Philosophy:** Text-first minimalism inspired by academic journals and research databases. Think arXiv, Google Scholar, and JSTOR—professional, trusted, functional.

## Core Design Elements

### Typography System
- **Primary Font:** Inter or similar clean sans-serif via Google Fonts
- **Headings:** Font weight 600-700, sizes: text-3xl (h1), text-2xl (h2), text-xl (h3)
- **Body Text:** Font weight 400, text-base (16px) for optimal readability
- **Metadata:** text-sm, font weight 400, for authors, dates, citations
- **Search Results Titles:** text-lg, font weight 600, with subtle underline on hover
- **Line Height:** leading-relaxed (1.625) for body text to enhance readability

### Layout System
**Spacing Primitives:** Use Tailwind units of 2, 4, 6, and 8 consistently
- Container: max-w-5xl centered (academic papers standard width)
- Section spacing: py-8 for main sections, py-4 for subsections
- Component gaps: gap-4 for form elements, gap-6 for result cards

### Component Library

**Header**
- Simple horizontal layout with site title (text-2xl font-bold)
- Optional: "About" and "Advanced Search" text links
- No hero image—jump straight to search functionality
- Minimal padding: py-6

**Search Interface**
- Large, prominent search input (h-12) with clear placeholder text
- Single-line layout: search field + button side-by-side
- Filter pills below search: Year range, Field, Publication Type
- Filters as simple dropdown selects or radio buttons
- Submit button: Solid, rectangular, text-based ("Search")

**Results Display**
- List layout (not cards) with clear visual separation (border-b)
- Each result contains:
  - Title (clickable, text-lg, font-semibold)
  - Authors list (text-sm, inline)
  - Publication info: Journal/Conference, Year, DOI (text-sm)
  - Abstract preview (2-3 lines with "Read more...")
- Pagination: Simple numbered links at bottom
- Results count: "Showing 1-10 of 234 results" (text-sm)

**Minimal Decorative Elements**
- Subtle borders (border-gray-300) for separation only
- No shadows, no gradients, no background images
- Whitespace as primary design tool
- Focus states: Simple outline for accessibility

### Interaction Patterns
- No animations or transitions
- Instant feedback on form interactions
- Clear active/selected states for filters (border or subtle background shift)
- Loading state: Simple "Loading..." text, no spinners

## Images
**No hero image.** This is a utility tool, not a marketing site. The search interface should be immediately visible upon page load without scrolling.

**If needed:** Small institutional logo in header corner (max 120px width)

## Page Structure
1. **Header** (py-6): Logo/Title + Navigation links
2. **Search Section** (py-8): Prominent search bar + filters
3. **Results Section** (py-8): List of search results with metadata
4. **Footer** (py-6): Copyright, contact link, terms—single line, centered

**No multi-column layouts.** Single column for optimal reading flow and mobile responsiveness.

## Trust Signals
- Clear metadata display (publication dates, peer-review status)
- DOI links for verification
- Citation count if available
- University/institution affiliations
- Privacy policy link in footer
- HTTPS badge/mention if applicable

**Critical:** Prioritize information density and scannability over visual polish. Every element serves a functional purpose.