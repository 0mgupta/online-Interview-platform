import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getInterviewers } from "@/actions/explore";
import { getCurrentUser } from "@/actions/user";
import PageHeader from "@/components/reusables";
import ExploreGrid from "./components/ExploreGrid";

export default async function ExplorePage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const dbUser = await getCurrentUser();
  
  // Redirect to onboarding if user hasn't completed it as an interviewee
  if (!dbUser || dbUser.role !== "INTERVIEWEE") {
    redirect("/onboarding");
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
