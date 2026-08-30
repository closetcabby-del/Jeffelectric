import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Residential Electrician in Southeast Houston | Jeff Electric",
  description:
    "Jeff Electric provides residential electrical repairs, troubleshooting, panel upgrades, EV-charger installation and surge protection across Southeast Houston.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/brand/jeff-electric-mark.png",
    shortcut: "/brand/jeff-electric-mark.png",
  },
};

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/jeffelectricllc/",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1Eot7yVzxN/?mibextid=wwXIfr",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <nav
          aria-label="Jeff Electric social media"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "14px",
            padding: "22px 24px 80px",
            background: "#050605",
            color: "#ffffff",
            borderTop: "1px solid #20221e",
          }}
        >
          <strong
            style={{
              marginRight: "4px",
              color: "#777a72",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: ".14em",
            }}
          >
            Follow Jeff Electric
          </strong>
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: "38px",
                padding: "0 16px",
                border: "1px solid #4a4c45",
                color: "#f2b21a",
                fontSize: "11px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".08em",
              }}
            >
              {social.name} ↗
            </a>
          ))}
        </nav>
      </body>
    </html>
  );
}
