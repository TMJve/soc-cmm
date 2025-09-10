// src/app/layout.tsx
import "~/styles/globals.css";

import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "SOC CMM Assessment",
  description: "A web UI for SOC CMM maturity assessment.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

// REMOVED: All 'geist' and 'next/font' related code is gone.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // REMOVED: The className on the <html> tag is gone.
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}