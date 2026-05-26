import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Async Task Dashboard",
  description: "Portfolio demo for resilient async task processing"
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
