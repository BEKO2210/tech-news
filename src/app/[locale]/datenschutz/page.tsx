import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "de" ? "Datenschutz" : "Privacy Policy" };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-ink-dim">
        {title}
      </h2>
      <div className="mt-3 space-y-2 text-ink-mid">{children}</div>
    </section>
  );
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const de = locale === "de";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
        {de ? "Datenschutzerklärung" : "Privacy Policy"}
      </h1>

      <div className="mt-10 space-y-8 leading-relaxed">
        <Section title={de ? "Verantwortlicher" : "Controller"}>
          <p className="text-ink">
            Belkis Aslani, Vogelsangstr. 32, 71691 Freiberg am Neckar,{" "}
            <a className="text-flux-cyan hover:underline" href="mailto:belkis.aslani@gmail.com">
              belkis.aslani@gmail.com
            </a>
          </p>
        </Section>

        <Section title={de ? "Grundsatz" : "Principle"}>
          <p>
            {de
              ? "FLUX setzt keine Tracking-Cookies, kein Analyse-Tool und keine Werbung ein. Es werden keine Nutzerkonten geführt und keine personenbezogenen Profile erstellt."
              : "FLUX uses no tracking cookies, no analytics tool and no advertising. No user accounts are kept and no personal profiles are created."}
          </p>
        </Section>

        <Section title={de ? "Hosting (Vercel)" : "Hosting (Vercel)"}>
          <p>
            {de
              ? "Die Website wird bei Vercel Inc. (USA) gehostet. Beim Aufruf verarbeitet Vercel technisch notwendige Server-Logdaten (u. a. IP-Adresse, Zeitpunkt, aufgerufene Seite, Browsertyp) zur Auslieferung und Sicherheit. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren Betrieb)."
              : "The site is hosted by Vercel Inc. (USA). On access, Vercel processes technically necessary server log data (incl. IP address, timestamp, page, browser type) for delivery and security. Legal basis: Art. 6(1)(f) GDPR (legitimate interest in secure operation)."}
          </p>
        </Section>

        <Section title={de ? "Lokale Speicherung (Personalisierung)" : "Local storage (personalization)"}>
          <p>
            {de
              ? "Deine Personalisierungs-Einstellungen (Themen, Tonfall, Länge, Wissenslevel) werden ausschließlich lokal in deinem Browser (localStorage) gespeichert und nicht an uns übertragen. Du kannst sie jederzeit über „Personalisieren“ ändern oder durch Leeren des Browser-Speichers löschen."
              : "Your personalization settings (topics, tone, length, expertise) are stored exclusively locally in your browser (localStorage) and are not transmitted to us. You can change them anytime via “Personalize” or delete them by clearing your browser storage."}
          </p>
        </Section>

        <Section title={de ? "KI-Zusammenfassungen" : "AI summaries"}>
          <p>
            {de
              ? "Zur Erstellung der Kurzfassungen werden Titel und ein kurzer Auszug des jeweiligen Artikels sowie deine (anonymen) Stil-Einstellungen an einen KI-Dienst (NVIDIA NIM) übermittelt. Es werden dabei keine personenbezogenen Daten übertragen."
              : "To generate the summaries, the title and a short excerpt of the respective article plus your (anonymous) style settings are sent to an AI service (NVIDIA NIM). No personal data is transmitted in the process."}
          </p>
        </Section>

        <Section title={de ? "Externe Inhalte" : "External content"}>
          <p>
            {de
              ? "Artikel verlinken auf die Originalquellen; teils werden Vorschaubilder direkt von deren Servern geladen, wodurch diese deine IP-Adresse erhalten. Ersatz-/Platzhalterbilder stammen von Unsplash. Beim Weiterklick zur Quelle gelten deren Datenschutzbestimmungen."
              : "Articles link to the original sources; some preview images are loaded directly from their servers, which thereby receive your IP address. Fallback/placeholder images come from Unsplash. When you click through to a source, its privacy policy applies."}
          </p>
        </Section>

        <Section title={de ? "Newsletter-Formular" : "Newsletter form"}>
          <p>
            {de
              ? "Das Newsletter-Feld ist derzeit eine reine Demo: Die Eingabe verlässt deinen Browser nicht und wird nicht gespeichert oder versendet."
              : "The newsletter field is currently a pure demo: your input does not leave your browser and is neither stored nor sent."}
          </p>
        </Section>

        <Section title={de ? "Deine Rechte" : "Your rights"}>
          <p>
            {de
              ? "Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie ein Beschwerderecht bei einer Aufsichtsbehörde. Wende dich dafür an die oben genannte E-Mail-Adresse."
              : "You have the right to information, rectification, erasure, restriction of processing, data portability and objection, as well as the right to lodge a complaint with a supervisory authority. Please contact the email address above."}
          </p>
        </Section>

        <p className="text-xs text-ink-dim">
          {de ? "Stand: Juni 2026" : "Last updated: June 2026"}
        </p>
      </div>
    </div>
  );
}
