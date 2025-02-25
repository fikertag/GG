import "./globals.css";
import { Poppins } from "next/font/google";
import { InsultProvider } from "@/context/InsultContext";
import { CommentProvider } from "@/context/Comment";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
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
          <body className={poppins.className}>{children}</body>
        </InsultProvider>
      </CommentProvider>
    </html>
  );
}
