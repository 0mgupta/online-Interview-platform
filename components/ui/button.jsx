import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  /* Base — PolySans 400, 0px radius, no shadow per Ventriloc spec */
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#202020] focus-visible:outline-offset-2 aria-invalid:outline-destructive",
  {
    variants: {
      variant: {
        /* Primary CTA — Graphite fill, white text, 0px corners */
        default:
          "bg-[#202020] text-white hover:bg-[#333333] active:bg-[#111111]",

        /* Ghost/outline — 1px Graphite border, transparent bg */
        outline:
          "border border-[#202020] bg-transparent text-[#202020] hover:bg-[#efefef]",

        /* Ghost nav — no border */
        ghost:
          "text-[#202020] hover:bg-[#efefef] bg-transparent",

        /* Ember accent — outline with Ember Orange, used sparingly */
        ember:
          "border border-[#ff682c] text-[#ff682c] bg-transparent hover:bg-[#ff682c]/5",

        /* Destructive */
        destructive:
          "bg-destructive text-white hover:bg-destructive/90",

        /* Link */
        link: "text-[#202020] underline underline-offset-2 decoration-[#ff682c] hover:opacity-70",

        /* Legacy — kept for backward compat, maps to default */
        gold: "bg-[#202020] text-white hover:bg-[#333333] active:bg-[#111111]",

        secondary:
          "bg-[#efefef] text-[#202020] hover:bg-[#e0e0e0]",
      },
      size: {
        default: "h-9 px-5 py-2 text-sm",
        xs: "h-6 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        /* Hero — used on landing CTAs */
        hero: "px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      style={{ borderRadius: 0, fontFamily: "var(--font-polysans)", letterSpacing: "-0.02em" }}
      suppressHydrationWarning
      {...props}
    />
  );
}

export { Button, buttonVariants };
