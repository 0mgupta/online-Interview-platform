import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getIntervieweeAppointments } from "@/actions/appointments";
import { getCurrentUser } from "@/actions/user";
import { AppointmentCard } from "@/components/AppointmentCard";
import PageHeader from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

import RoleMismatchWarning from "@/components/RoleMismatchWarning";

export default async function MyAppointmentsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const dbUser = await getCurrentUser();

  // Redirect based on role
  if (!dbUser || dbUser.role === "UNASSIGNED") {
    redirect("/onboarding");
  }

  if (dbUser.role === "INTERVIEWER") {
    return <RoleMismatchWarning currentRole="INTERVIEWER" requiredRole="INTERVIEWEE" />;
  }

  const appointments = await getIntervieweeAppointments();
  const now = new Date();
  const scheduled = appointments.filter(
    (a) => a.status === "SCHEDULED" && new Date(a.startTime) > now
  );
  const past = appointments.filter(
    (a) => a.status !== "SCHEDULED" || new Date(a.endTime) <= now
  );

  return (
    <main className="min-h-screen bg-white text-graphite pt-16">
      {/* Page header */}
      <PageHeader
        label="My appointments"
        main="Your interview"
        accent="sessions"
        description="All your upcoming and past mock interviews in one place."
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-8 flex flex-col gap-14">
        {/* Empty state */}
        {appointments.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-20 gap-5 text-center"
            style={{
              background: "#efefef",
              borderRadius: "8px",
            }}
          >
            <span
              className="w-16 h-16 flex items-center justify-center text-3xl"
              style={{
                background: "#ffffff",
                border: "1px solid #e8e8e8",
                borderRadius: "8px",
              }}
            >
              <CalendarDays size={28} className="text-graphite" />
            </span>
            <div>
              <p className="text-base font-medium" style={{ color: "#202020" }}>
                No sessions booked yet.
              </p>
              <p className="text-xs mt-1" style={{ color: "#828282" }}>
                Browse expert interviewers and book your first session.
              </p>
            </div>
            <Button variant="default" asChild>
              <Link href="/explore">Browse interviewers →</Link>
            </Button>
          </div>
        )}

        {/* Upcoming */}
        {scheduled.length > 0 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <p
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: "#816729", fontFamily: "var(--font-inter)" }}
              >
                Upcoming ({scheduled.length})
              </p>
              <div className="flex-1 h-px" style={{ background: "#e8e8e8" }} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {scheduled.map((b) => (
                <AppointmentCard key={b.id} booking={b} mode="interviewee" />
              ))}
            </div>
          </div>
        )}

        {/* Past */}
        {past.length > 0 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <p
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: "#816729", fontFamily: "var(--font-inter)" }}
              >
                Past ({past.length})
              </p>
              <div className="flex-1 h-px" style={{ background: "#e8e8e8" }} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {past.map((b) => (
                <AppointmentCard
                  key={b.id}
                  booking={b}
                  mode="interviewee"
                  isPast={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
