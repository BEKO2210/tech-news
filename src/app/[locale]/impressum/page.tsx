import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "de" ? "Impressum" : "Imprint" };
}

export default async function ImpressumPage({
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
        {de ? "Impressum" : "Imprint"}
      </h1>

      <div className="mt-10 space-y-8 leading-relaxed text-ink-mid">
        <section>
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-ink-dim">
            {de ? "Angaben gemäß § 5 DDG" : "Information pursuant to § 5 DDG (German law)"}
          </h2>
          <address className="mt-3 not-italic text-ink">
            Belkis Aslani
            <br />
            Vogelsangstr. 32
            <br />
            71691 Freiberg am Neckar
            <br />
            {de ? "Deutschland" : "Germany"}
          </address>
        </section>

        <section>
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-ink-dim">
            {de ? "Kontakt" : "Contact"}
          </h2>
          <p className="mt-3 text-ink">
            {de ? "E-Mail: " : "Email: "}
            <a className="text-flux-cyan hover:underline" href="mailto:belkis.aslani@gmail.com">
              belkis.aslani@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-ink-dim">
            {de
              ? "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV"
              : "Responsible for content pursuant to § 18 (2) MStV"}
          </h2>
          <p className="mt-3 text-ink">
            Belkis Aslani, {de ? "Anschrift wie oben." : "address as above."}
          </p>
        </section>

        <section>
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-ink-dim">
            {de ? "Hinweis" : "Note"}
          </h2>
          <p className="mt-3">
            {de
              ? "FLUX ist ein privates, nicht-kommerzielles Einzelentwickler-Projekt. Inhalte werden aus öffentlich verfügbaren RSS-Quellen aggregiert und automatisiert zusammengefasst; Urheber der Originalartikel sind die jeweils verlinkten Quellen."
              : "FLUX is a private, non-commercial solo-developer project. Content is aggregated from publicly available RSS sources and summarized automatically; copyright of the original articles belongs to the linked sources."}
          </p>
        </section>

        <section>
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-ink-dim">
            {de ? "EU-Streitschlichtung" : "EU dispute resolution"}
          </h2>
          <p className="mt-3">
            {de
              ? "Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."
              : "We are neither willing nor obliged to participate in dispute resolution proceedings before a consumer arbitration board."}
          </p>
        </section>
      </div>
    </div>
  );
}
