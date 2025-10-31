import type { Metadata } from "next";
import { Work_Sans, Manrope } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inkoop Planner",
  description: "I",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${workSans.variable} ${manrope.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
