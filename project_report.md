# Project Report: Calibrate (Mock Interview Platform)

Calibrate is a premium, 1:1 expert mock interview platform designed to connect aspiring software engineers with senior developers from top-tier companies. It features live HD video calls, persistent real-time chat, slot-based scheduling, and state-of-the-art AI-powered co-piloting.

---

## 1. Core Architecture & Tech Stack

Calibrate is built on a modern, robust, and highly secure technical stack:

- **Frontend Framework**: Next.js (App Router, React 19, custom server-side routing & redirects).
- **Styling**: Tailwind CSS v4 & custom **Ventriloc Design Tokens** (Monochromatic precision layout with subtle Ember Orange highlights).
- **Authentication**: Clerk (Role-based session tracking and login management).
- **Database / ORM**: PostgreSQL + Prisma ORM.
- **Video & Chat**: GetStream.io SDKs (Stream Video for HD call/screen share, Stream Chat for real-time threads).
- **Security & Shielding**: Arcjet (Bot detection, rate limiting, and SQL injection / API abuse protection).
- **Email Delivery**: Resend (Transactional emails and admin payout notifications).
- **Artificial Intelligence**: Google Gemini API (`gemini-2.5-flash-lite` for live question generation and automated feedback extraction).

---

## 2. Dynamic Role Workflows

The application manages two separate user flows based on database roles:

### Candidate (Interviewee) Flow
1. **Explore**: Browse verified interviewers by name or domain expertise (Frontend, Backend, DevOps, System Design, etc.).
2. **Scheduling**: View live slot calendars and book mock interview sessions using credits.
3. **Prep**: Message the interviewer via persistent chat before the session to share resumes or focus areas.
4. **Learn**: Receive a structured, AI-generated **Performance Evaluation Report** with overall metrics, strengths, and actionable improvements.

### Interviewer Flow
1. **Onboarding**: Set expert categories, years of experience, hourly credit rates, and bio.
2. **Availability**: Configure open slots once; the platform handles instant matching and booking.
3. **Co-pilot Tools**: Access a live AI Question Generator that creates tailor-made questions (system design, behavioral, DSA) matching the candidate's target level.
4. **Earnings & Payouts**: Accumulate credits from completed interviews and submit payout withdrawal requests directly to administrators.

---

## 3. Advanced AI Orchestration (Gemini Integration)

Google Gemini is integrated at two critical touchpoints:

### A. Live Question Generator
During an active mock interview, the interviewer has access to an AI sidekick that pulls questions on-demand.
- **Model**: `gemini-2.5-flash-lite`
- **Output**: Generates a set of 6 role-specific questions and brief answer guidelines, formatted cleanly as a JSON payload for the interviewer's private UI.

### B. Automated Transcript & Feedback Generator
After an interview concludes:
1. Stream's recording/transcription engine sends the speech segments to a webhook endpoint.
2. The webhook parses the transcript segments and maps them to speaker identities.
3. Gemini analyzes the discussion transcript and outputs a structured evaluation JSON:
   - Overall rating (`POOR` / `AVERAGE` / `GOOD` / `EXCELLENT`)
   - Recommendation (`HIRE` / `CONSIDER` / `NO_HIRE`)
   - Text segments analyzing technical depth, communication, and problem-solving.
   - Arrays of specific strengths and areas for improvement.
4. The parsed feedback is saved directly to the database for candidate review.
