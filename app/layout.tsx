import Link from "next/link";
import "./globals.css";
import { Inter } from "next/font/google";
import NavBar from "../components/NavBar";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Board Game Library",
  description: "An App to Check-in and out your board games!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <NavBar />
          <div className="max-w-screen-xl mx-auto p-4">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
