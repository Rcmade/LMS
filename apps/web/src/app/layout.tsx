import { Geist, Geist_Mono } from "next/font/google";

import { AlertDialog } from "@/components/alert/AlertDialog";
import { ClerkProvider } from "@clerk/nextjs";
import "@workspace/ui/globals.css";
import { Suspense } from "react";
import { Toaster } from "sonner";
import QueryProvider from "../providers/QueryProvider";
import ThemeProvider from "../providers/ThemeProvider";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <ClerkProvider>
          <QueryProvider>
            <Suspense>
              <ThemeProvider>{children}</ThemeProvider>
            </Suspense>
          </QueryProvider>
        </ClerkProvider>
        <AlertDialog />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
