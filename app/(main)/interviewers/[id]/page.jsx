import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { getInterviewerProfile } from "@/actions/booking";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmberTitle, SectionLabel } from "@/components/reusables";
import SlotPicker from "./_components/SlotPicker";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABEL, EXPECT_ITEMS } from "@/lib/data";

import RoleMismatchWarning from "@/components/RoleMismatchWarning";

export default async function InterviewerProfilePage({ params }) {
  const { id } = await params;

  const user = await currentUser();
  if (!user) redirect("/");

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
    select: { role: true, credits: true },
  });

  if (!dbUser) redirect("/");
  if (dbUser.role === "UNASSIGNED") redirect("/onboarding");

  if (dbUser.role === "INTERVIEWER") {
    return <RoleMismatchWarning currentRole="INTERVIEWER" requiredRole="INTERVIEWEE" />;
  }

  const interviewer = await getInterviewerProfile(id);

  if (!interviewer) notFound();

  return (
    <main className="min-h-screen bg-white text-graphite pt-24">
      {/* Hero identity banner */}
      <section className="border-b border-mist">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 pt-12 pb-14 flex flex-col gap-8">
          <Link href="/explore">
            <Button variant="link" className="p-0 h-auto cursor-pointer self-start gap-1">
              <ArrowLeft size={13} />
              Back to explore
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row items-start gap-8">
            <Avatar className="w-24 h-24 shrink-0" style={{ borderRadius: "8px", border: "1px solid #e8e8e8" }}>
              <AvatarImage
                src={interviewer.imageUrl}
                alt={interviewer.name}
                style={{ borderRadius: "8px" }}
              />
              <AvatarFallback
                style={{
                  borderRadius: "8px",
                  background: "#efefef",
                  color: "#202020",
                  fontFamily: "var(--font-polysans)",
                  fontWeight: 400,
                  fontSize: "30px",
                }}
              >
                {interviewer.name?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-3 min-w-0 pt-1">
              <h1
                style={{
                  fontFamily: "var(--font-polysans)",
                  fontWeight: 400,
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: "#202020",
                }}
              >
                {interviewer.name}
              </h1>

              {interviewer.title && interviewer.company && (
                <p className="text-base font-light" style={{ color: "#4d4d4d" }}>
                  {interviewer.title}
                  <span className="mx-2" style={{ color: "#e8e8e8" }}>·</span>
                  {interviewer.company}
                </p>
              )}

              <div className="flex items-center gap-2 flex-wrap mt-1">
                {interviewer.yearsExp && (
                  <Badge variant="outline">
                    {interviewer.yearsExp}+ yrs experience
                  </Badge>
                )}
                <Badge variant="ember">
                  {interviewer.creditRate ?? 10} credits / session
                </Badge>
                {interviewer.availabilities?.[0] && (
                  <Badge variant="success">
                    🟢 Available
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        {/* LEFT */}
        <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:-order-1">
          {interviewer.bio && (
            <div
              className="p-8 flex flex-col gap-5"
              style={{
                background: "#efefef",
                borderRadius: "6px 0px 6px 6px",
              }}
            >
              <SectionLabel>About</SectionLabel>
              <p className="text-base font-light leading-relaxed text-steel">
                {interviewer.bio}
              </p>
            </div>
          )}

          {interviewer.categories?.length > 0 && (
            <div
              className="p-8 flex flex-col gap-5"
              style={{
                background: "#efefef",
                borderRadius: "8px",
              }}
            >
              <div>
                <SectionLabel>Specialties</SectionLabel>
                <p className="text-sm font-light mt-1" style={{ color: "#828282" }}>
                  Interview categories this expert covers.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {interviewer.categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs px-3 py-1.5"
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e8e8e8",
                      borderRadius: "20px",
                      color: "#4d4d4d",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    {CATEGORY_LABEL[cat] ?? cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div
            className="p-8 flex flex-col gap-6"
            style={{
              background: "#efefef",
              borderRadius: "8px",
            }}
          >
            <div>
              <SectionLabel>What to expect</SectionLabel>
              <p className="text-sm font-light mt-1" style={{ color: "#828282" }}>
                Every session on Calibrate includes the following.
              </p>
            </div>
            <ul className="flex flex-col gap-5">
              {EXPECT_ITEMS.map(([icon, title, desc]) => (
                <li key={title} className="flex items-start gap-4">
                  <span
                    className="mt-0.5 w-10 h-10 shrink-0 flex items-center justify-center text-lg"
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e8e8e8",
                      borderRadius: "8px",
                    }}
                  >
                    {icon}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium text-graphite">
                      {title}
                    </p>
                    <p className="text-xs font-light leading-relaxed text-steel">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT — sticky slot picker */}
        <div className="lg:col-span-2 lg:sticky top-24">
          <SlotPicker
            interviewer={interviewer}
            interviewerCredits={interviewer.creditRate ?? 10}
            userCredits={dbUser.credits}
          />
        </div>
      </div>
    </main>
  );
}
