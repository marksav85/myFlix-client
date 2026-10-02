---
name: myFlix Shared Design System
status: approved-foundation
source: existing myFlix applications + Stitch visual exploration
design_direction: cinematic-editorial
frameworks:
  - React
  - Angular
themes:
  - cinematic-obsidian
  - angular-theme-tbd
---

# myFlix Design System

## 1. Purpose

This document defines the canonical visual and interaction system for the
myFlix React and Angular portfolio applications.

Both applications represent implementations of substantially the same product
using different frontend frameworks.

They must therefore remain approximately 95% equivalent in:

- page structure
- information hierarchy
- component geometry
- spacing
- typography
- functionality
- interactions
- responsive behaviour
- accessibility behaviour

Their principal visual distinction will come from their colour themes and
limited theme-specific decorative treatment.

A visitor comparing the applications should immediately understand that they
implement the same product while still perceiving them as visually distinct
portfolio projects.

This document is the authority for shared UI structure.

Framework-specific implementation details must not alter the intended design
unless required by a genuine technical constraint.

---

# 2. Design Principles

## 2.1 Character

The shared design should feel:

- contemporary
- cinematic
- editorial
- polished
- restrained
- approachable
- image-led
- portfolio-quality

The interface should feel intentionally designed without imitating Netflix or
another recognizable streaming platform.

myFlix is a movie-library application, not a streaming service.

The design must never imply unsupported playback, subscription, archive,
membership, rating, or technical-media functionality.

## 2.2 Content First

Movie artwork is the strongest visual element.

Decoration should support rather than compete with:

- movie posters
- movie titles
- descriptions
- genres
- directors
- account information
- application actions

Avoid excessive gradients, glass effects, animation, shadows, badges, or
decorative elements.

## 2.3 Honest Product Representation

Only represent functionality and data that the application actually supports.

Do not introduce fictional:

- streaming/playback controls
- trailers
- ratings
- runtime
- release year
- cast
- awards
- multiple genres
- 4K/HDR/Dolby metadata
- subscription plans
- membership tiers
- user avatars
- account statistics
- watch history
- archive identifiers
- password recovery
- remember-device functionality
- genre filters
- sorting controls

Future functionality may extend this specification deliberately, but visual
design must not invent it.

---

# 3. Shared Design Tokens

## 3.1 Semantic Colour Tokens

Components must reference semantic tokens rather than framework- or
theme-specific colour values.

Required tokens:

- `canvas`
- `surface-1`
- `surface-2`
- `surface-elevated`
- `border-subtle`
- `border-strong`
- `text-primary`
- `text-secondary`
- `text-muted`
- `primary`
- `primary-hover`
- `on-primary`
- `secondary`
- `secondary-subtle`
- `focus`
- `danger`
- `danger-hover`
- `danger-subtle`
- `on-danger`

The React and Angular applications may assign different colour values to these
tokens.

Component geometry and behaviour must remain unchanged between themes.

---

# 4. Typography

Use **Plus Jakarta Sans** as the shared primary typeface.

Fallback:

`"Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

The React application declares this stack without bundling or remotely loading
Plus Jakarta Sans. It uses that face only when available locally; otherwise it
renders with the system fallbacks.

## 4.1 Type Scale

### Display

- Desktop: 56px / 64px
- Mobile: 36px / 44px
- Weight: 800
- Tracking: approximately -0.03em

Use sparingly. Most application screens do not require display-sized text.

### Heading Large

- Desktop: 32px / 40px
- Mobile: 26px / 34px
- Weight: 700

### Heading Medium

- 24px / 32px
- Weight: 600–700

### Heading Small

- 18px / 26px
- Weight: 600

### Body Large

- 16px / 26px
- Weight: 400

### Body

- 14px / 22px
- Weight: 400

### Body Small

- 13px / 18px
- Weight: 400

### Label

- 14px / 20px
- Weight: 600

### Small Label

- 12px / 16px
- Weight: 600

Avoid very small text for important content.

---

# 5. Spacing

Use an 8px-oriented spacing rhythm with a 4px micro-step.

Recommended tokens:

- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-5`: 24px
- `space-6`: 32px
- `space-7`: 40px
- `space-8`: 56px
- `space-9`: 72px

## Page Margins

### Mobile
16px

### Tablet
24–32px

### Desktop
48–56px

Use a centered maximum-width content container on large displays.

Recommended maximum:

`1440–1600px`

Do not allow content to expand indefinitely on ultrawide displays.

---

# 6. Shape

The system should use restrained rounded geometry.

- Small: 4px
- Default: 8px
- Medium: 12px
- Large: 16px
- Full: 9999px

Use 8px as the normal control/card radius.

Avoid excessive pill-shaped UI.

Pills are appropriate only for compact tags or deliberately compact controls.

---

# 7. Elevation and Surfaces

Depth should primarily come from:

- surface contrast
- subtle borders
- restrained shadows
- limited theme-coloured interaction emphasis

Avoid large generic box shadows.

## Resting Surface

- theme `surface-1`
- 1px `border-subtle`

## Elevated Surface

- theme `surface-2`
- stronger border
- restrained shadow

## Focused/Floating Surface

Use only where genuine elevation is needed, such as menus or dialogs.

Glass/backdrop effects may be used sparingly in the navigation shell but are
not a requirement for ordinary content cards.

---

# 8. Global Application Shell

All screens share the same application shell.

## Header

Desktop layout:

- myFlix brand/logo aligned left
- navigation aligned right
- consistent content width with page body
- visually separated from page content
- sticky behaviour is permitted if unobtrusive

Logged-out navigation:

- Login
- Signup

Logged-in navigation:

- Movies/Home
- My Profile
- Logout

Do not display a user avatar unless avatar functionality is deliberately added
to the product.

Do not add an independent global search control. Search belongs to the movie
library page.

## Navigation States

Every navigation item must have:

- default
- hover
- keyboard focus
- active/current
- disabled where applicable

Logout must always remain readable.

The previous implementation's red-text-on-red-background defect must never be
reproduced.

---

# 9. Branding

Use the product name:

**myFlix**

Do not introduce a secondary product identity.

The wordmark may receive theme-specific colour treatment, but its dimensions,
position and typography should remain consistent across React and Angular.

Avoid Netflix-derived wordmarks or styling.

---

# 10. Buttons

All buttons require:

- default
- hover
- focus-visible
- active
- disabled
- pending/loading where relevant

Minimum interactive target should be approximately 44px where practical.

## Primary

Used for the principal action on a screen or form.

Examples:

- Login
- Signup
- Save Changes
- Add to Favorites

Use:

- `primary`
- `primary-hover`
- `on-primary`

## Secondary

Used for less prominent actions.

Examples:

- Back to Movies
- View Details where primary emphasis is unnecessary
- Logout

Use neutral surface styling with clear text and border contrast.

## Destructive

Used only for destructive operations.

Examples:

- Delete Account
- destructive confirmation action

Use:

- `danger`
- `danger-hover`
- `danger-subtle`
- `on-danger`

Destructive actions must not visually resemble ordinary navigation.

---

# 11. Form Controls

All forms share a common visual language.

Inputs should provide:

- persistent visible labels
- readable placeholders where useful
- clear boundaries against the background
- hover feedback
- strong focus-visible state
- validation/error state
- disabled state
- sufficient vertical height

Recommended input height:

48px

Do not rely on placeholder text as the only label.

Password fields may use normal browser/password-manager functionality.

---

# 12. Authentication Screens

Login and Signup use the same shared authentication layout.

## Desktop

Use a focused authentication card/panel with:

- myFlix branding or clear application context
- concise page heading
- optional short neutral supporting sentence
- labelled form controls
- primary submission action
- link to the alternative authentication route

### Login

Contains only:

- Username
- Password
- Login
- Signup link

Do not add:

- password recovery
- remember-device controls
- demo credentials
- subscription marketing
- security marketing claims

### Signup

Contains the fields actually required by the application:

- Username
- Password
- Confirm Password (client-side validation; not sent to the API)
- Email
- Birthday where applicable
- Signup
- Login link

Authentication screens should remain visually focused and uncluttered.

---

# 13. Movie Library

The movie library is the primary authenticated screen.

## Structure

1. Global header
2. Page heading/context where appropriate
3. Search field
4. Responsive movie grid
5. Empty/error/loading states

The search control remains a single search/filter input.

Do not introduce sorting or genre filtering unless those features are later
implemented deliberately.

---

# 14. Movie Grid

The grid should emphasize posters rather than large blocks of text.

Recommended desktop behaviour:

- approximately 4 columns at common desktop widths
- expand carefully on wider displays if card readability remains strong

Tablet:

- approximately 2–3 columns

Mobile:

- 1–2 columns depending on viewport width

Use normal wrapping grid behaviour rather than horizontal movie carousels.

---

# 15. Movie Cards

Movie cards use a consistent poster-led composition.

Available content:

- poster
- title
- description
- genre
- director
- favourite state/action
- View Details

Do not display metadata that does not exist in the backend.

## Poster

Use a consistent approximately 2:3 movie-poster presentation.

Use `object-fit: cover` or equivalent where necessary while avoiding obvious
distortion.

## Card Information Hierarchy

Recommended order:

1. poster
2. title
3. genre
4. director
5. short description where space permits
6. actions

Descriptions may be visually truncated on library cards to maintain consistent
card proportions.

The complete description remains available on the detail screen.

## Card Actions

Provide:

- View Details
- favourite toggle where appropriate

Favourite state must not rely solely on colour.

Provide an accessible label such as:

- Add to Favorites
- Remove from Favorites

## Hover

Hover may introduce:

- slight elevation
- subtle border emphasis
- very restrained transform

Avoid large zoom effects that cause layout collision.

---

# 16. Movie Detail

Desktop uses a strong two-column composition.

## Left

- prominent poster

## Right

- movie title
- description
- genre
- director
- favourite action
- Back to Movies

The layout should make effective use of horizontal space without filling the
screen with invented metadata.

Do not add:

- playback
- trailers
- ratings
- cast
- technical badges
- awards
- multiple genres unless supported by the data model

## Mobile

Stack:

1. poster
2. title/content
3. actions

Poster dimensions must not overwhelm the viewport.

---

# 17. Profile

The profile page should clearly separate:

1. account information
2. account editing
3. favourite movies
4. destructive account actions

## Account Information

Display actual stored user information only.

Examples:

- Username
- Email
- Birthday where available

Do not introduce:

- avatar
- membership date
- account tier
- statistics
- viewing history

## Edit Profile

Fields:

- Username
- optional new Password
- Email
- Birthday

Primary action:

- Save Changes

A blank password means no password replacement when supported by the
application logic.

## Favorites

Display favourite movies using the shared movie-card language.

The section may use a more compact variant if necessary, but should remain
visually related to the main movie library.

Do not invent favourite counts unless deliberately derived and included as a
minor UI enhancement.

## Danger Zone

Delete Account belongs in a clearly separated destructive section.

Explain the consequence briefly and neutrally.

The destructive action must be visually distinct from Save Changes and normal
navigation.

---

# 18. Application States

Every data-driven screen must account for:

## Loading

Use restrained loading indicators or skeletons appropriate to the content.

Avoid layout shifts where practical.

## Empty

Examples:

- no movies match search
- no favourite movies

Explain the state and, where useful, provide a relevant next action.

## Error

Provide a concise user-facing message.

Do not expose raw server/database errors.

## Pending Actions

Disable or otherwise guard repeated submissions while requests are pending.

---

# 19. Accessibility

Accessibility is part of the design system, not a later styling pass.

Requirements:

- WCAG-conscious text contrast
- keyboard-operable navigation
- visible `focus-visible` treatment
- semantic headings
- persistent form labels
- accessible error associations
- descriptive button labels
- minimum practical target sizes
- meaningful favourite-state labels
- colour must not be the sole indicator of state
- destructive actions must be clearly identifiable
- reduced-motion preferences must be respected

Hover-only information must never be required to understand or operate the
interface.

---

# 20. Motion

Motion should be restrained.

Recommended:

- 150–250ms interface transitions
- subtle elevation/transform on movie cards
- colour/border transitions on controls
- no large page animations
- no autoplay visual effects

Respect:

`prefers-reduced-motion`

Functionality must remain understandable without animation.

---

# 21. Responsive Behaviour

## Mobile

- compact header/navigation
- authentication card becomes near-full-width
- movie grid reduces appropriately
- detail page stacks
- profile sections stack
- forms use full available width
- buttons remain easily tappable

## Tablet

- intermediate movie grid
- detail may remain two-column where space permits
- profile can transition between stacked and split layouts

## Desktop

- full navigation
- multi-column movie grid
- two-column detail
- structured profile layout

React and Angular must use equivalent responsive behaviour even if their CSS
implementations differ.

---

# 22. Theme Architecture

The shared system must not hard-code the identity of either implementation into
component structure.

Components consume semantic theme tokens.

Example:

    MovieCard
      background: surface-1
      border: border-subtle
      title: text-primary
      metadata: text-secondary
      focus: focus

not:

    MovieCard
      background: #131A26
      focus: #F59E0B

This allows both implementations to retain identical geometry while expressing
different visual identities.

---

# 23. Theme A — Cinematic Obsidian

Cinematic Obsidian is the approved first theme derived from the Stitch
exploration.

It uses dark architectural surfaces with warm amber primary emphasis and
restrained cool cyan secondary emphasis.

## Foundation

- `canvas`: `#0B0F17`
- `surface-1`: `#131A26`
- `surface-2`: `#1A2332`
- `surface-elevated`: `#202B3B`
- `border-subtle`: `rgba(255,255,255,0.08)`
- `border-strong`: `rgba(255,255,255,0.14)`

## Text

- `text-primary`: `#F8FAFC`
- `text-secondary`: `#CBD5E1`
- `text-muted`: `#94A3B8`

## Primary

- `primary`: `#F59E0B`
- `primary-hover`: `#D97706`
- `on-primary`: `#0B0F17`

## Secondary

- `secondary`: `#38BDF8`
- `secondary-subtle`: `rgba(56,189,248,0.12)`

Secondary colour should be used sparingly.

It is appropriate for:

- selected secondary states
- restrained highlights
- focus/supporting accents

It must not create unsupported technical-media badges.

## Focus

- `focus`: `#38BDF8`

Use a clearly visible focus ring with sufficient offset from the component.

## Danger

- `danger`: `#E11D48`
- `danger-hover`: `#BE123C` (hover and active)
- `danger-subtle`: `rgba(244,63,94,0.12)`
- `on-danger`: `#FFFFFF`

---

# 24. Theme B — Angular Visual Identity

The second theme is intentionally not yet defined.

It must:

- preserve every shared structural rule in this document
- preserve typography
- preserve spacing
- preserve radii
- preserve component geometry
- preserve responsive behaviour
- preserve interaction behaviour
- preserve information hierarchy

It should differ primarily through:

- canvas/surface colour family
- primary colour
- secondary accent
- focus treatment
- restrained theme-specific decorative treatment

It must be sufficiently distinct from Cinematic Obsidian that screenshots of
the React and Angular projects are immediately distinguishable.

It must not become a second independent redesign.

The second palette will be selected through a focused visual exploration using
the approved shared screens as fixed structural references.

---

# 25. Framework Implementation

## React

Implement using the existing React application and its established styling
architecture.

Do not rewrite application functionality solely to accommodate the design.

## Angular

Implement idiomatically within the existing Angular application.

Angular Material may provide behaviour or accessibility primitives where
already appropriate, but default Material appearance must not override this
design system.

React and Angular do not need identical DOM or CSS implementations.

They do need visually and behaviourally equivalent outcomes.

---

# 26. Source-of-Truth Priority

When implementation sources disagree, use this priority:

1. actual supported application functionality and backend contract
2. this `DESIGN.md`
3. approved refined Stitch screens
4. original application screenshots
5. Stitch-generated HTML
6. exploratory Stitch `DESIGN.md`

Stitch-generated HTML is reference material, not production code.

Unsupported functionality appearing in a Stitch mock-up must not be
implemented merely because it appears visually.

---

# 27. Approved Screen Set

The shared system currently covers:

- Login
- Signup through the shared authentication system
- Movie Library
- Movie Detail
- User Profile

Additional states should derive from the same components and tokens rather than
introducing independent visual systems.

---

# 28. Remaining Design Decision

Before implementing the Angular theme, define **Theme B**.

The Theme B exercise should change the visual identity while keeping the
approved screens structurally fixed.

Once Theme B is approved, this document can be considered the complete visual
authority for both myFlix frontend implementations.
