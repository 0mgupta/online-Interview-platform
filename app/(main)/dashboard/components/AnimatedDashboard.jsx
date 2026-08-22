'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader, { SectionLabel, EmberTitle } from "@/components/reusables";
import AvailabilitySection from "./AvailabilitySection";
import AppointmentsSection from "./AppointmentsSection";
import EarningsSection from "./EarningsSection";
import ProfileSection from "./ProfileSection";
import { ClipboardList, Clock, Wallet, User } from "lucide-react";
import { AnimateInView } from "@/components/motion/AnimateInView";

export default function AnimatedDashboard({
  dbUser,
  stats,
  availability,
  appointments,
  withdrawalHistory,
}) {
  const [activeTab, setActiveTab] = useState("earnings");

  return (
    <>
      {/* Animated page header */}
      <AnimateInView variant="fadeUp" duration={0.45}>
        <PageHeader
          label="Interviewer dashboard"
          main="Welcome back,"
          accent={dbUser.name?.split(" ")[0] ?? "Interviewer"}
          description={
            dbUser.title && dbUser.company
              ? `${dbUser.title} · ${dbUser.company}`
              : undefined
          }
          right={
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-right"
            >
              <p className="text-xs" style={{ color: "#828282" }}>Credit balance</p>
              <p
                className="text-3xl leading-none mt-1"
                style={{
                  fontFamily: "var(--font-polysans)",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  color: "#ff682c",
                }}
              >
                {stats?.creditBalance ?? 0}
              </p>
            </motion.div>
          }
        />
      </AnimateInView>

      {/* Tabbed content */}
      <AnimateInView variant="fadeUp" delay={0.1} duration={0.45}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-10">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList
              className="w-full justify-start gap-1 p-1 mb-8"
              style={{
                background: "#efefef",
                borderRadius: "8px",
              }}
            >
              {[
                { value: "earnings", icon: <Wallet size={14} />, label: "Earnings" },
                { value: "appointments", icon: <ClipboardList size={14} />, label: "Appointments" },
                { value: "availability", icon: <Clock size={14} />, label: "Availability" },
                { value: "profile", icon: <User size={14} />, label: "Profile" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 sm:flex-initial py-2 px-4 gap-2 text-sm data-[state=active]:bg-white data-[state=active]:text-graphite data-[state=active]:shadow-none"
                  style={{
                    fontFamily: "var(--font-polysans)",
                    letterSpacing: "-0.02em",
                    borderRadius: "6px",
                    transition: "background 0.15s ease, color 0.15s ease",
                  }}
                >
                  {tab.icon} {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Animated tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <TabsContent value="appointments" forceMount hidden={activeTab !== "appointments"}>
                  <AppointmentsSection appointments={appointments} />
                </TabsContent>

                <TabsContent value="availability" forceMount hidden={activeTab !== "availability"}>
                  <AvailabilitySection initial={availability} />
                </TabsContent>

                <TabsContent value="earnings" forceMount hidden={activeTab !== "earnings"}>
                  <EarningsSection stats={stats} history={withdrawalHistory} />
                </TabsContent>

                <TabsContent value="profile" forceMount hidden={activeTab !== "profile"}>
                  <ProfileSection dbUser={dbUser} />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </AnimateInView>
    </>
  );
}
