import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  /* Base — 20px radius (tags spec), Inter, no shadow */
  "inline-flex items-center justify-center border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        /* Default — Graphite fill */
        default:
          "bg-[#202020] text-white border-transparent",

        /* Ash — warm gray surface */
        secondary:
          "bg-[#efefef] text-[#202020] border-transparent",

        /* Outline — Mist border, Graphite text */
        outline:
          "border-[#e8e8e8] text-[#202020] bg-transparent",

        /* Ember accent tag — used sparingly */
        ember:
          "border-[#ff682c]/30 bg-[#ff682c]/8 text-[#ff682c]",

        /* Brass tag — chart / data accent */
        brass:
          "border-[#816729]/30 bg-[#816729]/8 text-[#816729]",

        /* Fog — nested container tag */
        ghost:
          "border-transparent bg-[#f5f5f5] text-[#4d4d4d]",

        /* Status — success */
        success:
          "border-green-600/20 bg-green-500/8 text-green-700",

        /* Status — warning */
        warning:
          "border-[#816729]/30 bg-[#ebe6dd] text-[#816729]",

        destructive:
          "bg-destructive text-white border-transparent",

        link:
          "text-[#202020] underline-offset-4 hover:underline border-transparent bg-transparent",

        /* Legacy alias */
        gold: "border-[#ff682c]/30 bg-[#ff682c]/8 text-[#ff682c]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant = "default", asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      style={{ borderRadius: "20px" }}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
