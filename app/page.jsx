import { checkUser } from "@/lib/checkUser";
import { redirect } from "next/navigation";
import InteractiveLandingPage from "@/components/InteractiveLandingPage";

export default async function LandingPage() {
  const user = await checkUser();

  if (user) {
    if (user.role === "UNASSIGNED") {
      redirect("/onboarding");
    }

    if (user.role === "INTERVIEWER") {
      redirect("/dashboard");
    }

    if (user.role === "INTERVIEWEE") {
      redirect("/explore");
    }
  }

  return <InteractiveLandingPage />;
}
