import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PageHeader from "@/components/reusables";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAvailability,
  getInterviewerAppointments,
  getInterviewerStats,
  getWithdrawalHistory,
} from "@/actions/dashboard";
import AvailabilitySection from "./components/AvailabilitySection";
import AppointmentsSection from "./components/AppointmentsSection";
import EarningsSection from "./components/EarningsSection";
import { ClipboardList, Clock, Wallet } from "lucide-react";
import { getCurrentUser } from "@/actions/user";
import AnimatedDashboard from "./components/AnimatedDashboard";

import RoleMismatchWarning from "@/components/RoleMismatchWarning";

export default async function InterviewerDashboardPage() {
  let userId;
  try {
    const authResult = await auth();
    userId = authResult.userId;
  } catch (err) {
    console.error("auth() failed:", err?.errors ?? err);
    throw err;
  }

  if (!userId) {
    console.log("dashboard/page.jsx: userId is null, redirecting to /");
    redirect("/");
  }

  const dbUser = await getCurrentUser();

  // Redirect based on role
  if (!dbUser || dbUser.role === "UNASSIGNED") {
    redirect("/onboarding");
  }

  if (dbUser.role === "INTERVIEWEE") {
    return <RoleMismatchWarning currentRole="INTERVIEWEE" requiredRole="INTERVIEWER" />;
  }

  const [availability, appointments, stats, withdrawalHistory] =
    await Promise.all([
      getAvailability(),
      getInterviewerAppointments(),
      getInterviewerStats(),
      getWithdrawalHistory(),
    ]);

  return (
    <main className="min-h-screen bg-white text-graphite pt-16">
      {/* Animated page header */}
      <AnimatedDashboard
        dbUser={dbUser}
        stats={stats}
        availability={availability}
        appointments={appointments}
        withdrawalHistory={withdrawalHistory}
      />
    </main>
  );
}