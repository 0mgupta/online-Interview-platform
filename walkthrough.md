# Walkthrough - Interactive Landing Page, Renaming, and Custom Branding

We have successfully completed merging the dedicated interviewer page into the main landing page, making it interactive using a premium mode toggle, renaming the project to "Calibrate", completely automating onboarding, designing a cropped logo, and integrating active view-switching and auth actions into the navbar.

## Changes Made

### 1. New Client Component: Interactive Landing Page
- Created [`InteractiveLandingPage.jsx`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/components/InteractiveLandingPage.jsx) as a Client Component.
- Implemented a premium, modern sliding toggle control centered at the top of the landing page.
- Made the page reactively adapt to the selected mode ("I want to Practice" vs. "I want to Interview").
- Removed the redundant toggle pill and CTAs from the landing page.
- Designed premium replacements to occupy the hero CTA slots.

### 2. Main Page Route Restructuring
- Simplified [`app/page.jsx`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/app/page.jsx) by removing all landing page markup and replacing it with the new client component.
- Retained efficient server-side redirects for authenticated users (redirecting to `/dashboard` or `/explore` depending on their role).

### 3. Deleted /for-interviewers Route
- Deleted the now redundant `/for-interviewers` directory and [`app/for-interviewers/page.jsx`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/app/for-interviewers/page.jsx) file.
- Updated the link "Learn more about interviewing →" in [`RoleSelection.jsx`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/components/RoleSelection.jsx) to direct to the new path `/?view=interviewer`.

### 4. Layout Fit & Padding Fix
- Resolved an overlap where the mode toggle pill rendered underneath the fixed header.
- Increased the landing page main wrapper padding-top to `pt-24 sm:pt-28`.
- Reduced the hero section padding-top to `pt-8 sm:pt-12`.

### 5. Brand Rename to Calibrate
- Renamed the brand from "Prept" to "Calibrate" in layout titles, navigation logo attributes, onboarding pages, email action definitions, and user-facing documentation reports.

### 6. Full Onboarding Screen Removal
- Completely bypassed the onboarding setup screens for **both candidates (interviewees) and interviewers**.
- An aesthetic, full-screen load state (*"Preparing your Calibrate space..."*) is presented to the user during this brief setup transition.

### 7. Custom Branding & Logo Sizing
- Generated a premium logo featuring a stylized calibration indicator and custom editorial typeface for the **Calibrate** identity.
- Copied this asset to `public/logo-calibrate.png` and updated the image source in [`AnimatedHeader.jsx`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/components/AnimatedHeader.jsx).
- Wrote and executed a Python cropping script [`crop_logo.py`](file:///C:/Users/OM/.gemini/antigravity-ide/brain/517dd37b-33b6-477b-8796-11b7decf7a99/scratch/crop_logo.py) to trim the white borders.
- Adjusted the logo size and header vertical padding.

### 8. Premium Navbar Integration
- Added a sleek sliding view toggle ("I want to Practice" vs. "I want to Interview") directly in the center of the navigation bar for logged-out visitors.
- Integrated Sign In and Get Started action buttons on the right side of the navbar for logged-out users.
- Synced the view parameters reactively.
- Added `<Suspense>` wrapper in [`header.jsx`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/components/header.jsx) around `AnimatedHeader`.
- Integrated a client-side `mounted` hydration guard inside [`AnimatedHeader.jsx`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/components/AnimatedHeader.jsx).
- Removed the redundant "Dashboard" navigation links for Interviewers.
- Replaced the Candidate navigation links with two distinct, separated text menu items (**"Explore"** and **"My Appointments"**).
- Refactored `NavLink` hover interactions to be managed directly via React `useState` hover lifecycle events.
- Updated the "Sign In" button to dynamically pass the current view mode as a role parameter.

### 9. Custom Explore Card CTA Buttons
- Redesigned the primary call-to-action button in [`InterviewerCard.jsx`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/app/(main)/explore/components/InterviewerCard.jsx) to use custom-styled outlined Links.

### 10. Dashboard Availability AM/PM Time Selector
- Replaced the browser-dependent `<input type="time" />` picker in [`AvailabilitySection.jsx`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/app/(main)/dashboard/components/AvailabilitySection.jsx) with custom-designed **Hour, Minute, and AM/PM select dropdowns**.
- Wrote robust bidirectional formatting helpers (`parse24To12` and `format12To24`).

### 11. Custom Slot Booking Actions
- Updated the action buttons in the interviewer scheduling confirmation block inside [`SlotPicker.jsx`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/app/(main)/interviewers/[id]/_components/SlotPicker.jsx) to use sharp borders and custom paddings.

### 12. Layout Padding Adjustments
- Fine-tuned the vertical spacing on the interviewer profile page ([`page.jsx`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/app/(main)/interviewers/[id]/page.jsx)) for a balanced look.

### 13. Fixed Video Call Booking Crash
- Resolved a runtime database query mismatch in [`actions/booking.js`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/actions/booking.js). Added the missing `clerkUserId: true` selection field.

### 14. Custom Appointment Action Buttons
- Replaced the shadcn button wrappers in [`AppointmentCard.jsx`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/components/AppointmentCard.jsx) with custom HTML / Link tags.

### 15. Custom Explore Page Category Filters
- Upgraded the category filter pills in [`ExploreGrid.jsx`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/app/(main)/explore/components/ExploreGrid.jsx) to use sharp Graphite blocks.
- Cleaned up the duplicate "All" tag rendering.

### 16. Global Arial Font Headings
- Configured all heading tags (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`) to render globally in the **Arial** font family by adding a base override rule in [`globals.css`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/app/globals.css).

### 17. Role Mismatch Protection & Warning Screen
- Created a new reusable warning component [`RoleMismatchWarning.jsx`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/components/RoleMismatchWarning.jsx).
- Integrated this warning screen on all restricted pages instead of silent redirects.
- Styled mismatch action buttons with **"Logout"** and **"Login as Interviewee"** / **"Login as Interviewer"**.

### 18. LocalStorage Role Fallback System
- Configured the auth sign-up page and sign-in page to store the target role in `localStorage`.
- Updated the onboarding screen to retrieve the target role parameter from `localStorage`.

### 19. Interviewer Profile Editor Tab
- Created a new React component [`ProfileSection.jsx`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/app/(main)/dashboard/components/ProfileSection.jsx).
- Added a new `updateInterviewerProfile` server action.
- Integrated the profile editor under a new **"Profile"** tab.

### 20. Suppressed Browser-Injected Element Hydration Warnings
- Added the `suppressHydrationWarning` attribute to the custom base UI `<Button>` wrapper in [`components/ui/button.jsx`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/components/ui/button.jsx) and the `<Input>` wrapper in [`components/ui/input.jsx`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/components/ui/input.jsx), as well as HTML `<button>` nodes in [`ExploreGrid.jsx`](file:///c:/Users/OM/OneDrive/Desktop/one-on-one-interview/ai-interview-platform/app/(main)/explore/components/ExploreGrid.jsx). This suppresses hydration mismatch errors triggered when password savers or browser extensions dynamically inject attributes (such as `fdprocessedid`) onto inputs and buttons during browser rendering.
