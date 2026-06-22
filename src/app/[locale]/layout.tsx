import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Ticker } from "@/components/Ticker";
import { PrefsProvider } from "@/components/personalization/PrefsProvider";
import { OnboardingModal } from "@/components/personalization/OnboardingModal";
import { getArticles, trending } from "@/lib/feeds";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: { default: t("title"), template: "%s · FLUX" },
    description: t("description"),
    metadataBase: new URL("https://flux-tech-news.vercel.app"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      images: ["/og.png"],
    },
    twitter: { card: "summary_large_image" },
    icons: { icon: "/favicon.svg" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const articles = await getArticles(locale);
  const tickerItems = trending(articles, 10);

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <NextIntlClientProvider>
          <PrefsProvider>
            <Navbar />
            <Ticker items={tickerItems} />
            <main className="flex-1">{children}</main>
            <Footer />
            <OnboardingModal />
          </PrefsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
