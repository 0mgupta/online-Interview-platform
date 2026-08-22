"use client";

import { useAuth } from "@clerk/nextjs";
import { CheckoutButton } from "@clerk/nextjs/experimental";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/data";

export default function PricingSection() {
  const { has, userId } = useAuth();

  const isSignedIn = !!userId;
  const isOnStarter = isSignedIn && has({ plan: "starter" });
  const isOnPro = isSignedIn && has({ plan: "pro" });
  const isOnFree = isSignedIn && !isOnStarter && !isOnPro;

  const activePlanSlug = isOnPro
    ? "pro"
    : isOnStarter
    ? "starter"
    : isOnFree
    ? "free"
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {PLANS.map((plan, i) => {
        const isActive = activePlanSlug === plan.slug;

        return (
          <div
            key={plan.name}
            className="relative flex flex-col transition-colors duration-200"
            style={{
              background: plan.featured ? "#ebebeb" : "#efefef",
              borderRadius: i === 1 ? "6px 0px 6px 6px" : "8px",
              padding: "40px",
              border: isActive ? "1.5px solid #202020" : "none",
            }}
          >
            {/* Featured badge */}
            {plan.featured && !isActive && (
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-medium tracking-wide uppercase px-3.5 py-1 whitespace-nowrap"
                style={{
                  background: "#202020",
                  color: "#ffffff",
                  borderRadius: "20px",
                  fontFamily: "var(--font-inter)",
                }}
              >
                Most Popular
              </span>
            )}

            {/* Plan name */}
            <p
              className="text-xs font-medium tracking-[0.08em] uppercase mb-6"
              style={{ color: "#816729", fontFamily: "var(--font-inter)" }}
            >
              {plan.name}
            </p>

            {/* Price */}
            <div className="flex items-end gap-1 mb-1.5">
              <span
                style={{
                  fontFamily: "var(--font-polysans)",
                  fontWeight: 400,
                  fontSize: "48px",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  color: plan.featured ? "#ff682c" : "#202020",
                }}
              >
                {plan.price}
              </span>
              <span
                className="text-sm mb-2"
                style={{ color: "#828282", fontFamily: "var(--font-inter)" }}
              >
                /month
              </span>
            </div>

            <p className="text-sm mb-7" style={{ color: "#ff682c" }}>
              {plan.credits}
            </p>

            <div className="h-px mb-7" style={{ background: "#e8e8e8" }} />

            <ul className="space-y-3 mb-9 flex-1">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-sm"
                  style={{ color: "#4d4d4d" }}
                >
                  <span
                    className="text-xs mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center"
                    style={{
                      border: "1px solid #e8e8e8",
                      borderRadius: "4px",
                      color: "#ff682c",
                    }}
                  >
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            {isActive ? (
              <Button variant="outline" disabled className="w-full opacity-50 cursor-not-allowed">
                ✓ Current plan
              </Button>
            ) : plan.planId === null ? (
              isSignedIn ? (
                <Button variant="outline" disabled className="w-full opacity-50 cursor-not-allowed">
                  Default plan
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full">
                    Get started free
                  </Button>
                </SignInButton>
              )
            ) : isSignedIn ? (
              <CheckoutButton
                planId={plan.planId}
                planPeriod="month"
                checkoutProps={{
                  appearance: { elements: { drawerRoot: { zIndex: 2000 } } },
                }}
              >
                <Button
                  variant={plan.featured ? "default" : "outline"}
                  className="w-full"
                >
                  {activePlanSlug === "pro" && plan.slug === "starter"
                    ? "Downgrade"
                    : activePlanSlug === "starter" && plan.slug === "pro"
                    ? "Upgrade →"
                    : "Get started →"}
                </Button>
              </CheckoutButton>
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant={plan.featured ? "default" : "outline"}
                  className="w-full"
                >
                  Get started →
                </Button>
              </SignInButton>
            )}
          </div>
        );
      })}
    </div>
  );
}
