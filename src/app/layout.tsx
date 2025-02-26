import "./globals.css";
import { Inter } from "next/font/google";
import { InsultProvider } from "@/context/InsultContext";
import { CommentProvider } from "@/context/Comment";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700"], // Add necessary weights
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CommentProvider>
        <InsultProvider>
          <body className={inter.className}>{children}</body>
        </InsultProvider>
      </CommentProvider>
    </html>
  );
}
