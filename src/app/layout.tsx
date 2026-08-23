import type { Metadata } from "next";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import PageTransition from "@/components/PageTransition";
import IntroAnimation from "@/components/IntroAnimation";
import ChatAssistant from "@/components/ChatAssistant";

const cabinetGrotesk = localFont({
  src: [
    {
      path: "../fonts/CabinetGrotesk-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/CabinetGrotesk-Extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/CabinetGrotesk-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/CabinetGrotesk-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/CabinetGrotesk-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/CabinetGrotesk-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/CabinetGrotesk-Extrabold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../fonts/CabinetGrotesk-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-cabinet",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Shachin VP — Machine Learning Developer | AI Engineer",
  description:
    "Aspiring AI Research & Development Engineer specializing in deep learning architectures, end-to-end ML pipelines, real-time prediction systems, and API-based deployments.",
  keywords: [
    "Shachin VP",
    "Machine Learning Developer",
    "AI Engineer",
    "Deep Learning",
    "Python Developer",
    "TensorFlow",
    "Data Science",
    "Portfolio",
    "PSNA College",
    "Dindigul",
  ],
  authors: [{ name: "Shachin VP" }],
  creator: "Shachin VP",
  openGraph: {
    title: "Shachin VP — Machine Learning Developer | AI Engineer",
    description:
      "Aspiring AI R&D Engineer building end-to-end ML pipelines, real-time prediction systems, and AI-powered applications.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shachin VP — Machine Learning Developer | AI Engineer",
    description:
      "Aspiring AI R&D Engineer building end-to-end ML pipelines and AI-powered applications.",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cabinetGrotesk.variable} ${poppins.variable} h-full`}
    >
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Shachin VP",
              jobTitle: "Machine Learning Developer | AI Engineer",
              description:
                "Aspiring AI R&D Engineer specializing in deep learning, ML pipelines, and real-time prediction systems.",
              email: "shachinvp0506@gmail.com",
              knowsAbout: [
                "Machine Learning",
                "Deep Learning",
                "Python",
                "TensorFlow",
                "Computer Vision",
                "NLP",
                "Data Science",
                "FastAPI",
              ],
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "PSNA College of Engineering and Technology",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-bg-900 text-text-primary font-[var(--font-cabinet)]" style={{ fontFamily: 'var(--font-cabinet), system-ui, sans-serif' }}>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
          <IntroAnimation />
          <Navbar />
          <main className="grow"><PageTransition>{children}</PageTransition></main>
          <ChatAssistant />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
