import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "@/context/AppProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InterviewX — AI Video Interview Platform",
  description: "Next-gen AI-powered video interview platform. Configure custom questions, get comprehensive performance analysis, and hire top talent faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (!localStorage.getItem('theme') || localStorage.getItem('theme') === 'system') {
                  var hour = new Date().getHours();
                  if (hour >= 18 || hour < 6) {
                    localStorage.setItem('theme', 'dark');
                  } else {
                    localStorage.setItem('theme', 'light');
                  }
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} font-sans antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AppProvider>
            {children}
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
