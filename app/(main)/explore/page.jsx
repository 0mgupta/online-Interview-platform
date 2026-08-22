import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getInterviewers } from "@/actions/explore";
import { getCurrentUser } from "@/actions/user";
import PageHeader from "@/components/reusables";
import ExploreGrid from "./components/ExploreGrid";

import RoleMismatchWarning from "@/components/RoleMismatchWarning";

export default async function ExplorePage() {
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

  const interviewers = await getInterviewers();

  return (
    <main className="min-h-screen bg-white text-graphite pt-16">
      {/* Page header */}
      <PageHeader
        label="Explore"
        main="Find your"
        accent="expert interviewer"
        description="Browse senior engineers from top companies."
      />

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-10">
        <ExploreGrid interviewers={interviewers} />
      </div>
    </main>
  );
}
