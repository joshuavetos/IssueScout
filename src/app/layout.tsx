import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Issue Scout Spike", description: "GitHub issue finder deployment spike" };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
