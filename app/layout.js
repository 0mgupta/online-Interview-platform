import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Calibrate — Expert Mock Interviews",
  description:
    "Practice technical interviews with industry experts. Book a session, get real feedback, and land the job.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head />
        <body
          className="bg-white text-graphite"
          style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster
            toastOptions={{
              style: {
                background: "#ffffff",
                border: "1px solid #e8e8e8",
                color: "#202020",
                borderRadius: "8px",
                fontFamily: "var(--font-inter)",
              },
            }}
          />
          <footer className="border-t border-mist py-10 px-6">
            <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate">
              <span
                style={{
                  fontFamily: "var(--font-polysans)",
                  letterSpacing: "-0.02em",
                }}
              >
                Calibrate
              </span>
              <span>Made with ❤️ by OM GUPTA</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
