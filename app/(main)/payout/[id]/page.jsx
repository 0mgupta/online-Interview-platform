import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PayoutReviewClient from "./_components/PayoutReviewClient";
import { EmberTitle, SectionLabel } from "@/components/reusables";

export default async function PayoutReviewPage({ params }) {
  const { id } = await params;

  const payout = await db.payout.findUnique({
    where: { id },
    include: {
      interviewer: { select: { name: true, email: true } },
    },
  });

  if (!payout) notFound();

  return (
    <main className="min-h-screen bg-white text-graphite antialiased px-6 flex items-center justify-center pt-16">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="text-center">
          <SectionLabel>Admin</SectionLabel>
          <h1
            className="mt-1"
            style={{
              fontFamily: "var(--font-polysans)",
              fontWeight: 400,
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#202020",
            }}
          >
            Review <EmberTitle>Withdrawal</EmberTitle>
          </h1>
        </div>

        <PayoutReviewClient
          payout={{
            id: payout.id,
            credits: payout.credits,
            netAmount: payout.netAmount,
            platformFee: payout.platformFee,
            paymentMethod: payout.paymentMethod,
            paymentDetail: payout.paymentDetail,
            status: payout.status,
            interviewerName: payout.interviewer.name,
            interviewerEmail: payout.interviewer.email,
          }}
        />
      </div>
    </main>
  );
}
