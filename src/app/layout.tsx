import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ResponseLogger } from "@/components/response-logger";
import { ToastProvider } from "@/hooks/use-toast";
import { ThemeProvider } from "next-themes";
import { cookies } from "next/headers";
import FarcasterWrapper from "@/components/FarcasterWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestId = cookies().get("x-request-id")?.value;

  return (
        <html lang="en" suppressHydrationWarning>
          <head>
            {requestId && <meta name="x-request-id" content={requestId} />}
          </head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <ToastProvider>
                
      <FarcasterWrapper>
        {children}
      </FarcasterWrapper>
      
                <ResponseLogger />
              </ToastProvider>
            </ThemeProvider>
          </body>
        </html>
      );
}

export const metadata: Metadata = {
        title: "RANTAI 3C: Eco Blockchain Tool",
        description: "Monitor and certify your carbon footprint with RANTAI 3C. Switch between light/dark themes, analyze emissions, and secure data on blockchain effortlessly."
    };
