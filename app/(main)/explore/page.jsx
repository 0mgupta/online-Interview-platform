import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getInterviewers } from "@/actions/explore";
import { getCurrentUser } from "@/actions/user";
import PageHeader from "@/components/reusables";
import ExploreGrid from "./components/ExploreGrid";

export default async function ExplorePage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const dbUser = await getCurrentUser();
  
  // Redirect based on role
  if (!dbUser || dbUser.role === "UNASSIGNED") {
    redirect("/onboarding");
  }

  if (dbUser.role === "INTERVIEWER") {
    redirect("/dashboard");
  }

  const interviewers = await getInterviewers();

  return (
    <main className="min-h-screen bg-black">
      {/* Page header */}
      <PageHeader
        label="Explore"
        gray="Find your"
        gold="expert interviewer"
        description="Browse senior engineers from top companies."
      />

      {/* Content */}
      <div className="max-w-6xl mx-auto px-8 xl:px-0 py-10">
        <ExploreGrid interviewers={interviewers} />
      </div>
    </main>
  );
}
