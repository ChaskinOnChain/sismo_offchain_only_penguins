import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Only Penguins",
  description:
    "Dive into the cheekiest, fluffiest platform where you can subscribe to get exclusive, naughty glimpses of your favorite penguins. Preserve your privacy and let no one know you're subscribed to Only Penguins!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
