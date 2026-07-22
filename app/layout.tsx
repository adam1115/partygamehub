import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "PartyGameHub",
  description: "Party Game Hub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-zinc-950">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}