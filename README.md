# Euless JH Band website concept

This repository contains the hosted, responsive prototype for replacing the
current Google Site.

- **Prototype:** https://pdrutherford.github.io/ejh-band-site/
- **CMS walkthrough:** https://pdrutherford.github.io/ejh-band-site/cms.html
- **Content editor:** https://app.pagescms.org

## Recommended implementation

The prototype uses:

- **Hosting:** GitHub Pages, free for a public repository.
- **Editing:** Pages CMS, a free browser-based editor for GitHub content.
- **Content:** Structured JSON files in `content/`.
- **Rendering:** Static HTML with client-side content hydration and HTML
  fallbacks.
- **Calendar:** Keep the directors' existing Google Calendar and embed it or
  display its upcoming events automatically.
- **Forms/files:** Continue using district-approved Google Forms and Drive
  documents; link to them rather than rebuilding those workflows.

Directors sign in to Pages CMS with GitHub, select
`pdrutherford/ejh-band-site`, choose an editable area, and click **Save**.
GitHub Pages publishes the committed JSON change automatically. Editors do not
need to edit code, use a terminal, or understand Git.

Expected recurring cost: **$0**. Each editor needs a free GitHub account and
collaborator access to this repository.

## Why this approach

It keeps the simplicity of Google Sites for editors while allowing a more
polished, accessible, and responsive front end. The site remains portable:
content is stored in plain text files and can be moved to another free static
host later.

Google Sites is the lowest-maintenance fallback, but it offers less control over
mobile navigation, hierarchy, typography, and visual consistency. A custom
static site plus Pages CMS is the better balance of presentation, cost, and
editor usability.

## Information architecture

The current top-level structure remains recognizable and reachable directly
from the primary navigation:

1. **Home** — concise welcome, urgent announcements, and common destinations.
2. **Calendar** — next events first, then the complete Google Calendar.
3. **Classes** — Symphonic, Concert, and Beginning Band.
4. **Directors** — bios and prominent contact details.
5. **Future Stallions** — instrument selection, supplies, and getting started.

The Classes menu links directly to each ensemble on a consolidated local page.
The existing Google Calendar remains embedded as the single source of truth,
and the current schedule PDFs remain linked from the Calendar page.

## Content rules

- Put time-sensitive notices and the next few events near the top of Home.
- Keep one authoritative calendar rather than copying dates into several pages.
- Show a short summary first; place longer expectations and policies on class
  detail pages.
- Only publish content that answers a student or family question or supports a
  required action.
- Add an owner and review date to each editable page in the CMS.
- Archive expired notices automatically or during a monthly five-minute review.

## Migration plan

### 1. Confirm and clean content

Inventory every current page, file, form, calendar, and external link. Ask the
directors to mark each item **keep**, **update**, or **remove**. The current site
contains potentially stale or inconsistent class copy, so names, schedules,
ensemble labels, phone extensions, and expectations must be confirmed before
launch.

### 2. Validate the design

Review this prototype with two directors, two current students, and two parents.
Give each person three tasks: find the next event, find their class information,
and contact a director. Adjust labels or hierarchy where anyone hesitates.

### 3. Build the editable version

Create content schemas for announcements, events, classes, directors, and Future
Stallions. Configure Pages CMS with plain-language field labels and previews.
Connect the existing Google Calendar and migrate only approved content.

### 4. Test and launch

Test keyboard navigation, screen readers, color contrast, mobile layouts, links,
and editor permissions. Run the old and new sites in parallel briefly, then add
a redirect or prominent link from the old Google Site.

### 5. Hand off

Give directors a one-page editing guide and a 20-minute walkthrough. Keep one
technical owner responsible for repository access and rare structural changes;
directors own routine content updates.

## Prototype notes

- Red, black, and warm white preserve the school identity without making every
  surface visually heavy.
- The existing page names and class groupings remain intact.
- The home page prioritizes schedule, classes, Future Stallions, and contact
  information rather than adding promotional filler.
- Current-site links remain connected so reviewers can compare the concept with
  the source content.
- The visible prototype banner and content-confirmation notes would be removed
  from the production site.
